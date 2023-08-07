import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuctionFactorySmartContractService } from '../services/auction-factory-smart-contract.service';
import { addressZero } from '../helpers/constants';
// import {decrypt} from "ganache";

@Component({
  selector: 'app-poll',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss'],
})
export class AuctionComponent implements OnInit {
  address;
  details = {
    auctionName: '',
    highestBid: 0,
    highestBidder: '',
    seller: '',
    auctionEndTime: 0
  }
  bid = 0;
  constructor(private auctionFactoryService: AuctionFactorySmartContractService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.address = this.activatedRoute.snapshot.params['id'];
    this.auctionFactoryService.getAuctionDetails(this.address).then(d => {
      this.details = d;
      console.log(this.details);
    });
  }

  unixTimestampToDate(unixTimestamp: number): string {
    unixTimestamp = Number(unixTimestamp);
    const date = new Date(unixTimestamp * 1000); // Unix timestamp is in seconds, so multiply by 1000 to convert to milliseconds
    return date.toLocaleString("sr"); // Returns the date in the local time zone and format
  }
}
