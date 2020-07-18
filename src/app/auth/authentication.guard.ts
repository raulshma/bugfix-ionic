import { Injectable, OnDestroy } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Logger } from '@core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';

const log = new Logger('AuthenticationGuard');

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate, OnDestroy {
  auth$: Subscription;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnDestroy(): void {
    this.auth$ && this.auth$.unsubscribe();
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // return true;
    if (this.authService.isLoggedIn()) return true;
    log.debug('Not authenticated, redirecting and adding redirect url...');
    this.router.navigate(['/login'], {
      queryParams: { redirect: state.url },
      replaceUrl: true,
    });
    return false;
  }
}
