import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { RegisterItemComponent } from './register-item/register-item.component';
import { ReportsComponent } from './reports/reports.component'

const routes: Routes = [
  { path: '',         redirectTo: '/main', pathMatch: 'full' },
  { path: 'main',     component: MainPageComponent },
  { path: 'register', component: RegisterItemComponent },
  { path: 'reports',  component: ReportsComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ApoRoutingModule { }