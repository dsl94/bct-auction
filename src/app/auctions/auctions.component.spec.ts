import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionsComponent } from './auctions.component';

describe('AuctionComponent', () => {
  let component: AuctionsComponent;
  let fixture: ComponentFixture<AuctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuctionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
