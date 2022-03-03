import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalObtenerPagosComponent } from './modal-obtener-pagos.component';

describe('ModalObtenerPagosComponent', () => {
  let component: ModalObtenerPagosComponent;
  let fixture: ComponentFixture<ModalObtenerPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalObtenerPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalObtenerPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
