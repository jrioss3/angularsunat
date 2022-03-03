import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

@Injectable()
export class EmpresasConstructorasFormService {

  private constructorasForm: FormGroup;

  constructor(public formBuilder: FormBuilder) {
    this.constructorasForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      respuesta: [null],
    });
  }

  public get getForm(): FormGroup {
    return this.constructorasForm;
  }

  public get fieldRespuesta(): AbstractControl {
    return this.getForm.get('respuesta');
  }

  public inicializarFormulario(respuesta: string): void {
    this.constructorasForm.patchValue({
      respuesta: respuesta
    });
  }
}
