import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { userFirebaseService } from 'src/app/userFirebase.service';
import { User } from 'src/models/user.class';
import { Router } from '@angular/router';
import { UserDataService } from '../user-data.service';



//import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {


  newUser = new User;

  constructor(public userFirebaseService: userFirebaseService, private fb: FormBuilder, private userDataService: UserDataService,
    private router: Router) {
    //this.onSubmitUserDetails(input);
  }

  userDetailsForm!: FormGroup;
  email: string = '';
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



  password!: String;

  onSubmitUserDetails() {

    this.newUser.firstLastName = this.userDetailsForm.get('firstLastName')?.value;
    this.newUser.email = this.userDetailsForm.get('email')?.value;
    const password = this.userDetailsForm.get('password')?.value;

    // Diese Methode wird aufgerufen, wenn das Formular abgeschickt wird. Sie aktualisiert den User im Service und navigiert zur nächsten Seite.
    this.userDataService.updateUser(this.newUser, password); // Ruft updateUser auf dem Service auf, übergibt den neuen User
    this.router.navigate(['/uploadImage']); // Navigiert programmatisch zur UploadImage-Komponente
  }
}