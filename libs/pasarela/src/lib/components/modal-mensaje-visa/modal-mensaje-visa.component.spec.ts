import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMensajeVisaComponent } from './modal-mensaje-visa.component';

describe('ModalMensajeVisaComponent', () => {
  let component: ModalMensajeVisaComponent;
  let fixture: ComponentFixture<ModalMensajeVisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMensajeVisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMensajeVisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
