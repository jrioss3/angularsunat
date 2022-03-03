import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../../../utils/ngb-date-parsear-formato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../../../../components/error-message/validation.service';
import { I18n } from '../../../../../../utils/ngdatepicker/i18n';
import { CustomDatepickerI18n } from '../../../../../../utils/ngdatepicker/custom-datepicker-i18n';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { ListaParametrosModel, Casilla107 } from '@path/natural/models';
import { ConstantesExcepciones } from '@path/natural/utils';
import { ParametriaFormulario, PreDeclaracionService } from '@path/natural/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError, of, EMPTY } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { PersonaJuridica } from '@rentas/shared/types';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { ConstantesCombos, ConstantesDocumentos } from '@rentas/shared/constantes';
import { FuncionesGenerales, CasillasUtil } from '@rentas/shared/utils';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  providers: [
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato },
    FormBuilder
  ]
})
export class ScCas107MantenimientoComponent extends CasillasUtil implements OnInit {

  @Input() inputLista107: Casilla107[];
  @Output() lista107Ready = new EventEmitter<Casilla107[]>();
  @Input() inputid: Casilla107;
  @Input() inputidIndex: number;

  public frmCasilla107: FormGroup;
  public submitted = false;
  public annio: number;
  public mensajes107 = ConstantesExcepciones;
  private funcionesGenerales: FuncionesGenerales;
  public listaTipDoc: ListaParametrosModel[];
  public listaTipComp: Array<any>;
  public condition = false;
  public condicionPeriodo = false;
  public placholder = '';
  public tamanioNroDoc: number;
  public texto = 'ingresar';
  public textoNumDoc = 'ingresar';

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private preDeclaracionservice: PreDeclaracionService,
    private cus12Service: ParametriaFormulario,
    private comboService: ComboService,
    private personaService: ConsultaPersona,
    private config: NgbDatepickerConfig,
    private spinner: NgxSpinnerService) {
      super()
     }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.annio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    const rucDeclarante = this.preDeclaracionservice.obtenerRucPredeclaracion();
    const listaParametros = [ConstantesDocumentos.RUC, ConstantesDocumentos.SIN_RUC, ConstantesDocumentos.CONSOLIDADO];
    this.listaTipDoc = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO, listaParametros);
    this.listaTipComp = this.cus12Service.obtenerTipoComprobante();

    this.config.maxDate = { year: this.annio, month: 12, day: 31 };

    this.frmCasilla107 = this.fb.group({
      txtNum: [this.inputid ? this.inputid.numDoc : ''],
      txtRazSoc: [this.inputid ? this.inputid.desRazSoc : '', Validators.required],
      cmbTipoDocumento: [this.inputid ? (this.inputid.tipDoc ? this.inputid.tipDoc : '') : '', Validators.required],
      cmbTipoComprobante: [this.inputid ? (this.inputid.codTipComp ? this.inputid.codTipComp : '') : '', Validators.required],
      txtSerie: [this.inputid ? this.inputid.numSerie : '', Validators.required],
      txtNumComprobante: [this.inputid ? this.inputid.numComp : '', Validators.required],
      txtFechaEmi: [this.obtenerValoresFecha(), Validators.required],
      periodo: [this.obtenerValoresPerido()],
      txtIngresoAtri: [this.inputid ? this.inputid.mtoAtribuido : '', Validators.required]
    }, {
      validators: [
        ValidationService.validarNrodoc('cmbTipoDocumento', 'txtNum', 'CUS12', rucDeclarante),
        ValidationService.validarFechayPeriodo('txtFechaEmi', 'periodo'),
        ValidationService.validarSerie('txtSerie'),
        ValidationService.soloNumeros('txtNumComprobante', 'CUS12', '', ''),
        ValidationService.soloNumeros('txtIngresoAtri', 'CUS12', 'si', 'si', 'cmbTipoComprobante'),
      ]
    });

    if (this.inputid) {
      const CamposDeshabilitados = [this.f.txtNum, this.f.cmbTipoDocumento, this.f.cmbTipoComprobante,
      this.f.txtSerie, this.f.txtNumComprobante, this.f.txtFechaEmi];
      this.funcionesGenerales.desHabilitarCampos(CamposDeshabilitados);
      this.f.txtIngresoAtri.enable();
      this.condition = true;
      this.condicionPeriodo = true;
      this.texto = '';
      this.textoNumDoc = '';
      this.inputid.tipDoc === ConstantesDocumentos.SIN_RUC ? this.f.txtRazSoc.enable() : this.f.txtRazSoc.disable();
    } else {
      this.tamanioNroDoc = 0;
      this.f.txtRazSoc.disable();
    }
  }

  public get f() { return this.frmCasilla107.controls; }
  // METODOS AL INICIAR O EDITAR UN REGISTRO -------------------------------------------------------------------------------
  private obtenerValoresPerido(): any {
    if (this.inputid) {
      return this.funcionesGenerales.obtenerPeriodoAlEditar(this.inputid.perServicio);
    } else {
      return { year: 'AAAA', month: 'MM' };
    }
  }

  private obtenerValoresFecha(): any {
    if (this.inputid) {
      if (this.inputid.tipDoc !== '99') {
        return this.funcionesGenerales.obtenerFechaAlEditar(this.inputid.fecEmi);
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
  // ----------------------------------------------------------------------------------------------------------------------
  public cambiarTipoDoc(): void {
    const val = this.f.cmbTipoDocumento.value;
    switch (val) {
      case ConstantesDocumentos.SIN_RUC: {
        this.generarCorrelativo();
        this.f.txtNum.disable();
        this.f.txtRazSoc.setValue('');
        const campos = [this.f.txtRazSoc, this.f.cmbTipoComprobante, this.f.txtNumComprobante, this.f.txtFechaEmi, this.f.txtSerie];
        this.funcionesGenerales.habilitarCampos(campos);
        this.placholder = 'ingresar';
        this.texto = 'ingresar';
        this.condition = false;
        break;
      }
      case ConstantesDocumentos.RUC: {
        this.f.txtNum.setValue('');
        this.f.txtRazSoc.setValue('');
        this.f.txtRazSoc.disable();
        const camposHabilitar = [this.f.txtNum, this.f.cmbTipoComprobante, this.f.txtNumComprobante, this.f.txtFechaEmi, this.f.txtSerie];
        this.funcionesGenerales.habilitarCampos(camposHabilitar);
        this.ObtenerRazSoc();
        this.condition = false;
        this.placholder = '';
        this.tamanioNroDoc = 11;
        this.texto = 'ingresar';
        break;
      }
      case ConstantesDocumentos.CONSOLIDADO: {
        this.f.txtRazSoc.setValue('CONSOLIDADO');
        const camposVacios = [this.f.txtNum, this.f.txtSerie, this.f.cmbTipoComprobante, this.f.txtNumComprobante, this.f.txtFechaEmi];
        const CamposDeshab = [this.f.txtRazSoc, this.f.txtSerie, this.f.cmbTipoComprobante, this.f.txtNumComprobante, this.f.txtFechaEmi];
        FuncionesGenerales.getInstance().setearVacioEnCampos(camposVacios);
        FuncionesGenerales.getInstance().desHabilitarCampos(CamposDeshab);
        this.f.txtNum.enable();
        this.condition = true;
        this.placholder = '';
        this.tamanioNroDoc = 11;
        this.texto = '';
        break;
      }

      default: {
        this.f.txtNum.setValue('');
        this.f.txtRazSoc.setValue('');
        const campos = [this.f.txtNum, this.f.txtSerie, this.f.txtNumComprobante, this.f.txtFechaEmi, this.f.cmbTipoComprobante];
        FuncionesGenerales.getInstance().habilitarCampos(campos);
        this.f.txtRazSoc.disable();
        this.condition = false;
        this.tamanioNroDoc = 0;
        this.texto = 'ingresar';
      }
    }
  }
  // 1. VALIDAR EXISTENCIA DEL RUC EN EL PADRON -----------------------------------------------------------------------------
  public ObtenerRazSoc(): void {
    this.f.cmbTipoDocumento.value === ConstantesDocumentos.CONSOLIDADO ?
      this.f.txtRazSoc.setValue('CONSOLIDADO') : this.f.txtRazSoc.setValue('');
    this.autocompletarNombre().subscribe();
  }

  private tipoContribuyente(): Observable<string> {
    if (this.f.txtNum.value && this.f.cmbTipoDocumento.value === ConstantesDocumentos.RUC) {
      return of(ConstantesDocumentos.RUC);
    } else {
      return EMPTY;
    }
  }

  private autocompletarNombre(): Observable<any> {
    if (this.cumpleCondicion()) {
      this.spinner.show();
      return this.tipoContribuyente().pipe(
        switchMap(() => this.validarExistenciaContribuyente()),
        catchError(error => {
          this.f.txtNum.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX03 });
          this.spinner.hide();
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private cumpleCondicion(): boolean {
    return !this.f.txtNum.errors && this.f.txtNum.value !== '' && this.f.cmbTipoDocumento.value === ConstantesDocumentos.RUC &&
      this.f.txtRazSoc.value === '';
  }

  private validarExistenciaContribuyente(): Observable<any> {
    return this.personaService.obtenerContribuyente(this.f.txtNum.value).pipe(
      tap(data => this.obtenerRazonSocialContribuyente(data))
    );
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void {
    this.f.txtRazSoc.setValue(data.ddpNombre.trim());
    this.spinner.hide();
  }
  // ---------------------------------------------------------------------------------------------------------------------
  public insertarCerosSerie(): void {
    const valor = this.f.txtSerie.value;
    if (Number(valor) !== 0) {
      if (valor.match(/^[0-9]*$/)) {
        this.f.txtSerie.setValue(valor.length < 4 ? this.pad('0' + valor, 4) : valor);
      }
    }
  }

  public insertarCerosComprobante(): void {
    const valor = this.f.txtNumComprobante.value;
    if (Number(valor) !== 0) {
      if (valor.match(/^[0-9]*$/)) {
        this.f.txtNumComprobante.setValue(valor.length < 8 ? this.pad('0' + valor, 8) : valor);
      }
    }
  }

  private generarCorrelativo(): void {
    const listaSinRuc = this.inputLista107.filter(x => x.tipDoc === ConstantesDocumentos.SIN_RUC);
    const correlativo = listaSinRuc.length !== 0 ? Number([...listaSinRuc].pop().numDoc) + 1 : 1;
    this.f.txtNum.setValue(this.pad('0' + correlativo, 8));
  }

  private pad(str, max): void {
    str = str.toString();
    return str.length < max ? this.pad('0' + str, max) : str;
  }

  public validarEspacio(val: any): void {
    this.f.txtNum.setValue(val.trim());
  }

  public verificarFecha(): void {
    this.f.txtFechaEmi.markAsUntouched();
    this.f.txtFechaEmi.setValue(this.f.txtFechaEmi.value);
  }

  public metodo(): void {
    this.submitted = true;
    this.autocompletarNombre().subscribe(() => {
      this.submitted = true;
      if (this.frmCasilla107.invalid) {
        return;
      }

      if (!this.inputid) {
        this.agregar();
      } else {
        this.actualizar();
      }
    });
  }

  private agregar(): void {
    let guardar = false;

    const casilla107Model = {
      tipDoc: this.f.cmbTipoDocumento.value,
      numDoc: this.f.txtNum.value,
      desRazSoc: this.f.txtRazSoc.value.toUpperCase(),
      perServicio: this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value),
      codTipComp: this.f.cmbTipoComprobante.value ? this.f.cmbTipoComprobante.value : null,
      numSerie: this.f.txtSerie.value ? this.f.txtSerie.value.toUpperCase() : null,
      numComp: this.f.txtNumComprobante.value ? this.f.txtNumComprobante.value : null,
      fecEmi: this.funcionesGenerales.formatearFechaString(this.f.txtFechaEmi.value),
      mtoAtribuido: this.f.txtIngresoAtri.value,
    };

    if (this.f.cmbTipoDocumento.value !== '99') {
      guardar = this.inputLista107.some(x => {
        return casilla107Model.numComp === x.numComp && casilla107Model.codTipComp === x.codTipComp &&
          casilla107Model.numSerie === x.numSerie;
      });
    }

    if (!guardar) {
      this.inputLista107.push(casilla107Model);
      this.lista107Ready.emit(this.inputLista107);
      this.callModal('Se grabaron los datos exitosamente.');
      this.activeModal.close();
    } else {
      this.callModal(ConstantesExcepciones.CUS12_EX10);
    }
  }

  private actualizar(): void {
    const casilla107Model = {
      tipDoc: this.f.cmbTipoDocumento.value,
      numDoc: this.f.txtNum.value,
      desRazSoc: this.f.txtRazSoc.value.toUpperCase(),
      perServicio: this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value),
      codTipComp: this.f.cmbTipoComprobante.value ? this.f.cmbTipoComprobante.value : null,
      numSerie: this.f.txtSerie.value ? this.f.txtSerie.value.toUpperCase() : null,
      numComp: this.f.txtNumComprobante.value ? this.f.txtNumComprobante.value : null,
      fecEmi: this.funcionesGenerales.formatearFechaString(this.f.txtFechaEmi.value),
      mtoAtribuido: this.f.txtIngresoAtri.value,
    };

    if (!this.equals(this.inputid, casilla107Model)) {
      this.inputLista107[this.inputidIndex] = casilla107Model;
      this.lista107Ready.emit(this.inputLista107);
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

  private equals(obj: Casilla107, objNuevo: Casilla107): boolean {
    return objNuevo.tipDoc === obj.tipDoc &&
      objNuevo.numDoc === obj.numDoc &&
      objNuevo.desRazSoc === obj.desRazSoc &&
      objNuevo.perServicio === obj.perServicio &&
      objNuevo.codTipComp === obj.codTipComp &&
      objNuevo.numSerie === obj.numSerie &&
      objNuevo.numComp === obj.numComp &&
      objNuevo.fecEmi === obj.fecEmi &&
      objNuevo.mtoAtribuido === obj.mtoAtribuido;
  }
}
