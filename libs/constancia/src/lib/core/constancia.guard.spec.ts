import { TestBed } from '@angular/core/testing';

import { ConstanciaGuard } from './constancia.guard';

describe('ConstanciaGuard', () => {
  let guard: ConstanciaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ConstanciaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
