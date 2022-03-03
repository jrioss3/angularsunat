import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCasillasComponent } from './control-casillas.component';

describe('ControlCasillasComponent', () => {
  let component: ControlCasillasComponent;
  let fixture: ComponentFixture<ControlCasillasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlCasillasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCasillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
