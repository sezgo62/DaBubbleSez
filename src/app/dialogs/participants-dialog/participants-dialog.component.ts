import { Component } from '@angular/core';
import { ChannelFirebaseService } from 'src/app/channel-firebase.service';
import { userFirebaseService } from 'src/app/userFirebase.service';

@Component({
  selector: 'app-participants-dialog',
  templateUrl: './participants-dialog.component.html',
  styleUrls: ['./participants-dialog.component.scss']
})
export class ParticipantsDialogComponent {

  ChannelEditinputTurnedOn: boolean = true;
  decriptionEditinputTurnedOn: boolean = true;

constructor(public channelFirebaseService: ChannelFirebaseService, public userFirebaseService: userFirebaseService) {

}

  changeChannelName() {
    this.ChannelEditinputTurnedOn = false;
  }
  saveChannelName() {
    this.ChannelEditinputTurnedOn = true;
  }


  editDescription() {
    this.decriptionEditinputTurnedOn = false;
    let editDescriptionStyle = document.getElementById('channelDescriptionContainer');
    if (editDescriptionStyle) {
      editDescriptionStyle.style.border = 'none';
    }  }
  saveDescription() {
    this.decriptionEditinputTurnedOn = true;
    let editDescriptionStyle = document.getElementById('channelDescriptionContainer');
    if (editDescriptionStyle) {
      editDescriptionStyle.style.border = 'solid 1px #535AF1';
  }
}

}
