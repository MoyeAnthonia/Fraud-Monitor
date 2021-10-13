

import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { CheckboxModule, ButtonsModule } from 'ng-uikit-pro-standard'
import { WavesModule, PreloadersModule } from 'ng-uikit-pro-standard'
@NgModule({
  imports: [
    CommonModule,
    RegisterRoutingModule,
    CheckboxModule, 
    WavesModule, 
    ButtonsModule,
    PreloadersModule
  ],
  declarations: [RegisterComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterModule { }