import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuctionComponent } from './auction/auction.component';
import { CreateAuctionComponent } from './create-auction/create-auction.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'auctions', component: AuctionsComponent },
  { path: 'create-auction', component: CreateAuctionComponent },
  { path: 'auction', component: AuctionComponent },
  { path: 'auction/:id', component: AuctionComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
