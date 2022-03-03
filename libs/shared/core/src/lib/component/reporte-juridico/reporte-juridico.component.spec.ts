import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteJuridicoComponent } from './reporte-juridico.component';

describe('ReporteJuridicoComponent', () => {
  let component: ReporteJuridicoComponent;
  let fixture: ComponentFixture<ReporteJuridicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteJuridicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteJuridicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
