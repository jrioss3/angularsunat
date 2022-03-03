import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCuerpoComponent } from './reporte-cuerpo.component';

describe('ReporteCuerpoComponent', () => {
  let component: ReporteCuerpoComponent;
  let fixture: ComponentFixture<ReporteCuerpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteCuerpoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteCuerpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
