
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule, MDBBootstrapModule } from 'ng-uikit-pro-standard';
import { WavesModule, PreloadersModule } from 'ng-uikit-pro-standard'
import { SummaryCardComponent } from './summary-card.component';

@NgModule({
    imports: [RouterModule,
        CommonModule,
        FormsModule,
        MDBBootstrapModule,
        WavesModule,
        PreloadersModule,
        IconsModule,

    ],
    exports: [SummaryCardComponent],
    declarations: [SummaryCardComponent],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SummaryCardModule { }
