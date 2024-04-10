import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  // Initialisiert ein privates BehaviorSubject mit null. Ein BehaviorSubject hält den aktuellen Wert und gibt ihn an alle Abonnenten aus, sobald sie abonnieren.
  private userSubject = new BehaviorSubject<User | null>(null);
  private passwordSubject = new BehaviorSubject<string | null>(null);

  // Öffentliche Observable, die von anderen Teilen der App abonniert werden kann, um User-Updates zu erhalten.
  user$ = this.userSubject.asObservable();
  password$ = this.passwordSubject.asObservable();

  constructor() { }

  // Methode, um den aktuellen User zu aktualisieren. Jeder Aufruf dieser Methode sendet den neuen User-Wert an alle Abonnenten.
  updateUser(user: User, password: string) {
    this.userSubject.next(user);
    this.passwordSubject.next(password);

  }

  // Methode zum Zurücksetzen des User auf null
  clearUser() {
    this.userSubject.next(null);
  }
}
