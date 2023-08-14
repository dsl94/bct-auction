import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuctionFactorySmartContractService } from '../services/auction-factory-smart-contract.service';
import { addressZero } from '../helpers/constants';
import {SimpleAuctionSmartContractService} from "../services/simple-auction-smart-contract.service";
import Web3 from "web3";
import {Web3Service} from "../services/web3.service";
// import {decrypt} from "ganache";

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss'],
})
export class AuctionComponent implements OnInit {
  isLoading = false;
  address;
  error = ''
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
  constructor(private auctionFactoryService: AuctionFactorySmartContractService, private activatedRoute: ActivatedRoute, private simpleAuctionContract: SimpleAuctionSmartContractService,
              private web3Service: Web3Service) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.address = this.activatedRoute.snapshot.params['id'];
    this.load();
  }

  load() {
    this.auctionFactoryService.getAuctionDetails(this.address).then(d => {
      this.details = d;
      this.auctionFactoryService.getRatingsForCreator(this.details.seller).then(r => {
        this.ratings = r;
        this.isLoading = false;
      });
    });
  }

  unixTimestampToDate(unixTimestamp: number): string {
   const date = this.timestampFormat(unixTimestamp);// Unix timestamp is in seconds, so multiply by 1000 to convert to milliseconds
    return date.toLocaleString("sr"); // Returns the date in the local time zone and format
  }

  timestampFormat(unixTimestamp: number) {
    unixTimestamp = Number(unixTimestamp);
    const date = new Date(unixTimestamp * 1000);

    return date;
  }

  isAuctionTimePassed() {
    let auctionEndTime = this.timestampFormat(this.details.auctionEndTime);
    let now = new Date();
    if (now > auctionEndTime) {
      return true;
    } else {
      return false;
    }
  }

  placeBid() {
    if (this.isAuctionTimePassed()) {
      this.error = 'Auction time passed!!!';
    } else if(this.bid <= Number(this.weiToEth(this.details.highestBid))) {
      this.error = 'Your bid must be greater this current highest bid!!!'
    } else {
      this.isLoading = true;
      this.simpleAuctionContract.bid(this.address, this.bid).then(res => {
        this.isLoading = false;
        console.log(res);
        this.error = '';
        this.load();
      }).catch(e => {
        this.isLoading = false;
        console.log(e);
        this.error = e;
      });
    }
  }

  weiToEth(value) {
    return Web3.utils.fromWei(value, "ether");
  }

  isSeller() {
    const isSeller =  this.web3Service.getAccount() == this.details.seller;
    return isSeller;
  }
}
