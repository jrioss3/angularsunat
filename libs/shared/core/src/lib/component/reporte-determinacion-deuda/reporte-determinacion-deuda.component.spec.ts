import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDeterminacionDeudaComponent } from './reporte-determinacion-deuda.component';

describe('ReporteDeterminacionDeudaComponent', () => {
  let component: ReporteDeterminacionDeudaComponent;
  let fixture: ComponentFixture<ReporteDeterminacionDeudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteDeterminacionDeudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteDeterminacionDeudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
