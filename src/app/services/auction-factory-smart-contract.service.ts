import { Injectable } from '@angular/core';
import { SmartContractService } from './smart-contract.service';
import { GAS, addressZero } from '../helpers/constants';

@Injectable({
  providedIn: 'root',
})
export class AuctionFactorySmartContractService {
  private factoryContract;
  private account;

  constructor(private smartContractService: SmartContractService) {
    this.factoryContract = this.smartContractService.getAuctionFactoryContract();
    this.account = this.smartContractService.getAccount();
  }

  async createAuction(
    name: string,
    duration: number
  ) {
    await this.factoryContract.methods['createAuction'](
      duration,
      name
    ).send({
      from: this.account,
      gas: GAS,
    });
  }

  async getAuctions() {
    const auctions = await this.factoryContract.methods[
      'getAllAuctions'
    ]().call({
      from: this.account,
    });
    return auctions.filter((act) => act != addressZero);
  }

  async getAuctionDetails(address: string) {
    const auction = await this.factoryContract.methods[
        'getAuctionDetails'
        ](address).call({
      from: this.account,
    });
    return auction;
  }

  async getRatingsForCreator(address: string) {
    const ratings = await this.factoryContract.methods[
      'ratings'
    ](address).call({
      from: this.account,
    });
    return ratings;
  }

  getAccount() {
    return this.account;
  }

  async canRate(addressOwner: string, addressAuction: string) {
    const canRate = await this.factoryContract.methods[
        'canRate'
        ](addressOwner, addressAuction).call({
      from: this.account,
    });
    return canRate;
  }

  async rate(addressOwner: string, addressAuction: string, rate: number) {
    const response = await this.factoryContract.methods[
        'rate'
        ](addressOwner, addressAuction, rate).send({
      from: this.account,
    });
    return response;
  }
}
