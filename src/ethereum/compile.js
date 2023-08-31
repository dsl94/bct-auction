const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const auctionPath = path.resolve(__dirname, 'contracts', 'Auction.sol');
const factoryPath = path.resolve(__dirname, 'contracts', 'AuctionFactory.sol');

var input = {
    language: 'Solidity',
    sources: {
        'Auction.sol': {
            content: fs.readFileSync(auctionPath, 'utf8')
        },
        'AuctionFactory.sol': {
            content: fs.readFileSync(factoryPath, 'utf8')
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};

var contracts = JSON.parse(solc.compile(JSON.stringify(input))).contracts;
console.log(contracts);

fs.ensureDirSync(buildPath);


const auctionContracts = contracts['Auction.sol'];
for (let contract in auctionContracts) {
    fs.outputJsonSync(path.resolve(buildPath, contract + '.json'), auctionContracts[contract]);
}

const factoryContracts = contracts['AuctionFactory.sol'];
for (let contract in factoryContracts) {
    fs.outputJsonSync(path.resolve(buildPath, contract + '.json'), factoryContracts[contract]);
}
