import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabResumenTransaccionesComponent } from './tab-resumen-transacciones.component';

describe('TabResumenTransaccionesComponent', () => {
  let component: TabResumenTransaccionesComponent;
  let fixture: ComponentFixture<TabResumenTransaccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabResumenTransaccionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabResumenTransaccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
