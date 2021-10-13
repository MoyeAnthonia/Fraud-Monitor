import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ToastService } from 'ng-uikit-pro-standard';
import eventsService from '../_services/events.service';

@Injectable()
export class httpInterceptor implements HttpInterceptor {

    constructor( public auth: AuthService, private toast: ToastService ) {  }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let token = localStorage.getItem('token');
        let refresh = localStorage.getItem('refresh')
            if (!request.headers.has('Content-Type')) {
                request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
            }
    
            if (token) {
                request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) });
            }
    
            request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
    
            request = request.clone({ headers: request.headers.set('rejectUnauthorized', 'false') });
            
            
            return next.handle(request).pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                    }
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {
                    console.log(error);
                    let data: any = {};
                    data = {
                        reason: error && error.error && error.error.reason ? error.error.reason : '',
                        status: error.statusText || error.status
                    };

                   
                    if (error instanceof HttpErrorResponse && error.status === 401) {
                        if(this.auth.isAuthenticated()){
                            this.toast.error(`${data.status}`)
                        }
                        return this.handle401Error(request, next);
                      } 
                      else {
                        this.toast.error(`${data.status}`)
                        console.log(request.url)
                        eventsService.getEvent('error').emit(request.url)
                        return throwError(error);
                        // return
                      }
                    
                }));
     
    }

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshTokenSubject.next(null);
      
          return this.auth.refreshtoken().pipe(
            switchMap((token: any) => {
            
              this.isRefreshing = false;
              this.refreshTokenSubject.next(localStorage.getItem('token'));
              return next.handle(request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`) }));
            }));
      
        } else {
          return this.refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(access => {
              return next.handle(request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${access}`) }));
            }));
        }
      }
}

export const HttpInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: httpInterceptor,
    multi: true
}
