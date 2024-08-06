import { createAction, props } from '@ngrx/store';

export const setCurrentChannelParticipants = createAction(
  '[Channel] Set Current Channel Participants',
  props<{ currentChannelParticipants: any[] }>()
);
