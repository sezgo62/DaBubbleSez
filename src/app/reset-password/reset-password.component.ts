import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginComponent } from '../access/login/login.component';
import { getAuth, sendSignInLinkToEmail, sendPasswordResetEmail } from "firebase/auth";
import { userFirebaseService } from '../userFirebase.service';
import { Router } from '@angular/router';
import { Auth, updatePassword } from '@angular/fire/auth';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  userDetailsForm!: FormGroup;
  

  constructor(private fb: FormBuilder, public userFirebaseService: userFirebaseService, private router: Router) {

  }

  /**
  *  Das sind alle Fehlermeldungen die angezeigt werden wenn ein inputfeld nicht ausgefüllt wurde.
  */
   validation_messages = { 
     'password': [
       { type: 'required', message: 'Full password is required' }
     ],
     'passwordConfirm': [
       { type: 'required', message: 'Full password is required' },
     ],
   };

  ngOnInit(): void {
    this.userDetailsForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
    });
   
  }

  resetPassword() {

  }
  public auth!: Auth;
  
  onSubmitUserDetails() {
    debugger;
    const password = this.userDetailsForm.get('password')?.value;
    const passwordConfirm = this.userDetailsForm.get('passwordConfirm')?.value;

    //this.router.navigate(['/resetPassword']);
    
    if(password == passwordConfirm) {
      const newPassword =  password;

      this.auth = getAuth(this.userFirebaseService.firebaseApp);

      //const auth = getAuth();
      const user = this.auth.currentUser;

      const urlParams = new URLSearchParams(window.location.search);
      const oobCode = urlParams.get('oobCode');

      updatePassword(user!, newPassword).then(() => {
        // Update successful.
      }).catch((error) => {
        debugger;
        console.log(error);
        
        // An error ocurred
        // ...
      });
    }

    /*const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'https://www.example.com/finishSignUp?cartId=1234',
      // This must be true.
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.example.ios'
      },
      android: {
        packageName: 'com.example.android',
        installApp: true,
        minimumVersion: '12'
      },
      dynamicLinkDomain: 'example.page.link'
    };

    const auth = this.userFirebaseService.auth;
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        debugger;
        console.log('success');
        
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });*/

     
      
  }
}