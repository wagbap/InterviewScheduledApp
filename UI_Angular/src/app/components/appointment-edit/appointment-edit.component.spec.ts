import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentEditComponent } from './AppointmentEditComponent';

describe('AppointmentEditComponent', () => {
  let component: AppointmentEditComponent;
  let fixture: ComponentFixture<AppointmentEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentEditComponent]
    });
    fixture = TestBed.createComponent(AppointmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
