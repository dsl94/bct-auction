import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuctionFactorySmartContractService } from '../services/auction-factory-smart-contract.service';
import { addressZero } from '../helpers/constants';
import {SimpleAuctionSmartContractService} from "../services/simple-auction-smart-contract.service";
import Web3 from "web3";
// import {decrypt} from "ganache";

@Component({
  selector: 'app-poll',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss'],
})
export class AuctionComponent implements OnInit {
  isLoading = false;
  address;
  details = {
    auctionName: '',
    highestBid: 0,
    highestBidder: '',
    seller: '',
    auctionEndTime: 0
  }
  ratings = {
    numberOfRates: 0,
    ratingSum: 0
  }
  bid = 0;
  constructor(private auctionFactoryService: AuctionFactorySmartContractService, private activatedRoute: ActivatedRoute, private simpleAuctionContract: SimpleAuctionSmartContractService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.address = this.activatedRoute.snapshot.params['id'];
    this.auctionFactoryService.getAuctionDetails(this.address).then(d => {
      this.details = d;
      this.auctionFactoryService.getRatingsForCreator(this.details.seller).then(r => {
        this.ratings = r;
        this.isLoading = false;
      });
    });
  }

  unixTimestampToDate(unixTimestamp: number): string {
    unixTimestamp = Number(unixTimestamp);
    const date = new Date(unixTimestamp * 1000); // Unix timestamp is in seconds, so multiply by 1000 to convert to milliseconds
    return date.toLocaleString("sr"); // Returns the date in the local time zone and format
  }

  placeBid() {
    this.isLoading = true;
    this.simpleAuctionContract.bid(this.address, this.bid).then(res => {
      this.isLoading = false;
      console.log(res);
    }).catch(e => {
      this.isLoading = false;
      console.log(e);
    });
  }

  weiToEth(value) {
    return Web3.utils.fromWei(value, "ether");
  }
}
