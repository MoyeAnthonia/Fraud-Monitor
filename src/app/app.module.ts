import { ToastModule, MDBBootstrapModulePro, MDBBootstrapModule } from 'ng-uikit-pro-standard';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {HttpModule} from '@angular/http';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes.service';
import { ViewsModule } from './views/views.module';
import { MDBSpinningPreloader } from 'ng-uikit-pro-standard';


// main layout
import { NavigationModule } from './main-layout/navigation/navigation.module';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { DirectiveModule } from './directive.module';
import { AuthModule } from './_auth/_auth.module';
import { ServiceModule } from './_services/_service.module';
import { JwtModule } from '@auth0/angular-jwt';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatSliderModule } from '@angular/material';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, HttpModule,
    NavigationModule,
    AppRoutes,
    RouterModule,
    FormsModule,
    DirectiveModule,
    ViewsModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastModule.forRoot(),
    MDBBootstrapModulePro.forRoot(),
    MDBBootstrapModule.forRoot(),
    DirectiveModule,
    AuthModule,
    ServiceModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // blacklistedRoutes: ['http://23.239.0.110:7070/api/auth',
          // 'http://197.253.19.76:6200/api/v1/users/create'
        // ]
      }
    }),

    ReactiveFormsModule,
  ],
  providers: [MDBSpinningPreloader],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
