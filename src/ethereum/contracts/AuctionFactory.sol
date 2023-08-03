pragma solidity ^0.8.0;

import "./Auction.sol";

contract AuctionFactory {
    address[] public auctions;

    function createAuction(uint256 _duration, string memory _name) public {
        address newAuction = address(new Auction(msg.sender, _duration, _name));
        auctions.push(newAuction);
    }

    function getAuctions() public view returns (address[] memory) {
        return auctions;
    }

    function getAuctionDetails(address auctionAddress) public view returns (
        address payable seller,
        uint256 auctionEndTime,
        address highestBidder,
        uint256 highestBid,
        string memory auctionName,
        AuctionState state
    ) {
        Auction auction = Auction(auctionAddress);
        return (
            auction.seller(),
            auction.auctionEndTime(),
            auction.highestBidder(),
            auction.highestBid(),
            auction.auctionName(),
            auction.state()
        );
    }

    function getRatingsForSeller(address sellerAddress) public view returns (uint256[] memory) {
        uint256[] memory ratings;
        for (uint256 i = 0; i < auctions.length; i++) {
            Auction auction = Auction(auctions[i]);
            if (auction.seller() == sellerAddress && auction.state() == AuctionState.Ended && auction.sellerRated()) {
                ratings[i] = auction.getSellerRating();
            }
        }
        return ratings;
    }


}
