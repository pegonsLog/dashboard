import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter/filter.component';
import { BirthdayListComponent } from './birthday-list/birthday-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { BirthdayRoutingModule } from './birthday-routing.module';

@NgModule({
  declarations: [BirthdayListComponent, FilterComponent, BirthdayListComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    BirthdayRoutingModule,
  ],
  exports: [BirthdayListComponent, FilterComponent, BirthdayListComponent],
})
export class BirthdayModule {}
