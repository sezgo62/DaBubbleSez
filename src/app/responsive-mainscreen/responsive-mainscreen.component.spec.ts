import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveMainscreenComponent } from './responsive-mainscreen.component';

describe('ResponsiveMainscreenComponent', () => {
  let component: ResponsiveMainscreenComponent;
  let fixture: ComponentFixture<ResponsiveMainscreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResponsiveMainscreenComponent]
    });
    fixture = TestBed.createComponent(ResponsiveMainscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
