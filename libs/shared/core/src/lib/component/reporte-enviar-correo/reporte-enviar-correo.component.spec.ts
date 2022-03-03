import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEnviarCorreoComponent } from './reporte-enviar-correo.component';

describe('ReporteEnviarCorreoComponent', () => {
  let component: ReporteEnviarCorreoComponent;
  let fixture: ComponentFixture<ReporteEnviarCorreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteEnviarCorreoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteEnviarCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
