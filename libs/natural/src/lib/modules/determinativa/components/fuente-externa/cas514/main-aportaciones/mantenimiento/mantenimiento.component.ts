import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LCas514Detalle, ListaParametrosModel } from '@path/natural/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService, UtilsComponent } from '@path/natural/components';
import { CasillaErrorService, PreDeclaracionService } from '@path/natural/services';
import { of, EMPTY, Observable, throwError, zip } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal, NgbModal, NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import {
  ConstantesSeccionDeterminativa, NgbDateParsearFormato, CustomDatepickerI18n,
  I18n, ConstantesExcepciones
} from '@path/natural/utils';
import { PersonaJuridica, PersonaNatural } from '@rentas/shared/types';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { ConstantesCombos, ConstantesDocumentos } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils'

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  providers: [
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato }
  ]
})
export class Sfec514AportacionesMantenimientoComponent implements OnInit {

  @Input() inputId: LCas514Detalle;
  @Input() public modal;
  @Input() inputListaBienes: LCas514Detalle[];
  @Output() listaBienesReady = new EventEmitter<LCas514Detalle[]>();
  @Input() inputIndex: number;
  public frmCasilla514: FormGroup;
  public submitted = false;
  public mensaje514 = CasillaErrorService;
  private anio: string;
  private ruc: string;
  public listaTipDoc: ListaParametrosModel[];
  private porcentajeDeduccion: number;
  private existeData: boolean;
  private nroFormulario = '1676';
  private montoPersonalizado: number;
  private noValidarMonto: boolean;
  public placeholder = '';
  private funcionesGenerales: FuncionesGenerales;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private comboService: ComboService,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService,
    private predeclaracionService: PreDeclaracionService,
  ) { }

  ngOnInit(): void {
    this.porcentajeDeduccion = 100;
    this.anio = this.predeclaracionService.obtenerAnioEjercicio();
    this.ruc = this.predeclaracionService.obtenerRucPredeclaracion();
    this.listaTipDoc = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
    this.funcionesGenerales = FuncionesGenerales.getInstance();

    this.montoPersonalizado = this.inputId && String(this.inputId.indArchPers) === '1' ? this.inputId.mtoOriginal : null;
    this.noValidarMonto = this.inputId && String(this.inputId.indArchPers) === '1' ? true : false;

    this.frmCasilla514 = this.fb.group({
      codTipComprob: [this.inputId ? this.inputId.codDocEmisor : ''],
      numDocEmisor: [this.inputId ? this.inputId.numDocEmisor.trim() : ''],
      desNomEmisor: [this.inputId ? this.inputId.desNomEmisor.trim() : ''],
      numFor: ['FV-1676'],
      numFormulario: [this.inputId ? this.inputId.numFor : '', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      fecPago: [this.inputId ? this.obtenerFechaPagoAlEditar() : ''],
      mtoComprob: [this.inputId ? this.inputId.mtoComprob : '', Validators.required],
      mtoDeduccion: [this.inputId ? this.inputId.mtoDeduccion : ''],
      periodo: [this.inputId ? this.inputId.periodo : '']
    }, {
      validators:
        [
          ValidationService.soloNumeros('mtoDeduccion', 'CUS32_3', 'deducir', ''),
          ValidationService.soloNumeros('mtoComprob', 'CUS32_3', 'si', 'si'),
          ValidationService.validarMonto('mtoComprob', '', 'APORTACIONES', this.montoPersonalizado, this.noValidarMonto),
        ]
    });

    const camposDeshab = [this.f.codTipComprob, this.f.numDocEmisor, this.f.desNomEmisor, this.f.numFor, this.f.fecPago,
    this.f.mtoDeduccion, this.f.mtoComprob, this.f.periodo];
    FuncionesGenerales.getInstance().desHabilitarCampos(camposDeshab);
    this.inputId ? (this.f.numFormulario.enable(), this.f.mtoComprob.enable()) : this.f.numFormulario.enable();//el primer numformu se cambio a enable
    this.existeData = this.inputId ? true : false;
  }

  public get f() { return this.frmCasilla514.controls; }

  public calculoMontoDeduccion(): void {
    this.f.mtoDeduccion.setValue(this.f.mtoComprob.value);
  }

  public changeNumeroFormulario(): void {
    this.existeData = false;
    this.ejecutarNumeroFormulario(this.f.numFormulario.value).subscribe();
  }

  private obtenerFechaPagoAlEditar(): { day: number, month: number, year: number } {
    return {
      day: Number(this.inputId.fecPago.substring(8, 10)),
      month: Number(this.inputId.fecPago.substring(5, 7)),
      year: Number(this.inputId.fecPago.substring(0, 4))
    };
  }
  // 1. VALIDAR EXISTENCIA DEL NUMERO DE FORMULARIO ----------------------------------------------------------------------------------------
  private ejecutarNumeroFormulario(nroFormulario: string): Observable<any> {
   
    if (!this.f.numFormulario.errors && !this.existeData) {
      this.spinner.show();
      return this.predeclaracionService.validarNumeroComprobante1676(nroFormulario).
        pipe(
          tap(data => this.validarNumeroFormulario(data)),
          catchError(error => {
            
            this.existeData = false;
            const camposVacios = [this.f.codTipComprob, this.f.numDocEmisor, this.f.fecPago, this.f.mtoComprob, this.f.mtoDeduccion,
            this.f.desNomEmisor, this.f.mtoComprob];          
            this.placeholder = '';
            this.f.numFormulario.setErrors({ '{excepccion01}': error.error.errors[0].msg });
         
            this.spinner.hide();
            return throwError(error);
          })
        );
    } /*else if (this.inputId) {
      this.f.mtoComprob.setValue(this.f.mtoComprob.value);
      this.f.mtoDeduccion.setValue(this.f.mtoDeduccion.value);
    }*/
    return of({});
  }
  public obtenerPeriodoParaElCampo(val: string): string {
    return val.substring(4,6) +"/"+val.substring(0, 4);
  }
  public obtenerPeriodo(val: string): string {
    return val.substring(3)+val.substring(0, 2);
  }
  private validarNumeroFormulario(data: any): void {
    //debugger;
    this.existeData = true;
    this.placeholder = 'ingresar';
    this.f.codTipComprob.setValue(data.codDocTrabajador);
    this.f.numDocEmisor.setValue(data.numDocTrabajador);
    this.autocompletarNombreRazonSocial().subscribe();
    this.f.fecPago.setValue(this.establecerFecha(data));
    this.f.mtoComprob.setValue(data.monAportacion);
    this.calculoMontoDeduccion();
    //this.validarNumeroContribuyente(data.numDocEmisor);
    //this.validacionFecha(data);
    this.validacionPeriodo(data);
    this.f.periodo.setValue( this.obtenerPeriodoParaElCampo(data.periodo));
    this.f.mtoComprob.enable();
    this.spinner.hide();
  }

  private establecerFecha(data: any): { day: number, month: number, year: number } {
    return {
      day: Number(moment(data.fecha).format('DD')),
      month: Number(moment(data.fecha).format('MM')),
      year: Number(moment(data.fecha).format('YYYY'))
    };
  }

  private validarNumeroContribuyente(data: any) {
    if (data !== this.ruc) {
      this.f.numFormulario.setErrors({ '{excepccion01}': CasillaErrorService.Ex230 });
    }
  }

  private validacionFecha(data: any): void {
    if (
      (Number(moment(data.fecha).format('YYYY')) < Number(this.anio)) ||
      (Number(moment(data.fecha).format('YYYY')) === Number(this.anio) + 1 && Number(moment(data.fecha).format('MM')) > 1) ||
      (Number(moment(data.fecha).format('YYYY')) > Number(this.anio + 1))
    ) {
      this.f.numFormulario.setErrors({ 
        '{excepccion01}': CasillaErrorService.Ex229
        .replace('AAAA', String(this.anio))
        .replace('(EEEE)', String(Number(this.anio) + 1)) 
      });
    }
  }

  private validacionPeriodo(data: any): void {
    if (Number(data.periodo.substring(0, 4)) !== Number(this.anio)) {
      this.f.numFormulario.setErrors({ '{excepccion01}': CasillaErrorService.Ex233.replace('AAAA', String(this.anio)) });
    }
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
  // 2. VALIDAR EXISTENCIA DEL NUMERO DE DOCUMENTO EN EL PADRON ----------------------------------------------------------------------------
  private autocompletarNombreRazonSocial(): Observable<any> {
    if (this.cumpleCondicion()) {
      this.spinner.show();
      return this.tipoContribuyenteEmisor().pipe(
        switchMap(tipo => tipo === ConstantesDocumentos.DNI ? this.validarExistenciaPersona() : this.validarExistenciaContribuyente()),
        catchError(error => {
          switch (this.f.codTipComprob.value) {
            case ConstantesDocumentos.DNI: this.f.numDocEmisor.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS30_EX04 }); break;
            case ConstantesDocumentos.RUC: this.f.numDocEmisor.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS32_EX03 }); break;
          }
          this.spinner.hide();
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private cumpleCondicion(): boolean {
    return !this.f.numDocEmisor.errors &&
      (this.f.codTipComprob.value === ConstantesDocumentos.RUC || this.f.codTipComprob.value === ConstantesDocumentos.DNI);
  }

  private tipoContribuyenteEmisor(): Observable<any> {
    if (this.f.numDocEmisor.value && this.f.codTipComprob.value === ConstantesDocumentos.DNI) {
      return of(ConstantesDocumentos.DNI);
    } else if (this.f.numDocEmisor.value && this.f.codTipComprob.value === ConstantesDocumentos.RUC) {
      return of(ConstantesDocumentos.RUC);
    } else {
      this.f.desNomEmisor.setValue('');
      return EMPTY;
    }
  }

  private validarExistenciaPersona(): Observable<any> {
    return this.personaService.obtenerPersona(this.f.numDocEmisor.value.trim()).pipe(
      tap(data => this.obtenerNombrePersona(data))
    );
  }

  private validarExistenciaContribuyente(): Observable<any> {
    return this.personaService.obtenerContribuyente(this.f.numDocEmisor.value.trim()).pipe(
      tap(data => this.obtenerRazonSocialContribuyente(data))
    );
  }

  private obtenerNombrePersona(data: PersonaNatural): void {
    const nombre = data.desNombrePnat + ' ' + data.desApepatPnat + ' ' + data.desApematPnat;
    this.f.desNomEmisor.setValue(nombre);
    this.spinner.hide();
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void {
    this.f.desNomEmisor.setValue(data.ddpNombre.trim());
    this.spinner.hide();
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
  private establecerFormatoFechaAlGuardar(): string {
    const fecha = {
      day: this.f.fecPago.value.day,
      month: this.f.fecPago.value.month - 1,
      year: this.f.fecPago.value.year,
    };
    return moment(fecha).format('YYYY-MM-DD') + 'T00:00:00.000-05:00';
  }

  public metodo(): void {
    this.existeData = false;
    this.submitted = true;   
    zip(this.ejecutarNumeroFormulario(this.f.numFormulario.value)).subscribe(
      () => {       
        if (this.frmCasilla514.invalid) {
          return;
        }
        
        if (!this.inputId) {
          this.guardarRegistro();
        } else {
          this.actualizar();
        }
      }
    );
   
  }

  private guardarRegistro(): void {
    this.submitted = true;
    if (this.frmCasilla514.invalid) {
      return;
    }

    const objeto1122 = {
      codDocEmisor: this.f.codTipComprob.value,
      codFor: this.nroFormulario,
      codForPago: null,
      codMedPago: null,
      codTipBien: null,
      codTipComprob: null,
      codTipVinc: null,
      desNomEmisor: this.f.desNomEmisor.value,
      desNomTit: null,
      fecComprob: null, // this.fechaDefecto,
      fecFesembolso: null, // this.fechaDefecto,
      fecPago: this.establecerFormatoFechaAlGuardar(),
      indArchPers: this.inputId ? this.inputId.indArchPers : '0',
      indEstArchPers: null,
      indEstFormVirt: '1',
      indTipGasto: ConstantesSeccionDeterminativa.COD_TIPO_GASTO_APORTACIONES,
      indTipoAtrib: '1',
      mtoAtribuir: null,
      mtoComprob: Number(this.f.mtoComprob.value),
      mtoDeduccion: Number(this.f.mtoDeduccion.value),
      mtoInteres: null,
      mtoOriginal: this.inputId ? this.inputId.mtoOriginal : null,
      numComprob: null,
      numDocEmisor: this.f.numDocEmisor.value,
      numEjercicio: this.anio,
      numFor: this.f.numFormulario.value,
      numFormulario: null,
      numPartidaReg: this.obtenerPeriodo(this.f.periodo.value),
      numPrestamo: null,
      numRuc: null,
      numRucTit: null,
      numSerie: null,
      porAtribucion: null,
      porDeduccion: this.porcentajeDeduccion,
      indInconsistencia : null,
      desInconsistencia : null
    };

    const guardar = this.inputListaBienes.some(x => {
      return objeto1122.codDocEmisor === x.codDocEmisor && objeto1122.numDocEmisor === x.numDocEmisor &&
        this.f.numFor.value.substring(3, 7) === x.codFor && Number(this.f.numFormulario.value) === Number(x.numFor);
    });

    if (!guardar) {
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
    //debugger;
    if (this.frmCasilla514.invalid) {
      return;
    }

    const objeto1122 = {
      codDocEmisor: this.f.codTipComprob.value,
      codFor: this.nroFormulario,
      codForPago: null,
      codMedPago: null,
      codTipBien: null,
      codTipComprob: null,
      codTipVinc: null,
      desNomEmisor: this.f.desNomEmisor.value,
      desNomTit: null,
      fecComprob: null, // this.fechaDefecto,
      fecFesembolso: null, // this.fechaDefecto,
      fecPago: this.establecerFormatoFechaAlGuardar(),
      indArchPers: this.inputId ? this.inputId.indArchPers : '0',
      indEstArchPers: null,
      indEstFormVirt: '1',
      indTipGasto: ConstantesSeccionDeterminativa.COD_TIPO_GASTO_APORTACIONES,
      indTipoAtrib: '1',
      mtoAtribuir: null,
      mtoComprob: Number(this.f.mtoComprob.value),
      mtoDeduccion: Number(this.f.mtoDeduccion.value),
      mtoInteres: null,
      mtoOriginal: this.inputId ? this.inputId.mtoOriginal : null,
      numComprob: null,
      numDocEmisor: this.f.numDocEmisor.value,
      numEjercicio: this.anio,
      numFor: this.f.numFormulario.value,
      numFormulario: null,
      numPartidaReg: null,
      numPrestamo: null,
      numRuc: null,
      numRucTit: null,
      numSerie: null,
      porAtribucion: null,
      porDeduccion: this.porcentajeDeduccion,
      indInconsistencia: null,
      desInconsistencia : null
    };

    const guardar = this.inputListaBienes.some(x => {
      return objeto1122.codDocEmisor === x.codDocEmisor && objeto1122.numDocEmisor === x.numDocEmisor &&
        objeto1122.codFor === x.codFor && Number(objeto1122.numFor) === Number(x.numFor) && x !== this.inputId;
    });

    if (!guardar) {
      if (!this.equals(this.inputId, objeto1122)) {
        this.inputListaBienes[this.inputIndex] = objeto1122;
        this.listaBienesReady.emit(this.inputListaBienes);
      }
      this.activeModal.close();
    } else {
      this.callModal(CasillaErrorService.Ex225);
    }
  }

  callModal(excepcionName: string): void {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
  }

  equals(obj: LCas514Detalle, objNuevo: LCas514Detalle): boolean {
    return objNuevo.codDocEmisor === obj.codDocEmisor &&
      objNuevo.codFor === obj.codFor &&
      objNuevo.codForPago === obj.codForPago &&
      objNuevo.codMedPago === obj.codMedPago &&
      objNuevo.codTipBien === obj.codTipBien &&
      objNuevo.codTipComprob === obj.codTipComprob &&
      objNuevo.codTipVinc === obj.codTipVinc &&
      objNuevo.desNomEmisor === obj.desNomEmisor &&
      objNuevo.desNomTit === obj.desNomTit &&
      objNuevo.fecComprob === obj.fecComprob &&
      objNuevo.fecFesembolso === obj.fecFesembolso &&
      objNuevo.fecPago === obj.fecPago &&
      objNuevo.indArchPers === obj.indArchPers &&
      objNuevo.indEstArchPers === obj.indEstArchPers &&
      objNuevo.indEstFormVirt === obj.indEstFormVirt &&
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
