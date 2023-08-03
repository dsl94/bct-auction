import { Component, OnInit } from '@angular/core';
import { AuctionFactorySmartContractService } from '../services/auction-factory-smart-contract.service';

@Component({
  selector: 'app-polls',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.scss'],
})
export class AuctionsComponent implements OnInit {
  isLoading: boolean;
  activeAuction;
  constructor(private auctionFactorySmartContractService: AuctionFactorySmartContractService) {}

  ngOnInit(): void {
    this.init();
  }

  async init() {
    this.isLoading = true;

    this.activeAuction = await this.auctionFactorySmartContractService.getAuctions();

      this.isLoading = false;
  }
}
