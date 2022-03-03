import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteNaturalComponent } from './reporte-natural.component';

describe('ReporteNaturalComponent', () => {
  let component: ReporteNaturalComponent;
  let fixture: ComponentFixture<ReporteNaturalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteNaturalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteNaturalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
