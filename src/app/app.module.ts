import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { BodyComponent } from './shared/body/body.component';
import { HeaderComponent } from './shared/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { DefaultPageComponent } from './components/default-page/default-page.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from "@angular/cdk/overlay";
import { CdkMenuModule } from "@angular/cdk/menu";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { MenuaccessComponent } from './components/menuaccess/menuaccess.component';
import { AccountEntryComponent } from './components/account-entry/account-entry.component';
import { AccessControlComponent } from './components/access-control/access-control.component';
import { DataMigrationComponent } from './components/data-migration/data-migration.component';
import { AuthLogComponent } from './components/auth-log/auth-log.component';
import { MasterReportComponent } from './components/master-report/master-report.component';
import { PartyLedgerComponent } from './components/party-ledger/party-ledger.component';


@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    HeaderComponent,
    DefaultPageComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    MenuaccessComponent,
    AccountEntryComponent,
    AccessControlComponent,
    DataMigrationComponent,
    AuthLogComponent,
    MasterReportComponent,
    PartyLedgerComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    OverlayModule,
    CdkMenuModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
