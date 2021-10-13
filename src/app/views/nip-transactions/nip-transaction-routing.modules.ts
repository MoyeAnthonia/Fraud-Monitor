import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NipTransactionsComponent } from './nip-transactions.component';



const routes: Routes = [
  {
    path: '',
    component: NipTransactionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NipTransactionsRoutingModule { }