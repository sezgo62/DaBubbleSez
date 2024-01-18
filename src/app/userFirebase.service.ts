import { Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDocs, query, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

    this.unsubUser =  onSnapshot(itemCollection, (list) => {
     list.forEach(element => {
      console.log(element);
      
     });
    })

    //this.unsubList = onSnapshot(itemCollection, (list) => {})
    
    //const itemCollection = collection(this.firestore, 'user');
      this.user$ = collectionData(itemCollection);
    this.user = this.user$.subscribe( (list) => {
      list.forEach(element => {
        console.log(element);
        
      });
    } );
  }



getSingleDocRef(colId:string, docId: string) {
return doc(collection(this.firestore, colId), docId);
}

}