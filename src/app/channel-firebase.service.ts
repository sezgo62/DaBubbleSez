import { Injectable, OnInit, inject } from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, onSnapshot, where, query, setDoc, Timestamp, orderBy, updateDoc, getDocs, increment, arrayUnion, getDoc, arrayRemove } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.development';
import { User } from 'src/models/user.class';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Channel } from 'src/models/channel.class';
import { userFirebaseService } from './userFirebase.service';
import { BehaviorSubject, Observable, Subscription, take } from 'rxjs';
import { Post } from 'src/models/post.class';
import { DatePipe } from '@angular/common';
import { FieldValue } from '@angular/fire/firestore';


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
  post$!: Observable<DocumentData[]>;
  emoji$!: Observable<DocumentData[]>;
  post: any;
  channel;
  extractingUsersName!: User;
  allPosts: Post[] = []; // oder DocumentData[], je nachdem wie du es typisierst
  unsubChannel;

  getChannels() {
    return collection(this.firestore, 'channels');
  }

  //unsubList;
  firebaseApp!: FirebaseApp;

  //public auth: Auth;



  constructor(public userFirebaseService: userFirebaseService, private datePipe: DatePipe) {
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


  async filterChannels(channel: Channel): Promise<void> {

    // Unsubscribe von einer alten Subscription, falls vorhanden
    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }

    const itemCollection = collection(this.firestore, 'channels');
    const q = query(itemCollection, where("id", "==", channel.id));
    const channel$ = collectionData(q);

    // Abonniere das Observable und warte bis die Daten vollständig verarbeitet sind
    //await funktioniert nicht mit observables, Observables  müssen in ein Promise umgewandelt werden wie hier: return new Promise((resolve, reject) => {
    //Mehr dazu findest du in Readme unter dem Titel: "Promise und Observables"
    return new Promise<void>((resolve, reject) => { // Resolve das Promise, wenn die Verarbeitung abgeschlossen ist
      this.channelSubscription = channel$.subscribe({
        next: (list) => {
          list.forEach(element => {

            this.currentChannel = element as Channel;
            console.log('channel is', this.currentChannel);

            this.extractingUsersName = this.userFirebaseService.users.find(user => user.id === this.currentChannel.authorOfChannel);
            if (this.currentChannel.id && this.currentChannel.nameOfChannel && this.currentChannel.dateOfCreation && this.currentChannel.permittedUsers) {
              console.log('pushed element', this.currentChannel);
            } else {
              console.error('Das Element hat nicht alle notwendigen Felder:', element);
            }
          });
          resolve(); // Resolve das Promise, wenn die Verarbeitung abgeschlossen ist
        },
        error: (err) => {
          console.error('Fehler beim Laden der Kanäle:', err);
          reject(err); // Reject das Promise im Fehlerfall
        }
      });
    }).then(() => {

      this.filterPosts(); // Wird aufgerufen, nachdem das Promise aufgelöst wurde
    });
  }

  postSubscription: Subscription | undefined;

  async filterPosts() {
    const channelId = this.currentChannel.id;
    const itemCollection = collection(this.firestore, `channels/${channelId}/posts`);
    const q = query(itemCollection, orderBy('dateOfPost', 'asc')); // Sortierung nach 'dateOfPost'

    this.post$ = collectionData(q);

    if (this.postSubscription) {
      this.postSubscription.unsubscribe();  // Beende alte Subscription
    }

    this.postSubscription = this.post$.pipe(take(1)).subscribe((list) => {
      this.allPosts = [];  // Setze das Array zurück, um Doppelungen zu vermeiden

      list.forEach(async (element) => {
        const post = new Post(element);

        // Konvertiere den Firestore Timestamp in ein Date-Objekt
        if (post.dateOfPost instanceof Timestamp) {
          post.dateOfPost = post.dateOfPost.toDate();
        }

        const authorOfPost = this.userFirebaseService.users.find(user => user.id === post.authorOfPost);

        if (authorOfPost) {
          post.authorName = authorOfPost.firstLastName;  // Dynamisch das Feld hinzufügen
        }
        if (!await this.checkIfCollectionIsEmpty(channelId, post.id)) {
          debugger;
          // Referenz zur Emoji-Collection
          const emojiCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${post.id}/emoji`);

          // Verwende onSnapshot, um die Emoji-Collection zu beobachten, ohne die Ausführung zu blockieren
          onSnapshot(emojiCollectionRef, (snapshot) => {
            if (!snapshot.empty) {
              const firstDoc = snapshot.docs[0];
              post.emojiInformations = firstDoc.data();
              console.log('Emoji-Daten wurden aktualisiert:', post.emojiInformations);
            }
          });
        }
        this.allPosts.push(post); // Füge den Post zur Liste hinzu
      });
    });
  }

  ngOnDestroy() {
    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    const storedChannel = localStorage.getItem('currentChannel');
    if (storedChannel) {
      this.currentChannel = JSON.parse(storedChannel);
      //this.loadParticipants();
      console.log('getitem', this.currentChannel);

    }
  }

  private loadCurrentChannel(): Channel | null {
    const storedChannel = localStorage.getItem('currentChannel');
    return storedChannel ? JSON.parse(storedChannel) : null;
  }

  initializeFirebaseApp() {
    this.firebaseApp = initializeApp(environment.firebase);
  }

  channelSubscription: any;

  loadChannels() {
    const itemCollection = collection(this.firestore, 'channels');
    this.channelSubscription = collectionData(itemCollection).subscribe(list => {
      this.channels = list;
      //this.loadParticipants(); // Call after channels are loaded
    });
  }

  loadParticipants() {
    this.currentChannelParticipants = []; // Array leeren
    this.currentChannel.permittedUsers.forEach((permittedUser: any) => {
      debugger;
      const permittedUserOnChannel = this.userFirebaseService.users.find(user => user.id === permittedUser);
      if (permittedUserOnChannel) {
        this.currentChannelParticipants.push(permittedUserOnChannel);
        debugger;
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
      await setDoc(newChannelRef, channelJson);
      //console.log('Document written with ID:', docRef.id);  // Loggt die ID des neu erstellten Dokuments
    } catch (err) {
      console.log('Error adding document:', err);  // Fängt und loggt Fehler
    }
  }

  addPostToFirestore(post: Post) {
    debugger;
    if (!this.currentChannel) {
      console.error('No current channel selected');
      return;
    }

    const channelId = this.currentChannel.id;
    const postsCollectionRef = collection(this.firestore, `channels/${channelId}/posts`);

    // Hier generieren wir eine neue Dokument-Referenz ohne die ID explizit zu setzen, um eine eindeutige ID zu erstellen.
    const postDocRef = doc(postsCollectionRef);

    // Setzt die ID des Channel-Objekts auf die ID der neuen Dokumentreferenz
    post.id = postDocRef.id;
    const postJson = post.toJson();
    debugger;
    setDoc(postDocRef, postJson).then(() => {
      console.log("Post set with custom ID: ", postDocRef.id);
    }).catch((error) => {
      console.error("Error setting post: ", error);
    });
  }

  async addEmojiToFirestore(emojiname: string, post: Post) {
    if (!this.currentChannel) {
      console.error('No current channel selected');
      return;
    }

    const channelId = this.currentChannel.id;

    //const emojiCollectionRef = collection(this.firestore, `channels/${idOfPost}/emoji`);

    // Überprüfen, ob die Collection leer ist
    //getDocs(emojiCollectionRef).then(querySnapshot  => {

    // Erstellen einer Referenz auf die Emoji-Collection
    const emojiCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${post.id}/emoji`);

    // Abrufen aller Dokumente in der Emoji-Collection
    const querySnapshot = await getDocs(emojiCollectionRef);

    if (await this.checkIfCollectionIsEmpty(channelId, post.id)) {
      console.log('Die Emoji-Collection ist leer. Initialisiere das Dokument.');

      // Initialisieren des Emoji-Dokuments
      const emojiStats = {
        nerd: { emojiName: 'nerd', likeCount: [] },
        laugh: { emojiName: 'laugh', likeCount: 0 },
        rocket: { emojiName: 'rocket', likeCount: 0 },
        approved: { emojiName: 'approved', likeCount: 0 },
        handsUp: { emojiName: 'handsUp', likeCount: 0 },
      };

      const channelId = this.currentChannel.id;

      const emojiCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${post.id}/emoji`);

      const emojiDocRef = doc(emojiCollectionRef);



      setDoc(emojiDocRef, emojiStats).then(() => {
        console.log('Emoji-Dokument erfolgreich initialisiert.');

        this.incrementEmojiLikeCount(emojiname, emojiDocRef);

      }).catch(error => {
        console.error('Fehler beim Initialisieren des Emoji-Dokuments: ', error);
      });

      onSnapshot(emojiCollectionRef, async (snapshot) => {
        console.log('Emoji Collection Updated');
        // Wenn sich die Emoji-Collection ändert, rufe filterPosts erneut auf
        // Abrufen aller Dokumente in der Emoji-Collection
        const querySnapshotForEmoji = await getDocs(emojiCollectionRef);


        if (!snapshot.empty) {
          const firstDoc = snapshot.docs[0];
          post.emojiInformations = firstDoc.data();  // Emoji-Informationen aktualisieren

          console.log(post.emojiInformations);  // Debugging, um die aktuellen Daten zu sehen
        }
      });

    } else {
      console.log('Die Emoji-Collection hat bereits Dokumente.');
      //const emojiDocRef = doc(this.firestore, `channels/${channelId}/posts/${idOfPost}/emoji/emojiStats`);

      const firstDoc = querySnapshot.docs[0];
      const emojiDocRef = firstDoc.ref; // Dokumentreferenz des ersten Dokuments


      await this.incrementEmojiLikeCount(emojiname, emojiDocRef);

      const emojiCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${post.id}/emoji`);
      onSnapshot(emojiCollectionRef, async (snapshot) => {
        console.log('Emoji Collection Updated');
        // Wenn sich die Emoji-Collection ändert, rufe filterPosts erneut auf
        // Abrufen aller Dokumente in der Emoji-Collection
        const querySnapshotForEmoji = await getDocs(emojiCollectionRef);


        if (!snapshot.empty) {
          const firstDoc = snapshot.docs[0];
          post.emojiInformations = firstDoc.data();  // Emoji-Informationen aktualisieren

          console.log(post.emojiInformations);  // Debugging, um die aktuellen Daten zu sehen
        }
      });
    }
  }


  async checkIfCollectionIsEmpty(channelId: string, idOfPost: string): Promise<boolean> {
    debugger;
    const emojiCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${idOfPost}/emoji`);
    console.log("Abfrage gestartet...");
    try {
      const querySnapshot = await getDocs(emojiCollectionRef);
      console.log("Anzahl der Dokumente:", querySnapshot.size);
      if (querySnapshot.empty) {
        debugger;
        console.log("Collection ist leer");
        return true;
      } else {
        debugger;
        console.log("Collection enthält Dokumente");
        return false;
      }
    } catch (error) {
      console.error("Fehler bei der Abfrage:", error);
      return false;
    }

  }



  // Methode zur Erhöhung des Like-Counts
  async incrementEmojiLikeCount(emojiname: string, emojiDocRef: any) {

    const emojiData = (await getDoc(emojiDocRef)).data() as { [key: string]: any };
    const currentLikes = emojiData?.[emojiname]?.likeCount || [];

    if (currentLikes.includes(this.userFirebaseService.uid)) {
      // Entferne die User-ID, wenn sie bereits im Array ist (unlike)
      await updateDoc(emojiDocRef, {
        [`${emojiname}.likeCount`]: arrayRemove(this.userFirebaseService.uid)
      }).then(() => {
        console.log(`Like-Count für ${emojiname} erfolgreich verringert.`);
      }).catch(error => {
        console.error('Fehler beim Verringern des Like-Counts: ', error);
      });
    } else {
      // Füge die User-ID hinzu (like)
      await updateDoc(emojiDocRef, {
        [`${emojiname}.likeCount`]: arrayUnion(this.userFirebaseService.uid)
      }).then(() => {
        console.log(`Like-Count für ${emojiname} erfolgreich erhöht.`);
      }).catch(error => {
        console.error('Fehler beim Erhöhen des Like-Counts: ', error);
      });
    }
  }



  /*await updateDoc(emojiDocRef, {
     [`${emojiname}.likeCount`]: arrayUnion(this.userFirebaseService.uid)
   }).then(() => {
     console.log(`Like-Count für ${emojiname} erfolgreich erhöht.`);
   }).catch(error => {
     console.error('Fehler beim Aktualisieren des Like-Counts: ', error);
   });*/
}