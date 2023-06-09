import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { DayCreateComponent } from './day-create/day-create.component';
import { DayListComponent } from './day-list/day-list.component';
import { DayRoutingModule } from './day-routing.module';
import { DayUpdateComponent } from './day-update/day-update.component';


@NgModule({
  declarations: [
    DayCreateComponent,
    DayUpdateComponent,
    DayListComponent
  ],
  imports: [
    CommonModule,
    DayRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    DayCreateComponent,
    DayUpdateComponent,
    DayListComponent
  ],
})
export class DayModule { }
