import { Component, Input, OnInit } from '@angular/core';
import {AuctionFactorySmartContractService} from "../services/auction-factory-smart-contract.service";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() isActive: boolean = false;
  @Input() address;
  details = {
    auctionName: '',
    highestBid: 0,
    auctionEndTime: 0
  }
  constructor(private auctionFactoryService: AuctionFactorySmartContractService) {}

  ngOnInit(): void {
    this.auctionFactoryService.getAuctionDetails(this.address).then(d => {
      this.details = d;
    });
  }

  unixTimestampToDate(unixTimestamp: number): string {
    unixTimestamp = Number(unixTimestamp);
    const date = new Date(unixTimestamp * 1000); // Unix timestamp is in seconds, so multiply by 1000 to convert to milliseconds
    return date.toLocaleString("sr"); // Returns the date in the local time zone and format
  }
}
