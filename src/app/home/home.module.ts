import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DayModule } from '../day/day.module';
import { DonationModule } from '../donation/donation.module';
import { EmployeesModule } from '../employees/employees.module';
import { HeaderModule } from '../header/header.module';
import { SidenavModule } from '../sidenav/sidenav.module';
import { UserModule } from '../users/user.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CertificateService } from '../service-certificate/certificate.service';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { HourModule } from '../hour/hour.module';
import { FormsModule } from '@angular/forms';

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
    UserModule,
    EmployeesModule,
    DonationModule,
    FormsModule
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
