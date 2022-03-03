import { ConstantesExcepciones } from '@path/natural/utils';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../../../utils/ngb-date-parsear-formato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { ValidationService } from '../../../../../../components/error-message/validation.service';
import { DeudaCas130Model } from '@path/natural/models';
import { PreDeclaracionService } from '@path/natural/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError, of, zip } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PersonaJuridica } from '@rentas/shared/types';
import { ConsultaPersona } from '@rentas/shared/core';
import { ConstantesDocumentos } from '@rentas/shared/constantes';
import { SessionStorage, FuncionesGenerales, CasillasUtil } from '@rentas/shared/utils';
import * as moment from 'moment';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato }
  ]
})
export class Sddc130MantenimientoComponent extends CasillasUtil implements OnInit {

  @Input() inputLista130: DeudaCas130Model[];
  @Output() lista130Ready = new EventEmitter<DeudaCas130Model[]>();
  @Input() inputCasilla130: DeudaCas130Model;
  @Input() inputIndexCasilla130: number;

  public submitted = false;
  public mensajeErrorCasilla130 = ConstantesExcepciones;
  public frmCasilla130: FormGroup;
  private preDeclaracion: any;
  private funcionesGenerales: FuncionesGenerales;
  public txtrazsoc = '';
  public anio: number;
  public disabled = false;
  public textoPeriodo: string;

  private existeDataPadron: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private preDeclaracionservice: PreDeclaracionService,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService) { 
      super();
    }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.textoPeriodo = '<con formato “MM/AAAA”>';
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    const rucDeclarante = this.preDeclaracion.numRuc;
    this.anio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    this.existeDataPadron = false;

    if (Number(this.anio) >= 2021){
      this.frmCasilla130 = this.fb.group({
        periodo: [this.obtenerValoresPerido()],
        numDoc: [this.inputCasilla130 ? this.inputCasilla130.numDoc : '', Validators.required],
        numFormul: [this.inputCasilla130 ? this.inputCasilla130.numFormul : '', Validators.required],
        numOrd: [this.inputCasilla130 ? this.inputCasilla130.numOrd : '', Validators.required],
        mtoRetenido: [this.inputCasilla130 ? this.inputCasilla130.mtoRetenido : '', Validators.required]
      }, {
        validator:
          [
            ValidationService.validarNrodoc(ConstantesDocumentos.RUC, 'numDoc', 'CUS27', rucDeclarante),
            ValidationService.soloNumeros('mtoRetenido', 'CUS27', 'si', 'si'),
            ValidationService.soloNumeros('numOrd', 'CUS27', 'si', 'si')
            //ValidationService.soloCaracteres('CUS27', 'numFormul')
          ]
      });
    }else{
      this.frmCasilla130 = this.fb.group({
        periodo: [this.obtenerValoresPerido()],
        numDoc: [this.inputCasilla130 ? this.inputCasilla130.numDoc : '', Validators.required],
        numFormul: [this.inputCasilla130 ? this.inputCasilla130.numFormul : '', Validators.required],
        numOrd: [this.inputCasilla130 ? this.inputCasilla130.numOrd : ''],
        mtoRetenido: [this.inputCasilla130 ? this.inputCasilla130.mtoRetenido : '']
      }, {
        validator:
          [
            ValidationService.validarNrodoc(ConstantesDocumentos.RUC, 'numDoc', 'CUS27', rucDeclarante),
            ValidationService.soloNumeros('mtoRetenido', 'CUS27', 'si', 'si'),
            ValidationService.soloNumeros('numOrd', 'CUS27', 'si', 'si')
            //ValidationService.soloCaracteres('CUS27', 'numFormul')
          ]
      });
    }

    
    

   

    this.inputCasilla130 ? this.establecerValoresyDeshabilitarCamposAlEditar() : (this.f.numFormul.disable());
  }

  public get validPeriodoInvalid() {
    return this.f.periodo.hasError('invalid');
  }

  private obtenerValoresPerido(): any {
    if (this.inputCasilla130) {
      return this.funcionesGenerales.obtenerPeriodoAlEditar(this.inputCasilla130.perImpReten);
    } else {
      return { year: 'AAAA', month: 'MM' };
    }
  }

  private establecerValoresyDeshabilitarCamposAlEditar(): void {    
    this.existeDataPadron = true;
    this.disabled = true;
    this.txtrazsoc = this.inputCasilla130.desRazSoc;
    this.f.numDoc.disable();
    this.f.numFormul.disable();
    this.f.numOrd.disable();
  }

  public obtenerRazonSocialContribuyente(): void {
    this.txtrazsoc = '';
    this.f.numOrd.setValue('');
    if (!this.f.numDoc.errors) {
      this.autocompletarRazonSocialContribuyente().subscribe();
    }
  }

  private autocompletarRazonSocialContribuyente(): Observable<any> {    
    if (!this.f.numDoc.errors && this.txtrazsoc === '') {
      this.spinner.show();
      return this.personaService.obtenerContribuyente(this.f.numDoc.value)
        .pipe(
          tap(data => this.actualizarRazonSocialContribuyente(data)),
          catchError(error => {
            this.f.numDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS27_EX03 });
            this.spinner.hide();
            return throwError(error);
          })
        );
    }
    return of({});
  }

  private actualizarRazonSocialContribuyente(data: PersonaJuridica): void {    
    this.txtrazsoc = data.ddpNombre.trim();
    this.spinner.hide();
  }

  public cambiosEnCamposDependientesDeMontoDevuelto(): void{
    console.log("CAMBIO.....")
    const camposDeshab = [this.f.numFormul, this.f.numOrd];
    const camposVacios = [this.f.numFormul, this.f.numOrd];
    if (this.f.mtoRetenido.value !== '' || this.f.mtoRetenido.value != null) {
      const numero = Number(this.f.mtoRetenido.value);
      if (numero > 0) {
        this.f.numOrd.enable();
        this.f.numFormul.setValue('0601');
        //this.placeholder = 'Ingresar';
      } else {
        this.funcionesGenerales.setearVacioEnCampos(camposVacios);
        this.funcionesGenerales.desHabilitarCampos(camposDeshab);
        //this.placeholder = '';
      }
    } else {
      this.funcionesGenerales.setearVacioEnCampos(camposVacios);
      this.funcionesGenerales.desHabilitarCampos(camposDeshab);
    }


  }

  public LimpiarNumOrden(): void {
    //debugger;
    //this.f.numOrden.markAsUntouched();
    this.f.numOrd.setValue('');
  }

  // 1. VALIDAR EXISTENCIA DEL NUMERO DE ORDEN -----------------------------------------------------------------------------------------
  public changeNumeroDeOrden(): void {
    this.validarExistenciaNroDeOrden(this.f.numDoc.value, this.f.numOrd.value, this.getPeriodo()).subscribe();
  }

  private validarExistenciaNroDeOrden(numRuc: string, nroOrden: string, periodo: string): Observable<any> {    
    this.existeDataPadron = false;
    if (this.f.numOrd.value !== '' && this.f.numDoc.value !== '' && !this.f.numOrd.errors && !this.f.numDoc.errors) {
      return this.preDeclaracionservice.validarNumeroOrden(numRuc, nroOrden, periodo).
        pipe(
          tap(data => this.validarNumeroDeOrden(data)),
          catchError(error => {            
            this.existeDataPadron = false;
            this.f.numOrd.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS28_EX13 });
            return throwError(error);
          })
        );
    }
    return of({});
  }

  private validarNumeroDeOrden(data: any): void {   
    this.existeDataPadron = true;
    if (!data || (this.getPeriodo() !== data.periodo)) {
      this.existeDataPadron = false;
      this.f.numOrd.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS28_EX13 });
    }
  }

  private getPeriodo(): string {
    const periodo = {
      month: this.f.periodo.value.month - 1,
      year: this.f.periodo.value.year,
    };
    return moment(periodo).format('YYYYMM');
  }

  public get f() {
    return this.frmCasilla130.controls;
  }

  public validarEspacio(val: any): void {
    this.f.numDoc.setValue(val.trim());
  }

  public metodo(): void {
    this.submitted = true;
    
    const anioRenta = this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    if (Number(anioRenta) >= 2021){
      zip(this.autocompletarRazonSocialContribuyente(),
      this.validarExistenciaNroDeOrden(this.f.numDoc.value, this.f.numOrd.value, this.getPeriodo()))
      .subscribe(() => {
        if (this.frmCasilla130.invalid) {
          return;
        }
        this.validarRegistroDuplicado() ? this.callModal(ConstantesExcepciones.CUS28_EX08) : this.agregarOActualizar();
      });
    }else {
      zip(this.autocompletarRazonSocialContribuyente())
      .subscribe(() => {
        if (this.frmCasilla130.invalid) {
          return;
        }
        this.validarRegistroDuplicado() ? this.callModal(ConstantesExcepciones.CUS28_EX08) : this.agregarOActualizar();
      });
    }
  }

  private validarRegistroDuplicado(): boolean {
    return this.inputLista130.some(x => {
      return this.f.numDoc.value === x.numDoc &&
        this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value) === x.perImpReten &&
        (this.inputCasilla130 ? x !== this.inputCasilla130 : true);
    });
  }

  private agregarOActualizar(): void {
    const casilla130 = {
      desRazSoc: this.txtrazsoc,
      mtoRetenido: Number(this.f.mtoRetenido.value),
      numDoc: this.f.numDoc.value,
      numFormul: this.f.numFormul.value,
      numOrd: this.f.numOrd.value,
      perImpReten: this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value),
      codTipDoc: ConstantesDocumentos.RUC
    };

    if (!this.inputCasilla130) {
      this.inputLista130.push(casilla130);
      this.lista130Ready.emit(this.inputLista130);
      this.callModal('Se grabaron los datos exitosamente');
    } else if (!this.equals(this.inputCasilla130, casilla130)) {
      this.inputLista130[this.inputIndexCasilla130] = casilla130;
      this.lista130Ready.emit(this.inputLista130);
    }
    this.activeModal.close();
  }

  private equals(obj: DeudaCas130Model, objNuevo: DeudaCas130Model): boolean {
    return objNuevo.codTipDoc === obj.codTipDoc &&
      objNuevo.numDoc === obj.numDoc &&
      objNuevo.desRazSoc === obj.desRazSoc &&
      objNuevo.perImpReten === obj.perImpReten &&
      objNuevo.mtoRetenido === obj.mtoRetenido;
  }

  private callModal(excepcionName: string): void {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
  }

  public habilitarCasItan(): boolean {
    const anioRenta = this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    return Number(anioRenta) >= 2021;
  }
}
