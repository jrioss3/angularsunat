import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEstadosFinancierosComponent } from './reporte-estados-financieros.component';

describe('ReporteEstadosFinancierosComponent', () => {
  let component: ReporteEstadosFinancierosComponent;
  let fixture: ComponentFixture<ReporteEstadosFinancierosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteEstadosFinancierosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteEstadosFinancierosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
