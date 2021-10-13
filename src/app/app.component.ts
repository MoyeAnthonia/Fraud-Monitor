import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {MDBSpinningPreloader} from 'ng-uikit-pro-standard';
import { AuthService } from './_auth/auth.service';


@Component({
  selector: 'mdb-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']

})

export class AppComponent implements OnInit {

  private specialPages: any[] = [
    '/login', '/forgot', '/reset', '/activate'
  ];

  
  private currentUrl = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location,
    private mdbSpinningPreloader: MDBSpinningPreloader
  ) {

    this.router.events.subscribe((route:any) => {
      // this.currentUrl = route.url;
      // console.log("Special?: "+localStorage.Special)
      // // if(this.currentUrl==undefined){this.currentUrl='/'}
      // if((localStorage.Special!=undefined)&&(localStorage.Special=='false')){
      //   this.specialPage = false;  
      // }else {this.specialPage = true;}
      // // this.specialPage = this.specialPages.indexOf(this.currentUrl) !== -1;
    });

  }

  ngOnInit(): void {
    // this.mdbSpinningPreloader.stop();
    
  }
  
  goBack(): void {
    this.location.back();
  }

  isSpecialPage(): boolean {
    const currentUrl = `${this.router.url || '/'}`.split('?')[0];
    return this.specialPages.includes(currentUrl);
  }

}
