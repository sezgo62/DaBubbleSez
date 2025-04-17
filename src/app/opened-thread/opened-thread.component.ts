import { Component } from '@angular/core';
import { ChannelFirebaseService } from '../channel-firebase.service';
import { userFirebaseService } from '../userFirebase.service';
import { Post } from 'src/models/post.class';
import { serverTimestamp, Timestamp } from '@angular/fire/firestore';
import { Answer } from 'src/models/answers.class';

@Component({
  selector: 'app-opened-thread',
  templateUrl: './opened-thread.component.html',
  styleUrls: ['./opened-thread.component.scss']
})
export class OpenedThreadComponent {

  public isEmojiPickerVisible: boolean = false; //Diese Variable steuert, ob der Emoji-Picker sichtbar ist oder nicht. Wenn sie auf true gesetzt wird, wird der Emoji-Picker angezeigt; bei false wird er ausgeblendet.
  public textArea: string = "";
  answer: Answer = new Answer();


constructor(public channelFirebaseService: ChannelFirebaseService, public userFirebaseService: userFirebaseService) {

}



sendAnswer(answerMessage: string) {
    this.answer.authorOfAnswer = this.userFirebaseService.uid;
    this.answer.timeAnswerPosted = serverTimestamp() // Serverseitiger Zeit
    this.answer.answerText = answerMessage;
    this.answer.emojiOfAnswer;
    this.answer.id = '';
    this.channelFirebaseService.addAnswerToFirestore(this.answer, this.channelFirebaseService.threadPost);
  }


public toggleEmojiPicker(): void {
  this.isEmojiPickerVisible = !this.isEmojiPickerVisible; // Umschalten der Sichtbarkeit des Emoji-Pickers
}

public addEmoji(event: any) {
  this.textArea += event.emoji.native; // Emoji wird dem Text hinzugefügt
  this.isEmojiPickerVisible = false; // Picker wird nach Auswahl ausgeblendet
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

    getFormattedDateForAnswer(answer: Answer): string {
      let date: Date;
      let time: Date;
      if (answer.timeAnswerPosted instanceof Timestamp) {
        // Wenn es ein Timestamp ist, konvertiere es in ein Date
        date = answer.timeAnswerPosted.toDate();
      } else if (answer.timeAnswerPosted instanceof Date) {
        // Wenn es bereits ein Date ist, verwenden wir es direkt
        date = answer.timeAnswerPosted;
      } else {
        // Falls es ein FieldValue (serverTimestamp) ist, geben wir eine Platzhalterzeit oder eine andere Nachricht zurück
        return 'Zeitstempel wird generiert...'; // oder eine leere Zeichenkette
      }
  
      // Formatieren des Datums als String, z.B. 'dd. MMMM yyyy'
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
  
      // Formatieren der Uhrzeit als String, z.B. 'HH:mm'
    }



}
