import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginRegisterComponent } from './login-register.component';

const routes: Routes = [{path: '', component: LoginRegisterComponent}]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LoginRegisterRoutingModule { }
