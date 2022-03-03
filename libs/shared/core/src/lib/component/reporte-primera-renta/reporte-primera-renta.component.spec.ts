import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePrimeraRentaComponent } from './reporte-primera-renta.component';

describe('ReportePrimeraRentaComponent', () => {
  let component: ReportePrimeraRentaComponent;
  let fixture: ComponentFixture<ReportePrimeraRentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportePrimeraRentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePrimeraRentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
