import { Injectable, inject } from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { Firestore, addDoc, collection, collectionData, doc, onSnapshot } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.development';
import { User } from 'src/models/user.class';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Channel } from 'src/models/channel.class';


@Injectable({
  providedIn: 'root'
})
export class ChannelFirebaseService {


  firestore: Firestore = inject(Firestore);

  channels: any[] = [];
  channel$;
  channel;
  unsubUser;

  getChannels() {
    return collection(this.firestore, 'channel');
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
    this.channel$ = collectionData(itemCollection);
    this.channel = this.channel$.subscribe((list) => {
      list.forEach(element => {
        console.log(element);
        this.channels.push(element);
        console.log(this.channel);

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
    const itemCollection = collection(this.firestore, 'channel');
    // Weitere Operationen...
  }



  async addChannelToFireStore(channel: Channel) {
    debugger;
    const newUserRef = doc(this.getChannels());  // Erstellt eine neue Dokumentreferenz mit einer eindeutigen ID
    channel.id = newUserRef.id;  // Setzt die ID des User-Objekts auf die ID der neuen Dokumentreferenz
    debugger;
    // Konvertiert das User-Objekt zu einem JSON-Objekt
    const channelJson = channel.toJson();

    try {
      // Fügt das JSON-Objekt zur Firestore-Datenbank hinzu
      const docRef = await addDoc(this.getChannels(), channelJson);
      console.log('Document written with ID:', docRef.id);  // Loggt die ID des neu erstellten Dokuments
    } catch (err) {
      console.log('Error adding document:', err);  // Fängt und loggt Fehler
    }
  }




}
