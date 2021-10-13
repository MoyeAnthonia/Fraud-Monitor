import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateUserComponent } from './update-user.component';
import { UpdateUserRoutingModule } from './update-user-routing.module';
import { WavesModule, PreloadersModule } from 'ng-uikit-pro-standard'

@NgModule({
  imports: [
    CommonModule,
    UpdateUserRoutingModule,
    WavesModule,
    PreloadersModule,
  ],
  declarations: [UpdateUserComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]

})
export class UpdateUserModule { }