import { Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDocs, query, onSnapshot, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.class';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { StorageReference } from "firebase/storage";

import { getAuth, Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class userFirebaseService {

  firestore: Firestore = inject(Firestore);

  user$;
  user;
  unsubUser;

  getUsers() {
    return collection(this.firestore, 'user');
  }

  //unsubList;

  auth: Auth;


  constructor() {
    this.auth = getAuth();


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

      });
    });
  }

  async addUserToFireStore(user: User) {
    debugger;
    const newUserRef = doc(this.getUsers());  // Erstellt eine neue Dokumentreferenz mit einer eindeutigen ID
    user.id = newUserRef.id;  // Setzt die ID des User-Objekts auf die ID der neuen Dokumentreferenz

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
    debugger;
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



  /*uploadPicture(fileRef: StorageReference, file: File) {
    uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    }).catch((error) => {
      console.error('Upload failed:', error);
    });
  }*/

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

}