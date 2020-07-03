import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


//Angular material components
// import {
//   MatCardModule, MatTabsModule, MatIconModule, MatInputModule,
//   MatFormFieldModule, MatButtonModule, MatProgressBarModule, MatDividerModule, MatDialogModule, MatListModule, MatSnackBarModule
// } from '@angular/material';

import {MatCardModule} from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SessionExpiredDialogComponent } from './session-expired-dialog/session-expired-dialog.component';
import { AddNewChatDialogComponent } from './add-new-chat-dialog/add-new-chat-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    DashboardComponent,
    PageNotFoundComponent,
    SessionExpiredDialogComponent,
    AddNewChatDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    MatDialogModule,
    MatListModule,
    MatSnackBarModule
  ],
  providers: [],
  entryComponents: [AddNewChatDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }