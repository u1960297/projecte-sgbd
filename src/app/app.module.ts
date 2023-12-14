import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import {MatDialogModule} from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { LoginPageComponent } from './login/login.component';
import { RegisterPageComponent } from './register/register.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics} from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormRecipeComponent } from './form-recipe/form-recipe.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    RecipeComponent,
    LoginPageComponent,
    RegisterPageComponent,
    FormRecipeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,

    MenubarModule,
    ToastModule,
    TableModule,
    CardModule,
    ButtonModule,
    PanelModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    RadioButtonModule,
    MultiSelectModule,
    provideFirebaseApp(() => initializeApp({"projectId":"projecte-sgbd-4rgeinf","appId":"1:1005676375167:web:fcbb0ca5dabb6fe6d9634a","storageBucket":"projecte-sgbd-4rgeinf.appspot.com","apiKey":"AIzaSyCcm3xfUl0TB8DVu4usdETrbjXcnvHQThI","authDomain":"projecte-sgbd-4rgeinf.firebaseapp.com","messagingSenderId":"1005676375167","measurementId":"G-2GCLEQYJP8"})),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    // provideAppCheck(() => {
    //   // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
    //   const provider = new ReCaptchaEnterpriseProvider(/* reCAPTCHA Enterprise site key */);
    //   return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
    // }),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    provideRemoteConfig(() => getRemoteConfig())
  ],
  providers: [
    AngularFireStorage,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
