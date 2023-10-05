import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "./auth/services/auth.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const isAuthenticated = !!authService.getJwtToken();
  if (isAuthenticated) {
    return true;
  } else {
    router.navigate(['auth', 'signIn'])
  }
  return true;
};
