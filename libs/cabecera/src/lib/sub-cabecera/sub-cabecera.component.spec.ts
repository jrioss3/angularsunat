import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCabeceraComponent } from './sub-cabecera.component';

describe('SubCabeceraComponent', () => {
  let component: SubCabeceraComponent;
  let fixture: ComponentFixture<SubCabeceraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCabeceraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCabeceraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
