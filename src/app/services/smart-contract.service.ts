import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';

const auctionFactory = require('../../ethereum/build/AuctionFactory.json');
const auction = require('../../ethereum/build/Auction.json');

const mainAddress = '0xCC2DD3dF334db21A7A88D1737D188D9d07A3e991';

@Injectable({
  providedIn: 'root',
})
export class SmartContractService {
  private auctionFactoryContract;
  private web3;

  constructor(private web3Service: Web3Service) {
    this.web3 = this.web3Service.getInstance();
    this.auctionFactoryContract = new this.web3.eth.Contract(
      auctionFactory.abi,
      mainAddress
    );
  }

  getAuctionFactoryContract() {
    return this.auctionFactoryContract;
  }

  getAuctionContract(auctionAddress: string) {
    return new this.web3.eth.Contract(auction.abi, auctionAddress);
  }

  getAccount() {
    return this.web3Service.getAccount();
  }
}
