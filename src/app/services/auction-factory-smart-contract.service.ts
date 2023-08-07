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

  // async createPublicPoll(
  //   subject: string,
  //   descr: string,
  //   proposalNames: string[],
  //   duration: number
  // ) {
  //   await this.pollsContract.methods['createPublicPoll'](
  //     subject,
  //     descr,
  //     proposalNames,
  //     duration
  //   ).send({
  //     from: this.account,
  //     gas: GAS,
  //   });
  // }
  //
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

  // async rate(poll: string, mark: number) {
  //   await this.pollsContract.methods['rate'](poll, mark).send({
  //     from: this.account,
  //     gas: GAS,
  //   });
  // }
  //
  // async hasRated(creator: string, poll: string) {
  //   return await this.pollsContract.methods['hasRated'](
  //     creator,
  //     poll,
  //     this.account
  //   ).call();
  // }
  //
  // async getRating(address: string) {
  //   const rating = await this.pollsContract.methods['ratings'](address).call();
  //   return rating.rateNumber > 0
  //     ? rating.totalRate / rating.rateNumber
  //     : 'no ratings yet';
  // }
  //
  // async getLastCreatedPoll() {
  //   const activePolls = await this.pollsContract.methods[
  //     'getActivePolls'
  //   ]().call({
  //     from: this.account,
  //   });
  //   return activePolls[activePolls.length - 1];
  // }

  getAccount() {
    return this.account;
  }
}
