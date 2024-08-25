import {Injectable} from '@angular/core';
import {type ActivatedRouteSnapshot, type CanActivate, Router, type RouterStateSnapshot,} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  jwt = new JwtHelperService();

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let token: any = localStorage.getItem('token');
    if (!this.jwt.isTokenExpired(token)) {
      if (this.jwt.decodeToken(token).role === route.data['roles'][0]) {
        return true
      } else return this.router.parseUrl(this.jwt.decodeToken(token).role.toLowerCase());
    } else {
      localStorage.removeItem('token');
      return this.router.parseUrl('login');
    }
  }
}
