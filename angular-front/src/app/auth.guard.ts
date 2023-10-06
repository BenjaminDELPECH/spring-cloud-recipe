import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "./auth/services/auth.service";
import {inject} from "@angular/core";
import {Dialog} from "@angular/cdk/dialog";
import {SignInComponent} from "./auth/components/sign-in/sign-in.component";

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const dialog = inject(Dialog)
  const isAuthenticated = !!authService.getJwtToken();
  if (isAuthenticated) {
    return true;
  } else {
    dialog.open(SignInComponent)
    return false;
  }
  return true;
};
