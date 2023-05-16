import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayCreateComponent } from '../day/day-create/day-create.component';

const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SidenavRoutingModule { }
