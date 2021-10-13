import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WalletStatsRoutingModule } from './wallet-stats-routing.module'
import { WalletStatsComponent } from './wallet-stats.component';
import { FiltersModule } from 'app/shared/filters/filters.module';
import { ExcelExportModule } from 'app/shared/excel-export/excel-export.module';
import { TableModule } from 'app/shared/table/table.module';
import { PaginationModule } from 'app/shared/pagination/pagination.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WavesModule, PreloadersModule,DatepickerModule, MDBBootstrapModule } from 'ng-uikit-pro-standard'
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_auth/auth.guard';
// import { MatDatepickerModule, MatNativeDateModule, MatSliderModule } from '@angular/material';
import {MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatButtonModule, MatSliderModule, MatSelectModule} from "@angular/material";
import {MatIconModule} from '@angular/material/icon';
import { IconsModule } from 'ng-uikit-pro-standard'
import { DemoMaterialModule } from 'app/material-module';
// For MDB Angular Pro
// import { DatepickerModule, WavesModule } from 'ng-uikit-pro-standard'
import { FormsModule } from '@angular/forms';
import { SummaryCardModule } from 'app/shared/summary-card/summary-card.module';
// import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: WalletStatsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MDBBootstrapModule,
    // WalletStatsRoutingModule,
    FiltersModule,
    ExcelExportModule,
    TableModule,
    SummaryCardModule,
    PaginationModule,
    ReactiveFormsModule,
    WavesModule,
    PreloadersModule,
    // testing
    DemoMaterialModule,
    DatepickerModule,
    MatDatepickerModule,
    FormsModule,
    // NgxDaterangepickerMd.forRoot(),
        MatNativeDateModule,
         MatFormFieldModule, 
         MatInputModule,
        MatButtonModule, 
    MatNativeDateModule,
    MatSliderModule,
    MatIconModule,
    MatSelectModule,
    IconsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [WalletStatsComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]

})
export class WalletStatsModule { }