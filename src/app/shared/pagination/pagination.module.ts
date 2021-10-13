
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'ng-uikit-pro-standard';
import { PaginationComponent } from './pagination.component';

@NgModule({
    imports: [RouterModule,
        CommonModule, 
        FormsModule,
        ReactiveFormsModule, 
        MDBBootstrapModule, ],
    exports: [PaginationComponent],
    declarations: [PaginationComponent],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class PaginationModule { }
