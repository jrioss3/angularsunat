import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTrabajoRentaComponent } from './reporte-trabajo-renta.component';

describe('ReporteTrabajoRentaComponent', () => {
  let component: ReporteTrabajoRentaComponent;
  let fixture: ComponentFixture<ReporteTrabajoRentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteTrabajoRentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteTrabajoRentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
