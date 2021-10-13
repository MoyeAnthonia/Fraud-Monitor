import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WalletStatsComponent } from './wallet-stats.component';
import { AuthGuard } from 'app/_auth/auth.guard';



const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: WalletStatsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletStatsRoutingModule { }