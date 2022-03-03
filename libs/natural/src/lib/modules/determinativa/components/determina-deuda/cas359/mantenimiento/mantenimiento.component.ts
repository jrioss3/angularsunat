import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../../../utils/ngb-date-parsear-formato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18n } from '../../../../../../utils/ngdatepicker/i18n';
import { CustomDatepickerI18n } from '../../../../../../utils/ngdatepicker/custom-datepicker-i18n';
import { ValidationService } from '../../../../../../components/error-message/validation.service';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantesExcepciones } from '@path/natural/utils';
import { DeudaCas359Model } from '@path/natural/models';
import { PreDeclaracionService } from '@path/natural/services';
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
export class SdCas359MantComponent extends CasillasUtil implements OnInit {

  @Input() inputLista359: DeudaCas359Model[];
  @Output() lista359Ready = new EventEmitter<DeudaCas359Model[]>();
  @Input() inputCasilla359: DeudaCas359Model;
  @Input() inputIndexCasilla359: number;

  public frmCasilla359: FormGroup;
  public submitted = false;
  public mensajeErrorCasilla359 = ConstantesExcepciones;
  private funcionesGenerales: FuncionesGenerales;
  public anio: number;
  public txtrazsoc = '';
  public disabled = false;
  public textoPeriodo = '<con formato “MM/AAAA”>';

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private preDeclaracionservice: PreDeclaracionService,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService
  ) { 
    super();
  }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.anio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());

    this.frmCasilla359 = this.fb.group({
      txtRuc_: [this.inputCasilla359 ? this.inputCasilla359.numDoc : '', Validators.required],
      txtPeriodo: [this.obtenerValoresPerido()],
      txtIngresoAtri: [this.inputCasilla359 ? this.inputCasilla359.mtoRetenido : '', Validators.required]
    }, {
      validator: [
        ValidationService.validarNrodoc(ConstantesDocumentos.RUC, 'txtRuc_', 'CUS22'),
        ValidationService.soloNumeros('txtIngresoAtri', 'CUS22', 'si', 'si')
      ]
    });

    if (this.inputCasilla359) {
      this.disabled = true;
      this.txtrazsoc = this.inputCasilla359.desRazSoc;
      this.f.txtRuc_.disable();
    }
  }

  public get f() { return this.frmCasilla359.controls; }

  private obtenerValoresPerido(): any {
    if (this.inputCasilla359) {
      return this.funcionesGenerales.obtenerPeriodoAlEditar(this.inputCasilla359.perImpReten);
    } else {
      return { year: 'AAAA', month: 'MM' };
    }
  }

  public obtenerRazonSocialContribuyente(): void {
    this.txtrazsoc = '';
    if (!this.f.txtRuc_.errors) {
      this.autocompletarRazonSocialContribuyente().subscribe();
    }
  }

  private autocompletarRazonSocialContribuyente(): Observable<any> {
    if (!this.f.txtRuc_.errors && this.txtrazsoc === '') {
      this.spinner.show();
      return this.personaService.obtenerContribuyente(this.f.txtRuc_.value)
        .pipe(
          tap(data => this.actualizarRazonSocialContribuyente(data)),
          catchError(error => {
            this.f.txtRuc_.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS22_EX03 });
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

  public validarEspacio(val: any) {
    this.f.txtRuc_.setValue(val.trim());
  }

  public grabar(): void {
    this.submitted = true;
    this.autocompletarRazonSocialContribuyente().subscribe(() => {
      if (this.frmCasilla359.invalid) {
        return;
      }
      this.validarRegistroDuplicado() ? this.callModal(ConstantesExcepciones.CUS22_EX09) : this.agregarOActualizar();
    });
  }

  private validarRegistroDuplicado(): boolean {
    return this.inputLista359.some(x => {
      return this.f.txtRuc_.value === x.numDoc &&
        this.funcionesGenerales.formatearPeriodoString(this.f.txtPeriodo.value) === x.perImpReten &&
        (this.inputCasilla359 ? x !== this.inputCasilla359 : true);
    });
  }

  private agregarOActualizar(): void {
    const casilla359 = {
      codTipDoc: ConstantesDocumentos.RUC,
      numDoc: this.f.txtRuc_.value,
      desRazSoc: this.txtrazsoc,
      perImpReten: this.funcionesGenerales.formatearPeriodoString(this.f.txtPeriodo.value),
      mtoRetenido: Number(this.f.txtIngresoAtri.value)
    };

    if (!this.inputCasilla359) {
      this.inputLista359.push(casilla359);
      this.lista359Ready.emit(this.inputLista359);
      this.callModal('Se grabaron los datos exitosamente');
    } else if (!this.equals(this.inputCasilla359, casilla359)) {
      this.inputLista359[this.inputIndexCasilla359] = casilla359;
      this.lista359Ready.emit(this.inputLista359);
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

  private equals(obj: DeudaCas359Model, objNuevo: DeudaCas359Model): boolean {
    return objNuevo.codTipDoc === obj.codTipDoc &&
      objNuevo.numDoc === obj.numDoc &&
      objNuevo.desRazSoc === obj.desRazSoc &&
      objNuevo.perImpReten === obj.perImpReten &&
      objNuevo.mtoRetenido === obj.mtoRetenido;
  }
}
