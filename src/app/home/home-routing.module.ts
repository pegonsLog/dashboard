import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DayCreateComponent } from '../day/day-create/day-create.component';

const routes: Routes = [
  {
    path: 'main',
    component: HomeComponent,
  },

  { path: 'daynew', component: DayCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
