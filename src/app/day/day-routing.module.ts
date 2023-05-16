import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayCreateComponent } from './day-create/day-create.component';

const routes: Routes = [
  {
    path: 'new',
    component: DayCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DayRoutingModule {}
