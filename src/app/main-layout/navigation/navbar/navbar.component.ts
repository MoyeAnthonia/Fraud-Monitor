
import { Component, Input,  ElementRef, OnInit } from '@angular/core';
import { NavDrops, NavItems } from './data';
import { NavbarService } from './navbar.service';
import { AuthService } from 'app/_auth/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NavbarService]
})
export class NavbarComponent implements OnInit  {

  navItems: NavItems[];
  navDrops: NavDrops[];
  _breadCrumbs: any;
  _subscription: any;
  userName: any;
  @Input() sidenav: ElementRef;

  constructor(  private authService: AuthService, ) {
  }

  ngOnInit(){
    this.userName = localStorage.getItem('username');
  }
  isAuthenticated() {
    return this.authService.isAuthenticated()
  }
  Logout(){
    this.authService.logout();
  }


}
