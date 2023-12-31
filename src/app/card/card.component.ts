import { Component, Input, OnInit } from '@angular/core';
import {AuctionFactorySmartContractService} from "../services/auction-factory-smart-contract.service";
import Web3 from "web3";
import {Web3Service} from "../services/web3.service";
import {SimpleAuctionSmartContractService} from "../services/simple-auction-smart-contract.service";

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
    auctionEndTime: 0,
    seller: '',
    ended: false,
    highestBidder: ''
  }
  canRate = false;
  canWithdraw = false;
  constructor(private auctionFactoryService: AuctionFactorySmartContractService, private web3Service: Web3Service, private auctionService: SimpleAuctionSmartContractService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.auctionFactoryService.getAuctionDetails(this.address).then(d => {
      this.details = d;
      if (this.details.auctionName != '') {
        this.loadCanRate();
        this.loadCanWithdraw();
      }
    });
  }

  loadCanRate() {
    this.auctionFactoryService.canRate(this.details.seller, this.address).then(r => {
      this.canRate = r;
      if (this.details.highestBidder != this.web3Service.getAccount()) {
        this.canRate = false;
      }
    });
  }

  rate(rating: number) {
    this.loadCanRate();
    if (this.canRate) {
      this.auctionFactoryService.rate(this.details.seller, this.address, rating).then(res => {
        this.load();
      }).catch(e => {
        alert(e);
      })
    } else {
      alert("You can not rate")
    }
  }

  weiToEth(value) {
    return Web3.utils.fromWei(value, "ether");
  }

  canEnd() {
    const isSeller =  this.web3Service.getAccount() == this.details.seller;
    return isSeller && this.isAuctionTimePassed() && !this.details.ended;
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

  endAuction() {
    this.auctionService.endAuction(this.address).then(d => {
      console.log(d)
    }).catch(e => {
      console.log(e)
    })
  }

  unixTimestampToDate(unixTimestamp: number): string {
    unixTimestamp = Number(unixTimestamp);
    const date = new Date(unixTimestamp * 1000); // Unix timestamp is in seconds, so multiply by 1000 to convert to milliseconds
    return date.toLocaleString("sr"); // Returns the date in the local time zone and format
  }

  isBuyer() {
    const isBuyer = this.web3Service.getAccount() == this.details.highestBidder;
    const ended = this.details.ended;

    return isBuyer && ended;
  }

  loadCanWithdraw() {
    this.auctionService.canWithdraw(this.address,this.web3Service.getAccount()).then(d => {
      this.canWithdraw = d;
    });
  }

  withdraw() {
    this.auctionService.withdraw(this.address).then(d => {
      this.loadCanWithdraw();
    });
  }
}
