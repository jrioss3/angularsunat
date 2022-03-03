import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInformacionComplementariaComponent } from './reporte-informacion-complementaria.component';

describe('ReporteInformacionComplementariaComponent', () => {
  let component: ReporteInformacionComplementariaComponent;
  let fixture: ComponentFixture<ReporteInformacionComplementariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteInformacionComplementariaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteInformacionComplementariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
