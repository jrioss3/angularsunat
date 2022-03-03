import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteIdentificacionComponent } from './reporte-identificacion.component';

describe('ReporteIdentificacionComponent', () => {
  let component: ReporteIdentificacionComponent;
  let fixture: ComponentFixture<ReporteIdentificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteIdentificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteIdentificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
