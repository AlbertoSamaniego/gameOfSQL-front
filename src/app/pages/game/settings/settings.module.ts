import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { GameProfileComponent } from './components/game-profile/game-profile.component';
import { GameConfigComponent } from './components/game-config/game-config.component';
import { UserArchievementsComponent } from './components/user-archievements/user-archievements.component';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';



@NgModule({
  declarations: [
    SettingsComponent,
    GameProfileComponent,
    GameConfigComponent,
    UserArchievementsComponent,
    AccountSettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule
  ],
})
export class SettingsModule { }
