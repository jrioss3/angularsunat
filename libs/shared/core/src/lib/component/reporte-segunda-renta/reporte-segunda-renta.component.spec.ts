import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteSegundaRentaComponent } from './reporte-segunda-renta.component';

describe('ReporteSegundaRentaComponent', () => {
  let component: ReporteSegundaRentaComponent;
  let fixture: ComponentFixture<ReporteSegundaRentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteSegundaRentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteSegundaRentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
