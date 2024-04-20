import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RulesComponent } from './rules.component';

const routes: Routes = [{path: '', component: RulesComponent}]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RulesRoutingModule { }
