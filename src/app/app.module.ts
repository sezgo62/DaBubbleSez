import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './access/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.development';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { RegisterComponent } from './register/register.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { MainscreenComponent } from './mainscreen/mainscreen.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { CreateChannelDialogComponent } from './create-channel-dialog/create-channel-dialog.component';
import { ChannelComponent } from './channel/channel.component';
import { ParticipantsDialogComponent } from './dialogs/participants-dialog/participants-dialog.component';
import {MatMenuModule} from '@angular/material/menu';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { participantsReducer } from 'src/ngRx/participants.reducer';
import { ParticipantsEffects } from 'src/ngRx/participants.effects';
import { PostsComponent } from './posts/posts.component';
import { PickerModule } from "@ctrl/ngx-emoji-mart";
//import { localStorageSync } from 'ngrx-store-localstorage'; // Import hinzugefügt
import { ResponsiveMainscreenComponent } from './responsive-mainscreen/responsive-mainscreen.component';
import { OpenProfileDialogComponent } from './open-profile-dialog/open-profile-dialog.component';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import { OpenedThreadComponent } from './opened-thread/opened-thread.component';
import { DatePipe } from '@angular/common';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UploadImageComponent,
    MainscreenComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    CreateChannelDialogComponent,
    ChannelComponent,
    ParticipantsDialogComponent,
    PostsComponent,
    ResponsiveMainscreenComponent,
    OpenProfileDialogComponent,
    PrivateChatComponent,
    OpenedThreadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSidenavModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    PickerModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [DatePipe  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
