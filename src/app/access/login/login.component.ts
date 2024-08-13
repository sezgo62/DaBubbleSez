import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { userFirebaseService } from 'src/app/userFirebase.service';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { Auth, getAdditionalUserInfo, signInWithPopup } from '@angular/fire/auth';

import { GoogleAuthProvider } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CurrentUserService } from 'src/app/current-user.service';
import { UserDataService } from 'src/app/user-data.service';
import { User } from 'src/models/user.class';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //public userFirebaseService: userFirebaseService
  constructor(public userFirebaseService: userFirebaseService, private fb: FormBuilder, private router: Router, public currentUserService: CurrentUserService, public dataUserService: UserDataService) {
    this.auth = getAuth(this.userFirebaseService.firebaseApp);
  }

  userDetailsForm!: FormGroup;
  email: string = '';
  accountDetailsForm: any;

  private provider = new GoogleAuthProvider(); // Declare GoogleAuthProvider as a class attribute



  /**
   *  Das sind alle Fehlermeldungen die angezeigt werden wenn ein inputfeld nicht ausgefüllt wurde.
   */
  validation_messages = {
    'email': [
      { type: 'required', message: 'Full email is required' }
    ],
    'password': [
      { type: 'required', message: 'Full password is required' },
    ],
    'gender': [
      { type: 'required', message: 'Please select your gender' },
    ],
    'birthday': [
      { type: 'required', message: 'Please insert your birthday' },
    ],
    'phone': [
      { type: 'required', message: 'Phone is required' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ]
  };

  /**
   *  Hier haben wir alle inputfelder vom Formular und die Bedingung wie es validiert werden muss.
   */
  ngOnInit(): void {
    this.userDetailsForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  private firebaseApp!: FirebaseApp;
  public auth!: Auth;

  /**
   *  @param  userCredential Im userCredential sind alle Daten über den user eingespeichert.
   */
  async loginUser() {
    debugger;
    const email = this.userDetailsForm.get('email')?.value;
    const password = this.userDetailsForm.get('password')?.value;

    //const app = await initializeApp(environment.firebase);
    //const auth = getAuth(app);
    this.auth = getAuth(this.userFirebaseService.firebaseApp);

    //const auth = getAuth();
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {   // Im userCredential sind alle Daten über den user eingespeichert.
        this.currentUserService.currentUser = userCredential;
        this.router.navigate(['/mainScreen']);  // Diese Zeile befördert uns zur mainScreen component
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  /*signInWithGoogle() {
    debugger;
    const provider = new GoogleAuthProvider(); // Erstellen Sie den Google-Provider
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly'); // Zugriffsbereich hinzufügen    this.auth = getAuth(this.userFirebaseService.firebaseApp);
    this.auth.languageCode = 'it';

    provider.setCustomParameters({
      'login_hint': 'user@example.com'
    });

    signInWithPopup(this.auth, provider)
    .then((result) => {
      // Verarbeiten Sie das Anmeldungs-Ergebnis
      console.log(result);
      
    })
    .catch((error) => {
      // Behandeln Sie Fehler
      console.log(error);
    });

  }*/

    additionalUserInfo: any;

  signInWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider(); // Erstellen Sie den Google-Provider
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        this.additionalUserInfo = getAdditionalUserInfo(result);

        if(this.additionalUserInfo?.isNewUser) {
          debugger;
          console.log(result);
          console.log(this.additionalUserInfo);

          this.dataUserService.clearUser();

          const googleUser = new User;
          googleUser.firstLastName = result.user.displayName ?? '';
          googleUser.id = result.user.uid ?? '';
          googleUser.email = result.user.email ?? '';
  
          this.dataUserService.updateUserForGoogle(googleUser, this.additionalUserInfo?.isNewUser);

          this.router.navigate(['/uploadImage']);
        } else {
          this.router.navigate(['/mainScreen']);  // Diese Zeile befördert uns zur mainScreen component
        }

       

       

        const token = credential!.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  onSubmitUserDetails() {
  }

}