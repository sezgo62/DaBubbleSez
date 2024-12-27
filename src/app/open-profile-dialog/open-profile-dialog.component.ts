import { Component } from '@angular/core';
import { ChannelFirebaseService } from '../channel-firebase.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-open-profile-dialog',
  templateUrl: './open-profile-dialog.component.html',
  styleUrls: ['./open-profile-dialog.component.scss']
})
export class OpenProfileDialogComponent {

constructor(public channelFirebaseService: ChannelFirebaseService, private dialogRef: MatDialogRef<OpenProfileDialogComponent>) {}

closeDialog() {
  this.dialogRef.close();
}
}
