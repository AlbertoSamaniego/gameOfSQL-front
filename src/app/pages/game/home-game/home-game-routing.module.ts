import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeGameComponent } from './home-game.component';

const routes: Routes = [{path: '', component: HomeGameComponent}]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class HomeGameRoutingModule { }
