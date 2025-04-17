import { HostListener, Injectable, OnInit, inject } from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, onSnapshot, where, query, setDoc, Timestamp, orderBy, updateDoc, getDocs, increment, arrayUnion, getDoc, arrayRemove, deleteDoc, limit } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.development';
import { User } from 'src/models/user.class';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Channel } from 'src/models/channel.class';
import { userFirebaseService } from './userFirebase.service';
import { BehaviorSubject, Observable, Subject, Subscription, take } from 'rxjs';
import { Post } from 'src/models/post.class';
import { DatePipe } from '@angular/common';
import { FieldValue } from '@angular/fire/firestore';
import { Answer } from 'src/models/answers.class';
import { getAuth, signOut } from '@angular/fire/auth';
import { Message } from 'src/models/message.class';
import { MessageLobby } from 'src/models/messageLobby.class';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class ChannelFirebaseService implements OnInit {



  firestore: Firestore = inject(Firestore);

  channels: any[] = [];
  FilteredChannels: any[] = [];
  currentChannelParticipants: any[] = [];
  currentChannel!: Channel;
  currentLobby: string = '';
  channel$;
  users$;
  post$!: Observable<DocumentData[]>;
  messages$!: Observable<DocumentData[]>;
  emoji$!: Observable<DocumentData[]>;
  answer$!: Observable<DocumentData[]>;
  post: any;
  message: Message = new Message();
  messageLobby: MessageLobby = new MessageLobby()
  //channel;
  //user;
  extractingUsersName!: User;
  allPosts: Post[] = []; // oder DocumentData[], je nachdem wie du es typisierst
  allMessages: Message[] = []; // oder DocumentData[], je nachdem wie du es typisierst
  allAnswersOfCurrentOpenedThread: Answer[] = []; // oder DocumentData[], je nachdem wie du es typisierst
  threadPost: any;
  postSubscription: Subscription | undefined;
  messageSubscription: Subscription | undefined;

  answerSubscription: Subscription | undefined;
  profileInformations!: Post;
  //unsubChannel;
  //unsubUsers;
  channelSubscription: any;
  allChannelSubscription: any;
  messageChoosedPerson: boolean = false;

  allExistingChannelsAndUsers: any[] = [];
  disclaimer: boolean = true;
  inputMessage: boolean = false;
  activatePrivateChatTemplate: boolean = false;
  isVariableTrueForResponsive: boolean = false;
  isVariableTrueForResponsiveOpenedThread: boolean = false;
  addParticipantTextMap: { [key: number]: string } = {}; // Speichert Button-Texte pro ID
  showChannelResponsive: boolean = false;

  getChannels() {
    return collection(this.firestore, 'channels');
  }

  //unsubList;
  firebaseApp!: FirebaseApp;

  //public auth: Auth;

  goBackToNavigator() {
    this.showChannelResponsive = false;
  }


  constructor(public userFirebaseService: userFirebaseService, private datePipe: DatePipe, private router: Router) {
    //this.initializeFirebaseApp();



    const channelsCollection = collection(this.firestore, 'channels');
    const usersCollection = collection(this.firestore, 'user');

    // Channels-Observable
    this.channel$ = collectionData(channelsCollection);

    // Users-Observable
    this.users$ = collectionData(usersCollection);

    // Abonniere `channel$` und speichere die Daten in `channels`    
    this.channel$.pipe(take(1)).subscribe((channelsList) => {
      this.channels = []; // Channels-Array leeren
      channelsList.forEach(channel => {
        console.log('Channel:', channel);
        this.channels.push(channel); // Channel-Daten hinzufügen
      });

      // Abonniere `users$`, sobald `channels` fertig ist, und speichere alles in `allExistingChannelsAndUsers`
      this.users$.pipe(take(1)).subscribe((usersList) => {
        this.allExistingChannelsAndUsers = [...this.channels]; // Zuerst alle Channels hinzufügen

        usersList.forEach(user => {
          console.log('User:', user);
          this.allExistingChannelsAndUsers.push(user); // Dann alle Users hinzufügen
        });
        console.log('All channels and users:', this.allExistingChannelsAndUsers);
      });
    });
  }

  logout(): Promise<void> {
    const auth = getAuth();
    return signOut(auth);
  }

  /*blatest() {
    debugger;
    if (this.isVariableTrueForResponsive == true) {
      this.isVariableTrueForResponsive = true;
      this.isVariableTrueForResponsiveOpenedThread = true;
    } else {
      this.isVariableTrueForResponsiveOpenedThread = true;
      this.isVariableTrueForResponsive = true;
    }
  }*/

  //////

  getAllExistingUsers() {
    const usersCollection = collection(this.firestore, 'user');

    // Users-Observable
    this.users$ = collectionData(usersCollection);

    // Abonniere `users$`, sobald `channels` fertig ist, und speichere alles in `allExistingChannelsAndUsers`
    this.users$.pipe(take(1)).subscribe((usersList) => {

      usersList.forEach(user => {
        console.log('User:', user);
        this.getAllExistingUsersArray.push(user); // Dann alle Users hinzufügen
      });
      console.log('All channels and users:', this.getAllExistingUsersArray);
    });
  }

  getAllExistingUsersArray: any[] = [];

  uid: any;
  checkUserForChannelEntrance: any;
  isProcessing: boolean = false;

  navigateToMainscreen() {

    this.ngOnDestroy();

    this.messageChoosedPerson = false;

    this.router.navigate(['/mainScreen']);


  }


  navigateToOPenedThreadForMobile() {
    this.router.navigate(['/mainScreen']);

    this.isVariableTrueForResponsiveOpenedThread = true;
    this.isVariableTrueForResponsive = true;

  }


  async filterChannels(channel: Channel): Promise<void> {
    this.isProcessing = false;
    this.showChannelResponsive = true;

    //await new Promise(resolve => setTimeout(resolve, 1000));

    this.createNewMessage = false;
    this.inputMessage = false;

    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }

    try {
      const itemCollection = collection(this.firestore, 'channels');
      const auth = getAuth();
      this.uid = auth.currentUser?.uid;
      this.checkUserForChannelEntrance = channel.permittedUsers.find(permittedUser => permittedUser === this.uid);

      if (this.checkUserForChannelEntrance) {
        const q = query(itemCollection, where("id", "==", channel.id));
        const channel$ = collectionData(q);

        await new Promise<void>((resolve, reject) => {
          this.channelSubscription = channel$.subscribe({
            next: (list) => {
              list.forEach(element => {
                this.currentChannel = element as Channel;
                console.log('channel is', this.currentChannel);
              });
              resolve();
            },
            error: (err) => {
              console.error('Fehler beim Laden der Kanäle:', err);
              reject(err);
            },
          });
        });

        this.filterPosts();
      } else {
        this.showErrorMessageForChannel = true;
        this.createNewMessage = false;
      }
    } finally {
      this.isProcessing = true;
      this.inputMessage = false;
    }
  }


  showErrorMessageForChannel: boolean = false;

  async getAllChannels() {
    // Unsubscribe von einer alten Subscription, falls vorhanden
    if (this.allChannelSubscription) {
      this.allChannelSubscription.unsubscribe();
    }

    const itemCollection = collection(this.firestore, 'channels');
    //const q = query(itemCollection, where("id", "==", channel.id));
    const channels$ = collectionData(itemCollection);

    // Abonniere das Observable und warte bis die Daten vollständig verarbeitet sind
    //await funktioniert nicht mit observables, Observables  müssen in ein Promise umgewandelt werden wie hier: return new Promise((resolve, reject) => {
    //Mehr dazu findest du in Readme unter dem Titel: "Promise und Observables"
    return new Promise<void>((resolve, reject) => { // Resolve das Promise, wenn die Verarbeitung abgeschlossen ist
      this.channelSubscription = channels$.subscribe({
        next: (list) => {
          list.forEach(element => {

            //this.currentChannel = element as Channel;
            console.log('channel is', this.currentChannel);

            this.channels.push(element);
          });
          resolve(); // Resolve das Promise, wenn die Verarbeitung abgeschlossen ist
        },
        error: (err) => {
          console.error('Fehler beim Laden der Kanäle:', err);
          reject(err); // Reject das Promise im Fehlerfall
        }
      });
    })


  }

  async filterPosts() {
    console.log('channels are', this.channels);

    const channelId = this.currentChannel.id;
    const itemCollection = collection(this.firestore, `channels/${channelId}/posts`);
    const q = query(itemCollection, orderBy('dateOfPost', 'asc')); // Sortierung nach 'dateOfPost'

    this.post$ = collectionData(q);

    if (this.postSubscription) {
      this.postSubscription.unsubscribe(); // Beende alte Subscription
    }

    this.postSubscription = this.post$.pipe(take(1)).subscribe(async (list) => {
      this.allPosts = []; // Setze das Array zurück, um Doppelungen zu vermeiden

      for (const element of list) {
        const post = new Post(element);

        // Konvertiere den Firestore Timestamp in ein Date-Objekt
        if (post.dateOfPost instanceof Timestamp) {
          post.dateOfPost = post.dateOfPost.toDate();
        }

        const authorOfPost = this.userFirebaseService.users.find(user => user.id === post.authorOfPost);

        if (authorOfPost) {
          post.authorName = authorOfPost.firstLastName; // Dynamisch das Feld hinzufügen
          post.email = authorOfPost.email;
        }

        const latestAnswer = await this.getLatestAnswer(channelId, post.id);
        post.latestAnswer = latestAnswer;

        //debugger;
        console.log('ttttttttime is', latestAnswer);


        // Länge der Antworten abrufen
        const answersLength = await this.getAnswersLength(post);
        post.lengthOfAnswers = answersLength;

        // Überprüfen, ob die Emoji-Collection leer ist
        if (!await this.checkIfCollectionIsEmpty(channelId, post.id)) {
          const emojiCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${post.id}/emoji`);
          // Beobachte die Emoji-Collection
          onSnapshot(emojiCollectionRef, (snapshot) => {
            if (!snapshot.empty) {
              const firstDoc = snapshot.docs[0];
              post.emojiInformations = firstDoc.data();
              console.log('Emoji-Daten wurden aktualisiert:', post.emojiInformations);
            }
          });
        }

        this.allPosts.push(post); // Füge den Post zur Liste hinzu
      }
    });
  }


  async getLatestAnswer(channelId: string, postId: string): Promise<any> {
    const answersCollection = collection(this.firestore, `channels/${channelId}/posts/${postId}/answer`);
    const q = query(answersCollection, orderBy('timeAnswerPosted', 'desc'), limit(1));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      // Falls Timestamp enthalten ist:
      if (data['timeAnswerPosted'] instanceof Timestamp) {
        data['timeAnswerPosted'] = data['timeAnswerPosted'].toDate();
      }
      return data;
    } else {
      return null; // keine Antwort vorhanden
    }
  }



  async filterChats() {
    console.log('channels are', this.channels);

    const channelId = this.currentChannel.id;
    const itemCollection = collection(this.firestore, `channels/${channelId}/posts`);
    const q = query(itemCollection, orderBy('dateOfPost', 'asc')); // Sortierung nach 'dateOfPost'

    this.post$ = collectionData(q);

    if (this.postSubscription) {
      this.postSubscription.unsubscribe(); // Beende alte Subscription
    }

    this.postSubscription = this.post$.pipe(take(1)).subscribe(async (list) => {
      this.allPosts = []; // Setze das Array zurück, um Doppelungen zu vermeiden

      for (const element of list) {
        const post = new Post(element);

        // Konvertiere den Firestore Timestamp in ein Date-Objekt
        if (post.dateOfPost instanceof Timestamp) {
          post.dateOfPost = post.dateOfPost.toDate();
        }

        const authorOfPost = this.userFirebaseService.users.find(user => user.id === post.authorOfPost);

        if (authorOfPost) {
          post.authorName = authorOfPost.firstLastName; // Dynamisch das Feld hinzufügen
          post.email = authorOfPost.email;
        }

        // Länge der Antworten abrufen
        const answersLength = await this.getAnswersLength(post);
        post.lengthOfAnswers = answersLength;

        // Überprüfen, ob die Emoji-Collection leer ist
        if (!await this.checkIfCollectionIsEmpty(channelId, post.id)) {
          const emojiCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${post.id}/emoji`);
          // Beobachte die Emoji-Collection
          onSnapshot(emojiCollectionRef, (snapshot) => {
            if (!snapshot.empty) {
              const firstDoc = snapshot.docs[0];
              post.emojiInformations = firstDoc.data();
              console.log('Emoji-Daten wurden aktualisiert:', post.emojiInformations);
            }
          });
        }

        this.allPosts.push(post); // Füge den Post zur Liste hinzu
      }
    });
  }

  async getAnswersLength(post: Post): Promise<number> {
    const channelId = this.currentChannel.id;

    const answerCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${post.id}/answer`);
    const q = query(answerCollectionRef, orderBy('timeAnswerPosted', 'asc')); // Sortierung nach 'dateOfPost'

    this.answer$ = collectionData(q);

    // Unsubscribe von einer alten Subscription, falls vorhanden
    if (this.answerSubscription) {
      this.answerSubscription.unsubscribe();
    }

    return new Promise<number>((resolve, reject) => {
      this.answerSubscription = this.answer$.pipe(take(1)).subscribe({
        next: (list) => {
          const answersLength = list.length; // Berechne die Länge der Antworten
          resolve(answersLength); // Gib die Anzahl zurück
        },
        error: (err) => {
          console.error('Fehler beim Laden der Antworten:', err);
          reject(err); // Fehlerbehandlung
        }
      });
    });
  }

  isLargeScreen: boolean = window.innerWidth > 1444;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLargeScreen = window.innerWidth > 1444;

  }

  openPost(post: Post) {

    debugger;

    if (this.isLargeScreen == false) {
      this.navigateToOPenedThreadForMobile();
    }

    //console.log('large screen', this.isLargeScreen);

    this.threadPost = post;

    const channelId = this.currentChannel.id;

    const answerCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${post.id}/answer`);
    const q = query(answerCollectionRef, orderBy('timeAnswerPosted', 'asc')); // Sortierung nach 'dateOfPost'

    this.answer$ = collectionData(q);

    if (this.answerSubscription) {
      this.answerSubscription.unsubscribe();  // Beende alte Subscription
    }

    this.answerSubscription = this.answer$.pipe(take(1)).subscribe((list) => {
      this.allAnswersOfCurrentOpenedThread = [];  // Setze das Array zurück, um Doppelungen zu vermeiden

      list.forEach(async (element) => {
        const answer = new Answer(element);

        // Konvertiere den Firestore Timestamp in ein Date-Objekt
        if (answer.timeAnswerPosted instanceof Timestamp) {
          answer.timeAnswerPosted = answer.timeAnswerPosted.toDate();
        }

        const authorOfPost = this.userFirebaseService.users.find(user => user.id === answer.authorOfAnswer);

        if (authorOfPost) {
          answer.authorName = authorOfPost.firstLastName;  // Dynamisch das Feld hinzufügen
        }
        // Überprüfen, ob die Emoji-Collection leer ist
        if (!await this.checkIfAnswerCollectionIsEmpty(channelId, post.id, answer.id)) {
          const emojiCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${post.id}/answer/${answer.id}/emoji`);
          // Beobachte die Emoji-Collection
          onSnapshot(emojiCollectionRef, (snapshot) => {
            if (!snapshot.empty) {
              const firstDoc = snapshot.docs[0];
              answer.emojiInformations = firstDoc.data();
              console.log('Emoji-Daten wurden aktualisiert:', answer.emojiInformations);
            }
          });
        }

        this.allAnswersOfCurrentOpenedThread.push(answer);

      });
    });

  }

  async ngOnDestroy() {
    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
      this.allPosts = [];
      this.currentChannel = null!;
    }

    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
      this.allMessages = [];

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

  /*initializeFirebaseApp() {
    this.firebaseApp = initializeApp(environment.firebase);
  }*/


  loadChannels() {
    const itemCollection = collection(this.firestore, 'channels');
    this.channelSubscription = collectionData(itemCollection).subscribe(list => {
      this.channels = list;
      //this.loadParticipants(); // Call after channels are loaded
    });
  }

  loadParticipants() {
    if (this.currentChannel && this.currentChannel.permittedUsers) {
      this.currentChannelParticipants = []; // Array leeren
      this.currentChannel.permittedUsers.forEach((permittedUser: any) => {
        const permittedUserOnChannel = this.userFirebaseService.users.find(user => user.id === permittedUser);
        if (permittedUserOnChannel) {
          this.currentChannelParticipants.push(permittedUserOnChannel);
        }
      });
      localStorage.setItem('currentChannel', JSON.stringify(this.currentChannelParticipants));
    } else {
      console.log('ups');

    }

  }




  loadChannelData() {
    // Beispiel, wie Sie firestore verwenden könnten
    const itemCollection = collection(this.firestore, 'channel');
    // Weitere Operationen...
  }



  async addChannelToFireStore(channel: Channel) {


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

  async addPostToFirestore(post: Post) {
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
    await setDoc(postDocRef, postJson).then(() => {
      console.log("Post set with custom ID: ", postDocRef.id);


      onSnapshot(postsCollectionRef, async (snapshot) => {

        this.allAnswersOfCurrentOpenedThread = [];

        console.log('Emoji Collection Updated');
        // Wenn sich die Emoji-Collection ändert, rufe filterPosts erneut auf
        // Abrufen aller Dokumente in der Emoji-Collection
        const querySnapshotForEmoji = await getDocs(postsCollectionRef);
        //////////////////

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


            this.allPosts.push(post);

          });
        });

      });



      const element = document.getElementById('scrollBehavior');
      element?.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
      });

    }).catch((error) => {
      console.error("Error setting post: ", error);
    });
  }


  async deletePost(post: Post) {
    const channelId = this.currentChannel.id;

    const postCollection = collection(this.firestore, `channels/${channelId}/posts`);


    const auth = getAuth();
    this.uid = auth.currentUser?.uid;
    debugger;
    if (this.uid === post.authorOfPost) {
      debugger;
      await deleteDoc(doc(this.firestore, `channels/${channelId}/posts`, post.id));


      onSnapshot(postCollection, async (snapshot) => {

        this.allAnswersOfCurrentOpenedThread = [];

        console.log('Emoji Collection Updated');
        // Wenn sich die Emoji-Collection ändert, rufe filterPosts erneut auf
        // Abrufen aller Dokumente in der Emoji-Collection
        const querySnapshotForEmoji = await getDocs(postCollection);
        //////////////////

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


            this.allPosts.push(post);

          });
        });

      });


    }


  }


  async deleteAnswer(answer: Answer) {
    const channelId = this.currentChannel.id;

    const answerCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${this.threadPost.id}/answer`);


    const auth = getAuth();
    this.uid = auth.currentUser?.uid;
    debugger;

    if (this.uid === answer.authorOfAnswer) {
      debugger;
      await deleteDoc(doc(this.firestore, `channels/${channelId}/posts/${this.threadPost.id}/answer`, answer.id));


      onSnapshot(answerCollectionRef, async (snapshot) => {

        this.allAnswersOfCurrentOpenedThread = [];

        console.log('Emoji Collection Updated');
        // Wenn sich die Emoji-Collection ändert, rufe filterPosts erneut auf
        // Abrufen aller Dokumente in der Emoji-Collection
        const querySnapshotForEmoji = await getDocs(answerCollectionRef);
        //////////////////

        this.answerSubscription = this.answer$.pipe(take(1)).subscribe((list) => {
          this.allAnswersOfCurrentOpenedThread = [];  // Setze das Array zurück, um Doppelungen zu vermeiden

          list.forEach(async (element) => {
            const answer = new Answer(element);

            // Konvertiere den Firestore Timestamp in ein Date-Objekt
            if (answer.timeAnswerPosted instanceof Timestamp) {
              answer.timeAnswerPosted = answer.timeAnswerPosted.toDate();
            }

            const authorOfPost = this.userFirebaseService.users.find(user => user.id === answer.authorOfAnswer);

            if (authorOfPost) {
              answer.authorName = authorOfPost.firstLastName;  // Dynamisch das Feld hinzufügen
            }


            this.allAnswersOfCurrentOpenedThread.push(answer);

          });
        });

      });



    }




  }

  async addEmojiToFirestore(emojiname: string, post: Post) {
    if (!this.currentChannel) {
      console.error('No current channel selected');
      return;
    }

    const channelId = this.currentChannel.id;
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

  async addAnswerEmojiToFirestore(emojiname: string, post: Post, answer: Answer) {
    if (!this.currentChannel) {
      console.error('No current channel selected');
      return;
    }


    const channelId = this.currentChannel.id;

    // Erstellen einer Referenz auf die Emoji-Collection
    const emojiCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${post.id}/answer/${answer.id}/emoji`);

    // Abrufen aller Dokumente in der Emoji-Collection
    const querySnapshot = await getDocs(emojiCollectionRef);

    if (await this.checkIfAnswerCollectionIsEmpty(channelId, post.id, answer.id)) {
      console.log('Die Emoji-Collection ist leer. Initialisiere das Dokument.');

      // Initialisieren des Emoji-Dokuments
      const emojiStats = {
        nerd: { emojiName: 'nerd', likeCount: [] },
        laugh: { emojiName: 'laugh', likeCount: 0 },
        rocket: { emojiName: 'rocket', likeCount: 0 },
        approved: { emojiName: 'approved', likeCount: 0 },
        handsUp: { emojiName: 'handsUp', likeCount: 0 },
      };



      //const emojiCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${post.id}/emoji`);

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
          answer.emojiInformations = firstDoc.data();  // Emoji-Informationen aktualisieren

          console.log(answer.emojiInformations);  // Debugging, um die aktuellen Daten zu sehen
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


  async addAnswerToFirestore(answer: Answer, post: Post) {
    if (!this.currentChannel) {
      console.error('No current channel selected');
      return;
    }

    const channelId = this.currentChannel.id;

    //const emojiCollectionRef = collection(this.firestore, `channels/${idOfPost}/emoji`);

    // Überprüfen, ob die Collection leer ist
    //getDocs(emojiCollectionRef).then(querySnapshot  => {

    // Erstellen einer Referenz auf die Emoji-Collection
    const answerCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${post.id}/answer`);

    // Hier generieren wir eine neue Dokument-Referenz ohne die ID explizit zu setzen, um eine eindeutige ID zu erstellen.
    const answerDocRef = doc(answerCollectionRef);

    // Setzt die ID des Channel-Objekts auf die ID der neuen Dokumentreferenz
    answer.id = answerDocRef.id;

    // Abrufen aller Dokumente in der Emoji-Collection
    const querySnapshot = await getDocs(answerCollectionRef);


    console.log('Die Emoji-Collection ist leer. Initialisiere das Dokument.');

    // Konvertiert das Channel-Objekt zu einem JSON-Objekt
    const answerJson = answer.toJson();

    setDoc(answerDocRef, answerJson).then(() => {
      console.log('Emoji-Dokument erfolgreich initialisiert.');


    }).catch(error => {
      console.error('Fehler beim Initialisieren des Emoji-Dokuments: ', error);
    });


    onSnapshot(answerCollectionRef, async (snapshot) => {

      this.allAnswersOfCurrentOpenedThread = [];

      console.log('Emoji Collection Updated');
      // Wenn sich die Emoji-Collection ändert, rufe filterPosts erneut auf
      // Abrufen aller Dokumente in der Emoji-Collection
      const querySnapshotForEmoji = await getDocs(answerCollectionRef);
      //////////////////

      this.answerSubscription = this.answer$.pipe(take(1)).subscribe((list) => {
        this.allAnswersOfCurrentOpenedThread = [];  // Setze das Array zurück, um Doppelungen zu vermeiden

        list.forEach(async (element) => {
          const answer = new Answer(element);

          // Konvertiere den Firestore Timestamp in ein Date-Objekt
          if (answer.timeAnswerPosted instanceof Timestamp) {
            answer.timeAnswerPosted = answer.timeAnswerPosted.toDate();
          }

          const authorOfPost = this.userFirebaseService.users.find(user => user.id === answer.authorOfAnswer);

          if (authorOfPost) {
            answer.authorName = authorOfPost.firstLastName;  // Dynamisch das Feld hinzufügen
          }


          this.allAnswersOfCurrentOpenedThread.push(answer);

        });
      });

    });


    /*onSnapshot(emojiCollectionRef, async (snapshot) => {
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
    });*/

  }



  async checkIfCollectionIsEmpty(channelId: string, idOfPost: string): Promise<boolean> {
    const emojiCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${idOfPost}/emoji`);
    console.log("Abfrage gestartet...");
    try {
      const querySnapshot = await getDocs(emojiCollectionRef);
      console.log("Anzahl der Dokumente:", querySnapshot.size);
      if (querySnapshot.empty) {
        console.log("Collection ist leer");
        return true;
      } else {
        console.log("Collection enthält Dokumente");
        return false;
      }
    } catch (error) {
      console.error("Fehler bei der Abfrage:", error);
      return false;
    }
  }

  async checkIfAnswerCollectionIsEmpty(channelId: string, idOfPost: string, idOfAnswer: string): Promise<boolean> {
    const answerCollectionRef = collection(this.firestore, `channels/${channelId}/posts/${idOfPost}/answer/${idOfAnswer}/emoji`);
    console.log("Abfrage gestartet...");
    try {
      const querySnapshot = await getDocs(answerCollectionRef);
      console.log("Anzahl der Dokumente:", querySnapshot.size);
      if (querySnapshot.empty) {
        console.log("Collection ist leer");
        return true;
      } else {
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


  getProfileInformations(userInformations: any) {
    debugger;
    if (userInformations.authorOfPost) {
      this.profileInformations = userInformations;
      const authorOfPost = this.userFirebaseService.users.find(user => user.id === userInformations.authorOfPost);
      this.profileInformations.online = authorOfPost.online;
    } else if (userInformations.authorOfMessage) {
      this.profileInformations = userInformations;
      const authorOfPost = this.userFirebaseService.users.find(user => user.id === userInformations.authorOfPost);
      this.profileInformations.online = authorOfPost.online;
    } else if (userInformations.firstLastName) {
      this.profileInformations = userInformations;
      const profileOwner = this.userFirebaseService.users.find(user => user.id === userInformations.id);
      this.profileInformations.online = profileOwner.online;
    }
  }


  /*getMyProfileInformations(userInformations: any) {
    if (userInformations.id) {
      this.profileInformations = userInformations;
      const profileOwner = this.userFirebaseService.users.find(user => user.id === userInformations.id);
      this.profileInformations.online = profileOwner.online;
    } else if (userInformations.authorOfMessage) {
      this.profileInformations = userInformations;
      const authorOfPost = this.userFirebaseService.users.find(user => user.id === userInformations.id);
      this.profileInformations.online = authorOfPost.online;
    }

  }*/

  createNewMessage: boolean = false;

  createMessage() {
    //debugger;
    this.showChannelResponsive = true;
    this.isVariableTrueForResponsive = false;

    //this.isVariableTrueForResponsive = false;
    this.activatePrivateChatTemplate = true;
    this.disclaimer = false;

    setTimeout(() => {
      this.ngOnDestroy();
      this.inputMessage = true;
      this.createNewMessage = true;
      this.openMessageToUserInformations = undefined;
      this.messageChoosedPerson = false;
      this.isProcessing = false;
    }, 1000);

    setTimeout(() => {
      this.ngOnDestroy();
    }, 1200);

  }

  messageSnapshot: any;

  async addMessageToFirestore(message: Message) {

    const auth = getAuth();
    this.uid = auth.currentUser?.uid;





    if (this.currentLobby) {

      //const messageDocRef = doc(this.firestore, 'messageLobby', this.currentLobby);  
      //this.messageSnapshot = await getDoc(messageDocRef);
      this.addMessageToMessageCollection(message);


    } else {
      try {
        const messagesLobbyRef = collection(this.firestore, 'messageLobby');
        debugger;

        // Erstellt eine neue Dokumentreferenz mit einer eindeutigen ID
        const newMessagesLobbyRef = doc(messagesLobbyRef);

        this.messageLobby.id = newMessagesLobbyRef.id;

        const messageLobbyJson = this.messageLobby.toJson();

        await setDoc(newMessagesLobbyRef, messageLobbyJson);

        debugger;

      } catch {
        console.log('err');

      } finally {
        await this.saveCollectionInsideMessageLobby(message);

      }
    }
  }

  async addMessageToMessageCollection(message: Message) {
    const messageRef = collection(this.firestore, `messageLobby/${this.currentLobby}/messages`);
    const newMessageRef = doc(messageRef);
    message.id = newMessageRef.id;
    const messageJson = message.toJson();

    await setDoc(newMessageRef, messageJson);
  }

  async saveCollectionInsideMessageLobby(message: Message) {
    const messagesRef = collection(this.firestore, `messageLobby/${this.messageLobby.id}/messages`);
    const newMessagesRef = doc(messagesRef);
    message.id = newMessagesRef.id;
    const messageToJson = message.toJson();
    await setDoc(newMessagesRef, messageToJson);
    this.saveLobbyInsideUserConversationsSender(message);
  }

  async saveLobbyInsideUserConversationsSender(message: Message) {
    const userDocRef = doc(this.firestore, 'user', this.uid);
    const UserData = (await getDoc(userDocRef)).data() as { [key: string]: any };
    const conversationsArray = UserData?.['conversations'] || [];

    await updateDoc(userDocRef, {
      [`conversations`]: arrayUnion(this.messageLobby.id)
    })

    await this.LobbyInsideUserConversationsRecipient();
  }



  async LobbyInsideUserConversationsRecipient() {
    debugger;
    const userDocRef = doc(this.firestore, 'user', this.openMessageToUserInformations.id);
    const UserData = (await getDoc(userDocRef)).data() as { [key: string]: any };
    const conversationsArray = UserData?.['conversations'] || [];

    await updateDoc(userDocRef, {
      [`conversations`]: arrayUnion(this.messageLobby.id)
    })
  }


  getText(index: number): string {
    return this.addParticipantTextMap[index] || 'Hinzufügen';
  }

  updateText(index: number, newText: string) {
    this.addParticipantTextMap[index] = newText;
  }

  async addUserToChannel(user: User, i: any) {

    this.updateText(i, 'Hinzugefügt!');

    const channelDocRef = doc(this.firestore, 'channels', this.currentChannel.id);
    const channelData = (await getDoc(channelDocRef)).data() as { [key: string]: any };
    const conversationsArray = channelData?.['conversations'] || [];

    await updateDoc(channelDocRef, {
      [`permittedUsers`]: arrayUnion(user.id)
    })
  }





  openMessageToUserInformations: any;



  openMessageToUser(entity: Post | User) {
    this.showChannelResponsive = true;

    const auth = getAuth();
    this.uid = auth.currentUser?.uid;

    if ('authorOfPost' in entity) {
      // Es handelt sich um ein Post-Objekt
      const authorOfPost = this.userFirebaseService.users.find(user => user.id === entity.authorOfPost);
      this.openMessageToUserInformations = authorOfPost;
    } else if (this.uid != entity.id) {
      // Es handelt sich um ein User-Objekt
      this.openMessageToUserInformations = entity;

    }


    //this.disclaimer = false;
    this.createNewMessage = false;
    this.ngOnDestroy();
    this.inputMessage = true;
    this.checkConversations();
  }


  async checkConversations(): Promise<void> {

    const auth = getAuth();
    this.uid = auth.currentUser?.uid;

    this.activatePrivateChatTemplate = true;
    if (this.uid != this.openMessageToUserInformations.id) {

      console.log('uid user', this.uid);
      console.log('recipient', this.openMessageToUserInformations);



      // Referenzen für beide Nutzer-Dokumente erstellen
      const user1DocRef = doc(this.firestore, 'user', this.uid);
      const user2DocRef = doc(this.firestore, 'user', this.openMessageToUserInformations.id);

      // Nutzer-Daten abrufen/Documents holen
      const user1Snapshot = await getDoc(user1DocRef);
      const user2Snapshot = await getDoc(user2DocRef);

      //Wir holen uns die Daten um mit ihnen zu arbeiten und exists checkt für uns ob diese Documents tatsächtlich existieren. 
      if (user1Snapshot.exists() && user2Snapshot.exists()) {
        const user1Data: any = user1Snapshot.data();
        const user2Data: any = user2Snapshot.data();

        // Conversations-Arrays extrahieren
        const user1Conversations: string[] = user1Data.conversations || [];
        const user2Conversations: string[] = user2Data.conversations || [];

        // Abfrage, um gemeinsame IDs zu finden

        const matchingIDs = user1Conversations.filter(id => user2Conversations.includes(id));
        if (matchingIDs.length > 0) {
          console.log('Gemeinsame Conversations:', matchingIDs);
          this.filterMessages(matchingIDs[0]);
          this.messageChoosedPerson = false;
        }
      } else {
        console.error('Eins oder beide User-Dokumente existieren nicht.');
        this.messageChoosedPerson = true;
      }
    }
    //this.messageChoosedPerson = false;
  }

  async filterMessages(lobby: string) {
    //this.ngOnDestroy();
    this.currentLobby = lobby;
    this.showChannelResponsive = true;

    const itemCollection = collection(this.firestore, `messageLobby/${lobby}/messages`);
    const q = query(itemCollection, orderBy('timeMessagePosted', 'asc')); // Sortierung nach 'timeMessagePosted'

    this.messages$ = collectionData(q);


    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe(); // Beende alte Subscription
    }

    this.messageSubscription = this.messages$.pipe(take(1)).subscribe(async (list) => {

      this.allMessages = []; // Setze das Array zurück, um Doppelungen zu vermeiden

      for (const element of list) {
        const message = new Message(element);

        // Konvertiere den Firestore Timestamp in ein Date-Objekt
        if (message.timeMessagePosted instanceof Timestamp) {
          message.timeMessagePosted = message.timeMessagePosted.toDate();
        }

        const authorOfPost = this.userFirebaseService.users.find(user => user.id === message.authorOfMessage);

        if (authorOfPost) {
          message.authorName = authorOfPost.firstLastName; // Dynamisch das Feld hinzufügen
        }
        this.allMessages.push(message); // Füge den Post zur Liste hinzu

        console.log('mission completed', this.allMessages);

      }
    });

  }


  private openDrawerSubject = new Subject<void>();

  openDrawer$ = this.openDrawerSubject.asObservable();


  triggerOpenDrawer() {
    this.openDrawerSubject.next();
  }


  /*await updateDoc(emojiDocRef, {
     [`${emojiname}.likeCount`]: arrayUnion(this.userFirebaseService.uid)
   }).then(() => {
     console.log(`Like-Count für ${emojiname} erfolgreich erhöht.`);
   }).catch(error => {
     console.error('Fehler beim Aktualisieren des Like-Counts: ', error);
   });*/
}