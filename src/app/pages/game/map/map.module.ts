import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { MapRoutingModule } from './map-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { PointDetailComponent } from './components/point-detail/point-detail.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { ArchievementComponent } from './components/archievement/archievement.component';
import { HintComponent } from './components/hint/hint.component';
import { EndingComponent } from './components/ending/ending.component';



@NgModule({
  declarations: [
    MapComponent,
    PointDetailComponent,
    ChatbotComponent,
    ArchievementComponent,
    HintComponent,
    EndingComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    HttpClientModule,
  ]
})
export class MapModule { }
