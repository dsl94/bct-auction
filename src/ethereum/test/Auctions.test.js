const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3'); 

const web3 = new Web3(ganache.provider());

const Auction = require('../build/Auction.json');
const AuctionFactory = require('../build/AuctionFactory.json');

let accounts;
let auctionFactorySmartContract;
let auctionSmartContract;
let endedAuctionSmartContract;

let auctionAddresses;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    auctionFactorySmartContract = await new web3.eth.Contract(AuctionFactory.abi).deploy({ data: AuctionFactory.evm.bytecode.object }).send({from: accounts[0], gas: 30000000});

    await auctionFactorySmartContract.methods.createAuction(
        60000,
        "test",
    ).send({from: accounts[0], gas: 3000000});

    await auctionFactorySmartContract.methods.createAuction(
        1,
        "ended",
    ).send({from: accounts[0], gas: 3000000});

    auctionAddresses = await auctionFactorySmartContract.methods.getAllAuctions().call({from: accounts[0]});

    auctionSmartContract = new web3.eth.Contract(Auction.abi, auctionAddresses[0]);
    endedAuctionSmartContract = new web3.eth.Contract(Auction.abi, auctionAddresses[1]);
});

describe('Auction factory testing', function() {
    it('get all accounts', () => {
        assert.ok(accounts.length > 0);
    });

    it('deploys a main contract', () => {
        assert.ok(auctionFactorySmartContract.options.address);
    });

    it('gets auctions', async () => {
        const auctions = await auctionFactorySmartContract.methods.getAllAuctions().call({from: accounts[0]});

        assert.ok(auctions[0]);
        assert.ok(auctions[1]);
        assert.equal(auctions.length, 2); //
    });

    it('can rate fail', async () => {
        let canRate = await auctionFactorySmartContract.methods.canRate(accounts[0], auctionAddresses[0]).call({from: accounts[1]});
        assert.equal(canRate, false);
    });

    it('rate fail', async () => {
        try {
            auctionFactorySmartContract.methods.rate(accounts[0], auctionAddresses[0], 5).call({from: accounts[1]});
        } catch (e) {
            assert(e);
        }
    });

    it('can rate success', async () => {
        await endedAuctionSmartContract.methods.bid().send({from: accounts[1], value: 100});
        await sleep(1000);
        await endedAuctionSmartContract.methods.auctionEnd().send({from: accounts[0], gas: 3000000});
        await sleep(100);
        let canRate = await auctionFactorySmartContract.methods.canRate(accounts[0], auctionAddresses[1]).call({from: accounts[1]});
        // let ratings = await auctionFactorySmartContract.methods.ratings(accounts[0]).call({from: accounts[1]});
        assert.equal(canRate, true)
    });

    it('rate success', async () => {
        await endedAuctionSmartContract.methods.bid().send({from: accounts[1], value: 100});
        await sleep(1000);
        await endedAuctionSmartContract.methods.auctionEnd().send({from: accounts[0], gas: 3000000});
        await sleep(100);
        await auctionFactorySmartContract.methods.rate(accounts[0], auctionAddresses[1], 5).call({from: accounts[1]});
        let ratings = await auctionFactorySmartContract.methods.ratings(accounts[0]).call({from: accounts[1]});
        assert(ratings)
    });
});

describe('Auction smart contract testing', () => {
    it('deploys a contract', () => {
        assert.ok(auctionSmartContract.options.address);
    });

    it('is name properly set', async () => {
        const name = await auctionSmartContract.methods.auctionName().call({from: accounts[0]});
        assert.equal(name, "test", "Name is not set properly.");
    });

    it('is duration set', async () => {
        const duration = await auctionSmartContract.methods.auctionEndTime().call({from: accounts[0]});
        assert(duration);
    });

    it('test bid', async () => {
        await auctionSmartContract.methods.bid().send({from: accounts[1], value: 100});
        const highestBid = await auctionSmartContract.methods.highestBid().call({from: accounts[0]});
        assert.equal(highestBid, 100);
    });

    it('test bid fail', async () => {
        await auctionSmartContract.methods.bid().send({from: accounts[0], value: 100});
        sleep(10)
        try {
            await auctionSmartContract.methods.bid().send({from: accounts[0], value: 10});
        } catch (e) {
            assert(e);
        }

    });

    it('test end auction', async () => {
        await sleep(1000);
        await endedAuctionSmartContract.methods.auctionEnd().send({from: accounts[0], gas: 3000000});
        await sleep(100);
        const hasEnded = await endedAuctionSmartContract.methods.hasAuctionEnded().call({from: accounts[0]});
        assert.equal(hasEnded, true)
    });

    it('test highest bidder', async () => {
        await auctionSmartContract.methods.bid().send({from: accounts[0], value: 100});
        await auctionSmartContract.methods.bid().send({from: accounts[1], value: 200});
        let highestBid = await auctionSmartContract.methods.highestBid().call({from: accounts[0]});
        let highestBidder = await auctionSmartContract.methods.highestBidder().call({from: accounts[0]});
        assert.equal(highestBid, 200)
        assert.equal(highestBidder, accounts[1])
    });
});
