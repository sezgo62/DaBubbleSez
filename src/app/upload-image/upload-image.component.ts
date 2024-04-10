import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user.class';
import { UserDataService } from '../user-data.service';
import { Subscription } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { userFirebaseService } from '../userFirebase.service';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { StorageReference } from "firebase/storage";


@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {
  // Eine Property zum Speichern des Subscription-Objekts, um später das Abonnement beenden zu können
  userSubscription!: Subscription;
  // Eine Property zum Speichern des aktuellen Users
  user!: User;
  password!: string;



  constructor(private router: Router, private userDataService: UserDataService, private userService: userFirebaseService) {

  }

  
  fileName = 'Keine Datei ausgewählt'; // Initialer Text
  file!: File;
  fileRef!: StorageReference;

  handleFiles(files: FileList | null): void {
    if (files && files.length > 0) {
      this.fileName = files[0].name; // Update des Dateinamens
      this.file = files[0]; // Speichere das erste File-Objekt aus dem FileList in einer Variable

    } else {
      this.fileName = 'Keine Datei ausgewählt'; // Zurücksetzen, falls keine Datei ausgewählt ist
    }

    debugger;

    const storage = getStorage();
    this.fileRef = ref(storage, 'images/' + this.fileName);


  }


  ngOnInit(): void {
    // Abonniert das user$ Observable aus dem UserDataService, um bei jeder Aktualisierung des Users benachrichtigt zu werden
    this.userSubscription = this.userDataService.user$.subscribe(user => {
      // Aktualisiert den lokalen User-Status, wenn sich der User im Service ändert
      if (user) {


        this.user = user;
      }
    });
    this.userSubscription = this.userDataService.password$.subscribe(password => {
      if (password) {

        this.password = password;
      }
    });

  }

  imageCounter!: Number;
  selectedAvatar!: string;

  allAvatars = new Array(5).fill(0); // .fill(0) füllt das Array mit dem Wert 0, der Wert ist in diesem Fall aber irrelevant
  // Das Array hat 5 künstliche Stellen um welches dann jeweils im ngFor alle Bilder nacheinander abgebildet werden.

  selectImage(image: number) {
    console.log(image);

    this.imageCounter = image + 1;

    this.selectedAvatar = `avatar${this.imageCounter}`;

    this.user.image = this.selectedAvatar;

    console.log(this.user);

  }

  addUser() {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, this.user.email, this.password)
      .then((userCredential) => {
        // Signed up 
        console.log(userCredential);

        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });

    let getPureJson = this.user.toJson();
    this.userService.addUserToFireStore(getPureJson);

    this.userService.uploadPicture(this.fileRef, this.file);
    this.router.navigate(['/mainScreen']);

  }



  ngOnDestroy(): void {
    // Beendet das Abonnement, wenn die Komponente zerstört wird, um Memory Leaks zu verhindern
    this.userSubscription.unsubscribe();
  }

}
