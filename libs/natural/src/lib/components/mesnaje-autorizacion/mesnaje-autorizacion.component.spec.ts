import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesnajeAutorizacionComponent } from './mesnaje-autorizacion.component';

describe('MesnajeAutorizacionComponent', () => {
  let component: MesnajeAutorizacionComponent;
  let fixture: ComponentFixture<MesnajeAutorizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesnajeAutorizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesnajeAutorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
