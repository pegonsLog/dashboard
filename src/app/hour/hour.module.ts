import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { ConfirmationModule } from '../shared/dialogs/confirmation/confirmation.module';
import { HourCreateComponent } from './hour-create/hour-create.component';
import { HourListComponent } from './hour-list/hour-list.component';
import { HourRoutingModule } from './hour-routing.module';
import { HourUpdateComponent } from './hour-update/hour-update.component';
import { InputMaskModule } from '@ngneat/input-mask';

@NgModule({
  declarations: [HourCreateComponent, HourUpdateComponent, HourListComponent],
  imports: [
    CommonModule,
    HourRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    ConfirmationModule,
    InputMaskModule
  ],
  exports: [HourCreateComponent, HourUpdateComponent, HourListComponent],
})
export class HourModule {}
