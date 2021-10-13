import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule, ModalModule, MDBBootstrapModulePro } from 'ng-uikit-pro-standard';


import { CalendarModule } from 'angular-calendar';

import { FooterComponent } from '../main-layout/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DirectiveModule } from '../directive.module';
import { PaginationModule } from '../shared/pagination/pagination.module';
import { FiltersModule } from '../shared/filters/filters.module';
import { ExcelExportModule } from '../shared/excel-export/excel-export.module';
import { MDBBootstrapModule } from 'lib/ng-uikit-pro-standard/free';
import { AppRoutes } from '../app.routes.service';
import { TradePartnerComponent } from './trade-partner/trade-partner.component';
import { NipTransactionsComponent } from './nip-transactions/nip-transactions.component';

// <form [formGroup]="searchForm">

// <div class="col-2">
//         <select  class="browser-default d-block" formControlName="selectOptions">
//           <option *ngFor="let options of optionsSelect"  [value]="options.value" selected>{{options.label}}</option>
//         </select>
// <!-- <input id="select-value" value=""   > -->

// </div>
// <div class="col-2">
// <input id="select-value"  formControlName="selectedOption"   >
// </div>
// <div class="col-2"> 
// <small>Start Date</small>  
// <input id="select-value"  formControlName="startDate" type="date"  >

// </div>
// <div class="col-2">
//     <small>End Date</small>
//     <input id="select-value"  formControlName="endDate" type="date"   >

//          </div>
//          <div class="col-2">
// <button class="btn-standard" (click)="filters()">Filter</button>
           
//          </div>
//          <div class="col-2">

//             <app-excel-export *ngIf="raw_data" [datas]="raw_data" [filename]="status"></app-excel-export>

//          </div>

// </form>

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    ModalModule.forRoot(),
    DirectiveModule,
    MDBBootstrapModulePro.forRoot(),
    MDBBootstrapModule.forRoot(),
    PaginationModule,
    FiltersModule,
    ExcelExportModule,
    ToastModule.forRoot()
    
  ],
  declarations: [
    LoginComponent,
    DashboardComponent,
    // PaginationComponent,
    ],
  exports: [
    MDBBootstrapModulePro
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewsModule {

}
