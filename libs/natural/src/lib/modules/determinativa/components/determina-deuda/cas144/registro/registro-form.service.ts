import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class C144RegistroFormService {

  private registroForm: FormGroup

  constructor(public fb: FormBuilder) {
    this.registroForm = this.createForm();
  }

  public createForm(): FormGroup {
    return this.fb.group({
      formulario: [null, Validators.required],
      nroOrden: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]]
    }, {
      validators: []
    });
  }

  public get getForm() {
    return this.registroForm;
  }

  public get fieldFormulario() {
    return this.getForm.get('formulario');
  }

  public get fieldNroOrden() {
    return this.getForm.get('nroOrden');
  }
}
