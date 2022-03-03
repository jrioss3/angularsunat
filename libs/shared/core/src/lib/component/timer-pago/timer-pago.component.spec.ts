import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerPagoComponent } from './timer-pago.component';

describe('TimerPagoComponent', () => {
  let component: TimerPagoComponent;
  let fixture: ComponentFixture<TimerPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
