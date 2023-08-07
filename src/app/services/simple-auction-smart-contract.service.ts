import { Injectable } from '@angular/core';
import { SmartContractService } from './smart-contract.service';
import { GAS, addressZero } from '../helpers/constants';
import { Subject } from 'rxjs';
import Web3 from "web3";

@Injectable({
  providedIn: 'root',
})
export class SimpleAuctionSmartContractService {
  private account;

  constructor(private smartContractService: SmartContractService) {
    this.account = this.smartContractService.getAccount();
  }

  async getCreator(address: string) {
      let simpleAuctionContract =
          this.smartContractService.getAuctionContract(address)
    const creator = await simpleAuctionContract.methods['beneficiary']().call();
    return creator;
  }

  async bid(auctionAddress, bid) {
    let simpleAuctionContract =
        this.smartContractService.getAuctionContract(auctionAddress);

    const response = await simpleAuctionContract.methods['bid']().send({
      from: this.account,
      value: Web3.utils.toWei(bid, "ether")
    });

    return response;
  }

}
