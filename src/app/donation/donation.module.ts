import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { DonationCreateComponent } from './donation-create/donation-create.component';
import { DonationListComponent } from './donation-list/donation-list.component';
import { DonationRoutingModule } from './donation-routing.module';
import { DonationUpdateComponent } from './donation-update/donation-update.component';

@NgModule({
  declarations: [
    DonationCreateComponent,
    DonationUpdateComponent,
    DonationListComponent,
  ],
  imports: [CommonModule, DonationRoutingModule, AngularMaterialModule],
  exports: [
    DonationCreateComponent,
    DonationUpdateComponent,
    DonationListComponent,
  ]
})
export class DonationModule {}
