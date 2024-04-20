import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeGameComponent } from './home-game.component';
import { HomeGameRoutingModule } from './home-game-routing.module';



@NgModule({
  declarations: [
    HomeGameComponent
  ],
  imports: [
    CommonModule,
    HomeGameRoutingModule
  ]
})
export class HomeGameModule { }
