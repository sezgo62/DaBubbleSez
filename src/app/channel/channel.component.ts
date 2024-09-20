import { Component } from '@angular/core';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChannelFirebaseService } from '../channel-firebase.service';
import { userFirebaseService } from '../userFirebase.service';
import { Post } from 'src/models/post.class';
import { Timestamp } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {

  constructor(public channelFirebaseService: ChannelFirebaseService, public userFirebaseService: userFirebaseService, private datePipe: DatePipe) {

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
}
