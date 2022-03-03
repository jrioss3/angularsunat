import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbModal, NgbDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../../../utils/ngb-date-parsear-formato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18n } from '../../../../../../utils/ngdatepicker/i18n';
import { CustomDatepickerI18n } from '../../../../../../utils/ngdatepicker/custom-datepicker-i18n';
import { ValidationService } from '@path/natural/components/error-message/validation.service';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { ListaParametrosModel, Casilla519, PreDeclaracionModel } from '@path/natural/models';
import { ConstantesSeccionDeterminativa, ConstantesExcepciones } from '@path/natural/utils';
import { ParametriaFormulario, PreDeclaracionService } from '@path/natural/services';
import { Observable, EMPTY, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { PersonaJuridica, PersonaNatural } from '@rentas/shared/types';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { ConstantesCombos, ConstantesDocumentos } from '@rentas/shared/constantes';
import { SessionStorage, FuncionesGenerales, CasillasUtil} from '@rentas/shared/utils';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  providers: [
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato }, NgbDatepickerConfig
  ]
})
export class Sfec519MantenimientoComponent extends CasillasUtil implements OnInit {

  @Input() inputMonto1: number;
  @Input() inputMonto2: number;
  @Input() inputLista519: Casilla519[];
  @Output() lista519Ready = new EventEmitter<Casilla519[]>();
  @Input() inputid: Casilla519;
  @Input() inputindex: number;

  public frmCasilla519: FormGroup;
  public listTipDon: ListaParametrosModel[];
  private listaTipoDocDonat: ListaParametrosModel[];
  public listaDoc: ListaParametrosModel[];
  public arrTipoDoc: ListaParametrosModel[];
  public submitted = false;
  public mensaje519 = ConstantesExcepciones;
  private funcionesGenerales: FuncionesGenerales;
  private nameTipoDona = '';
  private nameModDona = '';
  private monto116;
  private monto512;
  private editLoad = false;
  private preDeclaracionObject: PreDeclaracionModel;
  public placeholder: string;
  public cmbTipoDonacionIsDisabled = false;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private preDeclaracionservice: PreDeclaracionService,
    private cus16Service: ParametriaFormulario,
    private comboservice: ComboService,
    private personaService: ConsultaPersona,
    private config: NgbDatepickerConfig,
    private spinner: NgxSpinnerService) { 
      super();
    }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.preDeclaracionObject = SessionStorage.getPreDeclaracion();
    const rucDeclarante = this.preDeclaracionservice.obtenerRucPredeclaracion();
    const anio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    this.monto116 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracionObject.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas116);
    this.monto512 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracionObject.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas512);
    this.listTipDon = this.cus16Service.obtenerTipoDonacion();
    const listaTipoDoc = [ConstantesDocumentos.RUC, ConstantesDocumentos.PASAPORTE, ConstantesDocumentos.DNI,
    ConstantesDocumentos.CARNET_DE_EXTRANJERIA, ConstantesDocumentos.PTP, ConstantesDocumentos.CARNET_IDENTIDAD];
    this.listaTipoDocDonat = this.comboservice.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO, listaTipoDoc);
    this.listaDoc = [];
    this.placeholder = 'ingresar';
    this.config.minDate = { year: anio, month: 1, day: 1 };
    this.config.maxDate = { year: anio, month: 12, day: 31 };

    this.frmCasilla519 = this.fb.group({
      cmbTipoDonacion: [this.inputid ? this.inputid.codTipDona : '', Validators.required],
      cmbModDonacion: [this.inputid ? this.inputid.codModDona : '', Validators.required],
      cmbTipDocDonatario: [this.inputid ? this.inputid.codTipDoc : '', Validators.required],
      txtNumIdentificacion: [this.inputid ? this.inputid.numDoc : '', Validators.required],
      txtNomDonatario: [this.inputid ? this.inputid.desRazSoc : '', Validators.required],
      txtFechaDonacion: [this.obtenerValoresFecha(), Validators.required],
      txtMontoDonacion: [this.inputid ? this.inputid.mtoDonacion : '', Validators.required],
      txtMontoDeduccion: ['', Validators.required]
    }, {
      validators: [
        ValidationService.validarNrodoc('cmbTipDocDonatario', 'txtNumIdentificacion', 'CUS16', rucDeclarante),
        ValidationService.validarFechas('txtFechaDonacion', anio, 'no', 'CUS16')
      ]
    });

    if (this.inputid) {
      this.editLoad = true;
      let calculo = 0;
      calculo = (this.inputid.codTipDona === 'A') ? this.inputMonto1 : this.inputMonto2;
      this.cambiarModalidadDonacion(this.inputid.codTipDona);
      this.cambiarTipoDocumentoDonatario(this.inputid.codTipDona);
      this.f.cmbModDonacion.setValue(this.inputid.codModDona);
      this.f.cmbTipDocDonatario.setValue(this.inputid.codTipDoc);
      this.f.txtNomDonatario.setValue(this.inputid.desRazSoc);
      this.f.txtMontoDonacion.setValue(this.inputid.mtoDonacion);
      this.f.cmbTipoDonacion.disable();
      this.cmbTipoDonacionIsDisabled = true;
      this.f.cmbModDonacion.disable();
      this.f.cmbTipDocDonatario.disable();
      this.f.txtNumIdentificacion.disable();
      this.f.txtNomDonatario.disable();
      this.f.txtMontoDeduccion.setValue(calculo);
    }
  }

  public get f() { return this.frmCasilla519.controls; }

  private obtenerValoresFecha(): any {
    if (this.inputid) {
      return this.funcionesGenerales.obtenerFechaAlEditar(this.inputid.fecDonacion);
    } else {
      return '';
    }
  }

  private cambiarModalidadDonacion(val): void {
    let listaTipDonacion = [];
    listaTipDonacion = (val === 'A' || val === 'D') ? ['1', '4', '5', '6', '3'] : ['1', '4', '5', '6'];
    this.f.cmbModDonacion.setValue('');
    this.f.cmbModDonacion.enable();
    const tipoDona = this.comboservice.obtenerComboPorNumero('862');
    switch (val) {
      case 'A': this.arrTipoDoc = tipoDona.filter(x => listaTipDonacion.includes(x.val)); break;
      case 'B': this.arrTipoDoc = tipoDona.filter(x => listaTipDonacion.includes(x.val)); break;
      case 'C': this.arrTipoDoc = tipoDona.filter(x => listaTipDonacion.includes(x.val)); break;
      case 'D': this.arrTipoDoc = tipoDona.filter(x => listaTipDonacion.includes(x.val)); break;
      default: this.arrTipoDoc = []; break;
    }
  }

  public funcionesChange(): void {
    const tipoDonacionSeleccionado = this.f.cmbTipoDonacion.value;
    this.changeTipoDona(tipoDonacionSeleccionado);
    this.cambiarModalidadDonacion(tipoDonacionSeleccionado);
    this.cambiarTipoDocumentoDonatario(tipoDonacionSeleccionado);
  }

  private cambiarTipoDocumentoDonatario(val): void {
    this.editLoad ? this.editLoad = false : this.f.txtNumIdentificacion.setValue('');
    this.f.txtMontoDonacion.setValue('');
    this.f.txtNomDonatario.setValue('');
    this.listaDoc = this.listaTipoDocDonat;
    switch (val) {
      case '': {
        this.f.cmbTipDocDonatario.setValue('');
        this.f.cmbTipDocDonatario.enable();
        this.f.txtMontoDeduccion.setValue('0');
        this.listaDoc = [];
        this.f.txtNomDonatario.enable();
        this.placeholder = 'ingresar';
        break;
      }
      case 'A': {
        this.f.cmbTipDocDonatario.setValue('');
        this.f.cmbTipDocDonatario.enable();
        this.f.txtMontoDeduccion.setValue(this.inputMonto1);
        this.f.txtNomDonatario.enable();
        this.placeholder = 'ingresar';
        break;
      }
      default: {
        this.f.cmbTipDocDonatario.setValue(ConstantesDocumentos.RUC);
        this.f.cmbTipDocDonatario.disable();
        this.f.txtNomDonatario.disable();
        this.f.txtMontoDeduccion.setValue(this.inputMonto2);
        this.placeholder = '';
        break;
      }
    }
  }

  public habilitarcampo(): void {
    this.f.txtNumIdentificacion.setValue('');
    this.f.txtNomDonatario.setValue('');
    this.f.txtNumIdentificacion.setValue('');
    this.f.cmbTipDocDonatario.value === ConstantesDocumentos.RUC || this.f.cmbTipDocDonatario.value === ConstantesDocumentos.DNI ?
      (this.f.txtNomDonatario.disable(), this.placeholder = '') : (this.f.txtNomDonatario.enable(), this.placeholder = 'ingresar');
  }

  private changeTipoDona(eventoHtml): void {
    this.nameTipoDona = (eventoHtml !== '' ? this.listTipDon.find(x => x.val === eventoHtml).desc : '');
  }

  public changeModDonacion(): void {
    const combo = (document.getElementById('cmbModDonacion')) as HTMLSelectElement;
    const selected = combo.options[combo.selectedIndex].text;
    this.nameModDona = selected;
  }

  public nombreRazonSocial(): void {
    if (this.f.txtNomDonatario.disabled === true) {
      this.f.txtNomDonatario.setValue('');
    }
    this.autocompletarNombre().subscribe();
  }

  private autocompletarNombre(): Observable<any> {
    if (this.cumpleCondicion()) {
      this.spinner.show();
      return this.tipoContribuyente().
        pipe(
          switchMap(tipo => tipo === ConstantesDocumentos.DNI ? this.validarExistenciaPersona() : this.validarExistenciaContribuyente()
          ),
          catchError(error => {
            switch (this.f.cmbTipDocDonatario.value) {
              case ConstantesDocumentos.DNI:
                this.f.txtNumIdentificacion.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS16_EX03 }); break;
              case ConstantesDocumentos.RUC:
                this.f.txtNumIdentificacion.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS16_EX04 }); break;
            }
            this.spinner.hide();
            return throwError(error);
          })
        );
    }
    return of({});
  }

  private cumpleCondicion(): boolean {
    return !this.f.txtNumIdentificacion.errors &&
      (this.f.cmbTipDocDonatario.value === ConstantesDocumentos.RUC || this.f.cmbTipDocDonatario.value === ConstantesDocumentos.DNI) &&
      this.f.txtNomDonatario.value === '';
  }

  private tipoContribuyente(): Observable<string> {
    if (this.f.txtNumIdentificacion.value && this.f.cmbTipDocDonatario.value === ConstantesDocumentos.DNI) {
      return of(ConstantesDocumentos.DNI);
    } else if (this.f.txtNumIdentificacion.value && this.f.cmbTipDocDonatario.value === ConstantesDocumentos.RUC) {
      return of(ConstantesDocumentos.RUC);
    } else {
      return EMPTY;
    }
  }

  private validarExistenciaPersona(): Observable<any> {
    return this.personaService.obtenerPersona(this.f.txtNumIdentificacion.value).pipe(
      tap(data => this.obtenerNombrePersona(data))
    );
  }

  private validarExistenciaContribuyente(): Observable<any> {
    return this.personaService.obtenerContribuyente(this.f.txtNumIdentificacion.value).pipe(
      tap(data => this.obtenerRazonSocialContribuyente(data))
    );
  }

  private obtenerNombrePersona(data: PersonaNatural): void {
    const nombre = data.desNombrePnat + ' ' + data.desApepatPnat + ' ' + data.desApematPnat;
    this.f.txtNomDonatario.setValue(nombre);
    this.spinner.hide();
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void {
    this.f.txtNomDonatario.setValue(data.ddpNombre.trim());
    this.spinner.hide();
  }

  public validarEspacio(val: any): void {
    this.f.txtNumIdentificacion.setValue(val.trim());
  }

  private validarMontoDeduccion(): boolean {
    const monto2 = ConstantesSeccionDeterminativa.DIEZ_PORCIENTO * (this.monto512 + this.monto116);
    const monto = this.f.cmbTipoDonacion.value === 'A' ?
      Number(this.f.txtMontoDonacion.value) + Number(this.inputMonto1) - (this.inputid ? this.inputid.mtoDonacion : 0) :
      Number(this.f.txtMontoDonacion.value) + Number(this.inputMonto2) - (this.inputid ? this.inputid.mtoDonacion : 0);
    return this.f.cmbTipoDonacion.value === 'A' ? (monto > monto2 ? false : true) : (monto > monto2 ? false : true);
  }

  private validarDuplicidadRegistro(): boolean {
    return this.inputLista519.some(x => {
      return this.f.cmbTipoDonacion.value === x.codTipDona && this.f.cmbTipDocDonatario.value === x.codTipDoc &&
        this.f.txtNumIdentificacion.value.toUpperCase() === x.numDoc &&
        x.fecDonacion === this.funcionesGenerales.formatearFechaString(this.f.txtFechaDonacion.value) &&
        (this.inputid ? this.inputid !== x : true);
    });
  }

  public grabar(): void {
    this.submitted = true;
    this.autocompletarNombre().subscribe(() => {
      if (this.frmCasilla519.invalid) {
        return;
      }
      this.validarDuplicidadRegistro() ? this.callModal(ConstantesExcepciones.CUS16_EX10) : this.agregarOActualizar();
    });
  }

  private agregarOActualizar(): void {
    const casilla519Object = {
      codTipDona: this.f.cmbTipoDonacion.value,
      desTipDona: !this.inputid ? this.nameTipoDona.toUpperCase() : this.inputid.desTipDona,
      codModDona: this.f.cmbModDonacion.value,
      desModDona: !this.inputid ? this.nameModDona.toUpperCase() : this.inputid.desModDona,
      codTipDoc: this.f.cmbTipDocDonatario.value,
      numDoc: this.f.txtNumIdentificacion.value.toUpperCase(),
      desRazSoc: this.f.txtNomDonatario.value.toUpperCase(),
      fecDonacion: this.funcionesGenerales.formatearFechaString(this.f.txtFechaDonacion.value),
      mtoDonacion: Number(this.f.txtMontoDonacion.value)
    };

    const monto = this.validarMontoDeduccion();

    if (monto && !this.inputid) {
      this.inputLista519.push(casilla519Object);
      this.lista519Ready.emit(this.inputLista519);
      this.callModal('Se grabaron los datos exitosamente.');
    } else if (!monto && casilla519Object.codTipDona === 'A') {
      this.callModal(ConstantesExcepciones.CUS16_EX08);
      return;
    } else if (!monto && casilla519Object.codTipDona !== 'A') {
      this.callModal(ConstantesExcepciones.CUS16_EX09);
      return;
    } else if (!this.equals(this.inputid, casilla519Object)) {
      this.inputLista519[this.inputindex] = casilla519Object;
      this.lista519Ready.emit(this.inputLista519);
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

  private equals(obj: Casilla519, objNuevo: Casilla519): boolean {
    return objNuevo.codTipDona === obj.codTipDona &&
      objNuevo.desTipDona === obj.desTipDona &&
      objNuevo.codModDona === obj.codModDona &&
      objNuevo.desModDona === obj.desModDona &&
      objNuevo.codTipDoc === obj.codTipDoc &&
      objNuevo.numDoc === obj.numDoc &&
      objNuevo.desRazSoc === obj.desRazSoc &&
      objNuevo.fecDonacion === obj.fecDonacion &&
      objNuevo.mtoDonacion === obj.mtoDonacion;
  }
}
