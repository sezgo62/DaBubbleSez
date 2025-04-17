import { Component, HostListener, ViewChild } from '@angular/core';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChannelFirebaseService } from '../channel-firebase.service';
import { userFirebaseService } from '../userFirebase.service';
import { Post } from 'src/models/post.class';
import { serverTimestamp, Timestamp } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { OpenProfileDialogComponent } from '../open-profile-dialog/open-profile-dialog.component';
import { MatDrawer } from '@angular/material/sidenav';
import { DrawerService } from '../drawer.service';
import { OpenedThreadComponent } from '../opened-thread/opened-thread.component';


@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {

  post: Post = new Post();


// Zugriff auf das MatDrawer-Element
@ViewChild('drawer2') drawer2!: MatDrawer;

  constructor(public channelFirebaseService: ChannelFirebaseService, public userFirebaseService: userFirebaseService, private datePipe: DatePipe, public dialog: MatDialog,public dialogOpenThread: MatDialog, private drawerService: DrawerService) {

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


// Methode zum Öffnen des Drawers
openDrawer() {
  this.drawerService.triggerOpenDrawer();  // Löst das Öffnen des Drawers aus
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

  public textArea: string = "";
  public isEmojiPickerVisible: boolean = false; //Diese Variable steuert, ob der Emoji-Picker sichtbar ist oder nicht. Wenn sie auf true gesetzt wird, wird der Emoji-Picker angezeigt; bei false wird er ausgeblendet.


  public addEmoji(event: any) {
    //-------this.textArea = `${this.textArea}${event.emoji.native}`;------- //event.emoji.native enthält das ausgewählte Emoji als String.
    //this.textArea${event.emoji.native} ist ein Template-String (auch bekannt als Template-Literal) in JavaScript/TypeScript, der den aktuellen Inhalt von textArea (${this.textArea}) mit dem ausgewählten Emoji (${event.emoji.native}) kombiniert.
    this.isEmojiPickerVisible = false;
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(OpenProfileDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '950px',
      height: '458px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  
isLargeScreen: boolean = window.innerWidth > 1444;

@HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLargeScreen = window.innerWidth > 1444;

  }

  openDialogForOPenedThread(enterAnimationDuration: string, exitAnimationDuration: string): void {
    if(this.isLargeScreen == false) {
      this.dialog.open(OpenedThreadComponent, {
        panelClass: 'custom-dialog-container',
        width: '950px',
        height: '458px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
    }
   
  }

}
