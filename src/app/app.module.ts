import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatCardModule, MatMenuModule,
        MatToolbarModule, MatIconModule, MatFormFieldModule, MatInputModule,
        MatAutocompleteModule, MatSnackBarModule, MatProgressSpinnerModule, 
        MatTableModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
        MatTabsModule,
        DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppComponent } from './app.component';
import { AppDatabaseService } from './app-database.service';
import { MainPageComponent } from './main-page/main-page.component';
import { RegisterItemComponent } from './register-item/register-item.component';
import { RegisterItemMessageComponent } from './register-item/register-item-message/register-item-message.component';
import { ReportsComponent } from './reports/reports.component';
import { RegisteredItemsComponent } from './registered-items/registered-items.component';
import { FindRegisteredItemComponent } from './find-registered-item/find-registered-item.component';
import { CreateNewItemComponent } from './create-new-item/create-new-item.component';
import { CreateItemMessageComponent } from './create-new-item/create-new-item-message/create-new-item-message.component'
import { ReportByDayComponent } from './reports/report-by-day/report-by-day.component';
import { APP_DATE_FORMATS } from './app.constants';
import { AppDateAdapter } from './app.adapters';

import { ApoRoutingModule } from './app-routing.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireOfflineModule } from 'angularfire2-offline';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    RegisterItemComponent,
    RegisterItemMessageComponent,
    ReportsComponent,
    RegisteredItemsComponent,
    FindRegisteredItemComponent,
    CreateNewItemComponent,
    CreateItemMessageComponent,
    ReportByDayComponent
  ],
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    // Routing
    ApoRoutingModule,
    // Material
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    // Firebase
    AngularFireModule.initializeApp(environment.firebase, 'que-asistencia'),
    AngularFireDatabaseModule,
    AngularFireOfflineModule,
    // ChartJS
    ChartsModule
  ],
  entryComponents: [
    RegisterItemMessageComponent,
    CreateItemMessageComponent
  ],
  providers: [
    AppDatabaseService,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
