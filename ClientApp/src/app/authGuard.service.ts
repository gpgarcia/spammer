import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = sessionStorage.getItem('currentUser');
    console.log('canActivate user: ' + user);
      if (!!user) {
          // logged in so return true
          return true;
      }

  //    // not logged in so redirect to login page with the return url
      this.router.navigate([''], { queryParams: { returnUrl: state.url }});
      return false;
  }
}
