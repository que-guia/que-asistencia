import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatCardModule, MatMenuModule,
  MatToolbarModule, MatIconModule, MatFormFieldModule, MatInputModule,
  MatAutocompleteModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppDatabaseService } from './app-database.service';
import { MainPageComponent } from './main-page/main-page.component';
import { RegisterItemComponent } from './register-item/register-item.component';
import { ReportsComponent } from './reports/reports.component';

import { ApoRoutingModule } from './app-routing.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    RegisterItemComponent,
    ReportsComponent
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
    // Firebase
    AngularFireModule.initializeApp(environment.firebase, 'que-asistencia'),
    AngularFireDatabaseModule
  ],
  providers: [
    AppDatabaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
