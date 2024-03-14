import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent {

  selectedAvatar = '';

  allAvatars = new Array(5).fill(0); // .fill(0) füllt das Array mit dem Wert 0, der Wert ist in diesem Fall aber irrelevant
// Das Array hat 5 künstliche Stellen um welches dann jeweils im ngFor alle Bilder nacheinander abgebildet werden.

selectImage(image: number) {
}


}
