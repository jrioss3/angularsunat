import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfPrinAccionistasModel } from '@path/juridico/models/SeccionInformativa/infPrinAccionistasModel';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { ConstantesSocios } from '@path/juridico/utils/constantesSocios';
import { ConstantesDocumentos } from '@rentas/shared/constantes';
import { ValidacionService } from '@rentas/shared/core';
import { FuncionesGenerales } from '@rentas/shared/utils';

@Injectable()
export class SociosRegistroFormService {

  private registroSociosForm: FormGroup
  private funcionesGenerales = FuncionesGenerales.getInstance();
  private anio: number;

  constructor(public formBuilder: FormBuilder, private preDeclaracionservice: PreDeclaracionService) {
    this.registroSociosForm = this.createForm();
  }

  private createForm(): FormGroup {
    this.anio = Number(this.preDeclaracionservice.obtenerNumeroEjercicio());
    return this.formBuilder.group({
      tipoSocio: [null, Validators.required],
      tipoDocumento: [null, Validators.required],
      nroDocu: [null, Validators.required],
      nomOraz: [null, Validators.required],
      fecNac: [null, Validators.required],
      paisNac: [null, Validators.required],
      porcPar: [null, [Validators.required, Validators.max(100.00000000)]],
      fecCons: [null, Validators.required]
    }, {
      validators: [
        ValidacionService.validaNrodoc('tipoDocumento', 'nroDocu', 'CUS5'),
        ValidacionService.validarFechas('fecNac', this.anio, 'si', 'CUS5'),
        ValidacionService.validarFechas('fecCons', this.anio, 'si', 'CUS5'),
        ValidacionService.validarNombre('nomOraz', 'CUS5')
      ]
    });
  }

  public get getForm(): FormGroup {
    return this.registroSociosForm;
  }

  public get fieldTipoSocio(): AbstractControl {
    return this.getForm.get('tipoSocio');
  }

  public get fieldTipoDoc(): AbstractControl {
    return this.getForm.get('tipoDocumento');
  }

  public get fieldNroDoc(): AbstractControl {
    return this.getForm.get('nroDocu');
  }

  public get fieldRazSoc(): AbstractControl {
    return this.getForm.get('nomOraz');
  }

  public get fieldFecNac(): AbstractControl {
    return this.getForm.get('fecNac');
  }

  public get fieldPaisNac(): AbstractControl {
    return this.getForm.get('paisNac');
  }

  public get fieldPorPar(): AbstractControl {
    return this.getForm.get('porcPar');
  }

  public get fieldFecCons(): AbstractControl {
    return this.getForm.get('fecCons');
  }

  public inicializarFormulario(socio: InfPrinAccionistasModel): void {
    if (socio) {
      this.registroSociosForm.patchValue({
        tipoSocio: socio.codTipDocSocio,
        tipoDocumento: socio.codTipDocPrincipal,
        nroDocu: socio.numDocPrincipal,
        nomOraz: socio.desDocPrincipal,
        fecNac: this.obtenerFechas(socio.fecNacPrincipal),
        paisNac: socio.codPais,
        porcPar: socio.porParticipacion,
        fecCons: this.obtenerFechas(socio.fecConstitucion)
      });
      this.habilitarCampos();
    } else {
      this.fieldTipoDoc.enable();
      this.fieldNroDoc.disable();
      this.fieldRazSoc.disable();
      this.fieldFecNac.enable();
      this.fieldPaisNac.disable();
      this.fieldFecCons.enable();
    }
  }

  private obtenerFechas(fecha: string): any {
    return this.funcionesGenerales.obtenerFechaAlEditar(fecha);
  }

  public habilitarCampos(): void {
    switch (this.fieldTipoSocio.value) {
      case ConstantesSocios.PERSONA_NATURAL_DOMICILIADO: {
        this.fieldTipoDoc.enable();
        this.fieldNroDoc.enable();
        if (this.fieldTipoDoc.value === ConstantesDocumentos.DNI
          || this.fieldTipoDoc.value === ConstantesDocumentos.RUC) {
          this.fieldRazSoc.disable();
        } else {
          this.fieldRazSoc.enable();
        }
        this.fieldFecNac.enable();
        this.fieldPaisNac.disable();
        this.fieldFecCons.enable();
        break;
      }
      case ConstantesSocios.PERSONA_JURICIDA_DOMICILIADO: {
        this.fieldTipoDoc.disable();
        this.fieldNroDoc.enable();
        this.fieldRazSoc.disable();
        this.fieldFecNac.disable();
        this.fieldPaisNac.disable();
        this.fieldFecCons.enable();
        break;
      }
      case ConstantesSocios.PERSONA_NATURAL_NO_DOMICILIADO: {
        this.fieldTipoDoc.enable();
        this.fieldNroDoc.enable();
        if (this.fieldTipoDoc.value === ConstantesDocumentos.DNI
          || this.fieldTipoDoc.value === ConstantesDocumentos.RUC) {
          this.fieldRazSoc.disable();
        } else {
          this.fieldRazSoc.enable();
        }
        this.fieldFecNac.enable();
        this.fieldPaisNac.enable();
        this.fieldFecCons.enable();
        break;
      }
      case ConstantesSocios.PERSONA_JURICIDA_NO_DOMICILIADO: {
        this.fieldTipoDoc.disable();
        this.fieldNroDoc.enable();
        this.fieldRazSoc.enable();
        this.fieldFecNac.disable();
        this.fieldPaisNac.enable();
        this.fieldFecCons.enable();
        break;
      }
      case ConstantesSocios.CONSOLIDADO: {
        this.fieldTipoDoc.disable();
        this.fieldNroDoc.disable();
        this.fieldRazSoc.disable();
        this.fieldFecNac.disable();
        this.fieldPaisNac.disable();
        this.fieldFecCons.disable();
        break;
      }
      default: {
        this.fieldTipoDoc.enable();
        this.fieldNroDoc.disable();
        this.fieldRazSoc.disable();
        this.fieldFecNac.enable();
        this.fieldPaisNac.disable();
        this.fieldFecCons.enable();
      }
    }
  }

  public limpiarCampos(): void {
    const fechaPred = {
      day: 1,
      month: 1,
      year: this.anio
    };
    switch (this.fieldTipoSocio.value) {
      case ConstantesSocios.PERSONA_NATURAL_DOMICILIADO: {
        this.fieldNroDoc.setValue(null);
        this.fieldRazSoc.setValue(null);
        this.fieldPaisNac.setValue(null);
        break;
      }
      case ConstantesSocios.PERSONA_JURICIDA_DOMICILIADO: {
        this.fieldTipoDoc.setValue(ConstantesDocumentos.RUC);
        this.fieldNroDoc.setValue(null);
        this.fieldRazSoc.setValue(null);
        this.fieldFecNac.setValue(null);
        this.fieldPaisNac.setValue(null);
        break;
      }
      case ConstantesSocios.PERSONA_NATURAL_NO_DOMICILIADO: {
        this.fieldNroDoc.setValue(null);
        this.fieldRazSoc.setValue(null);
        this.fieldPaisNac.setValue(null);
        break;
      }
      case ConstantesSocios.PERSONA_JURICIDA_NO_DOMICILIADO: {
        this.fieldTipoDoc.setValue(ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS);
        this.fieldNroDoc.setValue(null);
        this.fieldRazSoc.setValue(null);
        this.fieldFecNac.setValue(null);
        this.fieldPaisNac.setValue(null);
        break;
      }
      // Consolidado
      case ConstantesSocios.CONSOLIDADO: {
        this.fieldTipoDoc.setValue(ConstantesDocumentos.CONSOLIDADO);
        this.fieldNroDoc.setValue('000000000000');
        this.fieldRazSoc.setValue('CONSOLIDADO OTROS SOCIOS');
        this.fieldFecNac.setValue(fechaPred);
        this.fieldPaisNac.setValue(null);
        this.fieldFecCons.setValue(fechaPred);
        break;
      }
      // Vacio
      case '': {
        this.fieldNroDoc.setValue(null);
        this.fieldRazSoc.setValue(null);
        this.fieldFecNac.setValue(null);
        this.fieldFecCons.setValue(null);
      }
    }
  }

  public cambiarDoc(): void {
    if (this.fieldTipoDoc.value === ConstantesDocumentos.DNI
      || this.fieldTipoDoc.value === ConstantesDocumentos.RUC) {
      this.fieldNroDoc.enable();
      this.fieldRazSoc.disable();
      this.fieldRazSoc.setValue(null);
    } else if (this.fieldTipoDoc.value === ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS
      || this.fieldTipoDoc.value === ConstantesDocumentos.CARNET_DE_EXTRANJERIA
      || this.fieldTipoDoc.value === ConstantesDocumentos.PASAPORTE
      || this.fieldTipoDoc.value === ConstantesDocumentos.PTP
      || this.fieldTipoDoc.value === ConstantesDocumentos.CARNET_IDENTIDAD) {
      this.fieldNroDoc.enable();
      this.fieldRazSoc.enable();
      this.fieldRazSoc.setValue(null);
    } else if (!this.fieldTipoDoc.value) {
      this.fieldNroDoc.disable();
      this.fieldNroDoc.setValue(null);
      this.fieldRazSoc.disable();
      this.fieldRazSoc.setValue(null);
    }
  }
}
