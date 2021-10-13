import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import pageservice from 'app/_services/page.service';
import eventsService from 'app/_services/events.service';
import { AuthService } from 'app/_auth/auth.service';
import { Location } from '@angular/common';
import { NavigationService } from 'app/_services/navigation-service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @ViewChild('sidenav') sidenav: ElementRef;

  clicked: boolean;
  isHome: boolean;
  nav: string = ''
  is_lead: boolean = false
  constructor(private router: Router, private authService: AuthService, 
    private _location:Location, private navigation: NavigationService) {
    this.clicked = this.clicked === undefined ? false : true;
  }

  ngOnInit() { 

    eventsService.getEvent('is_lead').subscribe( (is_lead) => {
      if(is_lead){
        this.is_lead = is_lead;
      }
    })

    eventsService.getEvent('changeName').subscribe( (data)=> {
      pageservice.setNav(data)

      if(data == '/dashboard' || data == '/' ){
        this.isHome = true;
      }
      this.nav = pageservice.getNav()
    })

    eventsService.getEvent('changeName').emit(window.location.pathname)

    this.router.events.subscribe((event: NavigationStart) => {
    
      if(event instanceof NavigationStart) {
        pageservice.setNav(event.url)

        if(event.url == '/dashboard' || event.url == '/'){
          this.isHome = true;
        }else{
          this.isHome = false;
        }

        this.nav = pageservice.getNav();
        
      }
    });

    if(this.authService.getToken()){
      this.is_lead = this.authService.getToken().is_lead
    }

  }

  setClicked(val: boolean): void {
    this.clicked = val;
  }
  goBack() {
   this.navigation.back()
  }
   logout(){
    this.authService.logout()
  }

}
