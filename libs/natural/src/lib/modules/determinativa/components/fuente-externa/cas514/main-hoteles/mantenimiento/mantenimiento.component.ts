import { ConstantesCasilla514, ConstantesExcepciones, ConstantesMensajesInformativos } from '@path/natural/utils';
import { MostrarMensajeService } from '@path/natural/services/mostrarMensaje.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ValidationService, UtilsComponent } from '@path/natural/components';
import {
  ConstantesSeccionDeterminativa,
  CustomDatepickerI18n, NgbDateParsearFormato, I18n
} from '@path/natural/utils';
import { LCas514Detalle, ListaParametrosModel, Casilla514Cabecera } from '@path/natural/models';
import { NgbActiveModal, NgbDatepickerConfig, NgbDatepickerI18n, NgbDateParserFormatter,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CasillaErrorService, PreDeclaracionService, ParametriaFormulario } from '@path/natural/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap, catchError, flatMap, tap } from 'rxjs/operators';
import { Observable, throwError, EMPTY, of, zip } from 'rxjs';
import * as moment from 'moment';
import { ActividadesEconomicas } from '@path/natural/models/actividadesEconomicas';
import { ParametrosHoteles514 } from '@path/natural/models/parametrosModelCasilla514';
import { PersonaJuridica } from '@rentas/shared/types';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { ConstantesCombos, ConstantesDocumentos } from '@rentas/shared/constantes';
import { FuncionesGenerales, SessionStorage } from '@rentas/shared/utils';
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
export class Sfec514HotelesMantenimientoComponent implements OnInit {

  @Input() inputId: LCas514Detalle;
  @Input() public modal;
  @Input() inputListaBienes: LCas514Detalle[];
  @Output() listaBienesReady = new EventEmitter<LCas514Detalle[]>();
  @Input() inputIndex: number;
  public frmCasilla514: FormGroup;
  public submitted = false;
  public mensaje514: any;
  public listCompHoteles: ListaParametrosModel[];
  public listaFormaPago: ListaParametrosModel[];
  public porcentajeDeduccion: number;
  private anioEjercicio: number;
  public disabledFecha = false;
  public funcionesGenerales: FuncionesGenerales;
  private montoPersonalizado: number;
  private noValidarMonto: boolean;
  private existeDataComprobante: boolean ;

  public lstParametriaObservaciones;
  public showHtml: String;
  public isShowIncon: boolean = false;
  private preDeclaracion: PreDeclaracionModel;
  private lista514: Casilla514Cabecera[];
  private TipoGastoArtesanias = '05';

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private comboService: ComboService,
    private preDeclaracionservice: PreDeclaracionService,
    private cus27Service: ParametriaFormulario,
    private config: NgbDatepickerConfig,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService,
    private mostrarMensaje: MostrarMensajeService,
    public modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.anioEjercicio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    this.obtenerListasParametria();
    this.limitarSeleccionFechaEmision();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.getPorcentajeDeduccion();
    const rucDeclarante = this.preDeclaracionservice.obtenerRucPredeclaracion();
    this.mensaje514 = CasillaErrorService;
    this.lstParametriaObservaciones = this.comboService.obtenerComboPorNumero(ConstantesCombos.OBSERVACIONES_GASTOS_DEDUCIBES);    

    this.inputId ? this.establecerValoresAlEditar() : this.establecerValoresAlAgregar();

    this.frmCasilla514 = this.fb.group({
      numDocEmisor: [this.inputId ? this.inputId.numDocEmisor.trim() : '', Validators.required],
      desNomEmisor: [this.inputId ? this.inputId.desNomEmisor.trim() : ''],
      desInconsistencia: [this.inputId ? this.inputId.desInconsistencia : ''],
      codTipComprob: [this.inputId ? this.inputId.codTipComprob : '', Validators.required],
      numSerie: [this.inputId ? this.inputId.numSerie : '', Validators.required],
      numComprob: [this.inputId ? this.inputId.numComprob : '', Validators.required],
      fecFesembolso: [this.inputId ? this.funcionesGenerales.obtenerFechaAlEditar(this.inputId.fecComprob) : '', Validators.required],
      mtoComprob: [this.inputId ? this.inputId.mtoComprob : '', Validators.required],
      mtoDeduccion: [this.inputId ? String(this.inputId.mtoDeduccion) : '', Validators.required],
      codForPago: [this.inputId ? this.inputId.codForPago === null ? '' :
        (this.inputId.codForPago.trim() !== '' ? this.inputId.codForPago : '') : '']
    }, {
      validators:
        [
          ValidationService.soloNumeros('mtoComprob', 'CUS32_2', 'si', 'si'),
          ValidationService.soloNumeros('mtoDeduccion', 'CUS32_3', 'deducir', ''),
          ValidationService.validarNrodoc(ConstantesDocumentos.RUC, 'numDocEmisor', 'CUS32_1', rucDeclarante),
          ValidationService.validarNroCompro('numComprob'),
          ValidationService.validarFechasBien('fecFesembolso', this.anioEjercicio, 'CUS32'),
          ValidationService.validarNumSerie('codTipComprob', 'numSerie'),
          ValidationService.validarMonto('mtoComprob', 'codForPago', 'HOTELES', this.montoPersonalizado, this.noValidarMonto),
        ]
    });

    this.f.desNomEmisor.disable();
    this.f.mtoDeduccion.disable();
    this.f.codTipComprob.setValue(this.listCompHoteles[0].val);
    if (this.inputId) {
      this.inputId.indArchPers === ConstantesCasilla514.IND_ARCHIVO_PERSONALIZADO ?
        this.desHabilitarCamposEditarPersonalizados() : this.f.fecFesembolso.disable();
      this.calcularMontoAlEditar();
      if (Number(this.anioEjercicio) >= 2021){
        this.isShowIncon = true;
        this.showHtml = this.getDescripcionInconsistencias();
      }
    }
  }

  get f() { return this.frmCasilla514.controls; }

  private getDescripcionInconsistencias(): String{    
    let li = '';

    if(this.f.desInconsistencia.value !== null){

      if(this.f.desInconsistencia.value !== ""){

        const lstCodigosInconsistencias = this.f.desInconsistencia.value !== "" ? this.f.desInconsistencia.value.split(",") : [];//CODIGOS DE INCONSISTENCIA DEL REGISTRO

        const codFormPago = this.f.codForPago.value; 
        this.isShowIncon = false;

      
          lstCodigosInconsistencias.forEach(codigo => {
            const codigoParametro = codigo.trim();
            const data = this.lstParametriaObservaciones.find((x) => 
                x.val == codigoParametro
            );
          
            const desc = data?.desc ?? ''; 
            if(data != undefined){
              this.isShowIncon = true;
              if(!(data.val == 'I4' && codFormPago == '01')){
                if(!(data.val == 'IB' && codFormPago == '01')){
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
   
    const codFormPago = this.f.codForPago.value;
    const id = this.inputId;
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    
    this.lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
     
    
    
    this.lista514.forEach(x => {

      switch (x.indTipoGasto){
        case this.TipoGastoArtesanias:{
         
          var listaArtesanos = x.casilla514Detalle.lisCas514.filter(y => this.equals(y,this.inputId));
         
          if(listaArtesanos.length != 0){  
            let desInconsistencia = listaArtesanos[0].desInconsistencia ? listaArtesanos[0].desInconsistencia.trim().split(",") : "";
          
            var existe = desInconsistencia.includes('I4');
            if(!existe){
              if (codFormPago !== '01'){
                desInconsistencia = desInconsistencia.concat("I4");
              }
            }
            existe = desInconsistencia.includes('IB');
            if(!existe){
              if (codFormPago !== '01'){
                desInconsistencia = desInconsistencia.concat("IB");
              }
            }
                    
           
            this.f.desInconsistencia.setValue(desInconsistencia.toString());
          }
          
        }
      }

    });

  }

  private obtenerListasParametria(): void {
    this.listaFormaPago = this.cus27Service.obtenerFormaPago();
    this.listCompHoteles = this.cus27Service.obtenerTipoComprobante_cus32_Hoteles();
    this.listCompHoteles = this.listCompHoteles.filter(x => x.val === ConstantesCasilla514.codBoleta);
  }

  private limitarSeleccionFechaEmision(): void {
    this.config.minDate = { year: this.anioEjercicio, month: 1, day: 1 };
    this.config.maxDate = { year: this.anioEjercicio, month: 12, day: 31 };
  }

  private getPorcentajeDeduccion(): void {
    const listaPorcentajesDeduccion = this.comboService.obtenerComboPorNumero(ConstantesCombos.PORCENTAJE_DEDUCIR);
    this.porcentajeDeduccion = Number(listaPorcentajesDeduccion.find(item => item.desc == this.anioEjercicio.toString()).val);
  }

  private establecerValoresAlEditar(): void {
    this.disabledFecha = true;
    this.noValidarMonto = this.inputId.indArchPers === ConstantesCasilla514.IND_ARCHIVO_PERSONALIZADO ? true : false;
    this.montoPersonalizado = this.inputId.indArchPers === ConstantesCasilla514.IND_ARCHIVO_PERSONALIZADO ? this.inputId.mtoOriginal : null;
  }

  private establecerValoresAlAgregar(): void {
    this.disabledFecha = false;
    this.montoPersonalizado = null;
    this.noValidarMonto = false;
    setTimeout(() => this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_SI_BVE_FUE_MODIFICADA) , 200);
  }

  private desHabilitarCamposEditarPersonalizados(): void {
    const campos = [this.f.numDocEmisor, this.f.codTipComprob, this.f.numSerie, this.f.numComprob, this.f.fecFesembolso];
    this.funcionesGenerales.desHabilitarCampos(campos);
  }

  public validarEspacio(val: any): void {
    this.f.numDocEmisor.setValue(val.trim());
  }

  public activarMonto(): void {
    this.frmCasilla514.controls.codForPago.valueChanges.subscribe(data => {
      this.f.mtoComprob.markAsUntouched();
      this.f.mtoComprob.setValue(this.f.mtoComprob.value);
    });

    if (this.f.mtoComprob.value >= 3500 && this.f.codForPago.value !== '') {
      this.f.mtoComprob.markAsUntouched();
      this.f.mtoComprob.setValue(this.f.mtoComprob.value);
    }

    if(this.isShowIncon){
      this.showHtml = this.getDescripcionInconsistencias();
    }
  }

  private calcularMontoAlEditar(): void {
    if (this.inputId.indEstFormVirt === ConstantesCasilla514.regObservado) {
      let calculo = Number(this.inputId.mtoComprob) * (this.porcentajeDeduccion / 100);
      calculo = this.funcionesGenerales.redondearMontos(calculo, 2);
      this.f.mtoDeduccion.setValue(calculo);
    }
  }

  public calculoMontoDeduccion(): void {
    let valorDeduccion = 0;
    valorDeduccion = Number(this.f.mtoComprob.value) * (this.porcentajeDeduccion / 100);
    valorDeduccion = this.funcionesGenerales.redondearMontos(valorDeduccion, 2);
    this.f.mtoDeduccion.setValue(valorDeduccion);

    if (Number(this.f.mtoComprob.value) < 3500 && this.f.codForPago.value === ConstantesCasilla514.codEfectivo) {
      this.f.codForPago.markAsUntouched();
      this.f.codForPago.setValue(this.f.codForPago.value);
    }
  }

  /* 1. VALIDAR EXISTENCIA ACTIVIDAD ECONOMICA Y PADRON RUC -----------------------------------------------------------*/
  public ObtenerEmisor(): void {
    this.f.desNomEmisor.setValue('');
    if (!this.f.numDocEmisor.errors) {
      this.validarExistenciaPadronRUCYActividadEconomica().subscribe();
    }
  }

  private validarExistenciaPadronRUCYActividadEconomica(): Observable<any> {
    if (!this.f.numDocEmisor.errors && this.f.desNomEmisor.value === '') {
      this.spinner.show();
      return this.validarExistenciaContribuyente()
        .pipe(
          switchMap(() => this.validarActividadEconomica()),
          switchMap(bool => bool ? this.validacionActividadPadron() : this.existeActividad()),
          catchError(error => {
            this.f.numDocEmisor.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS32_EX03 });
            this.spinner.hide();
            return throwError(error);
          })
        );
    }
    return of({});
  }

  private validarExistenciaContribuyente(): Observable<any> {
    return this.personaService.obtenerContribuyente(this.f.numDocEmisor.value).pipe(
      tap(data => this.actualizarNombreContribuyente(data))
    );
  }

  private validarActividadEconomica(): Observable<boolean> {
    return this.preDeclaracionservice.validarActividadEconomica(this.f.numDocEmisor.value).pipe(
      flatMap(data => this.validacionCodigoActividadEconomica(data)), // si el endpoint responde ok return false
      catchError(() => of(true)) // si el endpoint responde 422 return true
    );
  }

  private validacionCodigoActividadEconomica(data: ActividadesEconomicas): Observable<any> {
    const codCIIU = data[0].codCiiu;
    const existeCIIU = this.cus27Service.obtenerActiviadesEconomicasPrincipales().filter(x => x.val === codCIIU);
    return data[0].codTipact === ConstantesCasilla514.tipoAct ? (existeCIIU.length !== 0 ? of(false) : of(true)) : of(true);
  }

  private existeActividad(): Observable<never> {
    this.spinner.hide();
    return EMPTY;
  }

  private validacionActividadPadron(): Observable<any> {
    return this.personaService.obtenerContribuyente(this.f.numDocEmisor.value).pipe(
      tap(data => this.validarCIIU(data))
    );
  }

  private actualizarNombreContribuyente(data: PersonaJuridica): void {
    this.f.desNomEmisor.setValue(data.ddpNombre.trim());
  }

  private validarCIIU(data: PersonaJuridica): void {
    const ciiu = data.ddpCiiu;
    const existeCIIU = this.cus27Service.obtenerActividadEconomicaPadron().filter(x => x.val === ciiu);
    this.spinner.hide();
    if (existeCIIU.length === 0) {
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_NO_CUMPLE_VALIDACION_CIIU);
    }
  }
  /* 1.FIN --------------------------------------------------------------------------------------------------------------------------*/

  /* 2. VALIDAR NUMERO DE COMPROBANTE ----------------------------------------------------------------------------------------------------*/
  private parametros(): ParametrosHoteles514 { /** Parametros para la validacion del numero de comprobante */
    return {
      numRuc: this.f.numDocEmisor.value,
      codTipComprob: this.f.codTipComprob.value,
      serie: this.f.numSerie.value.toUpperCase(),
      numComp: Number(this.f.numComprob.value),
      numEjercicio: this.anioEjercicio
    };
  }

  public changeNumeroDeComprobante() {
    this.existeDataComprobante = false;
    !this.f.numComprob.errors ?
      this.validarNumeroComprobante(this.parametros(),false).subscribe() : this.establecerValoresErrorExistenciaComprobante();
  }

  private validarNumeroComprobante(parametros: ParametrosHoteles514,boolGuardar): Observable<any> {
    if (this.validarCondicion()) {
      this.spinner.show();
      return this.preDeclaracionservice.validarNumeroComprobante(parametros).
        pipe(
          tap(data => {
            this.existeDataComprobante = true;
            this.establecerValores(data,boolGuardar),
              this.validarNroComprobante(data),
              this.validarFechaComprobante(data),
              this.spinner.hide();
          }),
          catchError(error => {
            this.establecerValoresErrorExistenciaComprobante();
            
            //this.f.numComprob.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS32_EX14 });
            this.f.numComprob.setErrors({ '{excepccion01}': error.error.errors[0].msg });
            this.spinner.hide();
            return throwError(error);
          })
        );
    }
    return of({});
  }

  private validarCondicion(): boolean {
    return !this.f.numDocEmisor.errors && !this.f.numComprob.errors && !this.f.numSerie.errors && !this.f.codTipComprob.errors && !this.existeDataComprobante;
  }

  private establecerValores(data: any,boolGuardar): void {
    if (!boolGuardar){
      this.f.mtoComprob.setValue(data.monto);
    }
    
    this.f.fecFesembolso.setValue(this.establecerFecha(data));
    this.f.fecFesembolso.disable();
    this.calculoMontoDeduccion();
    this.disabledFecha = true;
  }

  private getMontoComprobante(montoServicio): any {
    const sonDiferentesLosMontos = Number(this.f.mtoComprob.value) != Number(montoServicio);
    if(this.inputId && sonDiferentesLosMontos) {
      return this.f.mtoComprob.value;
    } else {
      return montoServicio;
    }
  }

  private establecerFecha(data: any): { day: number, month: number, year: number } {
    return {
      day: Number(moment(data.fecEmisionCpe).format('DD')),
      month: Number(moment(data.fecEmisionCpe).format('MM')),
      year: Number(moment(data.fecEmisionCpe).format('YYYY'))
    };
  }

  private validarNroComprobante(data: any): void {
    if (data.numRucReceptor === data.numRuc) {
      this.f.numComprob.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS32_EX19 });
    }
  }

  private validarFechaComprobante(data: any): void {
    if (this.f.fecFesembolso.value !== '' && (moment(data.fecEmisionCpe).format('YYYYMMDD') !== this.FormatearFecha())) {
      this.f.fecFesembolso.setErrors({ excepccion01: ConstantesExcepciones.CUS32_EX15 });
    }
  }

  private establecerValoresErrorExistenciaComprobante(): void {
    this.f.mtoComprob.setValue('');
    this.f.fecFesembolso.setValue('');
    this.f.mtoDeduccion.setValue('');
    this.disabledFecha = false;
    this.f.fecFesembolso.enable();
  }

  private FormatearFecha(): string {
    if (this.f.fecFesembolso.value != null) {
      const fechaEmision = {
        day: this.f.fecFesembolso.value.day,
        month: this.f.fecFesembolso.value.month - 1,
        year: this.f.fecFesembolso.value.year
      };
      return moment(fechaEmision).format('YYYYMMDD');
    }
  }
  /* 2. FIN ------------------------------------------------------------------------------------------------------------------------------*/
  private verificarDuplicidadRegistro(): boolean {
    return this.inputListaBienes.some(x => {
      return this.f.codTipComprob.value === x.codTipComprob &&
        Number(this.f.numComprob.value) === Number(x.numComprob) &&
        x.numDocEmisor === this.f.numDocEmisor.value &&
        x.numSerie === this.f.numSerie.value.toUpperCase() &&
        (this.inputId ? x !== this.inputId : true);
    });
  }

  public metodo(): void {
    this.submitted = true;
    zip(this.validarExistenciaPadronRUCYActividadEconomica(), this.validarNumeroComprobante(this.parametros(),true))
      .subscribe(() => {
        if (Number(this.f.fecFesembolso.value.year) !== this.anioEjercicio) {
          this.f.fecFesembolso.setErrors({ excepccion01: ConstantesExcepciones.CUS32_EX04 });
          return;
        }
        this.verificarDuplicidadRegistro() ?
          this.mostrarMensaje.callModal(ConstantesExcepciones.CUS32_EX18) : this.guardaroActualizarRegistro();
      });
  }

  private getDescripcionInconsistencias2(): Observable <String>{
    
    const codFormPago = this.f.codForPago.value;

    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;        
    
    this.lista514.forEach(x => {

      switch (x.indTipoGasto){
        case this.TipoGastoArtesanias:{
          var listaArtesanos = x.casilla514Detalle.lisCas514.filter(y => this.equals(y,this.inputId));
          //listaArtesanos = listaArtesanos.filter(y => y.indInconsistencia === '1');
          if(listaArtesanos.length != 0){
            //let desInconsistencia = listaArtesanos[0].desInconsistencia.trim().split(",");
            let desInconsistencia = this.f.desInconsistencia.value ? this.f.desInconsistencia.value.split(",") : null;
            if(desInconsistencia !== null){

              desInconsistencia = this.f.desInconsistencia.value.split(",");
            
              if (codFormPago == '01'){
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
     
      const desc = data?.desc ?? ''; 
      if(data != undefined){
        this.isShowIncon = true;
        if(!(data.val == 'I4' && codFormPago == '01')){
          if(!(data.val == 'IB' && codFormPago == '01')){
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

  private guardaroActualizarRegistro(): void {
    if (this.frmCasilla514.invalid) {
      return;
    }
    

    if(this.isShowIncon){
      this.getDescripcionInconsistencias2();
    }
    //debugger;

    const casilla514Model = {
      codDocEmisor: ConstantesDocumentos.RUC,
      codFor: null,
      codForPago: this.f.codForPago.value,
      codMedPago: null,
      codTipBien: null,
      codTipComprob: this.f.codTipComprob.value,
      codTipVinc: null,
      desInconsistencia: this.f.desInconsistencia.value,
      desNomEmisor: this.f.desNomEmisor.value,
      desNomTit: null,
      fecComprob: this.funcionesGenerales.formatearFechaString(this.f.fecFesembolso.value),
      fecFesembolso: null,
      fecPago: null,
      indArchPers: this.inputId ? this.inputId.indArchPers : ConstantesCasilla514.IND_REGISTRO_MANUAL,
      indEstArchPers: null,
      //indEstFormVirt: ConstantesCasilla514.IND_EST_FORM_VIRT_REVISADO,//this.f.desInconsistencia.value == "" ? ConstantesCasilla514.IND_EST_FORM_VIRT_REVISADO : "0"
      indEstFormVirt: this.f.desInconsistencia.value == null ? ConstantesCasilla514.IND_EST_FORM_VIRT_REVISADO : this.f.desInconsistencia.value == "" ? ConstantesCasilla514.IND_EST_FORM_VIRT_REVISADO : "0",//
      indInconsistencia: this.inputId ? this.inputId.indInconsistencia : null,
      indTipGasto: ConstantesSeccionDeterminativa.COD_TIPO_GASTO_HOTELES,
      indTipoAtrib: ConstantesCasilla514.IND_ATRIBUCION_REALIZADA,
      mtoAtribuir: null,
      mtoComprob: Number(this.f.mtoComprob.value),
      //mtoDeduccion: Number(this.f.mtoDeduccion.value),
      mtoDeduccion: this.f.desInconsistencia.value == null ? Number(this.f.mtoDeduccion.value) : this.f.desInconsistencia.value == "" ? Number(this.f.mtoDeduccion.value) : 0,
      mtoInteres: null,
      mtoOriginal: this.inputId ? this.inputId.mtoOriginal : null,
      numComprob: this.f.numComprob.value,
      numDocEmisor: this.f.numDocEmisor.value,
      numEjercicio: this.anioEjercicio.toString(),
      numFor: null,
      numFormulario: null,
      numPartidaReg: null,
      numPrestamo: null,
      numRuc: null,
      numRucTit: null,
      numSerie: this.f.numSerie.value.toUpperCase(),
      porAtribucion: null,
      porDeduccion: this.porcentajeDeduccion,
    };

    if (!this.inputId) {
      this.inputListaBienes.push(casilla514Model);
      this.listaBienesReady.emit(this.inputListaBienes);
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_GRABADO_DATOS_EXITOSO);
    } else if (!this.equals(this.inputId, casilla514Model)) {
      this.inputListaBienes[this.inputIndex] = casilla514Model;
      this.listaBienesReady.emit(this.inputListaBienes);
    }
    this.activeModal.close();
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
