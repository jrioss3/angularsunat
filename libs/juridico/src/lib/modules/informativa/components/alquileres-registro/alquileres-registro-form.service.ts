import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfAlquileresModel } from '@path/juridico/models/SeccionInformativa/infAlquileresModel';
import { ConstantesBienes, ConstantesDocumentos } from '@rentas/shared/constantes';
import { ValidacionService } from '@rentas/shared/core';

@Injectable()
export class AlquileresRegistroFormService {

  private registroAlquileresForm: FormGroup

  constructor(public formBuilder: FormBuilder) {
    this.registroAlquileresForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      tipoDocumento: [null, Validators.required],
      nroDocu: [null, Validators.required],
      nomOrazAlq: [null, Validators.required],
      montoAlq: [null, [Validators.required, Validators.min(1)]],
      tipoBien: [null, Validators.required],
      bienMueble: [null, Validators.required],
      bienMuebledesc: [null, Validators.required]
    }, {
      validators: [
        ValidacionService.validaNroPlaca('tipoBien', 'bienMueble', 'bienMuebledesc'),
        ValidacionService.validaNrodoc('tipoDocumento', 'nroDocu', 'CUS6'),
        ValidacionService.validarNombre('nomOrazAlq', 'CUS6'),
      ]
    });
  }

  public get getForm(): FormGroup {
    return this.registroAlquileresForm;
  }

  public get fieldTipoDoc(): AbstractControl {
    return this.getForm.get('tipoDocumento');
  }

  public get fieldNroDoc(): AbstractControl {
    return this.getForm.get('nroDocu');
  }

  public get fieldRazSoc(): AbstractControl {
    return this.getForm.get('nomOrazAlq');
  }

  public get fieldMtoAlq(): AbstractControl {
    return this.getForm.get('montoAlq');
  }

  public get fieldBienMueble(): AbstractControl {
    return this.getForm.get('bienMueble');
  }

  public get fieldBienMuebleDesc(): AbstractControl {
    return this.getForm.get('bienMuebledesc');
  }

  public get fieldTipoBien(): AbstractControl {
    return this.getForm.get('tipoBien');
  }

  public inicializarFormulario(alquiler: InfAlquileresModel): void {
    if (alquiler) {
      this.registroAlquileresForm.patchValue({
        tipoDocumento: alquiler.codDocIdeDec,
        nroDocu: alquiler.numDocIdeDec,
        nomOrazAlq: alquiler.nomRazonAlq,
        montoAlq: alquiler.mtoAlquiler,
        tipoBien: alquiler.codTipBien,
        bienMueble: alquiler.codSubTipBien,
        bienMuebledesc: alquiler.desBienAlq,
      });
      this.habilitarCamposTipoDoc();
      this.habilitarCamposTipoBien(this.fieldTipoBien.value);
      this.habilitarCamposDescTipoBien();
    } else {
      this.habilitarCamposTipoDoc();
      this.habilitarCamposTipoBien(this.fieldTipoBien.value);
    }
  }

  public habilitarCamposTipoDoc(): void {
    if (this.fieldTipoDoc.value === ConstantesDocumentos.DNI
      || this.fieldTipoDoc.value === ConstantesDocumentos.RUC) {
      this.fieldNroDoc.enable();
      this.fieldRazSoc.disable();
    } else if (this.fieldTipoDoc.value === ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS
      || this.fieldTipoDoc.value === ConstantesDocumentos.CARNET_DE_EXTRANJERIA
      || this.fieldTipoDoc.value === ConstantesDocumentos.PASAPORTE
      || this.fieldTipoDoc.value === ConstantesDocumentos.PTP
      || this.fieldTipoDoc.value === ConstantesDocumentos.CARNET_IDENTIDAD) {
      this.fieldNroDoc.enable();
      this.fieldRazSoc.enable();
    } else if (!this.fieldTipoDoc.value) {
      this.fieldNroDoc.disable();
      this.fieldRazSoc.disable();
    }
  }

  public habilitarCamposTipoBien(valor): void {
    switch (valor) {
      case ConstantesBienes.BIEN_MUEBLE: {
        this.fieldBienMueble.enable();
        this.fieldBienMuebleDesc.disable();
        break;
      }
      case ConstantesBienes.BIEN_INMUEBLE_DISTINTOS_DE_PREDIOS: {
        this.fieldBienMueble.enable();
        this.fieldBienMuebleDesc.disable();
        break;
      }
      case ConstantesBienes.BIEN_INMUEBLE: {
        this.fieldBienMueble.disable();
        this.fieldBienMuebleDesc.disable();
        break;
      }
      default: {
        this.fieldBienMueble.disable();
        this.fieldBienMuebleDesc.disable();
        break;
      }
    }
  }

  public habilitarCamposDescTipoBien(): void {
    if (this.fieldBienMueble.value) {
      this.fieldBienMuebleDesc.enable();
    } else {
      this.fieldBienMuebleDesc.disable();
    }
  }

  public limpiarCamposDoc(): void {
    this.fieldNroDoc.setValue('');
    this.fieldRazSoc.setValue('');
  }

  public limpiarCamposTipoBien(): void {
    this.fieldBienMueble.setValue(null);
    this.fieldBienMuebleDesc.setValue(null);
  }

  public limpiarCamposDescTipoBien(): void {
    this.fieldBienMuebleDesc.setValue(null);
  }

  public comboInicial(): boolean {
    if (this.fieldTipoBien.value === ConstantesBienes.BIEN_MUEBLE) {
      return true;
    } else {
      return false;
    }
  }

  public obtenerDescripcion(): string {
    if (this.fieldBienMueble.value === ConstantesBienes.VEHICULOS) {
      return 'Número de Placa';
    } else if (this.fieldBienMueble.value === ConstantesBienes.OTROS) {
      return '';
    } else if (this.fieldBienMueble.value === ConstantesBienes.CONCESION_MINERA) {
      return 'Partida Registral';
    } else if (this.fieldBienMueble.value === ConstantesBienes.OTROS_INMUEBLE) {
      return '';
    } else if (this.fieldBienMueble.value === ConstantesBienes.NAVES || this.fieldBienMueble.value === ConstantesBienes.AERONAVES) {
      return 'Matrícula';
    }
  }
}
