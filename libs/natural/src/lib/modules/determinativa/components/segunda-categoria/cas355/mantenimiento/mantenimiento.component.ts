import { ConstantesExcepciones, ConstantesMensajesInformativos } from '@path/natural/utils';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../../../utils/ngb-date-parsear-formato';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationService } from '../../../../../../components/error-message/validation.service';
import { I18n } from '../../../../../../utils/ngdatepicker/i18n';
import { CustomDatepickerI18n } from '../../../../../../utils/ngdatepicker/custom-datepicker-i18n';
import { ParametriaFormulario, PreDeclaracionService, MostrarMensajeService } from '@path/natural/services';
import { Observable, throwError, of, EMPTY, zip } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { CasillasUtil } from '@rentas/shared/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { PersonaJuridica, PersonaNatural } from '@rentas/shared/types';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { ConstantesCombos, ConstantesDocumentos } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils';
import { Casilla355, ListaParametrosModel } from '@path/natural/models';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  providers: [
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato }
  ]
})

export class C355MantenimientoComponent extends CasillasUtil implements OnInit {

  @Input() inputLista355: Casilla355[];
  @Output() lista355Ready = new EventEmitter<Casilla355[]>();
  @Input() inputCasilla355: Casilla355;
  @Input() inputIndexCasilla355: number;

  public frmCasilla355: FormGroup;
  public tiposDocumentos: ListaParametrosModel[];
  public listaFuentePerdida: Array<any>;
  public listaTiposDocumento: ListaParametrosModel[] = [];
  public descTipdoc: string;
  public nroDoc: string;
  public submitted = false;
  private funcionesGenerales: FuncionesGenerales;
  public error355 = ConstantesExcepciones;
  public txtrazsoc = '';
  public placeholder = 'ingresar';
  public anio: number;
  public numRazPlaceholder = 'ingresar';

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private preDeclaracionservice: PreDeclaracionService,
    private cus10Service: ParametriaFormulario,
    private comboService: ComboService,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService,
    private mostrarMensaje: MostrarMensajeService) { 
      super();
    }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.anio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    this.setListaParametros();
    const rucDeclarante = this.preDeclaracionservice.obtenerRucPredeclaracion();
    this.nroDoc = 'Número de documento';
    this.descTipdoc = 'Tipo de documento';

    this.frmCasilla355 = this.fb.group({
      cmbTipoFuentePerdida: [this.inputCasilla355 ? this.inputCasilla355.codTipFteRta : '', Validators.required],
      cmbTipoDocumento: [this.inputCasilla355 ? this.inputCasilla355.codTipDoc : '', Validators.required],
      txtNumDoc: [this.inputCasilla355 ? this.inputCasilla355.numDoc : '', Validators.required],
      txtRazonSocial: [this.inputCasilla355 ? this.inputCasilla355.desRazSoc : ''],
      periodo: [this.obtenerValoresPerido()],
      txtPrecVenta: [this.inputCasilla355 ? this.inputCasilla355.mtoPrecVenta : '', Validators.required],
      txtCostComputable: [this.inputCasilla355 ? this.inputCasilla355.mtoCostoComp : '', Validators.required],
      txtMonPerdida: [this.inputCasilla355 ? this.inputCasilla355.mtoPerdida : '', Validators.required],
      txtCantValores: [this.inputCasilla355 ? this.inputCasilla355.cntVal : '', Validators.required],
      txtRucEmisora: [this.inputCasilla355 ? this.inputCasilla355.numRucEmi : '', Validators.required],
      txtRazonSocialEmi: [this.inputCasilla355 ? this.inputCasilla355.desRazSocEmi : ''],
    }, {
      validators:
        [
          ValidationService.validarNrodoc('cmbTipoDocumento', 'txtNumDoc', 'CUS10', rucDeclarante),
          ValidationService.validarNrodoc(ConstantesDocumentos.RUC, 'txtRucEmisora', 'CUS10', rucDeclarante),
          ValidationService.soloNumeros('txtPrecVenta', 'CUS10', 'si', '', 'cmbTipoFuentePerdida', ''),
          ValidationService.soloNumeros('txtCostComputable', 'CUS10', 'si', '', 'cmbTipoFuentePerdida', ''),
          ValidationService.soloNumeros('txtMonPerdida', 'CUS10', 'si', '', 'cmbTipoFuentePerdida', 'si'),
          ValidationService.soloNumeros('txtCantValores', 'CUS10', '', '', '', ''),
        ]
    });

    this.f.txtRazonSocialEmi.disable();

    if (this.inputCasilla355) {
      this.descripcionCamposYListaTipoDocumento();
      this.deshabilitarCamposAlEditar();
      this.f.cmbTipoFuentePerdida.value === '03' ? this.f.txtMonPerdida.disable() : this.f.txtMonPerdida.enable();
    }
  }

  public get f() { return this.frmCasilla355.controls; }

  private obtenerValoresPerido(): any {
    if (this.inputCasilla355) {
      return this.funcionesGenerales.obtenerPeriodoAlEditar(this.inputCasilla355.perRta);
    } else {
      return { year: 'AAAA', month: 'MM' };
    }
  }

  private setListaParametros(): void {
    this.listaFuentePerdida = this.cus10Service.obtenerfuenteperdida();
    const listaParametro = [ConstantesDocumentos.DNI, ConstantesDocumentos.CARNET_DE_EXTRANJERIA, ConstantesDocumentos.RUC,
    ConstantesDocumentos.PASAPORTE, ConstantesDocumentos.PTP, ConstantesDocumentos.CARNET_IDENTIDAD, ConstantesDocumentos.SIN_RUC];
    this.tiposDocumentos = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO, listaParametro);
  }

  private descripcionCamposYListaTipoDocumento(): void {
    this.listaTiposDocumento = [];
    switch (this.f.cmbTipoFuentePerdida.value) {
      case '01': {
        this.descTipdoc = 'Tipo de documento';
        this.nroDoc = 'Número de documento';
        this.listaTiposDocumento = this.tiposDocumentos.filter(x => x.val === ConstantesDocumentos.RUC);
        break;
      }
      case '02': {
        this.descTipdoc = 'Tipo de documento';
        this.nroDoc = 'Número de documento';
        this.listaTiposDocumento = this.tiposDocumentos.filter(x => x.val === ConstantesDocumentos.SIN_RUC);
        break;
      }
      case '03': {
        this.descTipdoc = 'Tipo de documento del adquirente o comprador';
        this.nroDoc = 'Número de documento del adquirente o comprador';
        this.listaTiposDocumento = this.tiposDocumentos.filter(x => x.val !== ConstantesDocumentos.SIN_RUC);
        break;
      }
      default: {
        this.descTipdoc = 'Tipo de documento';
        this.nroDoc = 'Número de documento';
      }
    }
  }

  private deshabilitarCamposAlEditar(): void {
    const campos = [this.f.cmbTipoFuentePerdida, this.f.cmbTipoDocumento, this.f.txtNumDoc, this.f.txtPrecVenta, this.f.txtCostComputable,
    this.f.txtCantValores, this.f.txtRucEmisora, this.f.txtRazonSocial];
    this.funcionesGenerales.desHabilitarCampos(campos);
    this.placeholder = '';
  }

  public funcionesChange() {
    this.habilitarcampo();
    this.validarDocumento();
  }

  private habilitarcampo() {
    const tipDocRUCyDNI = [ConstantesDocumentos.DNI, ConstantesDocumentos.RUC];
    const tipDocDistintoRUCyDNI = [ConstantesDocumentos.PASAPORTE, ConstantesDocumentos.CARNET_DE_EXTRANJERIA, ConstantesDocumentos.PTP,
    ConstantesDocumentos.CARNET_IDENTIDAD];
    this.f.txtRazonSocial.setValue('');
    this.f.txtNumDoc.setValue('');
    if (tipDocDistintoRUCyDNI.includes(this.f.cmbTipoDocumento.value)) {
      this.f.txtRazonSocial.enable();
      this.numRazPlaceholder = 'INGRESAR';
    } else if (tipDocRUCyDNI.includes(this.f.cmbTipoDocumento.value)) {
      this.f.txtRazonSocial.disable();
      this.numRazPlaceholder = '';
    } else {
      this.f.txtRazonSocial.disable();
    }
  }

  public CalculoMonto(): void {
    const calculo = this.f.txtCostComputable.value - this.f.txtPrecVenta.value;
    this.f.txtMonPerdida.setValue(calculo.toFixed(2));
  }

  public cambiarFuentePerdida(): void {
    this.placeholder = '';
    this.descripcionCamposYListaTipoDocumento();
    const campoVacio = [this.f.txtRazonSocial, this.f.txtPrecVenta, this.f.txtCostComputable, this.f.txtMonPerdida,
    this.f.txtCantValores, this.f.txtRucEmisora];
    const camposDesHabilitados = [this.f.cmbTipoDocumento, this.f.txtRazonSocial, this.f.txtPrecVenta, this.f.txtCostComputable,
    this.f.txtCantValores, this.f.txtRucEmisora];
    const camposHabilitados = [this.f.cmbTipoDocumento, this.f.txtNumDoc, this.f.txtPrecVenta, this.f.txtCostComputable,
    this.f.txtCantValores, this.f.txtRucEmisora];
    const camposDefaultHabilitados = [this.f.cmbTipoDocumento, this.f.txtNumDoc];
    switch (this.f.cmbTipoFuentePerdida.value) {
      case '01': {
        this.f.cmbTipoDocumento.setValue(ConstantesDocumentos.RUC);
        this.funcionesGenerales.setearVacioEnCampos(campoVacio.concat(this.f.txtNumDoc, this.f.txtRazonSocialEmi));
        this.funcionesGenerales.desHabilitarCampos(camposDesHabilitados);
        this.f.txtNumDoc.enable();
        this.f.txtMonPerdida.enable();
        this.numRazPlaceholder = '';
        break;
      }
      case '02': {
        this.f.cmbTipoDocumento.setValue(ConstantesDocumentos.SIN_RUC);
        this.generarCorrelativo();
        this.funcionesGenerales.setearVacioEnCampos(campoVacio.concat(this.f.txtRazonSocialEmi));
        this.funcionesGenerales.desHabilitarCampos(camposDesHabilitados.concat(this.f.txtNumDoc));
        this.f.txtMonPerdida.enable();
        this.f.txtRazonSocial.enable();
        this.numRazPlaceholder = 'ingresar';
        break;
      }
      case '03': {
        this.funcionesGenerales.setearVacioEnCampos(campoVacio.concat(this.f.cmbTipoDocumento, this.f.txtNumDoc));
        this.funcionesGenerales.habilitarCampos(camposHabilitados);
        this.f.txtRazonSocial.enable();
        this.f.txtMonPerdida.disable();
        this.placeholder = 'ingresar';
        this.numRazPlaceholder = 'ingresar';
        break;
      }
      default: {
        this.funcionesGenerales.setearVacioEnCampos(campoVacio.concat(this.f.cmbTipoDocumento, this.f.txtNumDoc, this.f.txtRazonSocialEmi));
        this.funcionesGenerales.habilitarCampos(camposDefaultHabilitados.concat(this.f.txtMonPerdida));
        this.funcionesGenerales.desHabilitarCampos(camposDefaultHabilitados.filter(x => !camposDefaultHabilitados.includes(x)));
        this.placeholder = 'ingresar';
        this.numRazPlaceholder = 'ingresar';
        this.f.txtRazonSocial.enable();
        break;
      }
    }
  }

  private generarCorrelativo(): void {
    const listaSinRuc = this.inputLista355.filter(x => x.codTipDoc === ConstantesDocumentos.SIN_RUC);
    const correlativo = listaSinRuc.length !== 0 ? Number([...listaSinRuc].pop().numDoc) + 1 : 1;
    this.f.txtNumDoc.setValue(this.autocompletarCerosIzquierda('0' + correlativo, 11));
  }

  private autocompletarCerosIzquierda(nro, maxlongitud): string {
    nro = nro.toString();
    return nro.length < maxlongitud ? this.autocompletarCerosIzquierda('0' + nro, maxlongitud) : nro;
  }

  private validarDocumento(): void {
    this.f.cmbTipoDocumento.valueChanges.subscribe(data => {
      this.f.txtNumDoc.markAsUntouched();
      this.f.txtNumDoc.setValue(this.f.txtNumDoc.value);
    });
  }

  public validarEspacio(val: any): void {
    this.f.txtNumDoc.setValue(val.trim());
  }
  /** 1.Obtener Nombre / Razon Social del contribuyente si existe en la base de SUNAT --------------------------------------- */
  public obtenerNombreRazonSocial(): void {
    if (this.f.txtRazonSocial.disabled === true) {
      this.f.txtRazonSocial.setValue('');
    }
    this.autocompletarNombreRazonSocial().subscribe();
  }

  private cumpleCondicion(): boolean {
    return !this.f.txtNumDoc.errors && this.f.txtRazonSocial.value === '' &&
      (this.f.cmbTipoDocumento.value === ConstantesDocumentos.RUC || this.f.cmbTipoDocumento.value === ConstantesDocumentos.DNI);
  }

  private tipoContribuyente(): Observable<string> {
    if (this.f.txtNumDoc.value && this.f.cmbTipoDocumento.value === ConstantesDocumentos.DNI) {
      return of(ConstantesDocumentos.DNI);
    } else if (this.f.txtNumDoc.value && this.f.cmbTipoDocumento.value === ConstantesDocumentos.RUC) {
      return of(ConstantesDocumentos.RUC);
    } else {
      this.f.txtRazonSocial.setValue('');
      return EMPTY;
    }
  }

  private autocompletarNombreRazonSocial(): Observable<any> {
    if (this.cumpleCondicion()) {
      this.spinner.show();
      return this.tipoContribuyente().pipe(
        switchMap(tipo => tipo === ConstantesDocumentos.DNI ? this.validarExistenciaPersona() : this.validarExistenciaContribuyente()),
        catchError(error => {
          switch (this.f.cmbTipoDocumento.value) {
            case ConstantesDocumentos.DNI: this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX03 }); break;
            case ConstantesDocumentos.RUC: this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX04 }); break;
          }
          this.spinner.hide();
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private validarExistenciaPersona(): Observable<any> {
    return this.personaService.obtenerPersona(this.f.txtNumDoc.value)
      .pipe(
        tap(data => this.obtenerNombrePersona(data)));
  }

  private obtenerNombrePersona(data: PersonaNatural): void {
    const nombre = data.desNombrePnat + ' ' + data.desApepatPnat + ' ' + data.desApematPnat;
    this.f.txtRazonSocial.setValue(nombre);
    this.f.txtRazonSocial.disable();
    this.spinner.hide();
  }

  private validarExistenciaContribuyente(): Observable<any> {
    return this.personaService.obtenerContribuyente(this.f.txtNumDoc.value)
      .pipe(
        tap(data => this.obtenerRazonSocialContribuyente(data)));
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void {
    this.f.txtRazonSocial.setValue(data.ddpNombre.trim());
    this.f.txtRazonSocial.disable();
    this.spinner.hide();
  }
  /** 2. OBTENER LA RAZON SOCIAL DEL EMISOR SI EXISTE EN LA BASE DE SUNAT ------------------------------------------------------- */
  public obtenerRazonSocialEmisor(): void {
    if (this.f.txtRazonSocialEmi.disabled === true) {
      this.f.txtRazonSocialEmi.setValue('');
    }
    this.autocompletarRazonSocialEmisor().subscribe();
  }

  private cumpleCondicionRucEmisora(): boolean {
    return !this.f.txtRucEmisora.errors && this.f.txtRucEmisora.value;
  }

  private autocompletarRazonSocialEmisor(): Observable<any> {
    if (this.cumpleCondicionRucEmisora()) {
      this.spinner.show();
      return this.personaService.obtenerContribuyente(this.f.txtRucEmisora.value)
        .pipe(
          tap(data => this.obtenerRazonSocialContribuyenteEmisor(data)),
          catchError(error => {
            this.f.txtRucEmisora.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX04 });
            this.spinner.hide();
            return throwError(error);
          })
        );
    }
    return of({});
  }

  private obtenerRazonSocialContribuyenteEmisor(data: PersonaJuridica): void {
    this.f.txtRazonSocialEmi.setValue(data.ddpNombre.trim());
    this.spinner.hide();
  }

  public guardar(): void {
    this.submitted = true;
    zip(this.autocompletarNombreRazonSocial(), this.autocompletarRazonSocialEmisor())
      .subscribe(() => {
        if (Number(this.f.txtMonPerdida.value) < 0) {
          this.mostrarMensaje.callModal(ConstantesExcepciones.CUS10_EX11);
          return;
        }

        if (this.frmCasilla355.invalid) {
          return;
        }
        //this.verificarDuplicidadRegistro() ? this.mostrarMensaje.callModal(ConstantesExcepciones.CUS10_EX12) : this.agregaOActualizar();
        this.agregaOActualizar();
      });
  }

  private agregaOActualizar(): void {
    const casilla355Object = {
      codTipFteRta: this.f.cmbTipoFuentePerdida.value,
      codTipDoc: this.f.cmbTipoDocumento.value,
      numDoc: this.f.txtNumDoc.value.toUpperCase(),
      desRazSoc: this.f.txtRazonSocial.value.toUpperCase(),
      perRta: this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value),
      mtoCostoComp: Number(this.f.txtCostComputable.value),
      mtoPrecVenta: Number(this.f.txtPrecVenta.value),
      mtoPerdida: Number(this.f.txtMonPerdida.value),
      cntVal: Number(this.f.txtCantValores.value),
      numRucEmi: this.f.txtRucEmisora.value,
      desRazSocEmi: this.f.txtRazonSocialEmi.value.toUpperCase(),
    };

    const validar = casilla355Object.mtoPerdida > 0 ? true : false;

    if (!this.inputCasilla355) {
      this.inputLista355.push(casilla355Object);
      this.lista355Ready.emit(this.inputLista355);
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_GRABADO_DATOS_EXITOSO);
    } else if (!this.equals(this.inputCasilla355, casilla355Object)) {
      this.inputLista355[this.inputIndexCasilla355] = casilla355Object;
      this.lista355Ready.emit(this.inputLista355);
    }
    this.activeModal.close();
  }

  private verificarDuplicidadRegistro() {    
    return this.inputLista355.some(x => {
      //console.log(this.f.txtNumDoc.value.toUpperCase() + "___" + x.numDoc);
      return this.f.cmbTipoFuentePerdida.value === x.codTipFteRta && this.f.cmbTipoDocumento.value === x.codTipDoc &&
        Number(this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value)) === Number(x.perRta) &&
        this.f.txtNumDoc.value.toUpperCase() === x.numDoc && (this.inputCasilla355 ? x !== this.inputCasilla355 : true);
    });
  }

  private equals(obj: Casilla355, objNuevo: Casilla355): boolean {
    return objNuevo.codTipFteRta === obj.codTipFteRta &&
      objNuevo.codTipDoc === obj.codTipDoc &&
      objNuevo.numDoc === obj.numDoc &&
      objNuevo.desRazSoc === obj.desRazSoc &&
      objNuevo.perRta === obj.perRta &&
      objNuevo.mtoCostoComp === obj.mtoCostoComp &&
      objNuevo.mtoPrecVenta === obj.mtoPrecVenta &&
      objNuevo.mtoPerdida === obj.mtoPerdida &&
      objNuevo.cntVal === obj.cntVal &&
      objNuevo.numRucEmi === obj.numRucEmi &&
      objNuevo.desRazSocEmi === obj.desRazSocEmi;
  }
}
