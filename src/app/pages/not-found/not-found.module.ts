import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { SharedModule } from '../../shared/shared.module';
import { NotFoundRoutingModule } from './not-found-routing.module';



@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    NotFoundRoutingModule,
    SharedModule
  ]
})
export class NotFoundModule { }
