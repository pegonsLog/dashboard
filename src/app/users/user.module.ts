import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserListComponent } from './user-list/user-list.component';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InputMaskModule } from '@ngneat/input-mask';
import { ConfirmationModule } from '../shared/dialogs/confirmation/confirmation.module';


@NgModule({
  declarations: [
    UserListComponent,
    UserCreateComponent,
    UserUpdateComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    InputMaskModule,
    ConfirmationModule,
  ],
  exports:[  UserListComponent,
    UserCreateComponent,
    UserUpdateComponent]
})
export class UserModule { }
