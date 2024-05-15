import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Función de guardia personalizada para comprobar si el usuario está autenticado antes de acceder a determinadas rutas.
 * @returns Un booleano que indica si el usuario está autenticado o no.
 */
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

/**
 * Función de guardia personalizada para comprobar si el usuario no está autenticado antes de acceder a determinadas rutas.
 * @returns Un booleano que indica si el usuario no está autenticado o no.
 */
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


