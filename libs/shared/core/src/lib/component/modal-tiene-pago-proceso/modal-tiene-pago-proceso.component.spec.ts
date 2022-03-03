import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTienePagoProcesoComponent } from './modal-tiene-pago-proceso.component';

describe('ModalTienePagoProcesoComponent', () => {
  let component: ModalTienePagoProcesoComponent;
  let fixture: ComponentFixture<ModalTienePagoProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTienePagoProcesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTienePagoProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
