import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/_auth/auth.service';
import { Reset } from 'app/_models/reset';
import { ToastService } from 'ng-uikit-pro-standard';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy{
  loading = false;
  error: boolean
  errors: any
  reset: Reset
  token: string
  subscription: any
  // idFormat = '^\\w{15}$'
  constructor(private authService: AuthService, private route: ActivatedRoute, private toast: ToastService) { 
  }


  ngOnInit() {
    localStorage.removeItem('itt')

    this.errors = {
      password: "",
      co_password: "",
      length: ""
    }
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }


  errorHandler(password, co_password) {
   
    this.error = false;
    this.errors = {
      password: !password ? "Password is Required" : "",
      co_password: ((password !== co_password) && password) ? "Passwords do not match" : "",
      length: password && password.length < 8 ? "Minimum password length is 8" : "",
    }

    if(!password) this.error = true
    if( ((password !== co_password) && password)) this.error = true
    if(password && password.length < 8) this.error = true

  }
  
  resetPassword(password, password2){
    let token = this.route.snapshot.queryParamMap.get('token');
    let id = this.route.snapshot.queryParamMap.get('id');
    

    this.loading = true;
    
    this.errorHandler(password, password2)
    
    if(!this.error){
      this.subscription = this.authService.resetPassword({token, password, password2} as Reset, id).subscribe(data => {
        if(data){
          this.toast.success('Successful')
        }
      })
    }
      this.loading = false;
  }

}
