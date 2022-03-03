import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetalleCas108 } from '@path/juridico/models/SeccionDeterminativa/impRtaEmpresaModelCas108';

@Injectable()
export class Detalle108RegistroFormService {

  private detalle108Form: FormGroup

  constructor(public fb: FormBuilder) {
    this.detalle108Form = this.createForm();
  }

  public createForm(): FormGroup {
    return this.fb.group({
      ejercicio: [null, Validators.required],
      saldoPerdida: [null],
      saldoCompensa: [null]
    });
  }

  public get getForm(): FormGroup {
    return this.detalle108Form;
  }

  public get fieldEjercicio(): AbstractControl {
    return this.getForm.get('ejercicio');
  }

  public get fieldSaldoPerdida(): AbstractControl {
    return this.getForm.get('saldoPerdida');
  }

  public get fieldSaldoCompensa(): AbstractControl {
    return this.getForm.get('saldoCompensa');
  }

  public inicializarFormulario(saldo: DetalleCas108): void {
    if (saldo) {
      this.detalle108Form.patchValue({
        ejercicio: saldo.casillaCompensacion.desValLiteral,
        saldoPerdida: saldo.casillaPerdidas.mtoLiteral,
        saldoCompensa: saldo.casillaCompensacion.mtoLiteral,
      });
      this.fieldEjercicio.disable();
    }
  }
}
