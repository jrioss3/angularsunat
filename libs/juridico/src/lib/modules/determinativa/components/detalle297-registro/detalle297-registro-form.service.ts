import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HabilitarCasillas2021Service } from '@path/juridico/services/habilitar-casillas-2021.service';
import { ConstantesCombos } from '@rentas/shared/constantes';
import { ComboService, ValidacionService } from '@rentas/shared/core';
import { ListaParametro } from '@rentas/shared/types';

@Injectable()
export class Detalle297RegistroFormService {

  private detalle279Form: FormGroup;
  private r27: ListaParametro[];
  private r28: ListaParametro[];
  private r32: ListaParametro[];

  constructor(public fb: FormBuilder,
    private comboService: ComboService,
    public habilitarItan: HabilitarCasillas2021Service) {
    this.r27 = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPOS_VALOR_CAS_297);
    this.r28 = this.comboService.obtenerComboPorNumero(ConstantesCombos.ACOTACION_VALOR_CAS_297);
    this.r32 = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPOS_VALOR_COMPENSACION_CAS_297);
    this.detalle279Form = this.createForm();
  }

  public createForm(): FormGroup {
    return this.fb.group({
      mesApli: [null, Validators.required],
      periodo: [{ year: 'AAAA', month: 'MM' }, Validators.required],
      valSalDeudor: [null, Validators.required],
      numValor: [null, Validators.required],
      formDecJurada: [null],
      numOrdDecJurada: [null],
      numResCom: [null],
      codTributo: [null, Validators.required],
      montoApli: [null, [Validators.required, Validators.min(1)]]
    }, {
      validator: [
        ValidacionService.validarPeriodo('periodo'),
        ValidacionService.validarNumeroValor('numValor', this.r27, this.r28),
        ValidacionService.validarDeclaracionJurada('formDecJurada', this.getMostrarNuevosCampos()),
        ValidacionService.validarNumOrdenDecJurada('numOrdDecJurada', this.getMostrarNuevosCampos()),
        ValidacionService.validarNumResCom('numResCom', this.getMostrarNuevosCampos(), this.r32, this.r28),
        ValidacionService.validarCodTributo('codTributo')
      ]
    });
  }

  public get getForm(): FormGroup {
    return this.detalle279Form;
  }

  public getMostrarNuevosCampos(): boolean {
    return this.habilitarItan.habilitarCasillasITAN();
  }

  public get fieldMesApli(): AbstractControl {
    return this.getForm.get('mesApli');
  }

  public get fieldPeriodo(): AbstractControl {
    return this.getForm.get('periodo');
  }

  public get fieldValSalDeudor(): AbstractControl {
    return this.getForm.get('valSalDeudor');
  }

  public get fieldNumValor(): AbstractControl {
    return this.getForm.get('numValor');
  }

  public get fieldFormDecJurada(): AbstractControl {
    return this.getForm.get('formDecJurada');
  }

  public get fieldNumOrdDecJurada(): AbstractControl {
    return this.getForm.get('numOrdDecJurada');
  }

  public get fieldNumResCom(): AbstractControl {
    return this.getForm.get('numResCom');
  }

  public get fieldCodTributo(): AbstractControl {
    return this.getForm.get('codTributo');
  }

  public get fieldMontoApli(): AbstractControl {
    return this.getForm.get('montoApli');
  }

  public inicializarFormulario(): void {
    this.fieldNumValor.disable();
    this.fieldFormDecJurada.disable();
    this.fieldNumOrdDecJurada.disable();
  }
}
