import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprocesoComponent } from './reproceso.component';

describe('ReprocesoComponent', () => {
  let component: ReprocesoComponent;
  let fixture: ComponentFixture<ReprocesoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReprocesoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReprocesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
