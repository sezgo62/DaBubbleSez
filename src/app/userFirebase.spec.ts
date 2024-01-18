import { TestBed } from '@angular/core/testing';
import { userFirebaseService } from './userFirebase.service';


describe('FirebaseService', () => {
  let service: userFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(userFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
