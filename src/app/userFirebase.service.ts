import { Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDocs, query, onSnapshot, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.class';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { StorageReference } from "firebase/storage";

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

  constructor() {
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

  async addUserToFireStore(user: Object) {
    debugger;
    await addDoc(this.getUsers(), user).catch(
      (err) => { console.log(err) }
    ).then(
      (docref) => console.log('document written with ID:', docref)
    )
  }

uploadPicture(fileRef: StorageReference, file: File) {
  uploadBytes(fileRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  }).catch((error) => {
    console.error('Upload failed:', error);
  });
}

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

}