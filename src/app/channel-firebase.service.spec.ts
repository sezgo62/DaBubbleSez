import { TestBed } from '@angular/core/testing';

import { ChannelFirebaseService } from './channel-firebase.service';

describe('ChannelFirebaseService', () => {
  let service: ChannelFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
