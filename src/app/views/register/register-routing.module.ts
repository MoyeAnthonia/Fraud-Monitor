import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';
import { AuthGuard } from 'app/_auth/auth.guard';
import { LeadGuard } from 'app/_auth/lead.guard';



const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, LeadGuard],
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }