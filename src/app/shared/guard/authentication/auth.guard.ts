import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';

export const canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return true;
};

export const canMatch: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  return true;
};
