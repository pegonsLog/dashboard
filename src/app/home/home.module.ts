import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DayModule } from '../day/day.module';
import { DonationModule } from '../donation/donation.module';
import { EmployeesModule } from '../employees/employees.module';
import { HeaderModule } from '../header/header.module';
import { HourModule } from '../hour/hour.module';
import { SearchModule } from "../search/search.module";
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { UserModule } from '../users/user.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
    declarations: [HomeComponent],
    exports: [HomeComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        AngularMaterialModule,
        HeaderModule,
        DayModule,
        HourModule,
        UserModule,
        EmployeesModule,
        DonationModule,
        FormsModule,
        ReactiveFormsModule,
        SearchModule
    ]
})
export class HomeModule {}
