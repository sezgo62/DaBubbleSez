import { Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDocs, query, onSnapshot, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.class';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { StorageReference } from "firebase/storage";
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { getAuth, Auth } from '@angular/fire/auth';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class userFirebaseService {

  firestore: Firestore = inject(Firestore);

  users: any[] = [];
  user$;
  user;
  unsubUser;

  getUsers() {
    return collection(this.firestore, 'user');
  }

  //unsubList;
  firebaseApp!: FirebaseApp;

  //public auth: Auth;

  constructor() {
    this.initializeFirebaseApp();
    //this.auth = getAuth();
    const itemCollection = collection(this.firestore, 'user');

    this.unsubUser = onSnapshot(itemCollection, (list) => {
      list.forEach(element => {
        console.log(element);

      });
    })

    //this.unsubList = onSnapshot(itemCollection, (list) => {})
    //const itemCollection = collection(this.firestore, 'user');
    this.user$ = collectionData(itemCollection);
    this.user = this.user$.subscribe((list) => {
      list.forEach(element => {
        console.log(element);
        this.users.push(element);
        console.log(this.users);
        
      });
    });
  }

  

  initializeFirebaseApp() {
    this.firebaseApp = initializeApp(environment.firebase);
  }

  /*constructor(
    private afAuth: AngularFireAuth, // Verwenden Sie AngularFireAuth
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log("User logged in: ", user);
        this.loadUserData();
      } else {
        console.log("No user logged in");
      }
    });
  }*/

  loadUserData() {
    // Beispiel, wie Sie firestore verwenden könnten
    const itemCollection = collection(this.firestore, 'user');
    // Weitere Operationen...
  }



  async addUserToFireStore(user: User) {
    debugger;
    // Konvertiert das User-Objekt zu einem JSON-Objekt
    const userJson = user.toJson();

    try {
      // Fügt das JSON-Objekt zur Firestore-Datenbank hinzu
      const docRef = await addDoc(this.getUsers(), userJson);
      console.log('Document written with ID:', docRef.id);  // Loggt die ID des neu erstellten Dokuments
    } catch (err) {
      console.log('Error adding document:', err);  // Fängt und loggt Fehler
    }
  }


  imageUrl!: string;

  ////check
  async uploadPicture(fileRef: StorageReference, file: File, user: User) {
    console.log('Starting upload...');
    await uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Upload completed, snapshot:', snapshot);
      console.log('Attempting to get download URL...');
      return getDownloadURL(snapshot.ref);
    }).then((downloadURL) => {
      console.log('Download URL obtained:', downloadURL);
      debugger;
      this.imageUrl = downloadURL;
      user.image = this.imageUrl;
      this.addUserToFireStore(user);
    }).catch((error) => {
      console.error('An error occurred:', error);
    });
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

}