import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',  // Dies macht den Service in der gesamten Anwendung verfügbar
})
export class DrawerService {
  private openDrawerSubject = new Subject<void>();
  private closeDrawerSubject = new Subject<void>();

  openDrawer$ = this.openDrawerSubject.asObservable();
  closeDrawer$ = this.closeDrawerSubject.asObservable();

  triggerOpenDrawer() {
    this.openDrawerSubject.next();
  }

  triggerCloseDrawer() {
    this.closeDrawerSubject.next();
  }


}
