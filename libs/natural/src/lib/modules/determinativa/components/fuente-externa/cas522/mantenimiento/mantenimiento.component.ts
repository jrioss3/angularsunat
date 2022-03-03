import { MostrarMensajeService } from './../../../../../../services/mostrarMensaje.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../../../utils/ngb-date-parsear-formato';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationService } from '../../../../../../components/error-message/validation.service';
import { ConstantesExcepciones, ConstantesMensajesInformativos } from '@path/natural/utils';
import { PreDeclaracionService } from '@path/natural/services';
import { Casilla522 } from '@path/natural/models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError, of, EMPTY } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { CasillasUtil } from '@rentas/shared/utils';
import { PersonaJuridica } from '@rentas/shared/types';
import { ConsultaPersona } from '@rentas/shared/core';
import { ConstantesDocumentos } from '@rentas/shared/constantes';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato }
  ]
})
export class Sfec522MantenimientoComponent extends CasillasUtil implements OnInit  {

  @Input() inputLista522: Casilla522[];
  @Output() lista522Ready = new EventEmitter<Casilla522[]>();
  @Input() inputid: Casilla522;
  @Input() inputidIndex: number;

  public frmCasilla522: FormGroup;
  public mensaje522 = ConstantesExcepciones;
  public txtRazSoc: string;
  public submitted = false;
  public annioEjercicio: number;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private predeclaracionService: PreDeclaracionService,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService,
    private mostrarMensaje: MostrarMensajeService) { 
      super();
    }

  ngOnInit(): void {
    this.annioEjercicio = Number(this.predeclaracionService.obtenerAnioEjercicio());
    const rucDeclarante = this.predeclaracionService.obtenerRucPredeclaracion();
    this.txtRazSoc = this.inputid ? this.inputid.desRazSoc : '';
    this.frmCasilla522 = this.fb.group({
      txtRUC: [this.inputid ? this.inputid.numDoc : '', Validators.required],
      txtValor: [this.inputid ? this.inputid.mtoRetenido : '', Validators.required]
    }, {
      validator: [
        ValidationService.validarNrodoc(ConstantesDocumentos.RUC, 'txtRUC', 'CUS15', rucDeclarante),
        ValidationService.soloNumeros('txtValor', 'CUS15', 'si', 'si', '', '',  this.annioEjercicio),
      ]
    });
    this.inputid ? this.f.txtRUC.disable() : this.f.txtRUC.enable();
  }

  public get f() { return this.frmCasilla522.controls; }

  public obtenerNombre(): void {
    this.txtRazSoc = '';
    if (!this.f.txtRUC.errors && !this.inputid && this.f.txtRUC.value !== '') {
      this.validacionIngresoRUC().subscribe();
    }
  }

  private validacionIngresoRUC(): Observable<any> {
    if (!this.f.txtRUC.errors && !this.inputid && this.f.txtRUC.value !== '') {
      return this.validarExistenciaRegistroRUC().pipe(
        switchMap(bool =>
          !bool ? this.autocompletarNombre() : this.mensajeErrorRegistroRUC())
      );
    }
    return of({});
  }

  private validarExistenciaRegistroRUC(): Observable<boolean> {
    const existeRegistroRuc = this.inputLista522.some(x => {
      return this.f.txtRUC.value === x.numDoc;
    });
    return existeRegistroRuc ? of(true) : of(false);
  }

  private mensajeErrorRegistroRUC(): Observable<any> {
    this.f.txtRUC.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS15_EX06 });
    return EMPTY;
  }

  private autocompletarNombre(): Observable<any> {
    if (!this.f.txtRUC.errors && this.txtRazSoc === '') {
      this.spinner.show();
      return this.personaService.obtenerContribuyente(this.f.txtRUC.value)
        .pipe(
          tap(data => this.obtenerRazonSocialContribuyente(data)),
          catchError(error => {
            this.f.txtRUC.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS15_EX03 });
            this.spinner.hide();
            return throwError(error);
          })
        );
    }
    return of({});
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void {
    this.txtRazSoc = data.ddpNombre.trim();
    this.spinner.hide();
  }

  public validarEspacio(val: any): void {
    this.f.txtRUC.setValue(val.trim());
  }

  public metodo(): void {
    this.submitted = true;
    this.validacionIngresoRUC().subscribe(() => {
      if (this.frmCasilla522.invalid) {
        return;
      }
      this.agregarOActualizar();
    });
  }

  private agregarOActualizar(): void {
    const casilla522Object = {
      codTipDoc: ConstantesDocumentos.RUC,
      numDoc: this.f.txtRUC.value,
      desRazSoc: this.txtRazSoc,
      mtoRetenido: this.f.txtValor.value
    };

    if (!this.inputid) {
      this.inputLista522.push(casilla522Object);
      this.lista522Ready.emit(this.inputLista522);
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_GRABADO_DATOS_EXITOSO);
    } else if (!this.equals(this.inputid, casilla522Object)) {
      this.inputLista522[this.inputidIndex] = casilla522Object;
      this.lista522Ready.emit(this.inputLista522);
    }
    this.activeModal.close();
  }

  private equals(obj: Casilla522, objNuevo: Casilla522): boolean {
    return objNuevo.codTipDoc === obj.codTipDoc &&
      objNuevo.numDoc === obj.numDoc &&
      objNuevo.desRazSoc === obj.desRazSoc &&
      objNuevo.mtoRetenido === obj.mtoRetenido;
  }
}
