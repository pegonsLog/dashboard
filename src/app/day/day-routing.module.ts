import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayCreateComponent } from './day-create/day-create.component';
import { DayListComponent } from './day-list/day-list.component';

const routes: Routes = [
  {
    path: 'new',
    component: DayCreateComponent,
  },
  {
    path: 'list',
    component: DayListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DayRoutingModule {}
