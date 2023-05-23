import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { SidenavRoutingModule } from './sidenav-routing.module';
import { SidenavComponent } from './sidenav.component';


@NgModule({
  declarations: [SidenavComponent],
  imports: [
    CommonModule,
    SidenavRoutingModule,
    AngularMaterialModule,
    FormsModule
    ],
  exports: [SidenavComponent]
})
export class SidenavModule { }
