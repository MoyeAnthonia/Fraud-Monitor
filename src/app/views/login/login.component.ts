import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/_auth/auth.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { User } from "app/_models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy  {
  loading = false;
  error: boolean
  errors: any
  user: User
  isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  // idFormat = '^\\w{15}$'
  subscription: any
  constructor(private router:Router, private authService: AuthService, private toast: ToastService) { 

  }


  ngOnInit() {
    localStorage.removeItem('itt')

    this.errors = {
      email_detail: "",
      // password_length: "",
      password: "",
      email: ""
    }
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }


  errorHandler(email, password) {
    this.errors = {
      email_detail: "",
      password: "",
      email: ""
    }
    this.error = false;

    this.errors = {
      email_detail: (!this.isEmail.test(email) && email) ? "This is not a valid email" : "",
      password_length: (password && password.length < 8) ? "Minimum password length is 8 " : "",
      password: !password ? "Password is Required" : "",
      email: !email ? "Email is required" : ""
    }

    if((!this.isEmail.test(email) && email)) this.error = true
    if(!password) this.error = true
    if(!email) this.error = true
    if(password && password.length < 8) this.error = true

  }
  
  signIn(email,password){
   

    this.loading = true;
    
    this.errorHandler(email, password)

    if(!this.error){

      this.subscription = this.authService.login({email, password} as User)
      .subscribe()
     
    }

    this.loading = false;
  }

}

