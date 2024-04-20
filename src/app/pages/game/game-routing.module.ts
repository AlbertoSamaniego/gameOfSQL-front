import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeGameComponent } from './home-game/home-game.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'rules',
        loadChildren: () =>
          import('./rules/rules.module').then(m => m.RulesModule)
      },
      {
        path: 'map',
        loadChildren: () =>
          import('./map/map.module').then(m => m.MapModule)
      },
      {
        path: 'information',
        loadChildren: () =>
          import('./information/information.module').then(m => m.InformationModule)

      },
      {
        path: 'home-game',
        loadChildren: () =>
          import('./home-game/home-game.module').then(m => m.HomeGameModule)
      },
      {
        path: '',
        component: HomeGameComponent
      },
      {
        path: '**',
        redirectTo: '',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
