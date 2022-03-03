import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PreDeclaracionModel, InfAtribucionGastosModel, LCas514Detalle, ListaParametrosModel, InfAlquileresModel, Casilla514Cabecera } from '@path/natural/models';
import { PreDeclaracionService, ParametriaFormulario, MostrarMensajeService } from '@path/natural/services';
import { ValidationService, UtilsComponent } from '@path/natural/components';
import {
  ConstantesSeccionDeterminativa, NgbDateParsearFormato, CustomDatepickerI18n, I18n,
  ConstantesExcepciones, ConstantesCasilla514, ConstantesMensajesInformativos
} from '@path/natural/utils';
import { NgbActiveModal, NgbDatepickerConfig, NgbDatepickerI18n, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, EMPTY, Observable, throwError, zip } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { ParametrosHoteles514 } from '@path/natural/models/parametrosModelCasilla514';
import { PersonaJuridica } from '@rentas/shared/types';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { ConstantesCombos, ConstantesDocumentos } from '@rentas/shared/constantes';
import { SessionStorage, FuncionesGenerales } from '@rentas/shared/utils';
import { data } from 'jquery';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  providers: [
    I18n,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato },
  ],
})
export class Sfec514AlquileresMantenimientoComponent implements OnInit {
  @Input() inputId: LCas514Detalle;
  @Input() public modal;
  @Input() inputListaBienes: LCas514Detalle[];
  @Output() listaBienesReady = new EventEmitter<LCas514Detalle[]>();
  @Input() inputIndex: number;

  public submitted = false;
  public frmCasilla514: FormGroup;
  private preDeclaracion: PreDeclaracionModel;
  private anioEjercicio: number;
  private AtribucionRecibida: InfAtribucionGastosModel[];
  private AtribucionRealizada: InfAtribucionGastosModel[];
  public mensaje514 = ConstantesExcepciones;
  public listaTipoComprobante: ListaParametrosModel[];
  public listaTipoBien: ListaParametrosModel[];
  public listaFormaPago: ListaParametrosModel[];
  public listaTipoVinculo: ListaParametrosModel[];
  public disabledFecha = false;
  private existeDataFormulario1683: boolean;
  private existeDataFactura: boolean;
  public placeholder = 'ingresar';
  private fechaConsultaFactura: any;
  private existeDataPrevia1683: boolean;
  private funcionesGenerales: FuncionesGenerales;
  private rucDeclarante: string;
  private fechaServidor: number;

  public showHtml: String;
  public isShowIncon: boolean = false;
  public lstParametriaObservaciones;
  private lista514: Casilla514Cabecera[];
  private TipoGastoAlquiler = '01';

  constructor(
    private preDeclaracionservice: PreDeclaracionService,
    private cus27Service: ParametriaFormulario,
    private fb: FormBuilder,
    private personaService: ConsultaPersona,
    public activeModal: NgbActiveModal,
    private cus34Service: ParametriaFormulario,
    private config: NgbDatepickerConfig,
    private spinner: NgxSpinnerService,
    private comboService: ComboService,
    private mostrarMensaje: MostrarMensajeService,
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.fechaServidor = this.getFechaServidor();
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.anioEjercicio = Number(
      this.preDeclaracionservice.obtenerAnioEjercicio()
    );
    this.rucDeclarante = this.preDeclaracionservice.obtenerRucPredeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();

    this.obtenerListasParametria();
    this.limitarSeleccionFechaComprobante();   

    this.lstParametriaObservaciones = this.comboService.obtenerComboPorNumero(ConstantesCombos.OBSERVACIONES_GASTOS_DEDUCIBES);

    this.frmCasilla514 = this.fb.group(
      {
        desNomEmisor: [this.inputId ? this.inputId.desNomEmisor.trim() : ''],
        desInconsistencia: [this.inputId ? this.inputId.desInconsistencia : ''],
        numDocEmisor: [
          this.inputId ? this.inputId.numDocEmisor.trim() : '',
          Validators.required,
        ],
        codTipComprob: [
          this.inputId ? this.obtenerTipoComprobanteAlEditar() : '',
          Validators.required,
        ],
        numComprob: [
          this.inputId ? this.inputId.numComprob.trim() : '',
          Validators.required,
        ],
        fecComprob: [
          this.inputId ? this.obtenerFecha() : '',
          Validators.required,
        ],
        codTipBien: [
          this.inputId ? this.inputId.codTipBien.trim() : '',
          Validators.required,
        ],
        codForPago: [
          this.inputId ? this.inputId.codForPago.trim() : '',
          Validators.required,
        ],
        mtoComprob: [
          this.inputId ? this.inputId.mtoComprob : '',
          Validators.required,
        ],
        porDeduccion: [
          this.inputId
            ? this.inputId.porDeduccion
            : ConstantesCasilla514.PORCENTAJE_DEDUCCION_ALQUILERES,
          Validators.required,
        ],
        porAtribucion: [
          this.inputId ? this.inputId.porAtribucion : '',
          Validators.required,
        ],
        mtoOriginal: [
          this.inputId ? this.inputId.mtoAtribuir : '',
          Validators.required,
        ],
        mtoDeduccion: [
          this.inputId ? String(this.inputId.mtoDeduccion) : '',
          Validators.required,
        ],
        codTipVinc: [
          this.inputId ? this.obtenerTipovinculo() : '',
          Validators.required,
        ],
        desNomTit: [
          this.inputId ? this.inputId.desNomTit : '',
          Validators.required,
        ],
        periodo: [
          this.inputId ? this.inputId.periodo : '',
          Validators.required,
        ],
        numSerie: [
          this.inputId ? this.inputId.numSerie : '',
          Validators.required,
        ],
      },
      {
        validators: [
          ValidationService.validarNrodoc(
            ConstantesDocumentos.RUC,
            'numDocEmisor',
            'CUS32_1',
            this.rucDeclarante
          ),
          ValidationService.soloNumeros(
            'mtoDeduccion',
            'CUS32_1',
            'deducir',
            'si',
            'codTipBien',
            'codForPago'
          ),
          ValidationService.soloNumeros('mtoComprob', 'CUS32_2', 'si', 'si'),
          ValidationService.validarMonto(
            'mtoComprob',
            'codForPago',
            'ALQUILERES'
          ),
          ValidationService.validarNroCompro('numComprob'),
          ValidationService.validarFechasEsp(
            'fecComprob',
            'codTipComprob',
            this.anioEjercicio
          ),
          ValidationService.total('mtoOriginal', 'mtoDeduccion', 'CUS32'),
          ValidationService.validarNumSerie('codTipComprob', 'numSerie'),
        ],
      }
    );

    this.disableCamposAlAgregar();
    this.obtenerInformacionConyugal();
    this.disableCamposAlEditarRegistro();
  }

  public get f() {
    return this.frmCasilla514.controls;
  }
  /* METODOS AL INICAR EL REGISTRO O EDICION ---------------------------------------------------------------------------------------- */
  private getFechaServidor(): number {
    const fecha = SessionStorage.getFechaServidor().fecha;
    return Number(moment(fecha).format('YYYYMMDD'));
  }

  private obtenerListasParametria(): void {
    this.AtribucionRecibida = this.preDeclaracion.declaracion.seccInformativa.atribucionesGastos.lisAtribGastos.filter(
      (x) => x.indTipoAtrib === ConstantesCasilla514.IND_ATRIBUCION_RECIBIDA
    );
    this.AtribucionRealizada = this.preDeclaracion.declaracion.seccInformativa.atribucionesGastos.lisAtribGastos.filter(
      (x) => x.indTipoAtrib === ConstantesCasilla514.IND_ATRIBUCION_REALIZADA
    );
    this.listaTipoComprobante = this.cus27Service.obtenerTipoComprobante_cus27();
    this.listaFormaPago = this.cus27Service.obtenerFormaPago();
    this.listaTipoVinculo = this.cus34Service.obtenerTipoVinculo();
    this.obtenerListaTipoBien();
  }

  private obtenerListaTipoBien(): void {
    this.listaTipoBien = this.comboService.obtenerComboPorNumero(
      ConstantesCombos.TIPO_BIEN_514_v2
    );
    this.listaTipoBien.pop();
    //this.listaTipoBien[0].desc = ConstantesCasilla514.DESCRIPCION_BIEN_INMUEBLE;
    this.listaTipoBien.forEach((x) => {
      x.val = '0' + x.val;
    });
  }

  private limitarSeleccionFechaComprobante(): void {
    this.config.minDate = { year: this.anioEjercicio, month: 1, day: 1 };
    this.config.maxDate = { year: this.anioEjercicio + 1, month: 1, day: 31 };
  }

  private disableCamposAlAgregar(): void {
    const campos = [
      this.f.codTipVinc,
      this.f.desNomTit,
      this.f.desNomEmisor,
      this.f.porDeduccion,
      this.f.porAtribucion,
      this.f.mtoOriginal,
    ];
    this.funcionesGenerales.desHabilitarCampos(campos);
  }

  private obtenerTipoComprobanteAlEditar(): string {
    if (
      this.inputId.codTipComprob.trim() &&
      (this.inputId.codTipComprob ===
        ConstantesCasilla514.COD_TIPO_COMPROB_FACTURA ||
        this.inputId.codTipComprob ===
        ConstantesCasilla514.COD_TIPO_COMPROB_1683)
    ) {
      return this.inputId.codTipComprob;
    }
    return '';
  }

  private obtenerInformacionConyugal(): void {
    if (this.AtribucionRealizada.length > 0) {
      this.AtribucionRealizada.forEach((x) => {
        this.f.porAtribucion.setValue(50);
      });
    } else if (this.AtribucionRecibida.length === 0) {
      this.f.porAtribucion.setValue(0);
    }
  }

  private obtenerTipovinculo(): string {
    const descripcionTipVin = this.listaTipoVinculo.find(
      (x) => x.val === this.inputId.codTipVinc
    );
    return descripcionTipVin ? descripcionTipVin.desc : '';
  }

  private obtenerFecha(): { day: number; month: number; year: number } {
    return {
      day: Number(this.inputId.fecComprob.substring(8, 10)),
      month: Number(this.inputId.fecComprob.substring(5, 7)),
      year: Number(this.inputId.fecComprob.substring(0, 4)),
    };
  }

  private disableCamposAlEditarRegistro(): void {   
    if (this.inputId) {
      this.inputId.indArchPers ===
        ConstantesCasilla514.IND_ARCHIVO_PERSONALIZADO
        ? this.disableCamposAlEditarPersonalizado()
        : this.disableCamposAlEditarNoPersonalizado();
      if (Number(this.anioEjercicio) >= 2021) {
        this.isShowIncon = true;
        this.showHtml = this.getDescripcionInconsistencias();
      }

    } else {
      this.f.codTipComprob.value ===
        ConstantesCasilla514.COD_TIPO_COMPROB_FACTURA
        ? (this.existeDataFactura = true)
        : (this.f.codTipBien.enable(), (this.existeDataFormulario1683 = true));
    }
  }

  private getDescripcionInconsistencias2(): String {

    const codTipBien = this.f.codTipBien.value;
    const codFormPago = this.f.codForPago.value;

    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;

    this.lista514.forEach(x => {

      switch (x.indTipoGasto) {
        case this.TipoGastoAlquiler: {
          var listaArtesanos = x.casilla514Detalle.lisCas514.filter(y => this.equals(y, this.inputId));
          //listaArtesanos = listaArtesanos.filter(y => y.indInconsistencia === '1');
          if (listaArtesanos.length != 0) {
            //let desInconsistencia = listaArtesanos[0].desInconsistencia.trim().split(",");
            let desInconsistencia = this.f.desInconsistencia.value ? this.f.desInconsistencia.value.split(",") : null;
            if(desInconsistencia !== null){
              
              if ((codTipBien == '01' || codTipBien == '02')) {
                desInconsistencia = desInconsistencia.filter(e => e !== 'I9');
              }
              if (codFormPago == '01') {
                desInconsistencia = desInconsistencia.filter(e => e !== 'I4');
                desInconsistencia = desInconsistencia.filter(e => e !== 'IB');
              }
              desInconsistencia = desInconsistencia.filter(e => e !== 'IK');
              desInconsistencia = desInconsistencia.filter(e => e !== 'IL');
  
              this.f.desInconsistencia.setValue(desInconsistencia.toString());

            }

            
          }
        }
      }

    });

    //SessionStorage.setPreDeclaracion(this.preDeclaracion);

    //const lstCodigosInconsistencias = this.inputId ? this.inputId.desInconsistencia.trim().split(",") : [];//CODIGOS DE INCONSISTENCIA DEL REGISTRO
    const lstCodigosInconsistencias = this.f.desInconsistencia.value !== "" ? this.f.desInconsistencia.value.split(",") : [];//CODIGOS DE INCONSISTENCIA DEL REGISTRO
    if (lstCodigosInconsistencias.length == 0) {
      return;
    }
    let li = '';

    lstCodigosInconsistencias.forEach(codigo => {
      const codigoParametro = codigo.trim();
      const data = this.lstParametriaObservaciones.find((x) =>
        x.val == codigoParametro

      );
      //debugger;
      const desc = data?.desc ?? '';
      if (data != undefined) {
        this.isShowIncon = true;
        if (!(data.val == 'I9' && (codTipBien == '01' || codTipBien == '02'))) {
          if (!(data.val == 'I4' && codFormPago == '01')) {
            if (!(data.val == 'IB' && codFormPago == '01')) {
              if (desc != '') {
                li += '<li>' + desc + '</li>'
              }
            }
          }
          /*if (desc != '') {
            li += '<li>' + desc + '</li>'
          }*/
        }
      }
    });



    const modal = {
      titulo: 'Mensaje',
      mensaje: "<p>El comprobante mantiene observaciones no subsanadas : </p><ul>" + li + "</ul>",
    };
    const modalRef = this.modalService.open(
      UtilsComponent,
      this.funcionesGenerales.getModalOptions({})
    );
    modalRef.componentInstance.modal = modal;
    return modalRef.componentInstance.respuesta;
    //return;
  }

  private getDescripcionInconsistencias(): String {

    //this.addDescripInconsistencias();
    

    //const indInconsistencias = this.inputId ? this.inputId.indInconsistencia : "";//CODIGOS DE INCONSISTENCIA DEL REGISTRO
    //const lstCodigosInconsistencias = this.inputId ? this.inputId.desInconsistencia.trim().split(",") : [];
    
    //this.desInconsistenciaHidden = this.inputId.desInconsistencia.trim();

    let li = '';
    this.isShowIncon = false;

    if (this.f.desInconsistencia.value !== null) {

      if (this.f.desInconsistencia.value !== "") {

        //if (indInconsistencias == "1") {

        const lstCodigosInconsistencias = this.f.desInconsistencia.value !== "" ? this.f.desInconsistencia.value.split(",") : [];//CODIGOS DE INCONSISTENCIA DEL REGISTRO
        const codTipBien = this.f.codTipBien.value;
        const codFormPago = this.f.codForPago.value;

        lstCodigosInconsistencias.forEach(codigo => {
          const codigoParametro = codigo.trim();
          const data = this.lstParametriaObservaciones.find((x) =>
            x.val == codigoParametro
          );
          //debugger;
          const desc = data?.desc ?? '';
          if (data != undefined) {
            this.isShowIncon = true;
            if (!(data.val == 'I9' && (codTipBien == '01' || codTipBien == '02'))) {//PARA TIPO DE BIEN
              //PARA FORMA DE PAGO
              if (!(data.val == 'I4' && codFormPago == '01')) {
                if (!(data.val == 'IB' && codFormPago == '01')) {
                  if (desc != '') {
                    li += '<li>' + desc + '</li>'
                  }
                }
              }
              /*if (desc != '') {
                li += '<li>' + desc + '</li>'
              }*/
            }
          }

        });
        //}

      }

    }



    return li == "" ? "" : "<p>Observación : </p><ul>" + li + "</ul>";

  }

  private addDescripInconsistencias() {
    
    const codFormPago = this.f.codForPago.value;
    const codTipBien = this.f.codTipBien.value;
    const id = this.inputId;
    this.preDeclaracion = SessionStorage.getPreDeclaracion();

    this.lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
      
    this.lista514.forEach(x => {

      switch (x.indTipoGasto) {
        case this.TipoGastoAlquiler: {
          //var listaArtesanos = x.casilla514Detalle.lisCas514.filter(y => y.indInconsistencia === '1')
          var listaAlquiler = x.casilla514Detalle.lisCas514.filter(y => this.equals(y, this.inputId));
          listaAlquiler = listaAlquiler.filter(y => y.indInconsistencia === '1');
         
          if (listaAlquiler.length != 0) {
            let desInconsistencia = listaAlquiler[0].desInconsistencia ? listaAlquiler[0].desInconsistencia.trim().split(",") : "";
            var existe = desInconsistencia.includes('I9');
            if (!existe) {
              if (codTipBien !== '01' && codTipBien !== '02') {
                desInconsistencia = desInconsistencia.concat("I9");
              }
            }

            existe = desInconsistencia.includes('I4');
            if (!existe) {
              if (codFormPago !== '01') {
                desInconsistencia = desInconsistencia.concat("I4");
              }
            }

            existe = desInconsistencia.includes('IB');
            if (!existe) {
              if (codFormPago !== '01') {
                desInconsistencia = desInconsistencia.concat("IB");
              }
            }

            this.f.desInconsistencia.setValue(desInconsistencia.toString());
          }

        }
      }

    });

    /*if(isUptsesion){
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
    }*/



  }

  private disableCamposAlEditarPersonalizado(): void {
    const campos = [
      this.f.numDocEmisor,
      this.f.codTipComprob,
      this.f.numComprob,
      this.f.fecComprob,
      this.f.mtoComprob,
      this.f.numSerie,
    ];
    this.funcionesGenerales.desHabilitarCampos(campos);
    this.f.codTipBien.enable();
    this.disabledFecha = true;
  }

  private disableCamposAlEditarNoPersonalizado(): void {
    if (
      this.inputId.indTipoAtrib === ConstantesCasilla514.IND_ATRIBUCION_RECIBIDA
    ) {
      this.disableCamposAtribuidos();
    } else {
      this.inputId.codTipComprob === ConstantesCasilla514.COD_TIPO_COMPROB_1683
        ? this.disableCamposEditarFV1683()
        : this.disableCamposEditarFactura();
    }
  }

  private disableCamposAtribuidos(): void {
    const campos = [
      this.f.numDocEmisor,
      this.f.codTipComprob,
      this.f.numComprob,
      this.f.fecComprob,
      this.f.codTipBien,
      this.f.codForPago,
      this.f.mtoComprob,
      this.f.numSerie,
    ];
    this.funcionesGenerales.desHabilitarCampos(campos);
    this.disabledFecha = true;
    this.f.codTipComprob.value === ConstantesCasilla514.COD_TIPO_COMPROB_FACTURA
      ? (this.existeDataFactura = true)
      : (this.existeDataFormulario1683 = true);
  }

  private disableCamposEditarFV1683(): void {
    const camposDeshab = [
      this.f.numDocEmisor,
      this.f.codTipComprob,
      this.f.numSerie,
      this.f.fecComprob,
    ];
    this.funcionesGenerales.desHabilitarCampos(camposDeshab);
    this.disabledFecha = true;
    this.disableTipoBien();
    this.disableMtoDeduccion();
  }

  private disableCamposEditarFactura(): void {
    this.disableMtoDeduccion();
    this.disabledFecha = false;
  }

  private disableTipoBien(): void {
    this.preDeclaracionservice
      .validarNumeroComprobante1683(this.inputId.numComprob)
      .subscribe((data) =>
        data.tipoBien ===
          ConstantesCasilla514.COD_BIEN_INMUEBLE_CONSULTA_COMPROBANTE ||
          data.tipoBien ===
          ConstantesCasilla514.COD_BIEN_MUEBLE_CONSULTA_COMPROBANTE
          ? this.f.codTipBien.disable()
          : this.f.codTipBien.enable()
      );
  }

  private disableMtoDeduccion(): void {
    this.f.codTipBien.value === ConstantesCasilla514.COD_TIPO_BIEN_MUEBLE
      ? this.f.mtoDeduccion.disable()
      : this.f.mtoDeduccion.enable();
  }
  /*------------------------------------------------------------------------------------------------------------------------------------*/

  /* 1. VALIDAR EXISTENCIA DEL PADRON RUC --------------------------------------------------------------------------------------------*/
  public ObtenerEmisor(): void {
    this.f.desNomEmisor.setValue('');
    if (!this.f.numDocEmisor.errors) {
      this.autocompletarNombre().subscribe();
    }
  }

  private autocompletarNombre(): Observable<any> {
    if (!this.f.numDocEmisor.errors && this.f.desNomEmisor.value === '') {
      this.spinner.show();
      return this.consultaServiciosTipoContribuyente(
        this.f.numDocEmisor.value.trim()
      );
    }
    return of({});
  }

  private tipoComprobante(): Observable<string> {
    if (
      this.f.codTipComprob.value === ConstantesCasilla514.COD_TIPO_COMPROB_1683
    ) {
      return of(this.f.codTipComprob.value);
    } else if (
      this.f.codTipComprob.value ===
      ConstantesCasilla514.COD_TIPO_COMPROB_FACTURA
    ) {
      return of(this.f.codTipComprob.value);
    } else {
      return EMPTY;
    }
  }

  private consultaServiciosTipoContribuyente(numDoc): Observable<any> {
    return this.personaService.obtenerContribuyente(numDoc).pipe(
      tap((data) => this.obtenerRazonSocialContribuyente(data)),
      catchError((error) => {
        this.f.numDocEmisor.setErrors({
          '{excepccion01}': ConstantesExcepciones.CUS32_EX03,
        });
        this.spinner.hide();
        return throwError(error);
      })
    );
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void {
    this.f.desNomEmisor.setValue(data.ddpNombre.trim());
    this.spinner.hide();
  }
  /* 1. FIN VALIDACION ----------------------------------------------------------------------------------------------------------------- */
  /* 2. VALIDAR NUMERO DE COMPROBANTE ---------------------------------------------------------------------------------------------------*/
  private parametros(): ParametrosHoteles514 {
    /** Parametros para la validacion del numero de comprobante */
    return {
      numRuc: this.f.numDocEmisor.value.trim(),
      codTipComprob: ConstantesCasilla514.COD_TIPO_COMPROB_FACTURA,
      serie: this.f.numSerie.value.toUpperCase(),
      numComp: Number(this.f.numComprob.value.trim()),
      numEjercicio: this.anioEjercicio,
    };
  }

  public validarEspacioNumeroComprobante(val: any) {
    this.f.numComprob.setValue(val.trim());
  }

  public changeNumeroDeComprobante(): void {
    this.existeDataFormulario1683 = false;
    this.existeDataFactura = false;
    if (!this.f.codTipComprob.errors && !this.f.numComprob.errors) {
      this.ejecutarTipoComprobante().subscribe();
    } else {
      this.limpiarCamposAlNoEncontrarDataFormularios();
    }
  }

  private ejecutarTipoComprobante(): Observable<any> {
    if (
      !this.f.codTipComprob.errors &&
      !this.f.numComprob.errors &&
      this.f.codTipComprob.value !== ''
    ) {
      this.spinner.show();
      return this.tipoComprobante().pipe(
        switchMap((tipo) =>
          tipo === ConstantesCasilla514.COD_TIPO_COMPROB_1683
            ? this.validarNumeroComprobante1683(this.f.numComprob.value.trim())
            : this.validarNumeroComprobanteFactura(this.parametros())
        ),
        catchError((error) => {
          this.limpiarCamposAlNoEncontrarDataFormularios();
          //this.f.numComprob.setErrors({'{excepccion01}': ConstantesExcepciones.CUS32_EX14});
          this.f.numComprob.setErrors({'{excepccion01}': error.error.errors[0].msg});
          this.spinner.hide();
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private validarNumeroComprobante1683(
    numComprobante: string
  ): Observable<any> {
    if (!this.existeDataFormulario1683) {
      return this.preDeclaracionservice
        .validarNumeroComprobante1683(numComprobante)
        .pipe(
          tap((data) => {
            this.existeDataFormulario1683 = true;
            this.existeDataPrevia1683 = true;
            this.validaciones1683(data).subscribe(
              () => {
                this.spinner.show();
                this.consultaServiciosTipoContribuyente(
                  data.numRuc.trim()
                ).subscribe();
              },
              (error) => { }
            );
            this.spinner.hide();
          })
        );
    }
    this.spinner.hide();
    return of({});
  }

  private validaciones1683(data): Observable<any> {
    return this.validacionRectificatoria1683(data).pipe(
      switchMap(() => this.validacionPeriodo1683(data)),
      switchMap(() => this.validarExistenciaFechaFormulario(data)),
      tap(() => {
        this.validacionTipoBien(data);
        this.setearYDeshabilitarCamposAlEncontrarDataFormulario1683(data);
        this.activarMonto();
      }),
      catchError((error) => {
        this.spinner.hide();
        return throwError(error);
      })
    );
  }

  private validacionRectificatoria1683(data: any): any {
    if (
      data.rectificatoria === ConstantesCasilla514.IND_ARCHIVO_PERSONALIZADO
    ) {
      this.f.numComprob.setErrors({
        '{excepccion01}': ConstantesExcepciones.CUS32_EX21,
      });
      return throwError({});
    }
    return of({});
  }

  private validacionPeriodo1683(data: any): Observable<any> {
    if (
      this.anioEjercicio === ConstantesCasilla514.ANIO_EJERCICIO_BASE &&
      Number(data.periodo.substring(0, 4)) !== this.anioEjercicio
    ) {
      this.f.numComprob.setErrors({
        '{excepccion01}': ConstantesExcepciones.CUS32_EX28.replace(
          'AAAA',
          String(this.anioEjercicio)
        ),
      });
      return throwError({});
    } else if (
      this.anioEjercicio > ConstantesCasilla514.ANIO_EJERCICIO_BASE &&
      Number(data.periodo.substring(0, 4)) !== this.anioEjercicio
    ) {
      this.f.numComprob.setErrors({
        '{excepccion01}': ConstantesExcepciones.CUS32_EX29.replace(
          'AAAA',
          String(this.anioEjercicio)
        ),
      });
      return throwError({});
    }
    return of({});
  }

  private validarExistenciaFechaFormulario(data: any): Observable<any> {
    if (data.fecha) {
      return this.validarRangoFecha1683(data.fecha);
    } else {
      this.f.fecComprob.setValue('');
      this.disabledFecha = true;
      return of({});
    }
  }

  private validarRangoFecha1683(fecha: any): Observable<any> {
    const yearFechaComprob = moment(fecha).format('YYYY');
    const monthFechaComprob = moment(fecha).format('MM');
    const esMayorAFechaServidor = this.esfechaComprobanteMayorAFechaServidor(
      fecha
    );
    if (
      this.anioEjercicio === ConstantesCasilla514.ANIO_EJERCICIO_BASE &&
      (this.validarRangoFechaValidaFactura(
        yearFechaComprob,
        monthFechaComprob
      ) ||
        esMayorAFechaServidor)
    ) {
      this.f.numComprob.setErrors({
        '{excepccion01}': ConstantesExcepciones.CUS32_EX16.replace(
          'AAAA',
          String(this.anioEjercicio)
        ).replace('(EEEE)', String(this.anioEjercicio + 1)),
      });
      return throwError({});
    } else if (
      this.anioEjercicio > ConstantesCasilla514.ANIO_EJERCICIO_BASE &&
      this.validarFechaMayorAEneroEjercicioPosterior(fecha)
    ) {
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_RECIBO_DENTRO_PERIODO_DECLARAR)
    }
    this.establecerFechaFormulario1683(fecha);
    return of({});
  }

  private establecerFechaFormulario1683(fecha: any): void {
    const fechaComprobante = {
      year: Number(moment(fecha).format('YYYY')),
      month: Number(moment(fecha).format('MM')),
      day: Number(moment(fecha).format('DD')),
    };
    this.f.fecComprob.setValue(fechaComprobante);
    this.disabledFecha = true;
  }

  private validacionTipoBien(data: any): void {
    if (
      data.tipoBien ===
      ConstantesCasilla514.COD_BIEN_INMUEBLE_CONSULTA_COMPROBANTE ||
      data.tipoBien ===
      ConstantesCasilla514.COD_BIEN_MUEBLE_CONSULTA_COMPROBANTE
    ) {
      const tipoBien = this.listaTipoBien.filter(
        (x) => x.val === '0' + data.tipoBien
      );
      this.f.codTipBien.setValue(tipoBien.length !== 0 ? tipoBien[0].val : '');
      this.f.codTipBien.disable();
    } else if (!this.f.codTipBien.value) {
      this.f.codTipBien.setValue('');
      this.f.codTipBien.enable();
      this.f.codTipBien.setErrors({
        '{excepccion01}': ConstantesExcepciones.CUS32_EX05,
      });
    }
  }

  private validarNumeroComprobanteFactura(
    parametros: ParametrosHoteles514
  ): Observable<any> {
    if (
      !this.f.numDocEmisor.errors &&
      !this.f.numSerie.errors &&
      !this.existeDataFactura
    ) {
      return this.preDeclaracionservice
        .validarNumeroComprobante(parametros)
        .pipe(
          tap((data) => {
            this.setearValoresComprobanteFactura(data);
            this.spinner.hide();
          })
        );
    }
    this.spinner.hide();
    return of({});
  }

  private setearValoresComprobanteFactura(data: any): void {
    this.existeDataFactura = true;
    this.f.fecComprob.setValue(this.setearFechaFactura(data));
    this.f.mtoComprob.setValue(this.getMontoComprobante(data.monto));
    this.calculoMontoDeduccion();
    this.disabledFecha = false;
    this.fechaConsultaFactura = this.setearFechaFactura(data);
    this.f.periodo.setValue(this.obtenerPeriodo(data.periodo));
  }

  private setearFechaFactura(
    data: any
  ): { day: number; month: number; year: number } {
    return {
      year: Number(moment(data.fecEmisionCpe).format('YYYY')),
      month: Number(moment(data.fecEmisionCpe).format('MM')),
      day: Number(moment(data.fecEmisionCpe).format('DD')),
    };
  }

  private FormatearFecha(): string {
    if (this.f.fecComprob.value != null) {
      const fechaComprobante = {
        day: this.f.fecComprob.value.day,
        month: this.f.fecComprob.value.month - 1,
        year: this.f.fecComprob.value.year,
      };
      return moment(fechaComprobante).format('YYYYMMDD');
    }
  }

  private limpiarCamposAlNoEncontrarDataFormularios(): void {
    this.tipoComprobante()
      .pipe(
        tap((tipo) =>
          tipo === ConstantesCasilla514.COD_TIPO_COMPROB_1683
            ? this.limpiarCampoNumComp1683Invalido()
            : this.limpiarCamposAlNoEncontrarDataFormularioFactura()
        )
      )
      .subscribe();
  }

  private setearYDeshabilitarCamposAlEncontrarDataFormulario1683(data: any): void {
    const campos = [
      this.f.numDocEmisor,
      this.f.codTipComprob,
      this.f.numSerie,
      this.f.fecComprob,
      this.f.periodo,
    ];
    this.f.numDocEmisor.setValue(data.numRuc);
    this.f.numSerie.setValue(data.codFormulario);
    this.f.mtoComprob.setValue(this.getMontoComprobante(data.monComprobante));
    this.f.periodo.setValue(this.obtenerPeriodoParaElCampo(data.periodo));
    this.funcionesGenerales.desHabilitarCampos(campos);
    this.calculoMontoDeduccion();
  }
  public obtenerPeriodoParaElCampo(val: string): string {
    return val.substring(4, 6) + "/" + val.substring(0, 4);
  }
  public obtenerPeriodo(val: string): string {
    return val.substring(3) + val.substring(0, 2);
  }
  private getMontoComprobante(montoServicio): any {
    const sonDiferentesLosMontos = Number(this.f.mtoComprob.value) != Number(montoServicio);
    if (this.inputId && sonDiferentesLosMontos) {
      return this.f.mtoComprob.value;
    } else {
      return montoServicio;
    }
  }

  private limpiarCampoNumComp1683Invalido(): void {
    if (this.existeDataPrevia1683) {
      const camposVacios = [
        this.f.numDocEmisor,
        this.f.desNomEmisor,
        this.f.codTipBien,
        this.f.fecComprob,
        this.f.numSerie,
        this.f.mtoComprob,
        this.f.mtoDeduccion,
      ];
      const camposHabilitados = [
        this.f.fecComprob,
        this.f.numDocEmisor,
        this.f.codTipComprob,
        this.f.codTipBien,
        this.f.mtoDeduccion,
      ];
      this.funcionesGenerales.setearVacioEnCampos(camposVacios);
      this.funcionesGenerales.habilitarCampos(camposHabilitados);
      this.f.numSerie.disable();
      this.calculoMontoDeduccion();
      this.disabledFecha = false;
      this.existeDataFormulario1683 = false;
      this.existeDataPrevia1683 = false;
    }
  }

  private limpiarCamposAlNoEncontrarDataFormularioFactura(): void {
    this.f.fecComprob.setValue('');
    this.f.mtoComprob.setValue('');
    this.calculoMontoDeduccion();
    this.disabledFecha = false;
    this.existeDataFactura = false;
  }

  /*2. FIN VALIDACION --------------------------------------------------------------------------------------------------------------------*/
  public validarEspacio(val: any): void {
    this.f.numDocEmisor.setValue(val.trim());
  }

  public changeTipoComprobante(): void {
    this.frmCasilla514.controls.codTipComprob.valueChanges.subscribe(() => {
      this.f.numSerie.markAsUntouched();
      this.f.numSerie.setValue(this.f.numSerie.value);
    });
    if (
      this.f.codTipComprob.value === ConstantesCasilla514.COD_TIPO_COMPROB_1683
    ) {
      const campos = [
        this.f.numSerie,
        this.f.codTipBien,
        this.f.mtoComprob,
        this.f.fecComprob,
        this.f.mtoOriginal,
      ];
      this.f.numSerie.disable();
      this.f.codTipBien.enable();
      this.placeholder = '';
      this.disabledFecha = false;
      this.funcionesGenerales.setearVacioEnCampos(campos);
    } else {
      this.f.numSerie.setValue('');
      this.f.numSerie.enable();
      this.f.mtoDeduccion.enable();
      this.f.codTipBien.setValue('');
      this.f.codTipBien.enable();
      this.placeholder = 'ingresar';
    }
  }

  public calculoMontoDeduccion(): void {
    let valorDeduccion = 0;
    let valorMax = 0;

    if (
      this.f.codTipComprob.value ===
      ConstantesCasilla514.COD_TIPO_COMPROB_FACTURA
    ) {
      this.mostrarMensaje.callModal(
        ConstantesMensajesInformativos.MSJ_INGRESAR_MONTO_TIPO_COMPROB_FACTURA
      );
    }

    valorDeduccion =
      Number(this.f.mtoComprob.value) *
      ConstantesSeccionDeterminativa.TREINTA_PORCIENTO;
    valorMax =
      this.AtribucionRealizada.length > 0
        ? valorDeduccion * ConstantesSeccionDeterminativa.CINCUENTA_PORCIENTO
        : valorDeduccion;
    valorMax = this.funcionesGenerales.redondearMontos(valorMax, 2);

    this.f.mtoOriginal.setValue(valorMax);
    if (this.f.mtoOriginal.value > this.f.mtoDeduccion.value) {
      this.f.mtoDeduccion.markAsUntouched();
      this.f.mtoDeduccion.setValue(this.f.mtoDeduccion.value);
    }
  }

  public activarObs(): void {

    if (this.isShowIncon) {
      const codTipBien = this.f.codTipBien.value;
      if (codTipBien == "") {
        this.isShowIncon = true;
      }

      const codFormPago = this.f.codForPago.value;
      if (codFormPago !== "01") {
        this.isShowIncon = true;
      }

      if (this.isShowIncon) {
        this.showHtml = this.getDescripcionInconsistencias();
      }

    }

  }

  public activarMonto(): void {
    this.frmCasilla514.controls.codForPago.valueChanges.subscribe((data) => {
      this.f.mtoComprob.markAsUntouched();
      this.f.mtoComprob.setValue(this.f.mtoComprob.value);
    });
    if (this.f.codTipBien.value === ConstantesCasilla514.COD_TIPO_BIEN_MUEBLE) {
      this.f.mtoDeduccion.disable();
      this.f.mtoDeduccion.setValue('0.00');
    } else {
      const monto = this.inputId ? this.f.mtoDeduccion.value : '';
      this.f.mtoDeduccion.setValue(monto);
      this.f.mtoDeduccion.enable();
    }

    if (this.isShowIncon) {

      const codTipBien = this.f.codTipBien.value;
      if (codTipBien == "") {
        this.isShowIncon = true;
      }

      const codFormPago = this.f.codForPago.value;
      if (codFormPago !== "01") {
        this.isShowIncon = true;
      }

      if (this.isShowIncon) {
        this.showHtml = this.getDescripcionInconsistencias();
      }

    }

  }

  private formatearFechaComprobanteFactura(): string {
    const fechaComprobante = {
      day: this.fechaConsultaFactura.day,
      month: this.fechaConsultaFactura.month - 1,
      year: this.fechaConsultaFactura.year,
    };
    return moment(fechaComprobante).format('YYYYMMDD');
  }

  private validarFechaComprobanteFacturaAntesGuardar(): boolean {
    if (
      this.f.codTipComprob.value ===
      ConstantesCasilla514.COD_TIPO_COMPROB_FACTURA &&
      this.f.fecComprob.value !== ''
    ) {
      if (this.formatearFechaComprobanteFactura() !== this.FormatearFecha()) {
        this.f.fecComprob.setErrors({
          excepccion01: ConstantesExcepciones.CUS32_EX15,
        });
        return true;
      }

      if (
        this.validarRangoFechaValidaFactura(
          this.f.fecComprob.value.year,
          this.f.fecComprob.value.month
        )
      ) {
        this.f.fecComprob.setErrors({
          excepccion01: ConstantesExcepciones.CUS32_EX04,
        });
        return true;
      }
    }
    return false;
  }

  private validarFechaMayorAEneroEjercicioPosterior(fecha: any): boolean {
    const fechaComprobante = moment(fecha).format("YYYYMMDD")
    const fechaMaxima = String(this.anioEjercicio + 1) + "0131"
    return Number(fechaComprobante) > Number(fechaMaxima) ? true : false
  }

  private validarRangoFechaValidaFactura(year, month): boolean {
    if (
      Number(year) < this.anioEjercicio ||
      (Number(year) === this.anioEjercicio + 1 && Number(month) > 1) ||
      Number(year) > this.anioEjercicio + 1
    ) {
      return true;
    }
    return false;
  }

  private esfechaComprobanteMayorAFechaServidor(fecha): boolean {
    return Number(moment(fecha).format('YYYYMMDD')) > this.fechaServidor;
  }

  private verificarDuplicidadRegistro(): boolean {
    return this.inputListaBienes.some((x) => {
      return (
        this.f.codTipComprob.value === x.codTipComprob &&
        Number(this.f.numComprob.value) === Number(x.numComprob) &&
        x.numDocEmisor === this.f.numDocEmisor.value &&
        x.numSerie === this.f.numSerie.value.toUpperCase() &&
        (this.inputId ? x !== this.inputId : true)
      );
    });
  }

  private setTipoVinculo(): any {
    return this.f.codTipVinc.value
      ? this.f.codTipVinc.value === ConstantesCasilla514.PALABRA_CONYUGE
        ? ConstantesCasilla514.COD_TIPO_VINCULO_CONYUGE
        : ConstantesCasilla514.COD_TIPO_VINCULO_CONCUBINO
      : null;
  }

  public metodo(): void {
    this.submitted = true;
    zip(this.autocompletarNombre(), this.ejecutarTipoComprobante()).subscribe(
      () => {

        if (this.validarFechaComprobanteFacturaAntesGuardar()) {
          return;
        }

        this.verificarDuplicidadRegistro()
          ? this.mostrarMensaje.callModal(ConstantesExcepciones.CUS32_EX18)
          : this.guardaroActualizarRegistro();
      }
    );
  }

  private guardaroActualizarRegistro(): void {

    if (this.frmCasilla514.invalid) {
      return;
    }

    if (this.isShowIncon) {
      this.getDescripcionInconsistencias2();
    }
    const casilla514Model = {
      codDocEmisor: ConstantesDocumentos.RUC,
      codFor: null,
      codForPago: this.f.codForPago.value,
      codMedPago: null,
      codTipBien: this.f.codTipBien.value,
      codTipComprob: this.f.codTipComprob.value,
      codTipVinc: this.setTipoVinculo(),
      //desInconsistencia: this.inputId ? this.inputId.desInconsistencia : null,
      desInconsistencia: this.f.desInconsistencia.value,
      desNomEmisor: this.f.desNomEmisor.value,
      desNomTit: this.f.desNomTit.value ? this.f.desNomTit.value : null,
      fecComprob: this.funcionesGenerales.formatearFechaString(
        this.f.fecComprob.value
      ),
      fecFesembolso: null,
      fecPago: null,
      indArchPers: this.inputId
        ? this.inputId.indArchPers
        : ConstantesCasilla514.IND_REGISTRO_MANUAL,
      indEstArchPers: null,
      //indEstFormVirt: ConstantesCasilla514.IND_EST_FORM_VIRT_REVISADO, // 1: REVISADO, 0: OBSERVADO
      indEstFormVirt: this.f.desInconsistencia.value == null ? ConstantesCasilla514.IND_EST_FORM_VIRT_REVISADO : this.f.desInconsistencia.value == "" ? ConstantesCasilla514.IND_EST_FORM_VIRT_REVISADO : "0",//
      indInconsistencia: this.inputId ? this.inputId.indInconsistencia : null,
      //indInconsistencia: this.f.desInconsistencia.value == "" ? "0" : "1",
      indTipGasto: ConstantesSeccionDeterminativa.COD_TIPO_GASTO_ALQUILERES,
      indTipoAtrib: this.inputId
        ? this.inputId.indTipoAtrib
        : ConstantesCasilla514.IND_ATRIBUCION_REALIZADA,
      mtoAtribuir: Number(this.f.mtoOriginal.value),
      mtoComprob: Number(this.f.mtoComprob.value),
      mtoDeduccion: Number(this.f.mtoDeduccion.value),
      mtoInteres: null,
      mtoOriginal: null,
      numComprob: this.f.numComprob.value,
      numDocEmisor: this.f.numDocEmisor.value,
      numEjercicio: String(this.anioEjercicio),
      numFor: null,
      numFormulario: null,
      numPartidaReg: this.obtenerPeriodo(this.f.periodo.value),
      numPrestamo: null,
      numRuc: null,
      numRucTit: this.rucDeclarante,
      numSerie: this.f.numSerie.value.toUpperCase(),
      porAtribucion: Number(this.f.porAtribucion.value),
      porDeduccion: Number(this.f.porDeduccion.value),
    };

    if (!this.inputId) {
      this.inputListaBienes.push(casilla514Model);
      this.listaBienesReady.emit(this.inputListaBienes);
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_GRABADO_DATOS_EXITOSO);
      if (this.f.codTipComprob.value === ConstantesCasilla514.COD_TIPO_COMPROB_FACTURA) {
        this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_RECUERDO_GASTOS_REGISTRAR_CAS_514_ALQUILERES);
      }
    } else if (!this.equals(this.inputId, casilla514Model)) {
      this.inputListaBienes[this.inputIndex] = casilla514Model;
      this.listaBienesReady.emit(this.inputListaBienes);
    }
    this.activeModal.close();
  }

  equals(obj: LCas514Detalle, objNuevo: LCas514Detalle): boolean {
    return (
      objNuevo.codDocEmisor === obj.codDocEmisor &&
      objNuevo.codFor === obj.codFor &&
      objNuevo.codForPago === obj.codForPago &&
      objNuevo.codMedPago === obj.codMedPago &&
      objNuevo.codTipBien === obj.codTipBien &&
      objNuevo.codTipComprob === obj.codTipComprob &&
      objNuevo.codTipVinc === obj.codTipVinc &&
      objNuevo.desInconsistencia === obj.desInconsistencia &&
      objNuevo.desNomEmisor === obj.desNomEmisor &&
      objNuevo.desNomTit === obj.desNomTit &&
      objNuevo.fecComprob === obj.fecComprob &&
      objNuevo.fecFesembolso === obj.fecFesembolso &&
      objNuevo.fecPago === obj.fecPago &&
      objNuevo.indArchPers === obj.indArchPers &&
      objNuevo.indEstArchPers === obj.indEstArchPers &&
      objNuevo.indEstFormVirt === obj.indEstFormVirt &&
      objNuevo.indInconsistencia === obj.indInconsistencia &&
      objNuevo.indTipGasto === obj.indTipGasto &&
      objNuevo.indTipoAtrib === obj.indTipoAtrib &&
      objNuevo.mtoAtribuir === obj.mtoAtribuir &&
      objNuevo.mtoComprob === obj.mtoComprob &&
      objNuevo.mtoDeduccion === obj.mtoDeduccion &&
      objNuevo.mtoInteres === obj.mtoInteres &&
      objNuevo.mtoOriginal === obj.mtoOriginal &&
      objNuevo.numComprob === obj.numComprob &&
      objNuevo.numDocEmisor === obj.numDocEmisor &&
      objNuevo.numEjercicio === obj.numEjercicio &&
      objNuevo.numFor === obj.numFor &&
      objNuevo.numFormulario === obj.numFormulario &&
      objNuevo.numPartidaReg === obj.numPartidaReg &&
      objNuevo.numPrestamo === obj.numPrestamo &&
      objNuevo.numRuc === obj.numRuc &&
      objNuevo.numRucTit === obj.numRucTit &&
      objNuevo.numSerie === obj.numSerie &&
      objNuevo.porAtribucion === obj.porAtribucion &&
      objNuevo.porDeduccion === obj.porDeduccion
    );
  }
}

