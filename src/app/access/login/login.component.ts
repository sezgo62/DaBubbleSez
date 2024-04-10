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


  ngOnInit(): void {
    this.userDetailsForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  loginUser() {

    debugger;
    const email = this.userDetailsForm.get('email')?.value;
    const password = this.userDetailsForm.get('password')?.value;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        this.router.navigate(['/mainScreen']);
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

    console.log("Eingereichter Email-Wert:", this.userDetailsForm.get('email')?.value);
    console.log("Eingereichter Email-Wert:", this.userDetailsForm.get('password')?.value);
  }

}