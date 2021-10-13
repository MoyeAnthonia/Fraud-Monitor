import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersModule } from 'app/shared/filters/filters.module';
import { AgentProfileComponent } from './agent-profile.component';
import { AgentProfileRoutingModule } from './agent-profile-routing.module';
import { ModalModule, MDBBootstrapModule } from 'ng-uikit-pro-standard';
import { ReactiveFormsModule } from '@angular/forms';
import { WavesModule, PreloadersModule } from 'ng-uikit-pro-standard'

@NgModule({
  imports: [
    CommonModule,
    FiltersModule,
    AgentProfileRoutingModule,
    ModalModule.forRoot(),
    ReactiveFormsModule, 
    MDBBootstrapModule,
    WavesModule,
    PreloadersModule
  ],
  declarations: [AgentProfileComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class AgentProfileModule { }