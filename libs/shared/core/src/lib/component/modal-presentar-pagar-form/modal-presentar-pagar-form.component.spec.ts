import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPresentarPagarFormComponent } from './modal-presentar-pagar-form.component';

describe('ModalPresentarPagarFormComponent', () => {
  let component: ModalPresentarPagarFormComponent;
  let fixture: ComponentFixture<ModalPresentarPagarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPresentarPagarFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPresentarPagarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
