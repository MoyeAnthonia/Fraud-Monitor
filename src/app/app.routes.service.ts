import { RouterModule, Route, PreloadAllModules } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';


// dashboard

// user management
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AuthGuard } from './_auth/auth.guard';



const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }
    ]
  },
  {
    path: 'status',
    loadChildren: './views/wallet-stats/wallet-stats.module#WalletStatsModule'
  },
  {
    path: 'nip-transaction',
    loadChildren: './views/nip-transactions/nip-transactions.module#NipTransactionsModule'
  },
  {
    path: 'trade-partner',
    loadChildren: './views/trade-partner/trade-partner.module#TradePartnerModule'
  },
  {
    path: 'agent-profile',
    loadChildren: './views/agent-profile/agent-profile.module#AgentProfileModule'
  },
  {
    path: 'update',
    loadChildren: './views/update-user/update-user.module#UpdateUserModule'
  },
  {
    path: 'register',
    loadChildren: './views/register/register.module#RegisterModule'
  },
  {
    path: 'activate',
    loadChildren: './views/activate/activate.module#ActivateModule'
  },
  {
    path: 'forgot',
    loadChildren: './views/forgot-password/forgot-password.module#ForgotPasswordModule'
  },
  {
    path: 'reset',
    loadChildren: './views/reset-password/reset-password.module#ResetPasswordModule'
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];



export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules });
