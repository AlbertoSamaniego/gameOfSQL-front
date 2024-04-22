import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const canActivateGame: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('user');
  if (token !== null) {
    return true;
  } else {
    router.navigate(['/login-register']);
    return false;
  }
}

export const canActivateHome: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('user');
  if (token === null) {
    return true;
  } else {
    router.navigate(['/game/home-game']);
    return false;
  }
}


