import { Component } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'src/models/channel.class';
import { ChannelFirebaseService } from '../channel-firebase.service';

@Component({
  selector: 'app-create-channel-dialog',
  templateUrl: './create-channel-dialog.component.html',
  styleUrls: ['./create-channel-dialog.component.scss']
})
export class CreateChannelDialogComponent {

  channel: Channel = new Channel();

  constructor(public dialogRef: MatDialogRef<CreateChannelDialogComponent>, public channelFirebasService: ChannelFirebaseService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  currentDate!: any;

  createChannel(channelName: string, channelDescription: string) {

    const auth = getAuth();
    const currentUser = auth.currentUser?.uid
    this.channel.authorOfChannel = currentUser || 'unknown';
    this.channel.nameOfChannel = channelName;
    this.channel.description = channelDescription;

   // Aktuelles Datum und Uhrzeit in der europäischen Zeitzone (Berlin)
   const creationDate = new Date();

   // Formatierung der Uhrzeit und des Datums in der europäischen Zeitzone (Berlin)
   const options: Intl.DateTimeFormatOptions = {
     timeZone: 'Europe/Berlin',
     year: 'numeric',
     month: '2-digit',
     day: '2-digit',
     hour: '2-digit',
     minute: '2-digit',
     second: '2-digit',
     hour12: false
   };

   const europeanTimeFormatter = new Intl.DateTimeFormat('de-DE', options);
   const formattedParts = europeanTimeFormatter.formatToParts(creationDate);

   let day, month, year, hour, minute, second;
   formattedParts.forEach(({ type, value }) => {
     switch (type) {
       case 'day': day = value; break;
       case 'month': month = value; break;
       case 'year': year = value; break;
       case 'hour': hour = value; break;
       case 'minute': minute = value; break;
       case 'second': second = value; break;
     }
   });

   // Zusammenfügen zu einem ISO-ähnlichen String (ohne Millisekunden)
   const formattedDate = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

   console.log('Formatted Date:', formattedDate);

   // Erstellen eines neuen Date-Objekts aus dem formatierten String
   const europeanDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);

   console.log('euro Date:', europeanDate);


    // Setzen der Channel-Eigenschaften
    this.channel.authorOfChannel = currentUser || 'unknown';
    this.channel.nameOfChannel = channelName;
    this.channel.description = channelDescription;
    this.channel.dateOfCreation = Timestamp.fromDate(europeanDate) // Umwandlung in Timestamp;
    
debugger;

    console.log(this.channel);

    this.channelFirebasService.addChannelToFireStore(this.channel);
    //console.log(channelName, channelDescription);



    /*this.newUser.firstLastName = this.userDetailsForm.get('firstLastName')?.value;
    this.newUser.email = this.userDetailsForm.get('email')?.value;
    const password = this.userDetailsForm.get('password')?.value;

    // Diese Methode wird aufgerufen, wenn das Formular abgeschickt wird. Sie aktualisiert den User im Service und navigiert zur nächsten Seite.
    this.userDataService.updateUser(this.newUser, password); // Ruft updateUser auf dem Service auf, übergibt den neuen User
    this.router.navigate(['/uploadImage']); // Navigiert programmatisch zur UploadImage-Komponente
  }*/
  }

}

