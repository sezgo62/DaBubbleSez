import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenedThreadComponent } from './opened-thread.component';

describe('OpenedThreadComponent', () => {
  let component: OpenedThreadComponent;
  let fixture: ComponentFixture<OpenedThreadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenedThreadComponent]
    });
    fixture = TestBed.createComponent(OpenedThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
