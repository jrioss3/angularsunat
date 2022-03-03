import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkDevolucionComponent } from './link-devolucion.component';

describe('LinkDevolucionComponent', () => {
  let component: LinkDevolucionComponent;
  let fixture: ComponentFixture<LinkDevolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkDevolucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
