import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserListComponent } from './user-list/user-list.component';


@NgModule({
  declarations: [
    UserListComponent,
    UserCreateComponent,
    UserUpdateComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ],
  exports:[  UserListComponent,
    UserCreateComponent,
    UserUpdateComponent]
})
export class UserModule { }
