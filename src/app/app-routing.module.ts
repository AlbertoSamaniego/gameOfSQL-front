import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivateGame, canActivateHome } from './shared/guard/authentication/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    canActivate: [canActivateHome],
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'login-register',
    canActivate: [canActivateHome],
    loadChildren: () =>
      import('./pages/login-register/login-register.module').then(m => m.LoginRegisterModule)
  },
  {
    path: 'game',
    canActivate: [canActivateGame],
    loadChildren: () =>
      import('./pages/game/game.module').then(m => m.GameModule)
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('./pages/not-found/not-found.module').then(m => m.NotFoundModule)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
