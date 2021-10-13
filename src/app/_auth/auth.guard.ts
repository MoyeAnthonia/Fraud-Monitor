import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'app/_auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }


  canActivate() : boolean {
   
      if (!this.authService.isAuthenticated()) {
        console.log(!this.authService.isAuthenticated())
        if(location.pathname != '/login'){
          localStorage.setItem('intendedURL',location.pathname);
        }
          this.router.navigate(['/login']);
          return false;
      }
      return true;
  }

}