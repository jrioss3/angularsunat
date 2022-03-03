import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { ValidationService } from '../../../../../../components/error-message/validation.service';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DeudaCas127Model } from '@path/natural/models';
import { PreDeclaracionService } from '@path/natural/services';
import {ComboService} from '@rentas/shared/core';
import { CasillasUtil } from '@rentas/shared/utils';
import {
  CustomDatepickerI18n,
  NgbDateParsearFormato,
  I18n,
  ConstantesExcepciones
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
export class C127MantenimientoComponent extends CasillasUtil implements OnInit {
  @Input() inputLista127: DeudaCas127Model[];
  @Output() lista127Ready = new EventEmitter<DeudaCas127Model[]>();
  @Input() inputCasilla127: DeudaCas127Model;
  @Input() inputIndexCailla127: number;

  public submitted = false;
  public frmCasilla127: FormGroup;
  public mensajeErrorCasilla127 = ConstantesExcepciones;
  public listForm: any[];
  public disabled = false;
  public anio: number;
  private funcionesGenerales: FuncionesGenerales;
  private listaFormularioTipo1: any;
  private listaFormularioTipo2: any;
  private camposVacio: any;
  private camposDeshab: any;

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

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    const noFormularios = ['1665', '1683'];
    this.listForm = this.comboService.obtenerComboPorNumero(
      ConstantesCombos.FORMULARIOS,
      noFormularios,
      1
    );
    this.establecerFechaActualSistema();

    this.frmCasilla127 = this.fb.group(
      {
        periodo: [this.obtenerValoresPerido()],
        numFormulario: [
          this.inputCasilla127 ? this.inputCasilla127.numFormulario : '',
          Validators.required,
        ],
        numOrden: [
          this.inputCasilla127 ? this.inputCasilla127.numOrdOpe : '',
          Validators.required,
        ],
        fechaPago: [this.obtenerValoresFecha(), Validators.required],
        saldoFavor: [this.inputCasilla127 ? this.inputCasilla127.mtoSalfav : ''],
        saldoFavorE: [this.inputCasilla127 ? this.inputCasilla127.mtoSalfavExp : ''],
        otrosCreditos: [this.inputCasilla127 ? this.inputCasilla127.mtoOtrCre : ''],
        pagoSI: [
          this.inputCasilla127 ? this.inputCasilla127.mtoPagsInt : '',
          Validators.required,
        ],
      },
      {
        validators: [
          ValidationService.soloNumeros('saldoFavor', 'CUS25', 'si', ''),
          ValidationService.soloNumeros('saldoFavorE', 'CUS25', 'si', ''),
          ValidationService.soloNumeros('otrosCreditos', 'CUS25', 'si', ''),
          ValidationService.validarNumOrden('numOrden', 'CUS25'),
          ValidationService.validaPagoSI('numFormulario', 'pagoSI'),
        ],
      }
    );
    this.establecerValoresIniciales();
    this.funcionesGenerales.desHabilitarCampos(this.camposDeshab);
    this.cambiosAlEditar();
  }

  public get f() {
    return this.frmCasilla127.controls;
  }

  private obtenerValoresPerido(): any {
    if (this.inputCasilla127) {
      return this.funcionesGenerales.obtenerPeriodoAlEditar(
        this.inputCasilla127.perPago
      );
    } else {
      return { year: 'AAAA', month: 'MM' };
    }
  }

  private obtenerValoresFecha(): any {
    if (this.inputCasilla127) {
      return this.funcionesGenerales.obtenerFechaAlEditar(
        this.inputCasilla127.fecPago
      );
    } else {
      return '';
    }
  }

  private cambiosAlEditar(): void {
    if (this.inputCasilla127) {
      this.disabled = true;
      if (
        this.f.numFormulario.value === '0116' ||
        this.f.numFormulario.value === '0616'
      ) {
        this.habilitarYDeshabilitarCamposAlEditarFormulariosTipo1();
      } else {
        this.deshabilitarCamposAlEditarFormulariosTipo2();
      }
    }
  }

  private establecerValoresIniciales(): void {
    this.listaFormularioTipo1 = ['0116', '0616'];
    this.listaFormularioTipo2 = [
      '1052',
      '1073',
      '1252',
      '1260',
      '1660',
      '1661',
      '1662',
      '1672',
      '1648',
      '1663',
    ];
    this.camposVacio = [
      this.f.numOrden,
      this.f.saldoFavor,
      this.f.saldoFavorE,
      this.f.otrosCreditos,
      this.f.pagoSI,
    ];
    this.camposDeshab = [
      this.f.saldoFavor,
      this.f.saldoFavorE,
      this.f.otrosCreditos,
    ];
  }

  private establecerFechaActualSistema(): void {
    this.anio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    const fechaHoy = new Date();
    const dia = fechaHoy.getDate();
    const mes = fechaHoy.getMonth() + 1;
    this.config.maxDate = { year: fechaHoy.getFullYear(), month: mes, day: dia };
  }

  private habilitarYDeshabilitarCamposAlEditarFormulariosTipo1(): void {
    const camposHab = [
      this.f.saldoFavor,
      this.f.saldoFavorE,
      this.f.otrosCreditos,
      this.f.pagoSI,
    ];
    this.funcionesGenerales.habilitarCampos(camposHab);
    this.f.numFormulario.disable();
    this.f.numOrden.disable();
  }

  private deshabilitarCamposAlEditarFormulariosTipo2(): void {
    const camposDeshab = [this.f.numFormulario, this.f.numOrden, this.f.pagoSI];
    this.funcionesGenerales.habilitarCampos(camposDeshab);
    this.f.numFormulario.disable();
    this.f.numOrden.disable();
  }

  public cambiosDependientesNumeroFormulario(valuenumform: string): void {
    if (this.listaFormularioTipo1.includes(valuenumform)) {
      this.funcionesGenerales.habilitarCampos(this.camposDeshab);
      this.f.pagoSI.setValue('');
      this.f.numOrden.setValue('');
    } else if (this.listaFormularioTipo2.includes(valuenumform)) {
      this.f.numOrden.enable();
      this.funcionesGenerales.setearVacioEnCampos(this.camposVacio);
      this.funcionesGenerales.desHabilitarCampos(this.camposDeshab);
    } else {
      this.f.pagoSI.enable();
      this.funcionesGenerales.setearVacioEnCampos(this.camposVacio);
      this.funcionesGenerales.desHabilitarCampos(this.camposDeshab);
    }
  }

  public metodo(): void {
    this.submitted = true;
    if (this.frmCasilla127.invalid) {
      return;
    }
    this.validarRegistroDuplicado()
      ? this.callModal(ConstantesExcepciones.CUS25_EX09)
      : this.guardarOActualizar();
  }

  private validarRegistroDuplicado(): boolean {
    return this.inputLista127.some((x) => {
      return (
        this.f.numFormulario.value === x.numFormulario &&
        this.f.numOrden.value === x.numOrdOpe &&
        this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value) ===
          x.perPago &&
        (this.inputCasilla127 ? x !== this.inputCasilla127 : true)
      );
    });
  }

  private guardarOActualizar(): void {
    const casilla127 = {
      fecPago: this.funcionesGenerales.formatearFechaString(this.f.fechaPago.value),
      mtoOtrCre: Number(this.f.otrosCreditos.value),
      mtoPagsInt: Number(this.f.pagoSI.value),
      mtoSalfav: Number(this.f.saldoFavor.value),
      mtoSalfavExp: Number(this.f.saldoFavorE.value),
      numFormulario: this.f.numFormulario.value,
      numOrdOpe: this.f.numOrden.value,
      perPago: this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value),
    };

    if (!this.inputCasilla127) {
      this.inputLista127.push(casilla127);
      this.lista127Ready.emit(this.inputLista127);
      this.activeModal.close();
      this.callModal('Se grabaron los datos exitosamente');
    } else if (!this.equals(this.inputCasilla127, casilla127)) {
      this.inputLista127[this.inputIndexCailla127] = casilla127;
      this.lista127Ready.emit(this.inputLista127);
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

  private equals(obj: DeudaCas127Model, objNuevo: DeudaCas127Model): boolean {
    return (
      objNuevo.perPago === obj.perPago &&
      objNuevo.numFormulario === obj.numFormulario &&
      objNuevo.numOrdOpe === obj.numOrdOpe &&
      objNuevo.fecPago === obj.fecPago &&
      objNuevo.mtoSalfav === obj.mtoSalfav &&
      objNuevo.mtoSalfavExp === obj.mtoSalfavExp &&
      objNuevo.mtoOtrCre === obj.mtoOtrCre &&
      objNuevo.mtoPagsInt === obj.mtoPagsInt
    );
  }
}
