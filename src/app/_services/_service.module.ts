import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExcelService } from "./excel.service";


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
    ],
    exports: [
    ],
    providers: [
        ExcelService,
        // SocketService
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class ServiceModule { }