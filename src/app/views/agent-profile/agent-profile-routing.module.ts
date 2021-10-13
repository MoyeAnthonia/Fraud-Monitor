import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentProfileComponent } from './agent-profile.component';
import { AuthGuard } from 'app/_auth/auth.guard';



const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: AgentProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentProfileRoutingModule { }