import { ConstantesExcepciones } from '@path/natural/utils';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  NgbActiveModal,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbModal,
  NgbDatepickerConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../../../utils/ngb-date-parsear-formato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18n } from '../../../../../../utils/ngdatepicker/i18n';
import { CustomDatepickerI18n } from '../../../../../../utils/ngdatepicker/custom-datepicker-i18n';
import { PreDeclaracionService } from '@path/natural/services/preDeclaracion.service';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import {
  LCas100Detalles,
  Casilla100Cabecera,
} from '@path/natural/models/SeccionDeterminativa/DetRentaPrimeraModel';
import { ValidationService } from '@path/natural/components/error-message/validation.service';
import { ComboService } from '@rentas/shared/core';
import { ListaParametrosModel } from '@path/natural/models';
import { ConstantesCombos } from '@rentas/shared/constantes';
import { FuncionesGenerales, CasillasUtil } from '@rentas/shared/utils';
import { debounce, filter } from 'rxjs/operators';
import { interval } from 'rxjs';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [
    I18n,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato },
  ],
})
export class ScCas100RegistroComponent extends CasillasUtil implements OnInit {
  @Output() listaDetalleCasilla100 = new EventEmitter<Casilla100Cabecera>();
  @Input() inputCabecera: Casilla100Cabecera;
  @Input() listaDetalle: LCas100Detalles;
  @Input() indice: number;
  public listaFormularios: ListaParametrosModel[];
  public submitted = false;
  public cons100 = ConstantesExcepciones;
  private funcionesGenerales: FuncionesGenerales;
  public anioEjercicio: string;
  public frmCasilla100: FormGroup;
  public disabled = false;
  public placeHolder = 'INGRESAR';

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private comboService: ComboService,
    private predeclaracionService: PreDeclaracionService,
    private config: NgbDatepickerConfig
  ) {
    super();
  }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.anioEjercicio = this.predeclaracionService.obtenerAnioEjercicio();
    const codDoc = ['0116', '0616', '1668', '1665'];
    this.listaFormularios = this.comboService.obtenerComboPorNumero(
      ConstantesCombos.FORMULARIOS,
      codDoc,
      1
    );

    this.config.maxDate = {
      year: Number(this.anioEjercicio) + 1,
      month: 12,
      day: 31,
    };

    this.frmCasilla100 = this.fb.group(
      {
        periodo: [this.obtenerValoresPerido()],
        numeroFormulario: [
          this.listaDetalle ? this.listaDetalle.numFormulario : '',
          Validators.required,
        ],
        numOrden: [
          this.listaDetalle ? this.listaDetalle.numOrdOpe : '',
          Validators.required,
        ],
        pagoSinintereses: [
          this.listaDetalle ? this.listaDetalle.mtoPagSInt : '',
          [Validators.required, Validators.pattern(/^[0-9]*$/)],
        ],
        montoGravado: [
          this.listaDetalle ? this.listaDetalle.mtoGravado : '',
          [Validators.required, Validators.pattern(/^[0-9]*$/)],
        ],
        fechaPago: [this.obtenerValoresFecha(), Validators.required],
      },
      {
        validators: [
          ValidationService.validarFechas('fechaPago', 0, 'si', 'CUS19'),
          ValidationService.soloNumeros('montoGravado', 'CUS19', '', ''),
          ValidationService.validarNumOrden('numOrden', 'CUS19'),
        ],
      }
    );
    if (this.listaDetalle) {
      this.disabled = true;
      this.f.numeroFormulario.disable();
      this.f.numOrden.disable();
      if (this.f.numeroFormulario.value === '1683') {
        this.f.pagoSinintereses.disable();
        this.f.montoGravado.enable();
      } else {
        this.f.montoGravado.disable();
        this.f.pagoSinintereses.enable();
      }
    }

    this.frmCasilla100
      .get('montoGravado')
      .valueChanges.pipe(
        //debounce(() => interval(500)),
        //filter((value) => value !== null && value !== undefined)
        )
      .subscribe((value) => {
        // console.log("valor", value)
        this.calculo();
      });

      this.frmCasilla100
      .get('pagoSinintereses')
      .valueChanges.pipe(
        //debounce(() => interval(500)),
        //filter((value) => value !== null && value !== undefined)
        )
      .subscribe((value) => {
        this.calculo2();
      });
  }

  public get f() {
    return this.frmCasilla100.controls;
  }

  private obtenerValoresPerido(): any {
    if (this.listaDetalle) {
      return this.funcionesGenerales.obtenerPeriodoAlEditar(
        this.listaDetalle.perPago
      );
    } else {
      return { year: 'AAAA', month: 'MM' };
    }
  }

  private obtenerValoresFecha(): any {
    if (this.listaDetalle) {
      return this.funcionesGenerales.obtenerFechaAlEditar(
        this.listaDetalle.fecPago
      );
    } else {
      return '';
    }
  }

  public deshabilitarCampos(): void {
    this.f.pagoSinintereses.setValue('');
    this.f.montoGravado.setValue('');
    this.placeHolder = 'INGRESAR';
    this.f.pagoSinintereses.enable();
    if (this.f.numeroFormulario.value === '1683') {
      this.f.montoGravado.enable();
      this.f.pagoSinintereses.disable();
    } else if (this.f.numeroFormulario.value === '') {
      this.f.montoGravado.enable();
    } else {
      this.placeHolder = '';
      this.f.montoGravado.disable();
    }
  }

  public calculo(): void {
    if (this.f.numeroFormulario.value === '1683') {
      let montoGravado = this.f.montoGravado.value == null || this.f.montoGravado.value == undefined ? 0 : this.f.montoGravado.value
      const monto = Number(montoGravado) * 0.05;
      this.f.pagoSinintereses.setValue(Math.round(monto));
    }
  }

  public calculo2(): void {
    if (this.f.numeroFormulario.value !== '1683') {
      let montoPagoSinInteres = this.f.pagoSinintereses.value == null || this.f.pagoSinintereses.value == undefined ? 0 : this.f.pagoSinintereses.value
      const monto = Number(montoPagoSinInteres) * 20;
      this.f.montoGravado.setValue(Math.round(monto));
    }
  }

  public metodo(): void {
    this.submitted = true;
    if (this.frmCasilla100.invalid) {
      return;
    }
    this.validarRegistroDuplicado()
      ? this.callModal(ConstantesExcepciones.CUS19_EX11)
      : this.agregarOActualizar();
  }

  private validarRegistroDuplicado(): boolean {
    return this.inputCabecera.lisCas100Detalles.some((x) => {
      return (
        x.numOrdOpe === this.f.numOrden.value &&
        (this.listaDetalle ? x !== this.listaDetalle : true)
      );
    });
  }

  private agregarOActualizar(): void {
    const casilla100Model = {
      refTabla: '0709',
      perPago: this.funcionesGenerales.formatearPeriodoString(
        this.f.periodo.value
      ),
      numFormulario: this.f.numeroFormulario.value,
      numOrdOpe: this.f.numOrden.value,
      fecPago: this.funcionesGenerales.formatearFechaString(
        this.f.fechaPago.value
      ),
      mtoPagSInt: Number(this.f.pagoSinintereses.value),
      mtoGravado: Number(this.f.montoGravado.value),
      indAceptado: '1',
      indArchPers: this.listaDetalle ? this.listaDetalle.indArchPers : '0',
    };

    if (!this.listaDetalle) {
      // Updte
      this.inputCabecera.lisCas100Detalles.push(casilla100Model);
      this.listaDetalleCasilla100.emit(this.inputCabecera);
      this.callModal('Se grabaron los datos exitosamente.');
    } else if (!this.equals(casilla100Model, this.listaDetalle)) {
      // Nuevo
      this.inputCabecera.lisCas100Detalles[this.indice] = casilla100Model;
      this.listaDetalleCasilla100.emit(this.inputCabecera);
      this.callModal('Se grabaron los datos exitosamente.');
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

  private equals(obj: LCas100Detalles, objNuevo: LCas100Detalles): boolean {
    return (
      objNuevo.refTabla === obj.refTabla &&
      objNuevo.perPago === obj.perPago &&
      objNuevo.numFormulario === obj.numFormulario &&
      objNuevo.numOrdOpe === obj.numOrdOpe &&
      objNuevo.fecPago === obj.fecPago &&
      objNuevo.mtoPagSInt === obj.mtoPagSInt &&
      objNuevo.mtoGravado === obj.mtoGravado &&
      objNuevo.indAceptado === obj.indAceptado &&
      objNuevo.indArchPers === obj.indArchPers
    );
  }
}
