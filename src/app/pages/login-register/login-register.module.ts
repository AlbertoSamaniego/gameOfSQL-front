import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRegisterComponent } from './login-register.component';
import { LoginRegisterRoutingModule } from './login-register-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LoginRegisterComponent
  ],
  imports: [
    CommonModule,
    LoginRegisterRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    LoginRegisterComponent
  ]
})
export class LoginRegisterModule { }
