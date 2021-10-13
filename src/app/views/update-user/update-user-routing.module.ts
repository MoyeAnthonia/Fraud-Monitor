import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateUserComponent } from './update-user.component';
import { AuthGuard } from 'app/_auth/auth.guard';



const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: UpdateUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateUserRoutingModule { }