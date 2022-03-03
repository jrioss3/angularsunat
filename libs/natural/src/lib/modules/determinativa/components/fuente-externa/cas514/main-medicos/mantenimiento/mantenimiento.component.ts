import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LCas514Detalle, ListaParametrosModel,Casilla514Cabecera } from '@path/natural/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbDatepickerConfig, NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService, ParametriaFormulario, CasillaErrorService } from '@path/natural/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationService, UtilsComponent } from '@path/natural/components';
import {
  I18n, CustomDatepickerI18n, NgbDateParsearFormato,
  ConstantesSeccionDeterminativa, ConstantesExcepciones
} from '@path/natural/utils';
import { throwError, Observable, EMPTY, of, zip } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { PersonaJuridica } from '@rentas/shared/types';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { ConstantesDocumentos, ConstantesCombos } from '@rentas/shared/constantes';
import { FuncionesGenerales,SessionStorage } from '@rentas/shared/utils';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  providers: [
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato }
  ]
})
export class Sfec514MedicosMantenimientoComponent implements OnInit {

  @Input() inputId: LCas514Detalle;
  @Input() public modal;
  @Input() inputListaBienes: LCas514Detalle[];
  @Output() listaBienesReady = new EventEmitter<LCas514Detalle[]>();
  @Input() inputIndex: number;

  public frmCasilla514: FormGroup;
  public listaTipoComprobante: ListaParametrosModel[];
  public listaFormaPago: ListaParametrosModel[];
  private listaRUC20Autorizados: ListaParametrosModel[];
  public submitted = false;
  public mensaje514 = CasillaErrorService;
  private anioEjercicio: string;
  public disabled = false;
  private montoPersonalizado: number;
  private noValidarMonto: boolean;
  private existeDataFormulario: boolean;
  private funcionesGenerales: FuncionesGenerales;

  public lstParametriaObservaciones;
  public showHtml: String;
  public isShowIncon: boolean = false;
  private preDeclaracion: PreDeclaracionModel;
  private lista514: Casilla514Cabecera[];
  private TipoGastoMedico = '03';

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private preDeclaracionservice: PreDeclaracionService,
    private cus27Service: ParametriaFormulario,
    private config: NgbDatepickerConfig,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService,
    private comboService: ComboService
  ) { }

  ngOnInit(): void {
    this.anioEjercicio = this.preDeclaracionservice.obtenerAnioEjercicio();
    const rucDeclarante = this.preDeclaracionservice.obtenerRucPredeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.obtenerListasParametria();
    this.limitarSeleccionFechaPago();

    this.montoPersonalizado = this.inputId && this.inputId.indArchPers === '1' ? this.inputId.mtoOriginal : null;
    this.noValidarMonto = this.inputId && this.inputId.indArchPers === '1' ? true : false;

    this.lstParametriaObservaciones = this.comboService.obtenerComboPorNumero(ConstantesCombos.OBSERVACIONES_GASTOS_DEDUCIBES);    

    this.frmCasilla514 = this.fb.group({
      numDocEmisor: [this.inputId ? this.inputId.numDocEmisor.trim() : '', Validators.required],
      desNomEmisor: [this.inputId ? this.inputId.desNomEmisor.trim() : ''],
      desInconsistencia: [this.inputId ? this.inputId.desInconsistencia : ''],
      codTipComprob: [this.inputId ? this.inputId.codTipComprob : '', Validators.required],
      numSerie: [this.inputId ? this.inputId.numSerie : '', Validators.required],
      numComprob: [this.inputId ? this.inputId.numComprob : '', Validators.required],
      fecPago: [this.inputId ? this.obtenerFecha() : '', Validators.required],
      mtoDeduccion: [this.inputId ? String(this.inputId.mtoDeduccion) : '', Validators.required],
      mtoComprob: [this.inputId ? this.inputId.mtoComprob : '', Validators.required],
      codMedPago: [this.inputId ? this.inputId.codMedPago : '', Validators.required],
    }, {
      validators:
        [
          ValidationService.validarNrodoc(ConstantesDocumentos.RUC, 'numDocEmisor', 'CUS32_2', rucDeclarante, '',
            this.listaRUC20Autorizados),
          ValidationService.validarFechasBien('fecPago', Number(this.anioEjercicio), 'CUS32'),
          ValidationService.validarNroCompro('numComprob', this.noValidarMonto),
          ValidationService.soloNumeros('mtoComprob', 'CUS32_2', 'si', 'si'),
          ValidationService.validarMonto('mtoComprob', 'codMedPago', 'MEDICOS', this.montoPersonalizado, this.noValidarMonto),
          ValidationService.validarNumSerie('codTipComprob', 'numSerie')
        ]
    });

    this.deshabilitarCamposAlAgregar();
    this.f.codTipComprob.setValue(this.listaTipoComprobante[0].val);
    this.ingresarSerie();
    if (this.inputId) {
      this.existeDataFormulario = true;
      this.inputId.indArchPers === '1' ? this.deshabilitarCamposPersonalizado() : this.deshabilitarCamposAlAgregar();
      if (Number(this.anioEjercicio) >= 2021){
        this.isShowIncon = true;
        this.showHtml = this.getDescripcionInconsistencias();
      }
      this.calculoMontoDeduccion();
      
    }
  }

  public get f() { return this.frmCasilla514.controls; }

  private getDescripcionInconsistencias(): String{

    //this.addDescripInconsistencias();
    
    //const indInconsistencias = this.inputId ? this.inputId.indInconsistencia : "";//CODIGOS DE INCONSISTENCIA DEL REGISTRO
    //const lstCodigosInconsistencias = this.inputId ? this.inputId.desInconsistencia.trim().split(",") : [];
    
    //this.desInconsistenciaHidden = this.inputId.desInconsistencia.trim();
    
    let li = '';
    this.isShowIncon = false;

    if(this.f.desInconsistencia.value !== null){

      if(this.f.desInconsistencia.value !== ""){

        const lstCodigosInconsistencias = this.f.desInconsistencia.value !== "" ? this.f.desInconsistencia.value.split(",") : [];//CODIGOS DE INCONSISTENCIA DEL REGISTRO
        const codFormPago = this.f.codMedPago.value;
       
          lstCodigosInconsistencias.forEach(codigo => {
            const codigoParametro = codigo.trim();
            const data = this.lstParametriaObservaciones.find((x) => 
                x.val == codigoParametro
            );
           
            const desc = data?.desc ?? ''; 
            if(data != undefined){
              this.isShowIncon = true;
              if(!(data.val == 'I4' && codFormPago == '014')){
                if(!(data.val == 'IB' && codFormPago == '014')){
                  if(desc != ''){
                    li += '<li>' + desc + '</li>'
                  }
                }
              }
            }
            
          });
      }
    }
    

    return li == "" ? "" : "<p>Observación : </p><ul>" + li +  "</ul>";
    
  }

  private addDescripInconsistencias(){
   
    const codFormPago = this.f.codMedPago.value;
    const id = this.inputId;
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    
    this.lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
   
    
    this.lista514.forEach(x => {

      switch (x.indTipoGasto){
        case this.TipoGastoMedico:{
       
          var listaArtesanos = x.casilla514Detalle.lisCas514.filter(y => this.equals(y,this.inputId));
        
          if(listaArtesanos.length != 0){
            let desInconsistencia = listaArtesanos[0].desInconsistencia ? listaArtesanos[0].desInconsistencia.trim().split(",") : "";
            var existe = desInconsistencia.includes('I4');
            if(!existe){
              if (codFormPago !== '014'){
                desInconsistencia = desInconsistencia.concat("I4");
              }
            }
            existe = desInconsistencia.includes('IB');
            if(!existe){
              if (codFormPago !== '014'){
                desInconsistencia = desInconsistencia.concat("IB");
              }
            }
                    
           
            this.f.desInconsistencia.setValue(desInconsistencia.toString());
          }
          
        }
      }

    });
  }

  private getDescripcionInconsistencias2(): String{
    
    const codFormPago = this.f.codMedPago.value;

    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;        
    
    this.lista514.forEach(x => {

      switch (x.indTipoGasto){
        case this.TipoGastoMedico:{
          var listaArtesanos = x.casilla514Detalle.lisCas514.filter(y => this.equals(y,this.inputId));
        
          if(listaArtesanos.length != 0){          
            let desInconsistencia = this.f.desInconsistencia.value ? this.f.desInconsistencia.value.split(",") : null;
            if(desInconsistencia !== null){

              if (codFormPago == '014'){
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
    const lstCodigosInconsistencias = this.f.desInconsistencia.value ? this.f.desInconsistencia.value.split(",") : [];//CODIGOS DE INCONSISTENCIA DEL REGISTRO
    if(lstCodigosInconsistencias.length == 0){
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
      if(data != undefined){
        this.isShowIncon = true;
        if(!(data.val == 'I4' && codFormPago == '014')){
          if(!(data.val == 'IB' && codFormPago == '014')){
            if(desc != ''){
              li += '<li>' + desc + '</li>'
            }
          }
        }
      }
    });



    const modal = {
      titulo: 'Mensaje',
      mensaje: "<p>El comprobante mantiene observaciones no subsanadas : </p><ul>" + li +  "</ul>",
    };
    const modalRef = this.modalService.open(
      UtilsComponent,
      this.funcionesGenerales.getModalOptions({})
    );
    modalRef.componentInstance.modal = modal;
    return modalRef.componentInstance.respuesta;
    //return;
  }



  // METODOS AL INICIAR REGISTRO Y/O EDICION -------------------------------------------------------------
  private obtenerListasParametria(): void {
    this.listaRUC20Autorizados = this.comboService.obtenerComboPorNumero('R06');
    this.listaTipoComprobante = this.cus27Service.obtenerTipoComprobante_cus32_Medicos();
    this.listaFormaPago = this.cus27Service.obtenerFormaPagoRHE();
  }

  private deshabilitarCamposAlAgregar(): void {
    const array = [this.f.desNomEmisor, this.f.numSerie, this.f.mtoDeduccion];
    FuncionesGenerales.getInstance().desHabilitarCampos(array);
    this.f.fecPago.disable();
    this.disabled = true;
  }

  private deshabilitarCamposPersonalizado(): void {
    const array = [this.f.numDocEmisor, this.f.codTipComprob, this.f.numComprob, this.f.codMedPago, this.f.fecPago];
    FuncionesGenerales.getInstance().desHabilitarCampos(array);
    this.disabled = true;
  }

  private limitarSeleccionFechaPago(): void {
    this.config.minDate = { year: Number(this.anioEjercicio), month: 1, day: 1 };
    this.config.maxDate = { year: Number(this.anioEjercicio), month: 12, day: 31 };
  }

  private obtenerFecha(): { day: number, month: number, year: number } {
    return {
      day: Number(this.inputId.fecPago.substring(8, 10)),
      month: Number(this.inputId.fecPago.substring(5, 7)),
      year: Number(this.inputId.fecPago.substring(0, 4))
    };
  }
  // ----------------------------------------------------------------------------------------------------------------
  // METODOS CHANGE DE LOS CAMPOS ------------------------------------------------------------------------------------
  public validarEspacio(val: any): void {
    this.f.numDocEmisor.setValue(val.trim());
  }

  public ingresarSerie(): void {
    if (this.f.codTipComprob.value === '01') {
      this.f.numSerie.setValue('E001');
      this.f.numSerie.disable();
    } else {
      this.f.numSerie.setValue('');
      this.f.numSerie.enable();
    }
  }

  public calculoMontoDeduccion(): void {
    this.medioPago();
    if (this.f.mtoComprob.value < 3500 && this.f.codMedPago.value === '008') {
      this.f.codMedPago.markAsUntouched();
      this.f.codMedPago.setValue(this.f.codMedPago.value);
    }
  }

  public medioPago(): void {
    this.frmCasilla514.controls.codMedPago.valueChanges.subscribe(() => {
      this.f.mtoComprob.markAsUntouched();
      this.f.mtoComprob.setValue(this.f.mtoComprob.value);
    });
    this.f.mtoDeduccion.setValue(String((Number(this.f.mtoComprob.value) * ConstantesSeccionDeterminativa.TREINTA_PORCIENTO).toFixed(2)));
  }
  // -----------------------------------------------------------------------------------------------------------------
  // 1. VALIDAR EXISTENCIA DEL MISMO REGISTRO Y DEL PADRON RUC ----------------------------------------------------------------------
  public ObtenerEmisor(): void {
    this.f.desNomEmisor.setValue('');
    this.existeDataFormulario = false;
    if (!this.f.numDocEmisor.errors) {
      this.autocompletarNombre().subscribe();
    }
  }

  private autocompletarNombre(): Observable<any> {
    if (!this.f.numDocEmisor.errors && this.f.desNomEmisor.value === '') {
      this.spinner.show();
      return this.validarExistenciaContribuyente();
    }
    return of({});
  }

  private validarExistenciaContribuyente(): Observable<any> {
    return this.personaService.obtenerContribuyente(this.f.numDocEmisor.value).
      pipe(
        tap(data => this.obtenerRazonSocialContribuyente(data)),
        catchError(error => {
          this.f.numDocEmisor.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS32_EX03 });
          this.spinner.hide();
          return throwError(error);
        })
      );
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void {
    this.f.desNomEmisor.setValue(data.ddpNombre.trim());
    this.spinner.hide();
  }
  // -----------------------------------------------------------------------------------------------------------------
  // 2. VALIDAR NUMERO DE COMPROBANTE --------------------------------------------------------------------------------
  public changeNumeroDeComprobante(): void {
    this.existeDataFormulario = false;
    this.f.numComprob.value === '' ? this.limpiarCampos() :
      this.validarNumeroComprobante(this.f.numDocEmisor.value, this.f.codTipComprob.value, this.f.numSerie.value,
        Number(this.f.numComprob.value), Number(this.anioEjercicio)).subscribe();
  }

  private validarNumeroComprobante(
    numRuc: string, tipoComprobante: string, serie: string, numComprobante: number, anioEjercicio: number): Observable<any> {      
    if (!this.f.numDocEmisor.errors && !this.f.numComprob.errors && !this.existeDataFormulario) {
      this.spinner.show();
      return this.validarExistenciaComprobanteRHE(numRuc, tipoComprobante, serie, numComprobante, anioEjercicio);
    }
    return of({});
  }

  private validarNumeroComprobanteGuardar(
    numRuc: string, tipoComprobante: string, serie: string, numComprobante: number, anioEjercicio: number): Observable<any> {
     
    //if (!this.f.numDocEmisor.errors && !this.f.numComprob.errors && !this.existeDataFormulario) {
      this.spinner.show();
      return this.validarExistenciaComprobanteRHEGuardar(numRuc, tipoComprobante, serie, numComprobante, anioEjercicio);
    //}
    //return of({});
  }

  private validarExistenciaComprobanteRHE(numRuc, tipoComprobante, serie, numComprobante, anioEjercicio): Observable<any> {
    return this.preDeclaracionservice.validarNroComprobanteRH(numRuc, tipoComprobante, serie, numComprobante, anioEjercicio).
      pipe(
        tap(data => {
          this.existeDataFormulario = true,
            this.validarNroComprobanteRH(data),
            this.validarFechaComprobante(data),
            this.setearValoresComprobante(data),
            this.spinner.hide();
        }),
        catchError(error => {
          //this.f.numComprob.setErrors({ '{excepccion01}': CasillaErrorService.CUS32Ex11 });//error.error.errors[0].msg
          this.f.numComprob.setErrors({ '{excepccion01}': error.error.errors[0].msg });//
          this.limpiarCampos();
          this.spinner.hide();
          return throwError(error);
        })
      );
  }

  private validarExistenciaComprobanteRHEGuardar(numRuc, tipoComprobante, serie, numComprobante, anioEjercicio): Observable<any> {
    return this.preDeclaracionservice.validarNroComprobanteRH(numRuc, tipoComprobante, serie, numComprobante, anioEjercicio).
      pipe(
        tap(data => {
          this.existeDataFormulario = true,
            this.validarNroComprobanteRH(data),
            this.validarFechaComprobante(data),
            //this.setearValoresComprobante(data),
            this.spinner.hide();
        }),
        catchError(error => {
          //this.f.numComprob.setErrors({ '{excepccion01}': CasillaErrorService.CUS32Ex11 });//error.error.errors[0].msg
          this.f.numComprob.setErrors({ '{excepccion01}': error.error.errors[0].msg });//
          this.limpiarCampos();
          this.spinner.hide();
          return throwError(error);
        })
      );
  }

  private validarNroComprobanteRH(data: any): void {
    if (data.numRucReceptor === data.numRuc) {
      this.f.numComprob.setErrors({ '{excepccion01}': CasillaErrorService.EX236_1 });
    }
  }

  private validarFechaComprobante(data: any): void {
    if (this.f.fecPago.value !== '' && (moment(data.fecEmisionCpe).format('YYYY')) !== this.anioEjercicio) {
      this.f.fecPago.setErrors({ excepccion01: CasillaErrorService.EX236_2 });
    }
  }

  private setearValoresComprobante(data: any): void {
    const monto = data.monto;
    this.f.mtoComprob.setValue(monto);
    this.calculoMontoDeduccion();
    this.f.fecPago.setValue(this.establecerFechaComprobante(data));
    this.f.fecPago.disable();
    this.f.codMedPago.markAsUntouched();
    this.f.codMedPago.setValue(this.f.codMedPago.value);
    this.disabled = true;
  }

  private establecerFechaComprobante(data: any): { day: number, month: number, year: number } {
    return {
      day: Number(moment(data.fecEmisionCpe).format('DD')),
      month: Number(moment(data.fecEmisionCpe).format('MM')),
      year: Number(moment(data.fecEmisionCpe).format('YYYY'))
    };
  }

  private establecerErrorYLimpiarCampos(): Observable<never> {
    this.f.numComprob.setErrors({ '{excepccion01}': CasillaErrorService.Ex225 });
    this.limpiarCampos();
    return EMPTY;
  }

  private limpiarCampos(): void {
    const campos = [this.f.fecPago, this.f.mtoComprob];
    FuncionesGenerales.getInstance().setearVacioEnCampos(campos);
    this.f.fecPago.enable();
    this.disabled = false;
    this.calculoMontoDeduccion();
  }
  // ------------------------------------------------------------------------------------------------------------
  private establecerFormatoFechaAlGuardar(): string {
    if (this.f.fecPago.value != null) {
      const fecPago = {
        day: this.f.fecPago.value.day,
        month: this.f.fecPago.value.month - 1,
        year: this.f.fecPago.value.year
      };
      return moment(fecPago).format('YYYY-MM-DD') + 'T00:00:00.000-05:00';
    }
  }

  public metodo(): void {
    this.submitted = true;
    if (Number(this.f.fecPago.value.year) !== Number(this.anioEjercicio)) {
      this.f.fecPago.setErrors({ excepccion01: CasillaErrorService.Ex217 });
      return;
    }

    if (!this.inputId){

      zip(this.autocompletarNombre(), this.validarNumeroComprobante(
        this.f.numDocEmisor.value, this.f.codTipComprob.value, this.f.numSerie.value,
        Number(this.f.numComprob.value), Number(this.anioEjercicio)
      )).subscribe(() => {
        if (!this.inputId) {
          this.guardarRegistro();
        } else {
          this.actualizar();
        }
      });

    }else{

      zip(this.autocompletarNombre(), this.validarNumeroComprobanteGuardar(
        this.f.numDocEmisor.value, this.f.codTipComprob.value, this.f.numSerie.value,
        Number(this.f.numComprob.value), Number(this.anioEjercicio)
      )).subscribe(() => {
        if (!this.inputId) {
          this.guardarRegistro();
        } else {
          this.actualizar();
        }
      });

    }

    
  }

  private guardarRegistro(): void {
    this.submitted = true;
    if (this.frmCasilla514.invalid) {
      return;
    }

    

    const objeto1122 = {
      codDocEmisor: ConstantesDocumentos.RUC,
      codFor: null,
      codForPago: null,
      codMedPago: this.f.codMedPago.value,
      codTipBien: null,
      codTipComprob: this.f.codTipComprob.value,
      codTipVinc: null,
      desNomEmisor: this.f.desNomEmisor.value,
      desNomTit: null,
      fecComprob: null, // this.fechaDefecto,
      fecFesembolso: null, // this.fechaDefecto,
      fecPago: this.establecerFormatoFechaAlGuardar(),
      indArchPers: this.inputId ? this.inputId.indArchPers : '0',
      indEstArchPers: null,
      indEstFormVirt: '1',
      //indEstFormVirt: this.f.desInconsistencia.value == "" ? "1" : "0",
      indTipGasto: ConstantesSeccionDeterminativa.COD_TIPO_GASTO_MEDICO,
      indTipoAtrib: ConstantesSeccionDeterminativa.COD_ATRIB_REALIZADA,
      mtoAtribuir: null,
      mtoComprob: Number(this.f.mtoComprob.value),
      mtoDeduccion: Number(this.f.mtoDeduccion.value),
      //mtoDeduccion: this.f.desInconsistencia.value == "" ? Number(this.f.mtoDeduccion.value) : 0,
      mtoInteres: null,
      mtoOriginal: this.inputId ? this.inputId.mtoOriginal : null,
      numComprob: this.f.numComprob.value,
      numDocEmisor: this.f.numDocEmisor.value,
      numEjercicio: this.anioEjercicio,
      numFor: null,
      numFormulario: null,
      numPartidaReg: null,
      numPrestamo: null,
      numRuc: null,
      numRucTit: null,
      numSerie: this.f.numSerie.value,
      porAtribucion: null,
      porDeduccion: ConstantesSeccionDeterminativa.TREINTA_PORCIENTO * 100,
      indInconsistencia : null,
      desInconsistencia : null
    };

    const crear = this.inputListaBienes.some(x => {
      return objeto1122.codTipComprob === x.codTipComprob && Number(objeto1122.numComprob) === Number(x.numComprob) &&
        x.numSerie === objeto1122.numSerie && x.numDocEmisor === objeto1122.numDocEmisor;
    });

    if (!crear) {
      this.inputListaBienes.push(objeto1122);
      this.listaBienesReady.emit(this.inputListaBienes);
      this.callModal('Se grabaron los datos exitosamente');
      this.activeModal.close();
    } else {
      this.callModal(CasillaErrorService.Ex225);
    }

  }

  private actualizar(): void {
    this.submitted = true;
    if (this.frmCasilla514.invalid) {
      return;
    }

    if(this.isShowIncon){
      this.getDescripcionInconsistencias2();
    }

    const objeto1122 = {
      codDocEmisor: ConstantesDocumentos.RUC,
      codFor: null,
      codForPago: null,
      codMedPago: this.f.codMedPago.value,
      codTipBien: null,
      codTipComprob: this.f.codTipComprob.value,
      codTipVinc: null,
      //desInconsistencia: this.inputId ? this.inputId.desInconsistencia : null,
      desInconsistencia: this.f.desInconsistencia.value,
      desNomEmisor: this.f.desNomEmisor.value,
      desNomTit: null,
      fecComprob: null, // this.fechaDefecto,
      fecFesembolso: null, // this.fechaDefecto,
      fecPago: this.establecerFormatoFechaAlGuardar(),
      indArchPers: this.inputId ? this.inputId.indArchPers : '0',
      indEstArchPers: null,
      //indEstFormVirt: '1',
      indEstFormVirt: this.f.desInconsistencia.value == null ? "1" : this.f.desInconsistencia.value == "" ? "1" : "0",//
      indInconsistencia: this.inputId ? this.inputId.indInconsistencia : null,
      indTipGasto: ConstantesSeccionDeterminativa.COD_TIPO_GASTO_MEDICO,
      indTipoAtrib: ConstantesSeccionDeterminativa.COD_ATRIB_REALIZADA,
      mtoAtribuir: null,
      mtoComprob: Number(this.f.mtoComprob.value),
      //mtoDeduccion: Number(this.f.mtoDeduccion.value),
      mtoDeduccion: this.f.desInconsistencia.value == null ? Number(this.f.mtoDeduccion.value) : this.f.desInconsistencia.value == "" ? Number(this.f.mtoDeduccion.value) : 0,
      mtoInteres: null,
      mtoOriginal: this.inputId ? this.inputId.mtoOriginal : null,
      numComprob: this.f.numComprob.value,
      numDocEmisor: this.f.numDocEmisor.value,
      numEjercicio: this.anioEjercicio,
      numFor: null,
      numFormulario: null,
      numPartidaReg: null,
      numPrestamo: null,
      numRuc: null,
      numRucTit: null,
      numSerie: this.f.numSerie.value,
      porAtribucion: null,
      porDeduccion: ConstantesSeccionDeterminativa.TREINTA_PORCIENTO * 100,
    };

    const crear = this.inputListaBienes.some(x => {
      return objeto1122.codTipComprob === x.codTipComprob && Number(objeto1122.numComprob) === Number(x.numComprob) &&
        x.numSerie === objeto1122.numSerie && x.numDocEmisor === objeto1122.numDocEmisor && x !== this.inputId;
    });

    if (!crear) {
      if (!this.equals(this.inputId, objeto1122)) {
        this.inputListaBienes[this.inputIndex] = objeto1122 as LCas514Detalle;
        this.listaBienesReady.emit(this.inputListaBienes);
        //this.callModal('Se grabaron los datos exitosamente');
      }
      this.activeModal.close();
    } else {
      this.callModal(CasillaErrorService.Ex225);
    }
  }

  private callModal(excepcionName: string): void {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
  }

  private equals(obj: LCas514Detalle, objNuevo: LCas514Detalle): boolean {
    return objNuevo.codDocEmisor === obj.codDocEmisor &&
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
      objNuevo.porDeduccion === obj.porDeduccion;
  }
}
