import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DonationModule } from '../donation/donation.module';
import { EmployeesModule } from '../employees/employees.module';
import { HeaderModule } from '../header/header.module';
import { HourModule } from '../hour/hour.module';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { SidenavModule } from '../sidenav/sidenav.module';
import { UserModule } from '../users/user.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DayModule } from '../day/day.module';
import { CertificateService } from '../service-certificate/certificate.service';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AngularMaterialModule,
    SidenavModule,
    HeaderModule,
    HourModule,
    DayModule,
    UserModule,
    EmployeesModule,
    DonationModule
  ],
  exports: [HomeComponent],
  providers: [CertificateService],
})
export class HomeModule {}
