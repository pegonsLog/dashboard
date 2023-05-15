import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { SidenavModule } from '../sidenav/sidenav.module';
import { HeaderModule } from '../header/header.module';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AngularMaterialModule,
    SidenavModule,
    HeaderModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
