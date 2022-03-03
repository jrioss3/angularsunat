import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTodoConstanciaComponent } from './ver-todo-constancia.component';

describe('VerTodoConstanciaComponent', () => {
  let component: VerTodoConstanciaComponent;
  let fixture: ComponentFixture<VerTodoConstanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerTodoConstanciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerTodoConstanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
