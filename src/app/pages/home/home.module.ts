import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SnowFlakeComponent } from '../../shared/interfaces/snow-flake-component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    HomeComponent,
    SnowFlakeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
