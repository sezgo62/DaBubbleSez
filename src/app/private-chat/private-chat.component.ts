import { Component } from '@angular/core';
import { debounceTime, map } from 'rxjs';
import { ChannelFirebaseService } from '../channel-firebase.service';
import { FormControl } from '@angular/forms';
import { userFirebaseService } from '../userFirebase.service';
import { serverTimestamp, Timestamp } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';
import { Message } from 'src/models/message.class';
import { OpenProfileDialogComponent } from '../open-profile-dialog/open-profile-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.scss']
})
export class PrivateChatComponent {


  searchControl = new FormControl('');
  items: string[] = ['aa', 'Apfel', 'Banane', 'Orange', 'Pfirsich', 'Traube']; // Beispiel-Daten
  filteredItems: any[] = [];


  constructor(public channelFirebaseService: ChannelFirebaseService, public userFirebaseService: userFirebaseService, public dialog: MatDialog) {

  }

  public textArea: string = "";
  public isEmojiPickerVisible: boolean = false; //Diese Variable steuert, ob der Emoji-Picker sichtbar ist oder nicht. Wenn sie auf true gesetzt wird, wird der Emoji-Picker angezeigt; bei false wird er ausgeblendet.


  public addEmoji(event: any) {
    //-------this.textArea = `${this.textArea}${event.emoji.native}`;------- //event.emoji.native enthält das ausgewählte Emoji als String.
    //this.textArea${event.emoji.native} ist ein Template-String (auch bekannt als Template-Literal) in JavaScript/TypeScript, der den aktuellen Inhalt von textArea (${this.textArea}) mit dem ausgewählten Emoji (${event.emoji.native}) kombiniert.
    this.isEmojiPickerVisible = false;
  }

  ngOnInit(): void {


    // Filter-Logik mit debounceTime, um Verzögerungen zu minimieren und die Performance zu optimieren
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Wartezeit von 300ms nach jedem Input
      map(value => this.filterItems(value || ''))
    ).subscribe(filteredItems => {
      this.filteredItems = filteredItems;
      debugger;

    });
  }


getFormattedDate(message: Message): string {
    let date: Date;
    let time: Date;
    if (message.timeMessagePosted instanceof Timestamp) {
      // Wenn es ein Timestamp ist, konvertiere es in ein Date
      date = message.timeMessagePosted.toDate();
    } else if (message.timeMessagePosted instanceof Date) {
      // Wenn es bereits ein Date ist, verwenden wir es direkt
      date = message.timeMessagePosted;
    } else {
      // Falls es ein FieldValue (serverTimestamp) ist, geben wir eine Platzhalterzeit oder eine andere Nachricht zurück
      return 'Zeitstempel wird generiert...'; // oder eine leere Zeichenkette
    }

    // Formatieren des Datums als String, z.B. 'dd. MMMM yyyy'
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

     // Formatieren der Uhrzeit als String, z.B. 'HH:mm'
  }


  getFormattedTime(message: any): string {
    let date: Date;

    if (message.timeMessagePosted instanceof Timestamp) {
      date = message.timeMessagePosted.toDate();
    } else if (message.timeMessagePosted instanceof Date) {
      date = message.timeMessagePosted;
    } else {
      return 'Zeitstempel wird generiert...';
    }

    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
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

  chooseRecipientOfMessage(Recipient: User) {

  }

  message: Message = new Message();


  sendMessage(messageText: string) {
    this.channelFirebaseService.inputMessage = true;
    debugger;
    this.message.textOfMessage = messageText;
    this.message.timeMessagePosted = serverTimestamp() // Serverseitiger Zeit
    this.message.authorOfMessage = this.userFirebaseService.uid
    this.channelFirebaseService.addMessageToFirestore(this.message);
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

}
