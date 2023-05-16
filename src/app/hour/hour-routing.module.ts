import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HourCreateComponent } from './hour-create/hour-create.component';

const routes: Routes = [
  {
    path: 'new',
    component: HourCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HourRoutingModule {}
