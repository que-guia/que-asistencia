import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { RegisterItemComponent } from './register-item/register-item.component';
import { ReportsComponent } from './reports/reports.component';
import { RegisteredItemsComponent } from './registered-items/registered-items.component';
import { FindRegisteredItemComponent } from './find-registered-item/find-registered-item.component';
import { CreateNewItemComponent } from './create-new-item/create-new-item.component';

const routes: Routes = [
  { path: '',           redirectTo: '/main', pathMatch: 'full' },
  { path: 'main',       component: MainPageComponent },
  { path: 'register',   component: RegisterItemComponent },
  { path: 'reports',    component: ReportsComponent },
  { path: 'registered', component: RegisteredItemsComponent},
  { path: 'find',       component: FindRegisteredItemComponent },
  { path: 'create',     component: CreateNewItemComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ApoRoutingModule { }
