import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { userFirebaseService } from 'src/app/userFirebase.service';

//import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  
  constructor(public userFirebaseService: userFirebaseService, private fb: FormBuilder) {
    //this.onSubmitUserDetails(input);
  }

  userDetailsForm!: FormGroup;
  email: string = '';
  accountDetailsForm: any;
  submitted = false;


  validation_messages = {
    'email': [
      { type: 'required', message: 'Full email is required' }
    ],
    'password': [
      { type: 'maxlength', message: 'Full password is required' },
    ],
    'firstLastName': [
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstLastName: ['', [Validators.required, Validators.minLength(6)]],
      acceptTerms: [false, Validators.requiredTrue]
    });
}

  
  


  onSubmitUserDetails() {
    
    console.log("Eingereichter Email-Wert:", this.userDetailsForm.get('email')?.value);
    console.log("Eingereichter Email-Wert:", this.userDetailsForm.get('firstLastName')?.value);
    console.log("Eingereichter Email-Wert:", this.userDetailsForm.get('password')?.value);
    console.log("Eingereichter Email-Wert:", this.userDetailsForm.get('acceptTerms')?.value);

  }

}
