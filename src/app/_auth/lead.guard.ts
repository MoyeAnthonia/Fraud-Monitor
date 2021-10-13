import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'app/_auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LeadGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() : boolean {
   
    if (!this.authService.getToken().is_lead) {
        this.router.navigate(['/login']);
        return false;
    }
    return true;
}

}