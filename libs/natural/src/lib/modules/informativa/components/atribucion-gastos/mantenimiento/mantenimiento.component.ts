import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbModal, NgbModalOptions, NgbDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../../utils/ngb-date-parsear-formato';
import { I18n } from '../../../../../utils/ngdatepicker/i18n';
import { CustomDatepickerI18n } from '../../../../../utils/ngdatepicker/custom-datepicker-i18n';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../../../components/error-message/validation.service';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantesSeccionDeterminativa, ConstantesExcepciones } from '@path/natural/utils';
import { ListaParametrosModel, InfAtribucionGastosModel } from '@path/natural/models';
import { PreDeclaracionService, ParametriaFormulario } from '@path/natural/services';
import { Observable, throwError, of, EMPTY } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { PersonaJuridica, PersonaNatural } from '@rentas/shared/types';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { ConstantesCombos, ConstantesDocumentos } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils';

@Component({
  selector: 'app-satrmantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  providers: [
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato }
  ]
})
export class SatrMantenimientoComponent implements OnInit {

  @Input() inputListaConyugal: InfAtribucionGastosModel[];
  @Output() listaConyugalReady = new EventEmitter<InfAtribucionGastosModel[]>();
  @Input() inputid: InfAtribucionGastosModel;
  @Input() inputidIndex: number;

  public frmConyugal: FormGroup;
  public submitted = false;
  public mensajeConyugal = ConstantesExcepciones;
  private funcionesGenerales: FuncionesGenerales;
  // ListasParametria
  public listaTipoVinculo: Array<any>;
  public listaTipoGasto: Array<any>;
  public listaTipoDocumento: ListaParametrosModel[];
  public listaTipoDocumentoVinculo: any[];
  public statusOtrosVinculos: boolean;
  private casillaConyugal: InfAtribucionGastosModel;
  private annioEjercicio: number;
  private rucDeclarante: any;
  private dniDeclarante: any;
  private existeDataPadron: boolean;
  public length: number;
  private ruc20Autorizados: ListaParametrosModel[];

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private preDeclaracionservice: PreDeclaracionService,
    private cus34Service: ParametriaFormulario,
    private comboService: ComboService,
    private personaService: ConsultaPersona,
    private config: NgbDatepickerConfig,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.annioEjercicio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    this.ruc20Autorizados = this.comboService.obtenerComboPorNumero('R06');
    this.rucDeclarante = this.preDeclaracionservice.obtenerRucPredeclaracion();
    this.dniDeclarante = this.rucDeclarante.substr(2, 8);
    this.config.maxDate = { year: this.annioEjercicio, month: 12, day: 31 };
    this.obtenerListasParametria();
    this.obtenerDescripcionDocumento();
    this.statusOtrosVinculos = false;
    this.length = 0;

    this.frmConyugal = this.fb.group({
      cmbTipoGast: [this.inputid ? this.inputid.codTipoGasto : ''],
      cmbTipoVinculo: [this.inputid ? this.inputid.codTipVin : '', Validators.required],
      cmbTipoDocVinculo: [this.inputid ? this.inputid.codTipDocVin : '', Validators.required],
      txtOtroVinculo: [this.inputid ? this.inputid.desTipDocOtr : '', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      txtNumDocVinculo: [
        this.inputid ? this.inputid.numDocVin : '', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]*$/)]
      ],
      cmbTipoDoc: [this.inputid ? this.inputid.codTipDoc : '', Validators.required],
      txtNumDoc: [this.inputid ? this.inputid.numDoc : '', Validators.required],
      txtApellidosNombres: [this.inputid ? this.inputid.desNomRazSoc : '', Validators.required],
      dpFechaInicio: [this.obtenerValoresFecha(), Validators.required],
      txtPorcentajeAttr: [this.inputid ? this.inputid.porAtribucion : '']
    }, {
      validator: [
        ValidationService.validarNrodoc('cmbTipoDoc', 'txtNumDoc', 'CUS34', this.rucDeclarante, this.dniDeclarante, this.ruc20Autorizados),
        ValidationService.validarFechas('dpFechaInicio', this.annioEjercicio, 'no', 'CUS34')
      ]
    });

    this.f.txtPorcentajeAttr.setValue(50);
    this.f.txtPorcentajeAttr.disable();
    this.f.cmbTipoGast.setValue('1');
    this.f.cmbTipoGast.disable();
    this.f.txtOtroVinculo.disable();

    if (this.inputid) {
      this.cargarTipoDocumentoSustentaVinculo(this.inputid.codTipVin);
      this.f.cmbTipoDocVinculo.setValue(this.inputid.codTipDocVin);
      this.deshabilitarCamposAlEditar();
    }
  }

  public get f() { return this.frmConyugal.controls; }

  private obtenerValoresFecha(): any {
    if (this.inputid) {
      return this.funcionesGenerales.obtenerFechaAlEditar(this.inputid.fecIniRel);
    } else {
      return '';
    }
  }

  private deshabilitarCamposAlEditar(): void {
    const campos = [this.f.cmbTipoGast, this.f.cmbTipoVinculo, this.f.cmbTipoDocVinculo, this.f.txtNumDocVinculo, this.f.cmbTipoDoc,
    this.f.txtNumDoc, this.f.txtApellidosNombres, this.f.txtPorcentajeAttr];
    this.funcionesGenerales.desHabilitarCampos(campos);
  }

  private obtenerListasParametria(): void {
    this.listaTipoVinculo = this.cus34Service.obtenerTipoVinculo();
    this.listaTipoGasto = this.cus34Service.ObtenerTipoGasto();
  }

  private obtenerDescripcionDocumento(): void {
    const codDoc = [ConstantesDocumentos.DNI, ConstantesDocumentos.CARNET_DE_EXTRANJERIA,
    ConstantesDocumentos.PASAPORTE, ConstantesDocumentos.RUC, ConstantesDocumentos.PTP, ConstantesDocumentos.CARNET_IDENTIDAD];
    this.listaTipoDocumento = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO, codDoc);
  }

  public cargarTipoDocumentoSustentaVinculo(codigoTipoVinculo: any): void {
    switch (codigoTipoVinculo) {
      case '02': {
        this.listaTipoDocumentoVinculo = this.cus34Service.obtenerTipoDocumentoVinculo().
          filter(x => x.val === '01' || x.val === '03' || x.val === '04');
        break;
      }
      case '03': {
        this.listaTipoDocumentoVinculo = this.cus34Service.obtenerTipoDocumentoVinculo().
          filter(x => x.val === '02' || x.val === '03' || x.val === '04');
        break;
      }
      case '': {
        this.listaTipoDocumentoVinculo = [];
        break;
      }
    }
  }

  public loadOtrosVinculos(valueTipoDocumento: string): void {
    if (valueTipoDocumento === '04') {
      this.f.txtOtroVinculo.enable();
      this.statusOtrosVinculos = true;
    } else {
      this.f.txtOtroVinculo.disable();
      this.statusOtrosVinculos = false;
    }
  }

  public habilitarCampo(): void {
    this.f.txtNumDoc.setValue('');
    this.f.txtApellidosNombres.enable();
    this.f.txtApellidosNombres.setValue('');
    this.existeDataPadron = (this.f.cmbTipoDoc.value === ConstantesDocumentos.DNI || this.f.cmbTipoDoc.value === ConstantesDocumentos.RUC)
      ? false : true;
    switch (this.f.cmbTipoDoc.value) {
      case ConstantesDocumentos.DNI: this.length = 8; break;
      case ConstantesDocumentos.RUC: this.length = 11; break;
      case '': this.length = 0; break;
      default: this.length = 15; break;
    }
  }

  public obtenerNombreRazonSocial(): void {
    if (this.f.txtApellidosNombres.disabled === true) {
      this.f.txtApellidosNombres.setValue('');
      this.f.txtApellidosNombres.enable();
    }
    this.existeDataPadron = false;
    this.autocompletarNombreRazonSocial().subscribe();
  }

  private autocompletarNombreRazonSocial(): Observable<any> {
    if (this.cumpleCondicion()) {
      this.spinner.show();
      return this.tipoContribuyente().pipe(
        switchMap(tipo => tipo === ConstantesDocumentos.DNI ? this.validarExistenciaPersona() : this.validarExistenciaContribuyente()),
        catchError(error => {
          switch (this.f.cmbTipoDoc.value) {
            case ConstantesDocumentos.DNI:
              this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS34_EX06 }); break;
            case ConstantesDocumentos.RUC:
              this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS34_EX08 }); break;
          }
          this.spinner.hide();
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private cumpleCondicion(): boolean {
    return !this.f.txtNumDoc.errors && !this.existeDataPadron &&
      (this.f.cmbTipoDoc.value === ConstantesDocumentos.RUC
        || this.f.cmbTipoDoc.value === ConstantesDocumentos.DNI);
  }

  private tipoContribuyente(): Observable<string> {
    if (this.f.txtNumDoc.value && this.f.cmbTipoDoc.value === ConstantesDocumentos.DNI) {
      return of(ConstantesDocumentos.DNI);
    } else if (this.f.txtNumDoc.value && this.f.cmbTipoDoc.value === ConstantesDocumentos.RUC) {
      return of(ConstantesDocumentos.RUC);
    } else {
      this.f.txtApellidosNombres.setValue('');
      return EMPTY;
    }
  }

  private validarExistenciaPersona(): Observable<any> {
    return this.personaService.obtenerPersona(this.f.txtNumDoc.value).pipe(
      tap(data => this.obtenerNombrePersona(data))
    );
  }

  private validarExistenciaContribuyente(): Observable<any> {
    return this.personaService.obtenerContribuyente(this.f.txtNumDoc.value).pipe(
      tap(data => this.obtenerRazonSocialContribuyente(data))
    );
  }

  private obtenerNombrePersona(data: PersonaNatural): void {
    const nombre = data.desNombrePnat + ' ' + data.desApepatPnat + ' ' + data.desApematPnat;
    this.f.txtApellidosNombres.setValue(nombre);
    this.f.txtApellidosNombres.disable();
    this.existeDataPadron = true;
    this.spinner.hide();
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void {
    this.f.txtApellidosNombres.setValue(data.ddpNombre.trim());
    this.f.txtApellidosNombres.disable();
    this.existeDataPadron = true;
    this.spinner.hide();
  }

  public validarEspacio(val: any): void {
    this.f.txtNumDoc.setValue(val.trim());
  }

  public metodo(): void {
    this.submitted = true;
    this.autocompletarNombreRazonSocial().subscribe(data => {
      if (!this.inputid) {
        this.agregar();
      } else {
        this.actualizar();
      }
    });
  }

  private agregar(): void {
    if (this.frmConyugal.invalid) {
      return;
    }

    this.casillaConyugal = {
      numFormulario: '0709',
      codTipSoc: ConstantesSeccionDeterminativa.COD_SOCIEDAD_CONYUGAL,
      codTipVin: this.f.cmbTipoVinculo.value ? this.f.cmbTipoVinculo.value : '',
      codTipDocVin: this.f.cmbTipoDocVinculo.value ? this.f.cmbTipoDocVinculo.value : '',
      desTipDocOtr: this.f.txtOtroVinculo.value.toUpperCase() ? this.f.txtOtroVinculo.value.toUpperCase() : '',
      numDocVin: this.f.txtNumDocVinculo.value.toUpperCase() ? this.f.txtNumDocVinculo.value.toUpperCase() : '',
      desNomRazSoc: this.f.txtApellidosNombres.value.toUpperCase() ? this.f.txtApellidosNombres.value.toUpperCase() : '',
      codTipDoc: this.f.cmbTipoDoc.value ? this.f.cmbTipoDoc.value : '',
      numDoc: this.f.txtNumDoc.value.toUpperCase() ? this.f.txtNumDoc.value.toUpperCase() : '',
      numRucAtrib: null,
      indSexo: null,
      fecIniRel: this.funcionesGenerales.formatearFechaString(this.f.dpFechaInicio.value),
      porAtribTit: this.f.txtPorcentajeAttr.value ? this.f.txtPorcentajeAttr.value : 0,
      porAtribucion: this.f.txtPorcentajeAttr.value ? this.f.txtPorcentajeAttr.value : 0,
      desCorreo: null,
      numTelFijo: null,
      numCel: null,
      indTipoAtrib: ConstantesSeccionDeterminativa.COD_ATRIB_REALIZADA,
      codTipoGasto: this.f.cmbTipoGast.value ? this.f.cmbTipoGast.value : '',
    };
    this.inputListaConyugal.push(this.casillaConyugal);
    this.listaConyugalReady.emit(this.inputListaConyugal);
    this.callModal('Se grabaron los datos exitosamente');
    this.activeModal.close();
  }

  private actualizar(): void {
    if (this.frmConyugal.invalid) {
      return;
    }

    const casillaConyugal = {
      numFormulario: '0709',
      codTipSoc: ConstantesSeccionDeterminativa.COD_SOCIEDAD_CONYUGAL,
      codTipVin: this.f.cmbTipoVinculo.value ? this.f.cmbTipoVinculo.value : '',
      codTipDocVin: this.f.cmbTipoDocVinculo.value ? this.f.cmbTipoDocVinculo.value : '',
      desTipDocOtr: this.f.txtOtroVinculo.value ? this.f.txtOtroVinculo.value.toUpperCase() : '',
      numDocVin: this.f.txtNumDocVinculo.value ? this.f.txtNumDocVinculo.value.toUpperCase() : '',
      desNomRazSoc: this.f.txtApellidosNombres.value ? this.f.txtApellidosNombres.value.toUpperCase() : '',
      codTipDoc: this.f.cmbTipoDoc.value ? this.f.cmbTipoDoc.value : '',
      numDoc: this.f.txtNumDoc.value ? this.f.txtNumDoc.value.toUpperCase() : '',
      numRucAtrib: null,
      indSexo: null,
      fecIniRel: this.funcionesGenerales.formatearFechaString(this.f.dpFechaInicio.value),
      porAtribTit: this.f.txtPorcentajeAttr.value ? this.f.txtPorcentajeAttr.value : 0,
      porAtribucion: this.f.txtPorcentajeAttr.value ? this.f.txtPorcentajeAttr.value : 0,
      desCorreo: null,
      numTelFijo: null,
      numCel: null,
      indTipoAtrib: ConstantesSeccionDeterminativa.COD_ATRIB_REALIZADA,
      codTipoGasto: this.f.cmbTipoGast.value ? this.f.cmbTipoGast.value : '',
    };

    if (!this.equals(this.inputid, casillaConyugal)) {
      this.inputListaConyugal[this.inputidIndex] = casillaConyugal;
      this.listaConyugalReady.emit(this.inputListaConyugal);
    }
    this.activeModal.close();
  }

  private callModal(excepcionName: string): void {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
  }

  private equals(obj: InfAtribucionGastosModel, objNuevo: InfAtribucionGastosModel): boolean {
    return objNuevo.numFormulario === obj.numFormulario &&
      objNuevo.codTipSoc === obj.codTipSoc &&
      objNuevo.codTipVin === obj.codTipVin &&
      objNuevo.codTipDocVin === obj.codTipDocVin &&
      objNuevo.desTipDocOtr === obj.desTipDocOtr &&
      objNuevo.numDocVin === obj.numDocVin &&
      objNuevo.desNomRazSoc === obj.desNomRazSoc &&
      objNuevo.codTipDoc === obj.codTipDoc &&
      objNuevo.numDoc === obj.numDoc &&
      objNuevo.numRucAtrib === obj.numRucAtrib &&
      objNuevo.indSexo === obj.indSexo &&
      objNuevo.fecIniRel === obj.fecIniRel &&
      objNuevo.porAtribTit === obj.porAtribTit &&
      objNuevo.porAtribucion === obj.porAtribucion &&
      objNuevo.desCorreo === obj.desCorreo &&
      objNuevo.numTelFijo === obj.numTelFijo &&
      objNuevo.numCel === obj.numCel &&
      objNuevo.indTipoAtrib === obj.indTipoAtrib &&
      objNuevo.codTipoGasto === obj.codTipoGasto;
  }
}
