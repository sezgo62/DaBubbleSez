import { createReducer, on } from '@ngrx/store';
import { setCurrentChannelParticipants } from './participants.actions';

export interface ParticipantsState {
  currentChannelParticipants: any[];
  error: any;
}

export const initialState: ParticipantsState = {
  currentChannelParticipants: [],
  error: null
};

export const participantsReducer = createReducer(
  initialState,
  on(setCurrentChannelParticipants, (state, { currentChannelParticipants }) => ({
    ...state,
    currentChannelParticipants,
    error: null
  }))
);
