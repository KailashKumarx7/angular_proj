import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultPageComponent } from './components/default-page/default-page.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MenuaccessComponent } from './components/menuaccess/menuaccess.component';
import { AccountEntryComponent } from './components/account-entry/account-entry.component';
import { AccessControlComponent } from './components/access-control/access-control.component';
import { DataMigrationComponent } from './components/data-migration/data-migration.component';
import { AuthLogComponent } from './components/auth-log/auth-log.component';
import { authGuard } from './guard/auth.guard';
import { MasterReportComponent } from './components/master-report/master-report.component';
import { PartyLedgerComponent } from './components/party-ledger/party-ledger.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'default',
    pathMatch: 'full',
  },
  {
    path: 'default',
    component: DefaultPageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate:[authGuard]
  },
  {
    path: 'menuacc',
    component: MenuaccessComponent,
  },
  {
    path: 'acc-entry',
    component: AccountEntryComponent,
  },
  {
    path:'master-repo',
    component:MasterReportComponent
  },
  {
    path:'party-led',
    component:PartyLedgerComponent
  },
  {
    path: 'access-ctrl',
    component: AccessControlComponent,
  },
  {
    path: 'dt-mig',
    component: DataMigrationComponent,
  },
  {
    path: 'auth',
    component: AuthLogComponent
  },
  {
    path: 'utility/',
    children: [
      {
        path: 'dt-mig',
        component: DataMigrationComponent,
      },
    ],
  },
  // Add a wildcard route to redirect any unmatched routes to 'default'
  {
    path: '**',
    redirectTo: 'default',
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
