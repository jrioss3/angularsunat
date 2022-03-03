import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaErroresComponent } from './lista-errores.component';

describe('ListaErroresComponent', () => {
  let component: ListaErroresComponent;
  let fixture: ComponentFixture<ListaErroresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaErroresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaErroresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
