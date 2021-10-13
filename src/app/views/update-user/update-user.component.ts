import { Component, OnInit, OnDestroy } from '@angular/core';
import { UpdateUser } from 'app/_models/update-user';
import { AuthService } from 'app/_auth/auth.service';
import { ToastService } from 'ng-uikit-pro-standard';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit, OnDestroy {
  loading = false;
  error: boolean
  errors: any
  update: UpdateUser
  subscription: any
  isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  isName = /^[A-Za-z]+((\s)?((\'|\-|\.)?([A-Za-z])+))*$/
  constructor(private authService: AuthService, private toast: ToastService) { }

  ngOnInit() {
    
    this.errors = {
      firstname: "",
      first_detail: "",
      lastname: "",
      last_detail: "",
    }
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
    }

    this.errors = {
      first_detail: (!this.isName.test(data.first_name) && data.first_name) ? "This is not a valid Name" : "",
      firstname: !data.first_name ? "First Name is required" : "",
      last_detail: (!this.isName.test(data.last_name) && data.last_name) ? "This is not a valid Name" : "",
      lastname: !data.last_name ? "Last Name is required" : "",
    }

    if ((!this.isName.test(data.first_name) && data.first_name)) this.error = true
    if (!data.first_name) this.error = true
    if ((!this.isName.test(data.last_name) && data.last_name)) this.error = true
    if (!data.last_name) this.error = true
  }

  updateUser(first_name, last_name) {

    this.loading = true

    this.errorHandler({first_name, last_name});

    if(!this.error){
      
    this.subscription = this.authService.updateUser({first_name, last_name}, localStorage.getItem('email')).subscribe(data => {
      if(data){
        this.toast.success('Successful')
      }
    })
    }

    this.loading = false


  }

}
