import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'app/_auth/auth.service';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  optionsSelect: Array<any>;
  error: boolean
  errors: any
  default = ""
  loading: boolean
  subscription: any
  dept2: any

  isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  isName = /^[A-Za-z]+((\s)?((\'|\-|\.)?([A-Za-z])+))*$/

  constructor(private authService: AuthService, private toast: ToastService) { }

  ngOnInit() {
    this.dept2 = this.authService.getToken().dept 

    this.optionsSelect = [
      { value: 'risk_man', label: 'Risk Management' },
      { value: 'cust_exp', label: 'Customer Experience' },
      { value: 'tech', label: 'Technology' },
    ];
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }

  errorHandler(data) {
    this.error = false;

    this.errors = {
      firstname: "",
      first_detail: "",
      lastname: "",
      last_detail: "",
      email: "",
      email_detail: "",
      password: "",
      password2: "",
      length: "",
      dept: "",
      isItex: "",
    }
    // console.log(data.email.substring(data.email.indexOf("@") + 1))
    this.errors = {
      isItex: (data.email.substring(data.email.indexOf("@") + 1) != 'iisysgroup.com') && data.email ? "Please Use Itex Official Email" : "",
      email_detail: (!this.isEmail.test(data.email) && data.email) ? "This is not a valid email" : "",
      email: !data.email ? "Email is required" : "",
      first_detail: (!this.isName.test(data.first_name) && data.first_name) ? "This is not a valid Name" : "",
      firstname: !data.first_name ? "First Name is required" : "",
      last_detail: (!this.isName.test(data.last_name) && data.last_name) ? "This is not a valid Name" : "",
      lastname: !data.first_name ? "Last Name is required" : "",
      dept: !data.dept ? "Department is required" : "",
      password: !data.password ? "Password is required" : "",
      length: (data.password && data.password.length < 8) ? "Minimum password length is 8" : "",
      co_password: ((data.Password !== data.password2) && data.Password) ? "Passwords do not match" : "",
    }

    if((data.email.substring(data.email.indexOf("@") + 1) != 'iisysgroup.com') && data.email) this.error = true
    if ((!this.isEmail.test(data.email) && data.email)) this.error = true
    if (!data.email) this.error = true
    if ((!this.isName.test(data.first_name) && data.first_name)) this.error = true
    if (!data.first_name) this.error = true
    if ((!this.isName.test(data.last_name) && data.last_name)) this.error = true
    if (!data.last_name) this.error = true
    if (!data.dept) this.error = true

  }

  register(first_name, last_name, dept, email, password, password2, is_lead) {

    this.loading = true;


    this.errorHandler({ email, first_name, last_name, dept, password, password2, is_lead });

    if(!this.error){
      
    this.subscription = this.authService.register({ email, first_name, last_name, dept, password, password2, is_lead }).subscribe(data => {
      if(data){
        this.toast.success('Successful')
      }
    })
    }

    this.loading = false;


  }

}
