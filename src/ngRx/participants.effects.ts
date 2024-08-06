import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { setCurrentChannelParticipants } from './participants.actions';
import { catchError, map, of } from 'rxjs';

@Injectable()
export class ParticipantsEffects {
  // Ein Effect, der ohne externe Datenquelle arbeitet
  loadParticipants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setCurrentChannelParticipants),
      map(action => {
        // Verwenden Sie hier die Teilnehmer, die bereits im Store oder `localStorage` sind.
        // Kein Abrufen von externen Daten
        const participants = this.getParticipantsFromLocalStorage();
        return setCurrentChannelParticipants({ currentChannelParticipants: participants });
      }),
      //catchError(error => of(setCurrentChannelParticipants({ currentChannelParticipants: [], error })))
    )
  );

  constructor(private actions$: Actions) {}

  // Beispielmethode zum Abrufen von Teilnehmern aus dem localStorage
  private getParticipantsFromLocalStorage(): any[] {
    const storedParticipants = localStorage.getItem('participantsState');
    return storedParticipants ? JSON.parse(storedParticipants).currentChannelParticipants : [];
  }
}
