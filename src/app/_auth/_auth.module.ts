import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "./auth.service";
// import { AuthGuard } from "./auth-guard";
import { HttpInterceptorProvider } from "./error-interceptor";
import { AuthGuard } from "./auth.guard";
import { RoleGuard } from "./role-guard.service";


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
    ],
    exports: [
    ],
    providers: [
        HttpInterceptorProvider,
        AuthGuard,
        AuthService,
        RoleGuard
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule { }