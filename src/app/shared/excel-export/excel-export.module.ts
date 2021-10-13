
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'ng-uikit-pro-standard';
import { ExcelExportComponent } from './excel-export.component';
import { ExcelService } from 'app/_services/excel.service';

@NgModule({
    imports: [RouterModule,
        CommonModule, 
        FormsModule,
        ReactiveFormsModule, 
        MDBBootstrapModule, ],
    exports: [ExcelExportComponent],
    declarations: [ExcelExportComponent],
    providers: [ExcelService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ExcelExportModule { }
