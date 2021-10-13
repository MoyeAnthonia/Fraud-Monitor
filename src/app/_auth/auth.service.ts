import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Router } from "@angular/router";
import { ToastService } from "ng-uikit-pro-standard";
import { map } from "rxjs/operators";
import { User } from "app/_models/user";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Register } from "app/_models/register";
import { Reset } from "app/_models/reset";
import { Observable } from "rxjs";
import { UpdateUser } from "app/_models/update-user";
import eventsService from "app/_services/events.service";



@Injectable({
    providedIn: 'root'
})


export class AuthService {
    baseUrl = environment.baseUrl;
    jwtHelper = new JwtHelperService();
    decodedToken: any;

    constructor(private http: HttpClient, private router: Router,
        private toastService: ToastService) {
    }

    login(user: User): Observable<any> {
        let options: any
        let headers = new HttpHeaders()

        headers = headers.set('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Origin', '*');
        return this.http.post(this.baseUrl + 'accounts/token/', user, options)
            .pipe(
                map((response: any) => {
                    const userData = response;
                    if (userData) {
                        localStorage.setItem('token', userData.access);
                        localStorage.setItem('refresh', userData.refresh);
                        localStorage.setItem('email', user.email);

                        let decodedToken = this.jwtHelper.decodeToken( userData.access)
                        eventsService.getEvent('is_lead').emit((decodedToken.is_lead || false))

                        let intendedURL = localStorage.getItem('intendedURL');
                        if(intendedURL && intendedURL !== '/login') {
                        localStorage.removeItem('intendedURL');
                        this.router.navigateByUrl(intendedURL);
                        return;
                        }
                        this.router.navigate(['/dashboard']);
                    }

                })

               
            );

    }

    isAuthenticated() {
        const token = localStorage.getItem('token');
        return !this.jwtHelper.isTokenExpired(token);
    }

    getToken(): any{
        const token = localStorage.getItem('token');
        // console.log(this.jwtHelper.decodeToken(token))
        return this.jwtHelper.decodeToken(token)
    }

    refreshtoken(): Observable<any>  {
        return this.http.post(this.baseUrl + `accounts/token/refresh/`, {refresh: localStorage.getItem('refresh')}).pipe(map((response: any) => {
            localStorage.setItem('token', response.access);
            localStorage.setItem('refresh', response.refresh);
        }));
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/login']),
        this.toastService.success('Logged Out')
    }

    roleMatch(expectedRole): boolean {
        let isMatch = false;
        const roles = localStorage.getItem('role');
        const userRoles = roles;
        expectedRole.forEach(element => {
          if (userRoles.includes(element)) {              
            isMatch = true;
            return;
          }
        });
        return isMatch;
      }

    register(newUser: Register) {
        return this.http.post(this.baseUrl + 'accounts/register/', newUser);
    }

    activate(id,token): Observable<any>  {
        return this.http.get(this.baseUrl + `accounts/activate/${id}/${token}/`).pipe(map(response => {
            return  response;
    }));
}

    forgotPassword(email): Observable<any>  {
        return this.http.post(this.baseUrl + `accounts/password/reset/`, email).pipe(map(response => {
            return  response;
        }));
    }

    resetPassword(reset: Reset, id) {
        return this.http.post(this.baseUrl + `accounts/password/reset/confirm/${id}/`, reset);
    }

    updateUser(user: UpdateUser, email): Observable<any>  {
        return this.http.patch(this.baseUrl + `accounts/update/${email}/`, user).pipe(map(response => {
            return  response;
        }));
    }


} 