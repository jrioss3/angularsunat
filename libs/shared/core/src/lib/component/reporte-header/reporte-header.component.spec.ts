import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteHeaderComponent } from './reporte-header.component';

describe('ReporteHeaderComponent', () => {
  let component: ReporteHeaderComponent;
  let fixture: ComponentFixture<ReporteHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
