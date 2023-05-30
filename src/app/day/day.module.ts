import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DayRoutingModule } from './day-routing.module';
import { DayCreateComponent } from './day-create/day-create.component';
import { DayUpdateComponent } from './day-update/day-update.component';
import { DayListComponent } from './day-list/day-list.component';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { CertificateService } from '../service-certificate/certificate.service';


@NgModule({
  declarations: [
    DayCreateComponent,
    DayUpdateComponent,
    DayListComponent
  ],
  imports: [
    CommonModule,
    DayRoutingModule,
    AngularMaterialModule
  ],
  exports: [
    DayCreateComponent,
    DayUpdateComponent,
    DayListComponent
  ],
})
export class DayModule { }
