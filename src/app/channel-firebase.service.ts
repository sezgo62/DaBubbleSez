import { Injectable, OnInit, inject } from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, onSnapshot, where, query, setDoc } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.development';
import { User } from 'src/models/user.class';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Channel } from 'src/models/channel.class';
import { userFirebaseService } from './userFirebase.service';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ChannelFirebaseService implements OnInit {

 
  
  firestore: Firestore = inject(Firestore);

  channels: any[] = [];
  FilteredChannels: any[] = [];
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
      this.channels = [];
      list.forEach(element => {
        console.log(element);
        this.channels.push(element);
        console.log(this.channel); 
        console.log('pushed element', element);
      });
    });

    

  }

  async filterChannels(channel: Channel) {
    const itemCollection =  collection(this.firestore, 'channels');


    const q = query(itemCollection, where("id", "==", channel.id));
    debugger;
    this.channel$ = collectionData(q);
    this.channel = this.channel$.subscribe((list) => {
       list.forEach(element => {
        console.log(element);
         this.currentChannel = element as Channel;
        debugger;
        if (this.currentChannel.id && this.currentChannel.nameOfChannel && this.currentChannel.dateOfCreation && this.currentChannel.permittedUsers) {
          this.currentChannel = this.currentChannel;
          console.log('pushed element', this.currentChannel);
      } else {
          console.error('Das Element hat nicht alle notwendigen Felder:', element);
      }
        console.log(this.currentChannel); 
        console.log('pushed element', element);
      });
    });

    this.loadParticipants();
  }
  
  ngOnInit() {
    const storedChannel = localStorage.getItem('currentChannel');
    if (storedChannel) {
      this.currentChannel = JSON.parse(storedChannel);
      //this.loadParticipants();
      console.log('getitem', this.currentChannel);
      
      debugger;
    }  }

  private loadCurrentChannel(): Channel | null {
    const storedChannel = localStorage.getItem('currentChannel');
    return storedChannel ? JSON.parse(storedChannel) : null;
  }

  initializeFirebaseApp() {
    this.firebaseApp = initializeApp(environment.firebase);
  }

  channelSubscription: any;

  loadChannels() {
    debugger;
    const itemCollection = collection(this.firestore, 'channels');
    this.channelSubscription = collectionData(itemCollection).subscribe(list => {
      this.channels = list;
      //this.loadParticipants(); // Call after channels are loaded
    });
  }

  loadParticipants() {
    this.currentChannelParticipants = []; // Array leeren
  debugger;
      this.currentChannel.permittedUsers.forEach((permittedUser: any) => {
        const permittedUserOnChannel = this.userFirebaseService.users.find(user => user.id === permittedUser);
        if (permittedUserOnChannel) {
          this.currentChannelParticipants.push(permittedUserOnChannel);
        }
      });
    localStorage.setItem('currentChannel', JSON.stringify(this.currentChannelParticipants));

   
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
    //const newChannelRef = doc(this.getChannels());  // Erstellt eine neue Dokumentreferenz mit einer eindeutigen ID
    //channel.id = newChannelRef.id;  // Setzt die ID des Channel-Objekts auf die ID der neuen Dokumentreferenz
    //debugger;
    // Konvertiert das Channel-Objekt zu einem JSON-Objekt
    //const channelJson = channel.toJson();
    
    try {
      const channelsRef = collection(this.firestore, 'channels');

      // Erstellt eine neue Dokumentreferenz mit einer eindeutigen ID
      const newChannelRef = doc(channelsRef);
     
 
      // Setzt die ID des Channel-Objekts auf die ID der neuen Dokumentreferenz
      channel.id = newChannelRef.id;
 
       // Konvertiert das Channel-Objekt zu einem JSON-Objekt
       const channelJson = channel.toJson();

      // Fügt das JSON-Objekt zur Firestore-Datenbank hinzu

      // Fügt das JSON-Objekt zur Firestore-Datenbank hinzu
      await setDoc(newChannelRef, channelJson);
      //console.log('Document written with ID:', docRef.id);  // Loggt die ID des neu erstellten Dokuments
    } catch (err) {
      console.log('Error adding document:', err);  // Fängt und loggt Fehler
    }
  }


/*async addChannelToFireStore(channel: Channel) {
    debugger;
    //const newChannelRef = doc(this.getChannels());  // Erstellt eine neue Dokumentreferenz mit einer eindeutigen ID
    //channel.id = newChannelRef.id;  // Setzt die ID des Channel-Objekts auf die ID der neuen Dokumentreferenz
    //debugger;
    // Konvertiert das Channel-Objekt zu einem JSON-Objekt
    const channelJson = channel.toJson();

    try {
      // Fügt das JSON-Objekt zur Firestore-Datenbank hinzu

      const docRef = await addDoc(this.getChannels(), channelJson);
      console.log('Document written with ID:', docRef.id);  // Loggt die ID des neu erstellten Dokuments
    } catch (err) {
      console.log('Error adding document:', err);  // Fängt und loggt Fehler
    }
  }*/

}
