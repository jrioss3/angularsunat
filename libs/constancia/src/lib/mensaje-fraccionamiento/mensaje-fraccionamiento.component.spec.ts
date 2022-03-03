import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeFraccionamientoComponent } from './mensaje-fraccionamiento.component';

describe('MensajeFrancionamientoComponent', () => {
  let component: MensajeFraccionamientoComponent;
  let fixture: ComponentFixture<MensajeFraccionamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensajeFraccionamientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeFraccionamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
