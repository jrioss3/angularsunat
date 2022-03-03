import { ConstantesExcepciones, ConstantesMensajesInformativos } from '@path/natural/utils';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {
  NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../../../utils/ngb-date-parsear-formato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18n } from '../../../../../../utils/ngdatepicker/i18n';
import { CustomDatepickerI18n } from '../../../../../../utils/ngdatepicker/custom-datepicker-i18n';
import { ValidationService } from '@path/natural/components/error-message/validation.service';
import { PreDeclaracionService, MostrarMensajeService } from '@path/natural/services';
import { InfDividPercibModel } from '@path/natural/models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PersonaJuridica } from '@rentas/shared/types';
import { ConsultaPersona } from '@rentas/shared/core';
import { ConstantesDocumentos } from '@rentas/shared/constantes';
import { FuncionesGenerales, CasillasUtil } from '@rentas/shared/utils';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  providers: [
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato }
  ]
})

export class Sfec998MantenimientoComponent extends CasillasUtil implements OnInit {

  @Input() inputListaDividendos: InfDividPercibModel[];
  @Output() listaDividendos = new EventEmitter<InfDividPercibModel[]>();
  @Input() inputid: InfDividPercibModel;
  @Input() inputidIndex: number;

  public registerForm: FormGroup;
  public submitted = false;
  public mensaje998 = ConstantesExcepciones;
  private funcionesGenerales: FuncionesGenerales;
  public txtrazsoc: string;
  private anioEjercicio: number;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private preDeclaracionservice: PreDeclaracionService,
    private personaService: ConsultaPersona,
    private config: NgbDatepickerConfig,
    private spinner: NgxSpinnerService,
    private mostrarMensaje: MostrarMensajeService) { 
      super();
    }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.anioEjercicio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    const rucDeclarante = this.preDeclaracionservice.obtenerRucPredeclaracion();
    this.establecerRangoFechaPermitido();

    this.registerForm = this.formBuilder.group({
      txtRUC: [this.inputid ? this.inputid.numRuc : '', Validators.required],
      txtfechaPago: [this.obtenerValoresFecha(), Validators.required],
      txtMonto: [this.inputid ? this.inputid.mtoPerci : '', Validators.required],
    }, {
      validators:
        [ValidationService.validarFechas('txtfechaPago', this.anioEjercicio, 'no', 'CUS05'),
        ValidationService.validarNrodoc(ConstantesDocumentos.RUC, 'txtRUC', 'CUS05', rucDeclarante),
        ValidationService.soloNumeros('txtMonto', 'CUS05', '', 'si')
      ]
    });

    if (this.inputid) {
      this.txtrazsoc = '';
      this.autocompletarNombre().subscribe();
      this.f.txtRUC.disable();
    }
  }

  public get f() {
    return this.registerForm.controls;
  }

  private establecerRangoFechaPermitido(): void {
    this.config.minDate = { year: this.anioEjercicio, month: 1, day: 1 };
    this.config.maxDate = { year: this.anioEjercicio, month: 12, day: 31 };
  }

  private obtenerValoresFecha(): any {
    return this.inputid ? this.funcionesGenerales.obtenerFechaAlEditar(this.inputid.fecPago) : '';
  }

  public obtenerNombre(): void {
    this.txtrazsoc = '';
    this.autocompletarNombre().subscribe();
  }

  private autocompletarNombre(): Observable<any> {
    if (!this.f.txtRUC.errors && this.txtrazsoc === '') {
      this.spinner.show();
      return this.personaService.obtenerContribuyente(this.f.txtRUC.value)
        .pipe(
          tap((data: PersonaJuridica) => this.obtenerRazonSocialContribuyente(data)),
          catchError(error => {
            this.f.txtRUC.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS05_EX05 });
            this.spinner.hide();
            return throwError(error);
          })
        );
    }
    return of({});
  }

  private obtenerRazonSocialContribuyente(data): void {
    this.txtrazsoc = data.ddpNombre.trim();
    this.spinner.hide();
  }

  public validarEspacio(val: any) {
    this.f.txtRUC.setValue(val.trim());
  }

  public metodo(): void {
    this.autocompletarNombre().subscribe(() => {
      this.submitted = true;

      if (this.registerForm.invalid) {
        return;
      }
      this.verificarDuplicidadRegistro() ?
        this.mostrarMensaje.callModal(ConstantesExcepciones.CUS05_EX10) : this.agregarOActualizarRegistro();
    });
  }

  private verificarDuplicidadRegistro(): boolean {
    return this.inputListaDividendos.some(x => {
      return this.f.txtRUC.value === x.numRuc &&
        this.funcionesGenerales.formatearFechaString(this.f.txtfechaPago.value) === x.fecPago &&
        (this.inputid ? this.inputid !== x : true);
    });
  }

  private agregarOActualizarRegistro(): void {
    const dividendos = {
      numRuc: this.f.txtRUC.value,
      mtoPerci: Number(this.f.txtMonto.value),
      fecPago: this.funcionesGenerales.formatearFechaString(this.f.txtfechaPago.value)
    };

    if (!this.inputid) {
      this.inputListaDividendos.push(dividendos);
      this.listaDividendos.emit(this.inputListaDividendos);
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_GRABADO_DATOS_EXITOSO);
    } else if (!this.equals(this.inputid, dividendos)) {
      this.inputListaDividendos[this.inputidIndex] = dividendos;
      this.listaDividendos.emit(this.inputListaDividendos);
    }
    this.activeModal.close();
  }

  private equals(obj: InfDividPercibModel, objNuevo: InfDividPercibModel): boolean {
    return objNuevo.numRuc === obj.numRuc &&
      objNuevo.mtoPerci === obj.mtoPerci &&
      objNuevo.fecPago === obj.fecPago;
  }
}
