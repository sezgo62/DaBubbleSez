import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { userFirebaseService } from 'src/app/userFirebase.service';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public userFirebaseService: userFirebaseService, private fb: FormBuilder, private router: Router) {
    //this.onSubmitUserDetails(input);
  }

  userDetailsForm!: FormGroup;
  email: string = '';
  accountDetailsForm: any;


/**
 *  Das sind alle Fehlermeldungen die angezeigt werden wenn ein inputfeld nicht ausgefüllt wurde.
 */
  validation_messages = { 
    'email': [
      { type: 'required', message: 'Full email is required' }
    ],
    'password': [
      { type: 'maxlength', message: 'Full password is required' },
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


/**
 *  @param  userCredential Im userCredential sind alle Daten über den user eingespeichert.
 */
  loginUser() {
    const email = this.userDetailsForm.get('email')?.value;
    const password = this.userDetailsForm.get('password')?.value;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {   // Im userCredential sind alle Daten über den user eingespeichert.
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

  onSubmitUserDetails() {
  }

}