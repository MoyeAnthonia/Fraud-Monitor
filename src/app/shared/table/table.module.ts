
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule, MDBBootstrapModule } from 'ng-uikit-pro-standard';
import { TableComponent } from './table.component';
import { WavesModule, PreloadersModule } from 'ng-uikit-pro-standard'

@NgModule({
    imports: [RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule,
        WavesModule,
        PreloadersModule,
        IconsModule,

    ],
    exports: [TableComponent],
    declarations: [TableComponent],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class TableModule { }
