import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class ItanFormService {

  private itanForm: FormGroup;

  constructor(public formBuilder: FormBuilder) {
    this.itanForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      respuesta: [null],
    });
  }

  public get getForm(): FormGroup {
    return this.itanForm;
  }

  public get fieldRespuesta(): AbstractControl {
    return this.getForm.get('respuesta');
  }

  public inicializarFormulario(respuesta: string): void {
    this.itanForm.patchValue({
      respuesta: respuesta
    });
  }

}
