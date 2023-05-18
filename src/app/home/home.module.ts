import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DayModule } from '../day/day.module';
import { HeaderModule } from '../header/header.module';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { SidenavModule } from '../sidenav/sidenav.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HourModule } from '../hour/hour.module';
import { DonationModule } from '../donation/donation.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AngularMaterialModule,
    SidenavModule,
    HeaderModule,
    DayModule,
    HourModule,
    DonationModule
  ],
  exports: [HomeComponent],
})
export class HomeModule {}