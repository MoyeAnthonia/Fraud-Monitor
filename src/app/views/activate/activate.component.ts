import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'app/_auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit, OnDestroy {

  activated_message: string = ''
  subscription: any
  constructor(private authservice: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.activate()
  }

  ngOnDestroy(){

     if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
  

  activate(){
    if(this.route.snapshot.queryParamMap.get('id') && this.route.snapshot.queryParamMap.get('token')){
     this.subscription = this.authservice.activate(this.route.snapshot.queryParamMap.get('id'),this.route.snapshot.queryParamMap.get('token')).subscribe(data =>
        {
         if(data){
           this.activated_message = data.message
         }
        })
    }
    }
    
}
