
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersModule } from 'app/shared/filters/filters.module';
import { ExcelExportModule } from 'app/shared/excel-export/excel-export.module';
import { TableModule } from 'app/shared/table/table.module';
import { PaginationModule } from 'app/shared/pagination/pagination.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WavesModule, PreloadersModule,DatepickerModule, MDBBootstrapModule } from 'ng-uikit-pro-standard'
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_auth/auth.guard';
// import { MatDatepickerModule, MatNativeDateModule, MatSliderModule } from '@angular/material';
import {MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatButtonModule, MatSliderModule} from "@angular/material";
import {MatIconModule} from '@angular/material/icon';
import { IconsModule } from 'ng-uikit-pro-standard'
import { DemoMaterialModule } from 'app/material-module';
import { NipTransactionsComponent } from './nip-transactions.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: NipTransactionsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FiltersModule,
    MDBBootstrapModule,
    ExcelExportModule,
    TableModule,
    PaginationModule,
    ReactiveFormsModule,
    WavesModule,
    PreloadersModule,
    // testing
    DemoMaterialModule,
    DatepickerModule,
    MatDatepickerModule,
        MatNativeDateModule,
         MatFormFieldModule, 
         MatInputModule,
        MatButtonModule, 
    MatNativeDateModule,
    MatSliderModule,
    MatIconModule,
    IconsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [NipTransactionsComponent,
    ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class NipTransactionsModule { }