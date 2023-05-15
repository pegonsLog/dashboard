import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidenavRoutingModule } from './sidenav-routing.module';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { SidenavComponent } from './sidenav.component';


@NgModule({
  declarations: [SidenavComponent],
  imports: [
    CommonModule,
    SidenavRoutingModule,
    AngularMaterialModule
  ],
  exports: [SidenavComponent]
})
export class SidenavModule { }
