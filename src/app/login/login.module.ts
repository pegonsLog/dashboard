import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [LoginComponent]
})
export class LoginModule { }
