import { Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDocs, query, onSnapshot, addDoc, setDoc } from '@angular/fire/firestore';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { User } from 'src/models/user.class';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { StorageReference } from "firebase/storage";
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { getAuth, Auth, onAuthStateChanged } from '@angular/fire/auth';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment.development';
import { ChannelFirebaseService } from './channel-firebase.service';
import { arrayUnion, updateDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class userFirebaseService implements OnInit {

  firestore: Firestore = inject(Firestore);

  users: any[] = [];
  user$;
  user;
  uid!: any;
  unsubUser;

  getUsers() {
    return collection(this.firestore, 'user');
  }

  //unsubList;
  firebaseApp!: FirebaseApp;

  //public auth: Auth;

  filteredUsers: any;
  conversationId: any;
  constructor() {
    //Diese Funktion checkt jeder Zeit ob ein user durch die authentication des firebase eingeloggt ist oder nicht.
    const auth = getAuth();

    //onAuthStateChanged()` wird nur EINMAL aufgerufen
    onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Auth-Status geändert');

      if (user) {
        this.uid = user.uid;
        console.log('✅ Eingeloggter User UID:', this.uid);

        // 🔥 Firestore-Daten abrufen
        const itemCollection = collection(this.firestore, 'user');
        this.user$ = collectionData(itemCollection);

        // 🔥 Warten, bis ALLE User geladen wurden
        const usersList = await firstValueFrom(this.user$);
        this.users = usersList;
        console.log('✅ Firestore Users vollständig geladen:', this.users);

        // 🔥 Jetzt erst `findUser` ausführen
        const findUser = this.users.find(u => u.id === this.uid);


        if (findUser) {
          this.loggedInUser = findUser;




          const userConversationIds = this.loggedInUser.conversations; // 🔥 IDs der Unterhaltungen

          // 🔍 Alle Benutzer mit gemeinsamer `conversationId` finden
          this.filteredUsers = this.users
            .flatMap(user => {
              if (user.id === this.loggedInUser.id) return []; // Sich selbst ignorieren

              const sharedConversations = user.conversations?.filter((convId: string) =>
                this.loggedInUser.conversations.includes(convId)
              ) || [];

              if (sharedConversations.length === 0) return []; // Kein Match

              return {
                conversationId: sharedConversations[0], // Direkt die einzige ID nehmen
                user1: this.loggedInUser,
                user2: user
              };
            });

          console.log('✅ Gefilterte Benutzer mit gemeinsamen Conversations:', this.filteredUsers);


          console.log('✅ Gefilterte User-Paare mit gemeinsamen Conversations:', this.filteredUsers);










          console.log('✅ User gefunden:', this.loggedInUser);
        } else {
          console.log('⚠️ User nicht gefunden in Firestore');
        }
      } else {
        console.log('⚠️ Kein User eingeloggt');
      }
    });




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

  auth: any;

  initializeUserSnapshot() {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.auth = getAuth();
    this.uid = this.auth.currentUser?.uid


    //const matchingIDs = loggedInUser.filter(id => user2Conversations.includes(id));
    const itemCollection = collection(this.firestore, 'user');

    this.user$ = collectionData(itemCollection);



  }

  loggedInUser: User = new User();

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
    // Konvertiert das User-Objekt zu einem JSON-Objekt
    const userJson = user.toJson();

    try {

      const auth = getAuth();
      this.uid = auth.currentUser?.uid

      const usersRef = collection(this.firestore, 'user');


      // Erstellt eine neue Dokumentreferenz mit einer eindeutigen ID
      const newUsersRef = doc(usersRef, this.uid);
      debugger;

      // Fügt das JSON-Objekt zur Firestore-Datenbank hinzu
      const docRef = await setDoc(newUsersRef, userJson);
      //console.log('Document written with ID:', docRef.id);  // Loggt die ID des neu erstellten Dokuments
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

  async createChat() {


  }
}