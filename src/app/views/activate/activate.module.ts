

import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivateComponent } from './activate.component';
import { ActivateRoutingModule } from './activate-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ActivateRoutingModule
  ],
  declarations: [ActivateComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class ActivateModule { }