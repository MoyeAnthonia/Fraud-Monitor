import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Router } from "@angular/router";
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


export class WalletStatsService {
    baseUrl = environment.baseUrl;
    jwtHelper = new JwtHelperService();
    decodedToken: any;

    constructor(private http: HttpClient, private router: Router,) {
    }
  
    getStatus(status,limit,skip,order,search,searchname,startDate30,endDate30, startDate40,endDate40): Observable<any>  {
        let apiUrl = `agents/?status=${status}&limit=${limit}&offset=${skip}&ordering=${order}`
           

        if(search && searchname){
            apiUrl += `&${search}=${searchname}`
        }
        else if(startDate40 && endDate40 ) {
            apiUrl += `&last_txn_date_40__gte=${startDate40}&last_txn_date_40__lte=${endDate40}`
        }
       else if(  startDate30 &&  endDate30){
            apiUrl += `&last_txn_date_30__gte=${startDate30}&last_txn_date_30__lte=${endDate30}`
        }
    
   
        else {
            // console.log('hj')
        }
          console.log(apiUrl)  
     
        return this.http.get(this.baseUrl + apiUrl).pipe(map(response => {
            return  response;
        }));
    }
    getStatusSummary(status): Observable<any>  {
        let apiUrl = `agents/category/sum/?status=${status}`     
        return this.http.get(this.baseUrl + apiUrl).pipe(map(response => {
            return  response;
        }));
    }

    getPartner(irn): Observable<any>  {
        let apiUrl1 = `tps/${irn}/`     
        return this.http.get(this.baseUrl + apiUrl1).pipe(map(response => {
            return  response;
        }));
    }
    getPartnerAgent(irn,status,limit,skip,order,search,searchname,startDate30,endDate30, startDate40,endDate40): Observable<any>  {
        let apiUrl = `agents/?tp__irn=${irn}&status=${status}&limit=${limit}&offset=${skip}&ordering=${order}`
          if(search && searchname){
            apiUrl += `&${search}=${searchname}`
        }
        else if(startDate40 && endDate40 ) {
            apiUrl += `&last_txn_date_40__gte=${startDate40}&last_txn_date_40__lte=${endDate40}`
        }
       else if(  startDate30 &&  endDate30){
            apiUrl += `&last_txn_date_30__gte=${startDate30}&last_txn_date_30__lte=${endDate30}`
        }
    
   
        else {
            // console.log('hj')
        }
     
        return this.http.get(this.baseUrl + apiUrl).pipe(map(response => {
            return  response;
        }));
    }

    getNipTransaction(limit,skip,wallet,order,startDate,endDate): Observable<any>  {
        let apiUrl = `agents/activity/day/?&limit=${limit}&offset=${skip}&wallet=${wallet}&ordering=${order}`     
          
      if(startDate && endDate ) {
            apiUrl += `&date__gte=${startDate}&date__lte=${endDate}`
        }
    
       
        return this.http.get(this.baseUrl + apiUrl).pipe(map(response => {
            return  response;
        }));
    }

} 