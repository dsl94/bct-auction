import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuctionFactorySmartContractService } from '../services/auction-factory-smart-contract.service';

@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.scss'],
})
export class CreateAuctionComponent implements OnInit {
  name: string = '';
  duration: number = 0;
  timeUnit: string = 'seconds';

  error: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private auctionFactorySmartContractService: AuctionFactorySmartContractService
  ) {}

  ngOnInit(): void {}

  createNewAuction() {
    if (!this.doesErrorExist()) {
      this.error = false;
      this.errorMessage = '';
      const durationInSeconds: number = this.calculateDurationInSeconds();
      this.auctionFactorySmartContractService.createAuction(
          this.name,
          durationInSeconds
      ).then(data => {
        this.isLoading = true;
        this.navigate();
        this.resetValues();
        this.isLoading = false;
      }).catch(e => {
        alert(e);
      });
    } else {
        this.error = true;
        this.errorMessage = 'There need to be minimum 2 proposals.';
      }
  }

  private doesErrorExist() {
    if (this.name == '') {
      this.error = true;
      this.errorMessage =
        'Name and duration should not be empty.';
      return true;
    } else if (this.duration < 0) {
      this.error = true;
      this.errorMessage = 'Duration need to be non-negative number.';
      return true;
    } else {
      this.error = false;
      this.errorMessage = '';
      return false;
    }
  }

  private calculateDurationInSeconds(): number {
    let durationInSeconds = this.duration;
    switch (this.timeUnit) {
      case 'minutes':
        durationInSeconds *= 60;
        break;
      case 'hours':
        durationInSeconds *= 60 * 60;
        break;
      case 'days':
        durationInSeconds *= 60 * 60 * 24;
        break;
      case 'weeks':
        durationInSeconds *= 60 * 60 * 24 * 7;
        break;
      default:
        break;
    }
    return durationInSeconds;
  }

  async navigate() {

  }

  private resetValues() {
    this.name = '';
    this.duration = 0;
    this.timeUnit = 'seconds';

    this.error = false;
    this.errorMessage= '';
  }
}
