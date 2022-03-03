import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class Detalle144RegistroFormService {

  private detalle144Form: FormGroup

  constructor(public fb: FormBuilder) {
    this.detalle144Form = this.createForm();
  }

  public createForm(): FormGroup {
    return this.fb.group({
      formulario: [null, Validators.required],
      nroOrden: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]]
    });
  }

  public get getForm(): FormGroup {
    return this.detalle144Form;
  }

  public get fieldFormulario(): AbstractControl {
    return this.getForm.get('formulario');
  }

  public get fieldNroOrden(): AbstractControl {
    return this.getForm.get('nroOrden');
  }
}
