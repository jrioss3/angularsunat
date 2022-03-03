import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../../../utils/ngb-date-parsear-formato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18n } from '../../../../../../utils/ngdatepicker/i18n';
import { CustomDatepickerI18n } from '../../../../../../utils/ngdatepicker/custom-datepicker-i18n';
import { ValidationService } from '../../../../../../components/error-message/validation.service';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService, MostrarMensajeService } from '@path/natural/services';
import { DeudaCas358Model, ListaParametrosModel } from '@path/natural/models';
import { ConstantesExcepciones, ConstantesMensajesInformativos } from '@path/natural/utils';
import { ConstantesCombos } from '@rentas/shared/constantes';
import { FuncionesGenerales, CasillasUtil } from '@rentas/shared/utils';
import { ComboService } from '@rentas/shared/core';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  providers: [
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato }
  ]
})

export class SdCas358MantComponent extends CasillasUtil implements OnInit {

  @Input() inputListaCasilla358: DeudaCas358Model[];
  @Output() lista358Ready = new EventEmitter<DeudaCas358Model[]>();
  @Input() inputCasilla358: DeudaCas358Model;
  @Input() inputIndexCasilla358: number;

  public submitted = false;
  private fechaHoy: Date = new Date();
  public frmCasilla358: FormGroup;
  public listaFormularios: ListaParametrosModel[];
  public mensaje358 = ConstantesExcepciones;
  public anio: number;
  private mes: number;
  private funcionesGenerales: FuncionesGenerales;
  private dia: number;
  public disabled = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private preDeclaracionservice: PreDeclaracionService,
    private comboService: ComboService,
    private config: NgbDatepickerConfig,
    private mostrarMensaje: MostrarMensajeService) { 
      super();
    }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    const codDoc = ['0116', '0616', '1668', '1683'];
    this.listaFormularios = this.comboService.obtenerComboPorNumero(ConstantesCombos.FORMULARIOS, codDoc, 1);
    this.establecerFechaActualSistema();

    this.frmCasilla358 = this.fb.group({
      periodo: [this.obtenerValoresPerido()],
      numFormulario: [this.inputCasilla358 ? this.inputCasilla358.numFormulario : '', Validators.required],
      numOrden: [this.inputCasilla358 ? this.inputCasilla358.numOrdOpe : '', Validators.required],
      fechaPago: [this.obtenerValoresFecha(), Validators.required],
      pagoSinInteres: [this.inputCasilla358 ? this.inputCasilla358.mtoPagSInt : '', [Validators.required, Validators.min(1)]]
    }, {
      validators:
        [ValidationService.validarFechas('fechaPago', this.anio, 'si', 'CUS21'),
        ValidationService.soloNumeros('pagoSinInteres', 'CUS21', 'si', 'si'),
        ValidationService.validarNumOrden('numOrden', 'CUS21')
        ]
    });
    if (this.inputCasilla358) {
      this.deshabilitarCamposAlEditar();
    }
  }

  public get f() { return this.frmCasilla358.controls; }

  private obtenerValoresPerido(): any {
    if (this.inputCasilla358) {
      return this.funcionesGenerales.obtenerPeriodoAlEditar(this.inputCasilla358.perPago);
    } else {
      return { year: 'AAAA', month: 'MM' };
    }
  }

  private obtenerValoresFecha(): any {
    if (this.inputCasilla358) {
      return this.funcionesGenerales.obtenerFechaAlEditar(this.inputCasilla358.fecPago);
    } else {
      return '';
    }
  }

  private deshabilitarCamposAlEditar(): void {
    this.disabled = true;
    this.f.numFormulario.disable();
    this.f.numOrden.disable();
  }

  private establecerFechaActualSistema(): void {
    this.anio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    this.dia = this.fechaHoy.getDate();
    this.mes = this.fechaHoy.getMonth() + 1;
    this.config.maxDate = { year: this.fechaHoy.getFullYear(), month: this.mes, day: this.dia };
  }

  public metodo(): void {
    this.submitted = true;
    if (this.frmCasilla358.invalid) {
      return;
    }
    this.validarRegistroDuplicado() ? this.mostrarMensaje.callModal(ConstantesExcepciones.CUS21_EX09) : this.guardarOActualizar();
  }

  private validarRegistroDuplicado(): boolean {
    return this.inputListaCasilla358.some(x => {
      return this.f.numFormulario.value === x.numFormulario && this.f.numOrden.value === x.numOrdOpe &&
        this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value) === x.perPago &&
        (this.inputCasilla358 ? x !== this.inputCasilla358 : true);
    });
  }

  private guardarOActualizar(): void {
    const casilla358 = {
      perPago: this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value),
      numFormulario: this.f.numFormulario.value,
      numOrdOpe: this.f.numOrden.value,
      fecPago: this.funcionesGenerales.formatearFechaString(this.f.fechaPago.value),
      mtoPagSInt: Number(this.f.pagoSinInteres.value)
    };

    if (!this.inputCasilla358) {
      this.inputListaCasilla358.push(casilla358);
      this.lista358Ready.emit(this.inputListaCasilla358);
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_GRABADO_DATOS_EXITOSO);
    } else if (!this.equals(this.inputCasilla358, casilla358)) {
      this.inputListaCasilla358[this.inputIndexCasilla358] = casilla358;
      this.lista358Ready.emit(this.inputListaCasilla358);
    }
    this.activeModal.close();
  }

  private equals(obj: DeudaCas358Model, objNuevo: DeudaCas358Model): boolean {
    return objNuevo.perPago === obj.perPago &&
      objNuevo.numFormulario === obj.numFormulario &&
      objNuevo.numOrdOpe === obj.numOrdOpe &&
      objNuevo.fecPago === obj.fecPago &&
      objNuevo.mtoPagSInt === obj.mtoPagSInt;
  }
}
