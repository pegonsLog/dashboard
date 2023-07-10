import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BirthdayListComponent } from './birthday-list/birthday-list.component';
import { FilterComponent } from './filter/filter.component';

const routes: Routes = [
  {
    path: 'filter',
    component: FilterComponent,
  },
  {
    path: 'birthdayList',
    component: BirthdayListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BirthdayRoutingModule {}
