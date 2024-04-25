import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginComponent } from '../access/login/login.component';
import { getAuth, sendSignInLinkToEmail, sendPasswordResetEmail } from "firebase/auth";
import { userFirebaseService } from '../userFirebase.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  userDetailsForm!: FormGroup;
  

  constructor(private fb: FormBuilder, public userFirebaseService: userFirebaseService) {

  }

  ngOnInit(): void {
    this.userDetailsForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmitUserDetails() {
    debugger;
    const email = this.userDetailsForm.get('email')?.value;

    
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

      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          // ..
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
      
  }
}