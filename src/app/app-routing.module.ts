import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },

  {
    path: 'users',
    loadChildren: () =>
      import('src/app/users/users.module').then(
        (m) => m.UsersModule
      ),
  },
  {
    path: 'days',
    loadChildren: () =>
      import('src/app/day/day.module').then(
        (m) => m.DayModule
      ),
  },
  {
    path: 'hours',
    loadChildren: () =>
      import('src/app/hour/hour.module').then(
        (m) => m.HourModule
      ),
  },
  {
    path: 'donations',
    loadChildren: () =>
      import('src/app/donation/donation.module').then(
        (m) => m.DonationModule
      ),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
