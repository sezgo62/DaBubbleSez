import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
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
  public textArea: string = "";
  public isEmojiPickerVisible: boolean = false; //Diese Variable steuert, ob der Emoji-Picker sichtbar ist oder nicht. Wenn sie auf true gesetzt wird, wird der Emoji-Picker angezeigt; bei false wird er ausgeblendet.


  constructor(private cdr: ChangeDetectorRef, public dialog: MatDialog, public userFirebaseService: userFirebaseService, public channelFirebaseService: ChannelFirebaseService) { }
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

ngOnInit(): void {
  document.body.style.backgroundColor = '#ECEEFE';

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

  channels = ['# Entwicklerteam', '# javascript', '# CSS'];

  channelSelected: any;

  channelsCount: any;



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
   this.post.authorOfPost = this.userFirebaseService.uid;
   this.post.id = '';
   this.channelFirebaseService.addPostToFirestore(this.post);
  }

  dropMessages() {
    /*if (this.showMessages == false) {
      this.showMessages = true;
      this.cdr.detectChanges();

    } else {
      this.showMessages = false;
this.cdr.detectChanges();
return;
    }
    if (this.channelsCount != undefined) {
      this.selectChannel(this.channelSelected, this.channelsCount);
    }
  }*/
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
}

