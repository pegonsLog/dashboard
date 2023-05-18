import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonationRoutingModule } from './donation-routing.module';
import { DonationCreateComponent } from './donation-create/donation-create.component';
import { DonationUpdateComponent } from './donation-update/donation-update.component';
import { DonationListComponent } from './donation-list/donation-list.component';

@NgModule({
  declarations: [
    DonationCreateComponent,
    DonationUpdateComponent,
    DonationListComponent,
  ],
  imports: [CommonModule, DonationRoutingModule],
  exports: [
    DonationCreateComponent,
    DonationUpdateComponent,
    DonationListComponent,
  ],
})
export class DonationModule {}
