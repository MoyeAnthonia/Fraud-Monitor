import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'app/_auth/auth.service';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  email: string;
  loading = false;
  error: boolean
  errors: any
  isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  subscription: any

  constructor(private authservice: AuthService, private toast: ToastService) { }

  ngOnInit() {
    this.errors = {
      email_detail: "",
      email: ""
    }
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  errorHandler() {
    this.error = false;
    this.errors = {
      email_detail: "",
      email: ""
    }

    this.errors = {
      email_detail: (!this.isEmail.test(this.email) && this.email) ? "This is not a valid email" : "",
      email: !this.email ? "Email is required" : ""
    }

    if ((!this.isEmail.test(this.email) && this.email)) this.error = true
    if (!this.email) this.error = true

  }

  send(){
    this.loading = true;
    this.errorHandler();

    if(!this.error){
     this.subscription = this.authservice.forgotPassword(this.email).subscribe(data => {
      if(data){
        this.toast.success('Successful')
      }
    })
    }

    this.loading = false;
  }


}
