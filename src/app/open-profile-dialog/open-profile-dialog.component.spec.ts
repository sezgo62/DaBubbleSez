import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenProfileDialogComponent } from './open-profile-dialog.component';

describe('OpenProfileDialogComponent', () => {
  let component: OpenProfileDialogComponent;
  let fixture: ComponentFixture<OpenProfileDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenProfileDialogComponent]
    });
    fixture = TestBed.createComponent(OpenProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
