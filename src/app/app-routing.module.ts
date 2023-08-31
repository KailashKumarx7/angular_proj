import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultPageComponent } from './components/default-page/default-page.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MenuaccessComponent } from './components/menuaccess/menuaccess.component';

const routes: Routes = [
  {path:'',redirectTo:'default',pathMatch:'full'},
  {
    path:'default',component:DefaultPageComponent
  },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'signup',component:SignupComponent
  },
  {
    path:'dashboard',component:DashboardComponent
  },
  {
    path:'menuacc',component:MenuaccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
