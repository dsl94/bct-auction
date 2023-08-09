pragma solidity ^0.8.0;

import "./Auction.sol";

contract AuctionFactory {

    struct Organiser {
        bool active;
        uint ratingSum;
        uint numberOfRates;
    }

    address[] public owners;
    mapping(address => Organiser) public ratings;
    mapping(address => mapping(address => mapping(address => bool))) public hasVoted;

    address[] public allAuctions;

    function createAuction(uint _biddingTime, string memory _name) public returns(address createdAuction) {
        Auction newSimpleAuction = new Auction(_biddingTime, _name, payable(msg.sender));
        allAuctions.push(address(newSimpleAuction));

        if(!ratings[msg.sender].active) {
            ratings[msg.sender].active = true;
            owners.push(msg.sender);
        }

        return address(newSimpleAuction);
    }

    function getAuctionDetails(address auctionAddress) public view returns (
        address payable seller,
        uint256 auctionEndTime,
        address highestBidder,
        uint256 highestBid,
        string memory auctionName,
        bool ended
    ) {
        Auction auction = Auction(auctionAddress);
        return (
            auction.beneficiary(),
            auction.auctionEndTime(),
            auction.highestBidder(),
            auction.highestBid(),
            auction.auctionName(),
            auction.hasAuctionEnded()
        );
    }

    function getAllAuctions() public view returns(address[] memory) {
        return allAuctions;
    }

    function getOwners() public view returns(address[] memory) {
        return owners;
    }

    function canRate(address owner, address auction) public view returns(bool) {
        if(msg.sender == owner
            || !ratings[owner].active
            || !Auction(auction).hasAuctionEnded()
            || owner != Auction(auction).beneficiary()
            || hasVoted[owner][auction][msg.sender]) {
            return false;
        }
        if (Auction(auction).highestBidder() != msg.sender
            && Auction(auction).pendingReturns(msg.sender) == 0) {
            return false;
        }
        return true;
    }

    function rate(address owner, address auction, uint8 rate) public {
        require(rate <= 5, "Maximum value for rate is 5.");
        require(rate > 0, "Minimum value for rate is 1.");
        require(canRate(owner, auction), "You're not allowed to rate.");
        hasVoted[owner][auction][msg.sender] = true;
        ratings[owner].ratingSum += rate;
        ratings[owner].numberOfRates++;
    }

}
