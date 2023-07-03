import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HourRoutingModule } from './hour-routing.module';
import { HourCreateComponent } from './hour-create/hour-create.component';
import { HourUpdateComponent } from './hour-update/hour-update.component';
import { HourListComponent } from './hour-list/hour-list.component';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationModule } from '../shared/dialogs/confirmation/confirmation.module';
import { InputMaskModule } from '@ngneat/input-mask';

@NgModule({
  declarations: [HourCreateComponent, HourUpdateComponent, HourListComponent],
  imports: [
    CommonModule,
    HourRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    InputMaskModule,
    ConfirmationModule,
  ],
  exports: [HourCreateComponent, HourUpdateComponent, HourListComponent],
})
export class HourModule {}
