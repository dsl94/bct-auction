pragma solidity ^0.8.0;

enum AuctionState { Active, Ended }

contract Auction {
    address payable public seller;
    uint256 public auctionEndTime;
    address public highestBidder;
    uint256 public highestBid;
    string public auctionName;
    uint256 public sellerRating;
    bool public sellerRated;

    mapping(address => uint256) public bids;
    mapping(address => bool) public hasWithdrawn;


    AuctionState public state;

    event AuctionEnded(address winner, uint256 highestBid);

    constructor(address _seller, uint256 _duration, string memory _name) {
        seller = payable(_seller);
        auctionEndTime = block.timestamp + _duration;
        state = AuctionState.Active;
        auctionName = _name;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can perform this action");
        _;
    }

    modifier onlyAfterEnd() {
        require(block.timestamp >= auctionEndTime, "Auction not yet ended");
        _;
    }

    modifier checkAuctionState() {
        if (state == AuctionState.Active && block.timestamp >= auctionEndTime) {
            state = AuctionState.Ended;
            emit AuctionEnded(highestBidder, highestBid);
        }
        _;
    }

    function placeBid() public payable checkAuctionState {
        require(state == AuctionState.Active, "Auction is not active");
        require(msg.value > highestBid, "Bid amount too low");

        if (highestBid != 0) {
            // Refund the previous highest bidder
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
    }

    function withdraw() public checkAuctionState {
        require(state == AuctionState.Ended, "Auction is not ended");
        require(!hasWithdrawn[msg.sender], "Already withdrawn");

        uint256 amount = bids[msg.sender];
        if (amount > 0) {
            hasWithdrawn[msg.sender] = true;
            payable(msg.sender).transfer(amount);
        }
    }

    function endAuction() public onlySeller onlyAfterEnd checkAuctionState {
        require(state == AuctionState.Active, "Auction is not active");

        state = AuctionState.Ended;
        emit AuctionEnded(highestBidder, highestBid);

        seller.transfer(highestBid);
    }

    function rateSeller(uint256 rating) public checkAuctionState {
        require(state == AuctionState.Ended, "Auction is not ended");
        require(msg.sender == highestBidder, "Only highest bidder can rate the seller");
        require(!sellerRated, "Seller already rated");
        require(rating >= 1 && rating <= 5, "Invalid rating value");

        sellerRating = rating;
        sellerRated = true;
    }

    function getSellerRating() public view returns (uint256) {
        return sellerRating;
    }
}
