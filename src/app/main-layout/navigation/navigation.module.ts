import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from './navigation.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { DirectiveModule } from 'app/directive.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MDBBootstrapModulesPro.forRoot(),
    DirectiveModule
  ],
  declarations: [
    NavigationComponent,
    NavbarComponent,
    FooterComponent,
    // HasRoleDirective
  ],
  exports: [
    NavigationComponent,
    FooterComponent,
    NavbarComponent,
    // HasRoleDirective
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})
export class NavigationModule {

}
