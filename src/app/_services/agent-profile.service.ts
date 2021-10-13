import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Router } from "@angular/router";
import { ToastService } from "ng-uikit-pro-standard";
import { map } from "rxjs/operators";
import { User } from "app/_models/user";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Register } from "app/_models/register";
import { Reset } from "app/_models/reset";
import { Observable } from "rxjs";
import { UpdateUser } from "app/_models/update-user";


@Injectable({
    providedIn: 'root'
})


export class AgentService {
    baseUrl = environment.baseUrl;
    jwtHelper = new JwtHelperService();
    decodedToken: any;

    constructor(private http: HttpClient, private router: Router,
        private toastService: ToastService) {
    }


    getAgent(wallet): Observable<any>  {
        return this.http.get(this.baseUrl + `agents/${wallet}/`).pipe(map(response => {
            return  response;
        }));
    }

    getChart(wallet,year): Observable<any>  {
        return this.http.get(this.baseUrl + `agents/activity/?wallet=${wallet}&txn_year=${year}`).pipe(map(response => {
            return  response;
        }));
    }
} 