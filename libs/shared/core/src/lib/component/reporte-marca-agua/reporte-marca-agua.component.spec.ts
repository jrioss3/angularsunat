import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMarcaAguaComponent } from './reporte-marca-agua.component';

describe('ReporteMarcaAguaComponent', () => {
  let component: ReporteMarcaAguaComponent;
  let fixture: ComponentFixture<ReporteMarcaAguaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteMarcaAguaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteMarcaAguaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
