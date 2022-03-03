import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomDatepickerI18n } from '@path/natural/utils/ngdatepicker/custom-datepicker-i18n';
import { ValidationService } from '../../../../../../components/error-message/validation.service';
import { I18n } from '@path/natural/utils/ngdatepicker/i18n';
import { NgbDateParsearFormato } from '@path/natural/utils/ngb-date-parsear-formato';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ComboService } from '@rentas/shared/core';
import { DeudaCas128Model } from '@path/natural/models';
import { PreDeclaracionService } from '@path/natural/services';
import { CasillasUtil } from '@rentas/shared/utils';
import {
  ConstantesExcepciones,
} from '@path/natural/utils';
import { ConstantesCombos } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils';

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
export class C128MantenimientoComponent extends CasillasUtil implements OnInit {
  @Input() inputLista128: DeudaCas128Model[];
  @Output() lista128Ready = new EventEmitter<DeudaCas128Model[]>();
  @Input() inputCasilla128: DeudaCas128Model;
  @Input() inputIndexCasilla128: number;

  public submitted = false;
  public frmCasilla128: FormGroup;
  private funcionesGenerales: FuncionesGenerales;
  public listaFormularios: Array<any>;
  public mensajeErrorCasilla128 = ConstantesExcepciones;
  public anio: number;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private preDeclaracionservice: PreDeclaracionService,
    private config: NgbDatepickerConfig,
    private comboService: ComboService
  ) {
    super();
  }

  ngOnInit() {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.anio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    const noFormularios = ['0116', '0616', '1668', '1683', '1665'];
    this.listaFormularios = this.comboService.obtenerComboPorNumero(
      ConstantesCombos.FORMULARIOS,
      noFormularios,
      1
    );
    this.establecerFechaActualSistema();

    this.frmCasilla128 = this.fb.group(
      {
        periodo: [this.obtenerValoresPerido()],
        numFormulario: [
          this.inputCasilla128 ? this.inputCasilla128.numFormulario : '',
          Validators.required,
        ],
        numOrden: [
          this.inputCasilla128 ? this.inputCasilla128.numOrdOpe : '',
          Validators.required,
        ],
        fechaPago: [this.obtenerValoresFecha(), Validators.required],
        pagoSI: [
          this.inputCasilla128 ? this.inputCasilla128.mtoPagSInt : '',
          Validators.required,
        ],
      },
      {
        validator: [
          ValidationService.validarNumOrden('numOrden', 'CUS26'),
          ValidationService.validarFechas('fechaPago', 0, 'si', 'CUS26'),
          ValidationService.soloNumeros('pagoSI', 'CUS26', 'si', ''),
        ],
      }
    );

    if (this.inputCasilla128) {
      this.deshabilitarCamposAlEditar();
    }
  }

  public get f() {
    return this.frmCasilla128.controls;
  }

  private obtenerValoresPerido(): any {
    if (this.inputCasilla128) {
      return this.funcionesGenerales.obtenerPeriodoAlEditar(
        this.inputCasilla128.perPago
      );
    } else {
      return { year: 'AAAA', month: 'MM' };
    }
  }

  private obtenerValoresFecha(): any {
    if (this.inputCasilla128) {
      return this.funcionesGenerales.obtenerFechaAlEditar(
        this.inputCasilla128.fecPago
      );
    } else {
      return '';
    }
  }

  private establecerFechaActualSistema(): void {
    const fechaHoy = new Date();
    const dia = fechaHoy.getDate();
    const mes = fechaHoy.getMonth() + 1;
    this.config.maxDate = { year: fechaHoy.getFullYear(), month: mes, day: dia };
  }

  private deshabilitarCamposAlEditar(): void {
    this.f.periodo.disable();
    this.f.numFormulario.disable();
    this.f.numOrden.disable();
  }

  private validarRegistrosDuplicados(): boolean {
    return this.inputLista128.some((x) => {
      return (
        this.f.numFormulario.value === x.numFormulario &&
        this.f.numOrden.value === x.numOrdOpe &&
        Number(
          this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value)
        ) === Number(x.perPago) &&
        (this.inputCasilla128 ? x !== this.inputCasilla128 : true)
      );
    });
  }

  public metodo(): void {
    this.submitted = true;
    if (this.frmCasilla128.invalid) {
      return;
    }
    this.validarRegistrosDuplicados()
      ? this.callModal(ConstantesExcepciones.CUS26_EX09)
      : this.guardarOActualizar();
  }

  private guardarOActualizar(): void {
    const casilla128 = {
      fecPago: this.funcionesGenerales.formatearFechaString(this.f.fechaPago.value),
      mtoPagSInt: Number(this.f.pagoSI.value),
      numFormulario: this.f.numFormulario.value,
      numOrdOpe: this.f.numOrden.value,
      perPago: this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value),
    };

    if (!this.inputCasilla128) {
      this.inputLista128.push(casilla128);
      this.lista128Ready.emit(this.inputLista128);
      this.callModal('Se grabaron los datos exitosamente');
    } else if (!this.equals(this.inputCasilla128, casilla128)) {
      this.inputLista128[this.inputIndexCasilla128] = casilla128;
      this.lista128Ready.emit(this.inputLista128);
    }
    this.activeModal.close();
  }

  private callModal(excepcionName: string): void {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName,
    };
    const modalRef = this.modalService.open(
      UtilsComponent,
      this.funcionesGenerales.getModalOptions({})
    );
    modalRef.componentInstance.modal = modal;
  }

  private equals(obj: DeudaCas128Model, objNuevo: DeudaCas128Model): boolean {
    return (
      objNuevo.perPago === obj.perPago &&
      objNuevo.numFormulario === obj.numFormulario &&
      objNuevo.numOrdOpe === obj.numOrdOpe &&
      objNuevo.fecPago === obj.fecPago &&
      objNuevo.mtoPagSInt === obj.mtoPagSInt
    );
  }
}
