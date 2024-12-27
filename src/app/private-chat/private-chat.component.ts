import { Component } from '@angular/core';
import { debounceTime, map } from 'rxjs';
import { ChannelFirebaseService } from '../channel-firebase.service';
import { FormControl } from '@angular/forms';
import { userFirebaseService } from '../userFirebase.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.scss']
})
export class PrivateChatComponent {

  searchControl = new FormControl('');
  items: string[] = ['aa', 'Apfel', 'Banane', 'Orange', 'Pfirsich', 'Traube']; // Beispiel-Daten
  filteredItems: any[] = [];


constructor(public channelFirebaseService: ChannelFirebaseService, public userFirebaseService: userFirebaseService) {

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
  
getFormattedTimeAnswer(answer: any): string {
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


}
