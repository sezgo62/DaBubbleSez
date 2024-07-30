import { Injectable, inject } from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { Firestore, addDoc, collection, collectionData, doc, onSnapshot } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.development';
import { User } from 'src/models/user.class';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Channel } from 'src/models/channel.class';
import { userFirebaseService } from './userFirebase.service';


@Injectable({
  providedIn: 'root'
})
export class ChannelFirebaseService {


  firestore: Firestore = inject(Firestore);

  channels: any[] = [];
  currentChannelParticipants: any[] = [];
  currentChannel!: Channel;
  channel$;
  channel;
  unsubChannel;

  getChannels() {
    return collection(this.firestore, 'channels');
  }

  //unsubList;
  firebaseApp!: FirebaseApp;

  //public auth: Auth;

  constructor(public userFirebaseService: userFirebaseService) {
    this.initializeFirebaseApp();
    //this.auth = getAuth();
    const itemCollection = collection(this.firestore, 'channels');

    this.unsubChannel = onSnapshot(itemCollection, (list) => {
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
        console.log('pushed element', element);

      });
    });
  }

  initializeFirebaseApp() {
    this.firebaseApp = initializeApp(environment.firebase);
  }

  loadParticipants() {
    this.channels.forEach(channel => {

      channel.permittedUsers.forEach((permittedUser: any) => {
        const permittedUserOnChannel = this.userFirebaseService.users.find(user => user.id === permittedUser);
        if (permittedUserOnChannel) {
          this.currentChannelParticipants.push(permittedUserOnChannel);
          debugger;
        }
      });

    });
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

  loadChannelData() {
    // Beispiel, wie Sie firestore verwenden könnten
    const itemCollection = collection(this.firestore, 'channel');
    // Weitere Operationen...
  }



  async addChannelToFireStore(channel: Channel) {
    debugger;
    const newChannelRef = doc(this.getChannels());  // Erstellt eine neue Dokumentreferenz mit einer eindeutigen ID
    channel.id = newChannelRef.id;  // Setzt die ID des Channel-Objekts auf die ID der neuen Dokumentreferenz
    debugger;
    // Konvertiert das Channel-Objekt zu einem JSON-Objekt
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
