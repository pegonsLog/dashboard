import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('src/app/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('src/app/users/user.module').then((m) => m.UserModule),
  },
  {
    path: 'employees',
    loadChildren: () =>
      import('src/app/employees/employees.module').then((m) => m.EmployeesModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('src/app/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'days',
    loadChildren: () =>
      import('src/app/day/day.module').then((m) => m.DayModule),
  },
  {
    path: 'hours',
    loadChildren: () =>
      import('src/app/hour/hour.module').then((m) => m.HourModule),
  },
  {
    path: 'donations',
    loadChildren: () =>
      import('src/app/donation/donation.module').then((m) => m.DonationModule),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('src/app/search/search.module').then((m) => m.SearchModule),
  },
  {
    path: 'birthday',
    loadChildren: () =>
      import('src/app/birthday/birthday.module').then((m) => m.BirthdayModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
