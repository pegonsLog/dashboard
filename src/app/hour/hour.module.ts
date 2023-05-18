import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HourRoutingModule } from './hour-routing.module';
import { HourCreateComponent } from './hour-create/hour-create.component';
import { HourUpdateComponent } from './hour-update/hour-update.component';
import { HourListComponent } from './hour-list/hour-list.component';

@NgModule({
  declarations: [HourCreateComponent, HourUpdateComponent, HourListComponent],
  imports: [CommonModule, HourRoutingModule],
  exports: [HourCreateComponent, HourUpdateComponent, HourListComponent],
})
export class HourModule {}