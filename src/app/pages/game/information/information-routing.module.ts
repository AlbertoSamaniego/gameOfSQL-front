import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InformationComponent } from './information.component';

const routes: Routes = [{path: '', component: InformationComponent}]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class InformationRoutingModule { }
