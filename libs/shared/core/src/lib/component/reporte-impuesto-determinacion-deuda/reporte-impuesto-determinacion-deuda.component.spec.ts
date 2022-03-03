import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteImpuestoDeterminacionDeudaComponent } from './reporte-impuesto-determinacion-deuda.component';

describe('ReporteImpuestoDeterminacionDeudaComponent', () => {
  let component: ReporteImpuestoDeterminacionDeudaComponent;
  let fixture: ComponentFixture<ReporteImpuestoDeterminacionDeudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteImpuestoDeterminacionDeudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteImpuestoDeterminacionDeudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
