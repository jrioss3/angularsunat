import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../../../utils/ngb-date-parsear-formato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18n } from '../../../../../../utils/ngdatepicker/i18n';
import { CustomDatepickerI18n } from '../../../../../../utils/ngdatepicker/custom-datepicker-i18n';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { ValidationService } from '../../../../../../components/error-message/validation.service';
import { ConstantesExcepciones } from '@path/natural/utils';
import { PreDeclaracionService } from '@path/natural/services';
import { ListaParametrosModel, Casilla108 } from '@path/natural/models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, EMPTY, of, throwError } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { PersonaJuridica } from '@rentas/shared/types';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { ConstantesCombos, ConstantesDocumentos } from '@rentas/shared/constantes';
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
export class ScCas108MantenimientoComponent extends CasillasUtil implements OnInit {

  @Input() inputLista108: Casilla108[];
  @Output() lista108Ready = new EventEmitter<Casilla108[]>();
  @Input() inputid: Casilla108;
  @Input() inputidIndex: number;

  public frmCasilla108: FormGroup;
  public mensaje108 = ConstantesExcepciones;
  public listTipDoc: ListaParametrosModel[];
  private funcionesGenerales: FuncionesGenerales;
  public annio: number;
  public disabled = false;
  public placeholder: string;
  public tamanioNroDoc: number;
  public submitted = false;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private preDeclaracionservice: PreDeclaracionService,
    private comboService: ComboService,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService) { 
      super();
    }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.annio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    const rucDeclarante = this.preDeclaracionservice.obtenerRucPredeclaracion();
    const listaParametros = [ConstantesDocumentos.RUC, ConstantesDocumentos.SIN_RUC];
    this.listTipDoc = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO, listaParametros);

    this.frmCasilla108 = this.fb.group({
      cmbTipoDocumento: [this.inputid ? this.inputid.tipDoc : '', Validators.required],
      periodo: [this.obtenerValoresPerido()],
      txtNum: [this.inputid ? this.inputid.numDoc : '', Validators.required],
      txtRazSoc: [this.inputid ? this.inputid.desRazSoc : '', Validators.required],
      txtIngresoAtri: [this.inputid ? this.inputid.mtoAtribuido : '', Validators.required]
    }, {
      validators: [
        ValidationService.validarNrodoc('cmbTipoDocumento', 'txtNum', 'CUS13', rucDeclarante),
        ValidationService.soloNumeros('txtIngresoAtri', 'CUS13', 'si', 'si'),
      ]
    });

    this.f.txtRazSoc.disable();

    if (this.inputid) {
      this.disabled = true;
      this.f.cmbTipoDocumento.disable();
      this.f.txtNum.disable();
      this.f.txtIngresoAtri.enable();
      this.f.cmbTipoDocumento.value === ConstantesDocumentos.SIN_RUC ? this.f.txtRazSoc.enable() : this.f.txtRazSoc.disable();
    } else {
      this.tamanioNroDoc = 0;
    }
  }

  public get f() { return this.frmCasilla108.controls; }

  private obtenerValoresPerido(): any {
    if (this.inputid) {
      return this.funcionesGenerales.obtenerPeriodoAlEditar(this.inputid.perServicio);
    } else {
      return { year: 'AAAA', month: 'MM' };
    }
  }

  public ObtenerRazSoc(): void {
    this.f.txtRazSoc.setValue('');
    this.autocompletarNombre().subscribe();
  }

  private autocompletarNombre(): Observable<any> {
    if (this.cumpleCondicion()) {
      this.spinner.show();
      return this.tipoContribuyente().
        pipe(
          switchMap(() => this.validarExistenciaContribuyente()),
          catchError(error => {
            this.f.txtNum.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS13_EX03 });
            this.spinner.hide();
            return throwError(error);
          })
        );
    }
    return of({});
  }

  private cumpleCondicion(): boolean {
    return !this.f.txtNum.errors && this.f.cmbTipoDocumento.value === ConstantesDocumentos.RUC && this.f.txtRazSoc.value === '';
  }

  private tipoContribuyente(): Observable<string> {
    if (this.f.txtNum.value && this.f.cmbTipoDocumento.value === ConstantesDocumentos.RUC) {
      return of(ConstantesDocumentos.RUC);
    } else {
      this.f.txtRazSoc.setValue('');
      return EMPTY;
    }
  }

  private validarExistenciaContribuyente(): Observable<any> {
    return this.personaService.obtenerContribuyente(this.f.txtNum.value).
      pipe(
        tap(data => this.obtenerRazonSocialContribuyente(data))
      );
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void {
    this.f.txtRazSoc.setValue(data.ddpNombre.trim());
    this.spinner.hide();
  }

  public validacionTipoDoc() {
    this.f.txtRazSoc.setValue('');
    switch (this.f.cmbTipoDocumento.value) {
      case ConstantesDocumentos.SIN_RUC: {
        this.generarCorrelativo();
        this.f.txtNum.disable();
        this.f.txtRazSoc.enable();
        this.placeholder = 'ingresar';
        break;
      }
      case ConstantesDocumentos.RUC: {
        this.tamanioNroDoc = 11;
        this.f.txtNum.setValue('');
        this.f.txtNum.enable();
        this.f.txtRazSoc.disable();
        this.placeholder = '';
        break;
      }
      default: {
        this.tamanioNroDoc = 0;
        this.f.txtNum.setValue('');
        this.f.txtNum.enable();
        this.f.txtRazSoc.disable();
        this.placeholder = '';
        break;
      }
    }
  }

  private generarCorrelativo(): void {
    const listaSinRuc = this.inputLista108.filter(x => x.tipDoc === ConstantesDocumentos.SIN_RUC);
    const correlativo = listaSinRuc.length !== 0 ? Number([...listaSinRuc].pop().numDoc) + 1 : 1;
    this.f.txtNum.setValue(this.autocompletarCerosIzquierda('0' + correlativo, 8));
  }

  private autocompletarCerosIzquierda(nro, maxlongitud): void {
    nro = nro.toString();
    return nro.length < maxlongitud ? this.autocompletarCerosIzquierda('0' + nro, maxlongitud) : nro;
  }

  public validarEspacio(val: any): void {
    this.f.txtNum.setValue(val.trim());
  }

  private validarRegistroDuplicado() {
    return this.inputLista108.some(x => {
      return this.f.txtNum.value === x.numDoc &&
        Number(this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value)) === Number(x.perServicio) &&
        (this.inputid ? x !== this.inputid : true);
    });
  }

  public metodo(): void {
    this.submitted = true;
    this.autocompletarNombre().subscribe(() => {
      if (this.frmCasilla108.invalid) {
        return;
      }
      this.validarRegistroDuplicado() ? this.callModal(ConstantesExcepciones.CUS13_EX09) : this.agregaroActualizar();
    });
  }

  private agregaroActualizar(): void {
    const casilla108 = {
      tipDoc: this.f.cmbTipoDocumento.value,
      numDoc: this.f.txtNum.value,
      desRazSoc: this.f.txtRazSoc.value.toUpperCase(),
      perServicio: this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value),
      mtoAtribuido: this.f.txtIngresoAtri.value
    };

    if (!this.inputid) {
      this.inputLista108.push(casilla108);
      this.lista108Ready.emit(this.inputLista108);
      this.callModal('Se grabaron los datos exitosamente.');
    } else if (!this.equals(this.inputid, casilla108)) {
      this.inputLista108[this.inputidIndex] = casilla108;
      this.lista108Ready.emit(this.inputLista108);
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

  private equals(obj: Casilla108, objNuevo: Casilla108): boolean {
    return objNuevo.tipDoc === obj.tipDoc &&
      objNuevo.numDoc === obj.numDoc &&
      objNuevo.desRazSoc === obj.desRazSoc &&
      objNuevo.perServicio === obj.perServicio &&
      objNuevo.mtoAtribuido === obj.mtoAtribuido;
  }
}
