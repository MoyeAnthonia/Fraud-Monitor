import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {  }
  
  canActivate(route: ActivatedRouteSnapshot) {
    const expectedRole = route.data.expectedRole ;

    const role = localStorage.getItem('role');
    if ( expectedRole.includes(role) ) {
      return true;
    }
    this.auth.logout();    
    return false;
  }
   
  }
