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
import { sendSignInLinkToEmail } from "firebase/auth";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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
  userDetailsForm!: FormGroup;
  isNewUser: boolean = false;


  constructor(private router: Router, private userDataService: UserDataService, private userService: userFirebaseService, private fb: FormBuilder) {

  }

  fileName = 'Keine Datei ausgewählt'; // Initialer Text
  file!: File;
  fileRef!: StorageReference;
  imagePreviewUrl?: string | null; // Für die Bildvorschau
  imageCounter!: Number | null; // Wir setzen in imageCounter die Zahl ein um das richtige Avatar zu laden
  selectedAvatar: string | null = null;  // Hier wird der Avatar gespeichert den wir auf der upload-image Seite ausgewählt haben gespeichert.
  allAvatars = new Array(5).fill(0); // .fill(0) füllt das Array mit dem Wert 0, der Wert ist in diesem Fall aber irrelevant
  // Das Array hat 5 künstliche Stellen um welches dann jeweils im ngFor alle Bilder nacheinander abgebildet werden.
  isButtonDisabled!: boolean;; // Standardmäßig deaktiviert


  /**
   * 
   * @param files ist das Objekt in welchem alle Informationen enthalten sind wie der name des files.
   * @param file wird durch die Funktion an die Funktion uploadPicture() im userFirebaseService als Parameter weitergegeben um ein Bild zu uploaden.
   * @param fileRef hier erstelle wir uns ein Verzeichnis in welcher wir die Bilder im Storage speichern können.
   * @param URL.createObjectURL(this.file); // Erstellen einer Bildvorschau.
   * @param selectedAvatar // Das Profilbild des jeweiligen Nutzers
   *  
   */
  handleFiles(files: FileList | null): void {
    if (files && files.length > 0) {
      this.imageCounter = null;
      this.selectedAvatar = files[0].name;
      this.file = files[0]; // Speichere das erste File-Objekt aus dem FileList in einer Variable
      this.imagePreviewUrl = URL.createObjectURL(this.file);
    } else {
      this.selectedAvatar = 'Keine Datei ausgewählt'; // Zurücksetzen, falls keine Datei ausgewählt ist
    }
    const storage = getStorage(); // In storage speichern wir die Referenz zum storage
    this.fileRef = ref(storage, 'images/' + this.selectedAvatar); // Hier erstellen wir uns einen individuellen Ordner wo wir unsere Bilder abspeichern im storage
  }

  /**
   * 
   * @param userSubscription Wir abonnieren den user-data-service um die Daten aus der register Komponente zu empfangen die wir dort zum registrieren eingegeben haben.
   *                         Wir bekommen aus dem user-data-service einmal das password und das User objekt um die registrierung mit den Daten die in der register component eingegeben worden sind abzuuschließen.
   */
  ngOnInit(): void {
    // Abonniert das user$ Observable aus dem UserDataService, um bei jeder Aktualisierung des Users benachrichtigt zu werden
    this.userSubscription = this.userDataService.user$.subscribe(user => {
      // Aktualisiert den lokalen User-Status, wenn sich der User im Service ändert
      if (user) {
        this.user = user; // Hiermit holen wir uns das User Objekt aus dem UserDataService, welches wir vom registercomponent zwichengespeichert haben.
      }
    });
    this.userSubscription = this.userDataService.password$.subscribe(password => {
      if (password) {

        this.password = password; // Hiermit holen wir uns das Password aus dem UserDataService, welches wir vom registercomponent zwichengespeichert haben.
      }
    });
    this.userSubscription = this.userDataService.isNewUser$.subscribe(isNewUser => {
      if (isNewUser) {

        this.isNewUser = isNewUser; // Hiermit holen wir uns das Password aus dem UserDataService, welches wir vom registercomponent zwichengespeichert haben.
      debugger;
      }
    });
  }




  /*fetchImageAndUpload() {
    debugger;
    const imageUrl = `assets/img/avatars/${this.selectedAvatar}.png`;
    fetch(imageUrl)
        .then(res => res.blob())  // Bild als Blob abrufen
        .then(blob => {
            this.file = new File([blob], `${this.selectedAvatar}.png`, { type: 'image/png' });
            const storage = getStorage(); // In storage speichern wir die Referenz zum storage
            this.fileRef = ref(storage, 'images/' + this.selectedAvatar);
            //this.uploadAvatarToStorage(this.file);
        })
        .catch(error => console.error('Error fetching image:', error));
}*/

  /*uploadAvatarToStorage(file: File) {
    const storage = getStorage();
    const storageRef = ref(storage, `avatars/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Avatar uploaded successfully!', snapshot);
    }).catch((error) => {
        console.error('Error uploading avatar:', error);
    });
  }*/

  /**
     * @param userSubscription Wir abonnieren den user-data-service um die Daten aus der register Komponente zu empfangen die wir dort zum registrieren eingegeben haben.
     * @param imagePreviewUrl Eine Variable welche erstmals in der handleFiles() Funktion vergeben wird für eine Bildvorschau.
     */
  selectAvatar(image: number) {
    console.log(image);

    this.imagePreviewUrl = null; // Wir setzen es auf null da durch selectAvatar() ein Avatar ausgewählt wurde und das im HTML validiert wird.

    this.imageCounter = image + 1; // Wir addieren immer eine Zahl hinzu um das Richtige Bild zu laden. 
    //Der Grund ist, wir haben die Bilder ab eins bennant. Wie "Avatar1" aber das Array fängt aber ab der Stelle 0 an.

    this.selectedAvatar = `avatar${this.imageCounter}`; //Den Namen für das Bild setzen wir hier rein.

    this.user.image = this.selectedAvatar; //Den Namen für das Bild setzen wir in das User Object ein.

    //this.fetchImageAndUpload();
  }

  onSubmitUserDetails() { }


  /**
     * @param isButtonDisabled Wird benötigt um den Button zu disablen falls kein Bild ausgewählt wurde.
 *  @param  userCredential Im userCredential sind alle Daten über den user eingespeichert.
     */
  async addUser(event: MouseEvent): Promise<void> {
    this.isButtonDisabled = !this.selectedAvatar; // Nehmen wir an, selectedAvatar ist eine weitere Eigenschaft

    if (this.selectedAvatar) {

      const auth = getAuth(); // Referenz zu Firebase Authentication
      debugger;

      await createUserWithEmailAndPassword(auth, this.user.email, this.password) // createUserWithEmailAndPassword ist eine spezielle Funktion von
        //  firebase authentication um einen neuen user in der Datenbank zu registrieren
        .then((userCredential) => {  // Erfolgreiche Anmeldung: UserCredential enthält Informationen zum neuen Benutzer
          // Signed up 

          const user = userCredential.user; // Zugriff auf das User-Objekt, das den angemeldeten Benutzer repräsentiert
          this.user.id = user.uid;
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });


      if (this.fileRef && this.file) { // Falls eine file vorhanden ist werden wir zu uploadPicture() weitergeleitet. 
        this.userService.uploadPicture(this.fileRef, this.file, this.user);
        console.log('file detected');
      }
      debugger;

      this.userService.addUserToFireStore(this.user);
      console.log('new object', this.user);




      this.router.navigate(['/mainScreen']); // leitet uns weiter zur mainscreen-Seite


      ////////////Bestätigungslink in Bearbeitung////////////
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
  
      sendSignInLinkToEmail(auth, this.user.email, actionCodeSettings)
        .then(() => {
  
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem('emailForSignIn', this.user.email);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ...
        });
      } else {
        console.log('no file detected');
      }*/

    } else {
      let errorMessage = document.getElementById('errorText');
      errorMessage?.classList.remove('d-none');
    }
  }

  addUserForGoogle() {
    debugger;
    if (this.selectedAvatar) {

      if (this.fileRef && this.file) { // Falls eine file vorhanden ist werden wir zu uploadPicture() weitergeleitet. 
        this.userService.uploadPicture(this.fileRef, this.file, this.user);
        console.log('file detected');
      }

      this.userService.addUserToFireStore(this.user);


    }
  }

  ngOnDestroy(): void {
    // Beendet das Abonnement, wenn die Komponente zerstört wird, um Memory Leaks zu verhindern
    this.userSubscription.unsubscribe();
  }

}