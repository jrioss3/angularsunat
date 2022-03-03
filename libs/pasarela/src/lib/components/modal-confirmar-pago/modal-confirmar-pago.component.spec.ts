import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmarPagoComponent } from './modal-confirmar-pago.component';

describe('ModalConfirmarPagoComponent', () => {
  let component: ModalConfirmarPagoComponent;
  let fixture: ComponentFixture<ModalConfirmarPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalConfirmarPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmarPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
