import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerConstanciaComponent } from './ver-constancia.component';

describe('VerConstanciaComponent', () => {
  let component: VerConstanciaComponent;
  let fixture: ComponentFixture<VerConstanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerConstanciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerConstanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
