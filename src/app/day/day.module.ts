import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DayRoutingModule } from './day-routing.module';
import { DayCreateComponent } from './day-create/day-create.component';
import { DayUpdateComponent } from './day-update/day-update.component';
import { DayListComponent } from './day-list/day-list.component';


@NgModule({
  declarations: [
    DayCreateComponent,
    DayUpdateComponent,
    DayListComponent
  ],
  imports: [
    CommonModule,
    DayRoutingModule
  ]
})
export class DayModule { }
