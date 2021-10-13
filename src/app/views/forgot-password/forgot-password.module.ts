import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { WavesModule, PreloadersModule } from 'ng-uikit-pro-standard'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    FormsModule,      
    ForgotPasswordRoutingModule,
    WavesModule,
    PreloadersModule
  ],
  declarations: [ForgotPasswordComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class ForgotPasswordModule { }