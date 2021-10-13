import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MDBBootstrapModulesPro } from "ng-uikit-pro-standard";
import { HasRoleDirective } from "./shared/directives/has-role.directive";


@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MDBBootstrapModulesPro.forRoot(),
    //   HasRoleDirective
    ],
    declarations: [
        HasRoleDirective
    ],
    exports: [
        HasRoleDirective
    ],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
  })
  export class DirectiveModule { }