import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Post } from 'src/models/post.class';
import { userFirebaseService } from '../userFirebase.service';
import { ChannelFirebaseService } from '../channel-firebase.service';
import { CreateChannelDialogComponent } from '../create-channel-dialog/create-channel-dialog.component';
import { Channel } from 'src/models/channel.class';
import { FormControl } from '@angular/forms';
import { debounceTime, map } from 'rxjs';

@Component({
  selector: 'app-responsive-mainscreen',
  templateUrl: './responsive-mainscreen.component.html',
  styleUrls: ['./responsive-mainscreen.component.scss']
})
export class ResponsiveMainscreenComponent implements OnInit {
  showFiller = false;
  sidenavOpen = false;
  showChannels = false;
  post: Post = new Post();
  public textArea: string = "";
  public isEmojiPickerVisible: boolean = false; //Diese Variable steuert, ob der Emoji-Picker sichtbar ist oder nicht. Wenn sie auf true gesetzt wird, wird der Emoji-Picker angezeigt; bei false wird er ausgeblendet.
  isLargeScreen: boolean = window.innerWidth > 1444;
  isSidenavOpen: boolean = false;
  channelSelected: any;
  channelsCount: any;
  showMessages: boolean = false;
  messagesCount: any;
  isVariableTrueForResponsive: boolean = false;
    searchControl = new FormControl('');
    filteredItems: any[] = [];


  constructor(public dialog: MatDialog, public userFirebaseService: userFirebaseService, public channelFirebaseService: ChannelFirebaseService, private cdr: ChangeDetectorRef) { }

ngOnInit(): void {
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

  async selectedChannel(channel: Channel) {
    //this.channelFirebaseService.currentChannelParticipants = channel;
   
    
    await  this.channelFirebaseService.filterChannels(channel);

    this.channelFirebaseService.loadParticipants();
    //debugger;
  }

  //dropMessages() {
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
  }
  }*/

  dropChannels() {
    if (this.showChannels == false) {
      this.showChannels = true;
      //this.cdr.detectChanges();

    } else {
      this.showChannels = false;
      //this.cdr.detectChanges();
      return;
    }
    if (this.channelsCount != undefined) {
      this.StyleSelectedChannel(this.channelSelected, this.channelsCount);
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

  toggleMainscreen() {
    debugger;
    if(this.channelFirebaseService.isVariableTrueForResponsive == true) {
      this.channelFirebaseService.isVariableTrueForResponsive = false;
    } else {
      this.channelFirebaseService.isVariableTrueForResponsive = true;
    }
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



}
