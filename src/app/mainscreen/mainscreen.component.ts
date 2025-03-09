import { Component, ChangeDetectorRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateChannelDialogComponent } from '../create-channel-dialog/create-channel-dialog.component';
import { userFirebaseService } from '../userFirebase.service';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { ParticipantsDialogComponent } from '../dialogs/participants-dialog/participants-dialog.component';
import { ChannelFirebaseService } from '../channel-firebase.service';
import { Channel } from 'src/models/channel.class';
import { Post } from 'src/models/post.class';
import { FieldValue, serverTimestamp, Timestamp } from '@angular/fire/firestore';
import twemoji from 'twemoji';
import { Answer } from 'src/models/answers.class';
import { DrawerService } from '../drawer.service';
import { debounceTime, map, Subject } from 'rxjs';


@Component({
  selector: 'app-mainscreen',
  templateUrl: './mainscreen.component.html',
  styleUrls: ['./mainscreen.component.scss'],
})
export class MainscreenComponent implements OnInit {
  showFiller = false;
  sidenavOpen = false;
  showChannels = false;
  post: Post = new Post();
  answer: Answer = new Answer();
  public textArea: string = "";
  public isEmojiPickerVisible: boolean = false; //Diese Variable steuert, ob der Emoji-Picker sichtbar ist oder nicht. Wenn sie auf true gesetzt wird, wird der Emoji-Picker angezeigt; bei false wird er ausgeblendet.
  isLargeScreen: boolean = window.innerWidth > 1444;
  isSidenavOpen: boolean = false;
  searchControl = new FormControl('');
  items: string[] = ['aa', 'Apfel', 'Banane', 'Orange', 'Pfirsich', 'Traube']; // Beispiel-Daten
  filteredItems: any[] = [];
  filteredItemsAddParticipants: any[] = [];
  channelSelected: any;
  channelsCount: any;
  messagesCount: any;

  @ViewChild('drawer') drawer: MatDrawer | undefined;
  //@ViewChild('drawer2') drawer2: MatDrawer | undefined;

  constructor(private cdr: ChangeDetectorRef, public dialog: MatDialog, public userFirebaseService: userFirebaseService, public channelFirebaseService: ChannelFirebaseService, private drawerService: DrawerService) { }
  //um die sidenav zu schließen und zu öffnen, heisst ob es false oder true ist
  StyleSidenavButton() {
    if (this.sidenavOpen == false) {
      this.sidenavOpen = true;
      /*let sidenavIcon = document.getElementById('sidenavIcon') as HTMLElement;
      let sidenavDiv = document.getElementById('sidenav') as HTMLElement;
      if (this.sidenavOpen) {
        sidenavIcon.style.filter = 'invert(34%) sepia(77%) saturate(2175%) hue-rotate(228deg) brightness(98%) contrast(95%)';
        sidenavDiv.style.color = '#535AF1';
      }*/
    } else {
      this.sidenavOpen = false;
      /*let sidenavIcon = document.getElementById('sidenavIcon') as HTMLElement;
      let sidenavDiv = document.getElementById('sidenav') as HTMLElement;
      sidenavIcon.style.filter = '';
      sidenavDiv.style.color = '';*/
    }
  }

 toggleDrawer() {
    this.drawer?.toggle(); // TypeScript wird gezwungen, drawer als nicht undefined anzunehmen
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLargeScreen = window.innerWidth > 1444;
  }

  @ViewChild('drawer2') drawer2!: MatDrawer;


ngOnInit(): void {
  document.body.style.backgroundColor = '#ECEEFE';


  this.drawerService.openDrawer$.subscribe(() => {
    this.drawer2.open();
  });

   // Abonniere das Schließen des Drawers
   this.drawerService.closeDrawer$.subscribe(() => {
    this.drawer2.close();
  });


    // Filter-Logik mit debounceTime, um Verzögerungen zu minimieren und die Performance zu optimieren
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Wartezeit von 300ms nach jedem Input
      map(value => this.filterItems(value || ''))
    ).subscribe(filteredItems => {
      this.filteredItems = filteredItems;
      debugger;

    });

    this.userFirebaseService;
 }

 private filterItems(searchTerm: string): any[] {
  if (!searchTerm) {
    return [];
  }

  return this.channelFirebaseService.allExistingChannelsAndUsers
    .filter((element: any) => {
      const channelName = element.nameOfChannel ? element.nameOfChannel.toLowerCase() : '';
      const userName = element.firstLastName ? element.firstLastName.toLowerCase() : '';
      return channelName.includes(searchTerm.toLowerCase()) || userName.includes(searchTerm.toLowerCase());
    });
}

async redirectUserOrChannel(item: any) {
if(item.nameOfChannel) {
await this.channelFirebaseService.filterChannels(item);
this.channelFirebaseService.loadParticipants();
}

}




closeDrawer() {
  this.drawer2.close();  // Schließt das Drawer
}

  dropChannels() {
    if (this.showChannels == false) {
      this.showChannels = true;
      this.cdr.detectChanges();

    } else {
      this.showChannels = false;
      this.cdr.detectChanges();
      return;
    }
    if (this.channelsCount != undefined) {
      this.StyleSelectedChannel(this.channelSelected, this.channelsCount);
    }
  }


  dropMessages() {
    if (this.showMessages == false) {
      this.showMessages = true;
      this.cdr.detectChanges();

    } else {
      this.showMessages = false;
      this.cdr.detectChanges();
      return;
    }
    if (this.messagesCount != undefined) {
      this.StyleSelectedMessageOnDropdown(this.channelSelected, this.messagesCount);
    }
  }


  



  StyleSelectedChannel(i: any, channelsCount: any) {
    this.channelsCount = channelsCount;
    for (let j = 0; j < channelsCount; j++) {

      let styledElement = document.getElementById(`channel${j}`) as HTMLElement;

      styledElement.style.filter = '';
    }


    if (i != undefined || i != this.channelSelected) {
      let styledElement = document.getElementById(`channel${i}`) as HTMLElement | null;
      this.channelSelected = i;

      if (styledElement) {
        if (styledElement.style.filter) {
          styledElement.style.filter = '';
        } else {
          styledElement.style.filter = 'invert(34%) sepia(77%) saturate(2175%) hue-rotate(228deg) brightness(98%) contrast(95%)';
        }
      } else {

      }
    }
  }

  StyleSelectedMessageOnDropdown(i: any, messagesCount: any) {
    this.messagesCount = messagesCount;
    for (let j = 0; j < messagesCount; j++) {

      let styledElement = document.getElementById(`channel${j}`) as HTMLElement;

      styledElement.style.filter = '';
    }


    if (i != undefined || i != this.channelSelected) {
      let styledElement = document.getElementById(`channel${i}`) as HTMLElement | null;
      this.channelSelected = i;

      if (styledElement) {
        if (styledElement.style.filter) {
          styledElement.style.filter = '';
        } else {
          styledElement.style.filter = 'invert(34%) sepia(77%) saturate(2175%) hue-rotate(228deg) brightness(98%) contrast(95%)';
        }
      } else {

      }
    }
  }

  async selectedChannel(channel: Channel) {
    //this.channelFirebaseService.currentChannelParticipants = channel;
   
    
    await  this.channelFirebaseService.filterChannels(channel);

    this.channelFirebaseService.loadParticipants();
    //debugger;
  }

  showMessages: boolean = false;

  getImage() {
    const storage = getStorage();
    getDownloadURL(ref(storage, 'images/stars.jpg'))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();

        // Or inserted into an <img> element
        const img = document.getElementById('myimg');
        img?.setAttribute('src', url);
      })
      .catch((error) => {
        // Handle any errors
      });
  }

  sendPost(message: string) {
    debugger;
   this.post.authorOfPost = this.userFirebaseService.uid;
   this.post.dateOfPost = serverTimestamp() // Serverseitiger Zeit
   this.post.textOfPost = message;
   this.post.emojiOfPost;
   this.post.id = '';
   this.channelFirebaseService.addPostToFirestore(this.post);
  }

sendAnswer(answerMessage: string) {
  this.answer.authorOfAnswer = this.userFirebaseService.uid;
   this.answer.timeAnswerPosted = serverTimestamp() // Serverseitiger Zeit
   this.answer.answerText = answerMessage;
   this.answer.emojiOfAnswer;
   this.answer.id = '';
   this.channelFirebaseService.addAnswerToFirestore(this.answer, this.channelFirebaseService.threadPost);
  }




  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CreateChannelDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '950px',
      height: '458px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }



  openDialogToParticipants(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ParticipantsDialogComponent, {
      panelClass: 'participant-dialog-container',
      width: '950px',
      height: '680px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  public toggleEmojiPicker(): void {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible; // Umschalten der Sichtbarkeit des Emoji-Pickers
  }

  public addEmoji(event: any) {
    this.textArea += event.emoji.native; // Emoji wird dem Text hinzugefügt
    this.isEmojiPickerVisible = false; // Picker wird nach Auswahl ausgeblendet
}



getFormattedDate(post: Post): string {
  let date: Date;
  let time: Date;
  if (post.dateOfPost instanceof Timestamp) {
    // Wenn es ein Timestamp ist, konvertiere es in ein Date
    date = post.dateOfPost.toDate();
  } else if (post.dateOfPost instanceof Date) {
    // Wenn es bereits ein Date ist, verwenden wir es direkt
    date = post.dateOfPost;
  } else {
    // Falls es ein FieldValue (serverTimestamp) ist, geben wir eine Platzhalterzeit oder eine andere Nachricht zurück
    return 'Zeitstempel wird generiert...'; // oder eine leere Zeichenkette
  }

  // Formatieren des Datums als String, z.B. 'dd. MMMM yyyy'
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

   // Formatieren der Uhrzeit als String, z.B. 'HH:mm'
}

getFormattedTime(post: Post): string {
  let date: Date;

  if (post.dateOfPost instanceof Timestamp) {
      date = post.dateOfPost.toDate();
  } else if (post.dateOfPost instanceof Date) {
      date = post.dateOfPost;
  } else {
      return 'Zeitstempel wird generiert...';
  }

  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

getFormattedTimeAnswer(answer: Answer): string {
  let date: Date;

  if (answer.timeAnswerPosted instanceof Timestamp) {
      date = answer.timeAnswerPosted.toDate();
  } else if (answer.timeAnswerPosted instanceof Date) {
      date = answer.timeAnswerPosted;
  } else {
      return 'Zeitstempel wird generiert...';
  }

  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}


blatest() {
  if(this.channelFirebaseService.isVariableTrueForResponsive == true) {
    this.channelFirebaseService.isVariableTrueForResponsive = false;
  } else {
    this.channelFirebaseService.isVariableTrueForResponsive = true;
  }
}

}

