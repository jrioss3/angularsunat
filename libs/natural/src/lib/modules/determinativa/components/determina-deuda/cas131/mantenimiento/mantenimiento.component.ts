import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../../../../components/error-message/validation.service';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantesExcepciones } from '@path/natural/utils';
import { DeudaCas131Model } from '@path/natural/models';
import { PreDeclaracionService } from '@path/natural/services';
import * as moment from 'moment';
import { Observable, throwError, of, zip } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PersonaJuridica } from '@rentas/shared/types';
import { ConsultaPersona } from '@rentas/shared/core';
import { ConstantesDocumentos } from '@rentas/shared/constantes';
import { FuncionesGenerales, CasillasUtil } from '@rentas/shared/utils';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class Sddc131MantenimientoComponent extends CasillasUtil implements OnInit {

  @Input() inputLista131: DeudaCas131Model[];
  @Output() lista131Ready = new EventEmitter<DeudaCas131Model[]>();
  @Input() inputCasilla131: DeudaCas131Model;
  @Input() inputIndexCasilla131: number;

  public submitted = false;
  public mensajeErrorCasilla131 = ConstantesExcepciones;
  public frmCasilla131: FormGroup;
  private funcionesGenerales: FuncionesGenerales;
  public anio: number;
  public placeholder = '';

  private existeDataPadron: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private personaService: ConsultaPersona,
    private preDeclaracionservice: PreDeclaracionService,
    private spinner: NgxSpinnerService) {
      super();
     }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    const rucDeclarante = this.preDeclaracionservice.obtenerRucPredeclaracion();
    this.anio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());

    this.existeDataPadron = false;

    this.frmCasilla131 = this.fb.group({
      periodo: [this.obtenerValoresPerido()],
      numruc: [this.inputCasilla131 ? this.inputCasilla131.numDoc : '', Validators.required],
      txtRazSoc: [this.inputCasilla131 ? this.inputCasilla131.desRazSoc : ''],
      mtoRetenido: [this.inputCasilla131 ? this.inputCasilla131.mtoRetenido : ''],
      mtoDevol: [this.inputCasilla131 ? this.inputCasilla131.mtoDevolQuinta : ''],
      numform: [this.inputCasilla131 ? this.inputCasilla131.numFormulQuinta : ''],
      numOrden: [this.inputCasilla131 ? this.inputCasilla131.numOrdenQuinta : '']
    }, {
      validator: [
        ValidationService.validarNrodoc(ConstantesDocumentos.RUC, 'numruc', 'CUS28', rucDeclarante),
        ValidationService.soloNumeros('mtoRetenido', 'CUS28', 'si', 'si'),
        ValidationService.soloNumeros('mtoDevol', 'CUS28', 'si', 'si'),
        ValidationService.validarNumOrden('numOrden', 'CUS28'),
      ]
    });
    this.inputCasilla131 ? this.deshabilitarCamposAlEditar() : (this.f.numform.disable(), this.f.numOrden.disable());
  }

  public get f() { return this.frmCasilla131.controls; }

  private obtenerValoresPerido(): any {
    if (this.inputCasilla131) {
      return this.funcionesGenerales.obtenerPeriodoAlEditar(this.inputCasilla131.perImpReten);
    } else {
      return { year: 'AAAA', month: 'MM' };
    }
  }

  private deshabilitarCamposAlEditar(): void {
    const campos = [this.f.numruc, this.f.txtRazSoc, this.f.mtoDevol, this.f.numform, this.f.numOrden, this.f.periodo];
    this.funcionesGenerales.desHabilitarCampos(campos);
  }
  // 1. VALIDAR EXISTENCIA DEL NUMERO DE ORDEN -----------------------------------------------------------------------------------------
  public changeNumeroDeOrden(): void {
    this.validarExistenciaNroDeOrden(this.f.numruc.value, this.f.numOrden.value, this.getPeriodo()).subscribe();
  }

  private validarExistenciaNroDeOrden(numRuc: string, nroOrden: string, periodo: string): Observable<any> {    
    this.existeDataPadron = false;
    if (this.f.numOrden.value !== '' && this.f.numruc.value !== '' && !this.f.numOrden.errors && !this.f.numruc.errors) {
      return this.preDeclaracionservice.validarNumeroOrden(numRuc, nroOrden, periodo).
        pipe(
          tap(data => this.validarNumeroDeOrden(data)),
          catchError(error => {
            this.f.numOrden.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS28_EX13 });
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
      this.f.numOrden.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS28_EX13 });
    }
  }

  private getPeriodo(): string {
    const periodo = {
      month: this.f.periodo.value.month - 1,
      year: this.f.periodo.value.year,
    };
    return moment(periodo).format('YYYYMM');
  }
  // -------------------------------------------------------------------------------------------------------------------------------
  // 2. VALIDAR EXISTENCIA DEL RUC EN EL PADRON ------------------------------------------------------------------------------------
  public obtenerRazonSocialContribuyente(): void {
    this.f.txtRazSoc.setValue('');
    this.f.numOrden.setValue('');
    if (!this.f.numruc.errors) {
      this.autocompletarRazonSocialContribuyente().subscribe();
    }
  }

  private autocompletarRazonSocialContribuyente(): Observable<any> {
    if (!this.f.numruc.errors && this.f.txtRazSoc.value === '') {
      this.spinner.show();
      return this.personaService.obtenerContribuyente(this.f.numruc.value).
        pipe(
          tap(data => this.actualizarRazonSocialContribuyente(data)),
          catchError(error => {
            this.f.numruc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS28_EX03 });
            this.spinner.hide();
            return throwError(error);
          })
        );
    }
    return of({});
  }

  private actualizarRazonSocialContribuyente(data: PersonaJuridica): void {
    this.f.txtRazSoc.setValue(data.ddpNombre.trim());
    this.spinner.hide();
  }
  // -------------------------------------------------------------------------------------------------------------------------------
  public validarEspacio(val: any): void {
    this.f.numruc.setValue(val.trim());
  }

  public cambiosEnCamposDependientesDeMontoDevuelto(): void {
    const camposDeshab = [this.f.numform, this.f.numOrden];
    const camposVacios = [this.f.numform, this.f.numOrden];
    if (this.f.mtoDevol.value !== '' || this.f.mtoDevol.value != null) {
      const numero = Number(this.f.mtoDevol.value);
      if (numero > 0) {
        this.f.numOrden.enable();
        this.f.numform.setValue('0601');
        this.placeholder = 'Ingresar';
      } else {
        this.funcionesGenerales.setearVacioEnCampos(camposVacios);
        this.funcionesGenerales.desHabilitarCampos(camposDeshab);
        this.placeholder = '';
      }
    } else {
      this.funcionesGenerales.setearVacioEnCampos(camposVacios);
      this.funcionesGenerales.desHabilitarCampos(camposDeshab);
    }
  }

  public verificarNumOrden(): void {
    this.f.numOrden.markAsUntouched();
    this.f.numOrden.setValue(this.f.numOrden.value);
  }

  public metodo(): void {
    this.submitted = true;
    zip(this.autocompletarRazonSocialContribuyente(),
      this.validarExistenciaNroDeOrden(this.f.numruc.value, this.f.numOrden.value, this.getPeriodo()))
      .subscribe(() => {
        if (this.frmCasilla131.invalid) {
          return;
        }
        this.validarRegistroDuplicado() ? this.callModal(ConstantesExcepciones.CUS28_EX08) : this.agregarOActualizar();
      });
  }

  private validarRegistroDuplicado(): boolean {
    return this.inputLista131.some(x => {
      return this.f.numruc.value === x.numDoc &&
        Number(this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value)) === Number(x.perImpReten) &&
        (this.inputCasilla131 ? this.inputCasilla131 !== x : true);
    });
  }

  private agregarOActualizar(): void {
    const casilla131 = {
      desRazSoc: this.f.txtRazSoc.value,
      mtoDevolQuinta: Number(this.f.mtoDevol.value),
      mtoRetenido: Number(this.f.mtoRetenido.value),
      numDoc: this.f.numruc.value,
      numFormulQuinta: this.f.numform.value,
      numOrdenQuinta: this.f.numOrden.value,
      perImpReten: this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value),
      codTipDoc: ConstantesDocumentos.RUC
    };

    const montocero = casilla131.mtoRetenido === 0 && casilla131.mtoDevolQuinta === 0;

    if (!this.inputCasilla131 && !montocero) {
      this.inputLista131.push(casilla131);
      this.lista131Ready.emit(this.inputLista131);
      this.callModal('Se grabaron los datos exitosamente');
    } else if (montocero) {
      this.callModal(ConstantesExcepciones.CUS28_EX14);
      return;
    } else if (!this.equals(this.inputCasilla131, casilla131)) {
      this.inputLista131[this.inputIndexCasilla131] = casilla131 as DeudaCas131Model;
      this.lista131Ready.emit(this.inputLista131);
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

  private equals(obj: DeudaCas131Model, objNuevo: DeudaCas131Model): boolean {
    return objNuevo.codTipDoc === obj.codTipDoc &&
      objNuevo.numDoc === obj.numDoc &&
      objNuevo.desRazSoc === obj.desRazSoc &&
      objNuevo.perImpReten === obj.perImpReten &&
      objNuevo.mtoRetenido === obj.mtoRetenido &&
      objNuevo.mtoDevolQuinta === obj.mtoDevolQuinta &&
      objNuevo.numFormulQuinta === obj.numFormulQuinta &&
      objNuevo.numOrdenQuinta === obj.numOrdenQuinta;
  }
}
