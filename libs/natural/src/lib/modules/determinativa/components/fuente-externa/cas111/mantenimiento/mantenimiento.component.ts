import { MostrarMensajeService } from './../../../../../../services/mostrarMensaje.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../../../utils/ngb-date-parsear-formato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../../../../components/error-message/validation.service';
import { ConstantesExcepciones } from '@path/natural/utils';
import { ListaParametrosModel } from '@path/natural/models';
import { Casilla111 } from '@path/natural/models';
import { PreDeclaracionService } from '@path/natural/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PersonaJuridica } from '@rentas/shared/types';
import { ConsultaPersona,ComboService } from '@rentas/shared/core';
import { ConstantesDocumentos,ConstantesCombos } from '@rentas/shared/constantes';
import { FuncionesGenerales, CasillasUtil } from '@rentas/shared/utils';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato }
  ]
})
export class Cas111MantenimientoComponent extends CasillasUtil implements OnInit {

  @Input() inputListaCasilla111: Casilla111[];
  @Output() listaCasilla111 = new EventEmitter<Casilla111[]>();
  @Input() inputid: Casilla111;
  @Input() inputidIndex: number;

  private funcionesGenerales: FuncionesGenerales;
  public listaTipDoc: ListaParametrosModel[];
  public frmCasilla111: FormGroup;
  public mensaje111 = ConstantesExcepciones;
  public anio: number;
  public submitted = false;
  public txtRazSoc: string;
  public disabled: boolean;
  public dateSubmitted = false;
  public placholder = '';
  public tamanioNroDoc: number;
  private readonly mensajeConformidadGuardado = 'Se grabaron los datos exitosamente';
  

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private personaService: ConsultaPersona,
    private preDeclaracionservice: PreDeclaracionService,
    private spinner: NgxSpinnerService,
    private comboService: ComboService,
    private mostrarMensaje: MostrarMensajeService) {
    super();
  }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.anio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    const listaParametros = [ConstantesDocumentos.RUC, ConstantesDocumentos.SIN_RUC];
    this.listaTipDoc = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO, listaParametros);

    this.frmCasilla111 = this.fb.group({
      periodo: [this.obtenerValoresPerido()],
      mensual: [this.inputid ? this.inputid.mtoPercibido : '', Validators.required],
      ruc: [this.inputid ? this.inputid.numDoc : '', Validators.required],
      cmbTipoDocumento: [this.inputid ? (this.inputid.codTipDoc ? this.inputid.codTipDoc : '') : '', Validators.required],
      txtRazSocc: [this.inputid ? this.inputid.desRazSoc : '', [Validators.pattern(/^[a-zA-Z0-9 ]*$/)]]
    }, {
      validators:
        [
          ValidationService.validarNrodoc('cmbTipoDocumento', 'ruc', 'CUS14')
        ]
    });

    this.inputid ? (this.f.ruc.disable(), this.disabled = true) : (this.f.ruc.enable(), this.disabled = false);
    this.txtRazSoc = this.inputid ? this.inputid.desRazSoc : '';

    if (this.inputid){
      this.inputid.codTipDoc === ConstantesDocumentos.SIN_RUC ? this.f.txtRazSocc.enable() : this.f.txtRazSocc.disable();
      const CamposDeshabilitados = [this.f.ruc];
      this.funcionesGenerales.desHabilitarCampos(CamposDeshabilitados);

    }else{
      this.tamanioNroDoc = 0;
      this.f.txtRazSocc.disable();
    }

    
    
  }

  public get f() {
    return this.frmCasilla111.controls;
  }

  public cambiarTipoDoc(): void {    
    const val = this.f.cmbTipoDocumento.value;
    switch (val) {
      case ConstantesDocumentos.SIN_RUC:{
        this.generarCorrelativo();
        this.f.ruc.disable();
        this.f.txtRazSocc.setValue('');
        const campos = [this.f.txtRazSocc];
        this.funcionesGenerales.habilitarCampos(campos);
        break;
      }
      case ConstantesDocumentos.RUC:{
        this.f.ruc.setValue('');
        this.f.txtRazSocc.setValue('');
        this.f.txtRazSocc.disable();
        const camposHabilitar = [this.f.ruc];
        this.funcionesGenerales.habilitarCampos(camposHabilitar);
        this.tamanioNroDoc = 11;
        break;

      }
      case ConstantesDocumentos.CONSOLIDADO:{
        this.f.txtRazSocc.setValue('CONSOLIDADO');
        this.f.txtRazSocc.disable();
        this.f.ruc.setValue('');
        this.f.ruc.enable();
        this.tamanioNroDoc = 11;
        break;
      }

      default: {
        this.f.ruc.setValue('');
        this.f.txtRazSocc.setValue('');
        this.tamanioNroDoc = 0;
      }

    }


  }

  // 1. VALIDAR EXISTENCIA DEL RUC EN EL PADRON -----------------------------------------------------------------------------
  /*public ObtenerRazSoc(): void{

    this.f.cmbTipoDocumento.value === ConstantesDocumentos.CONSOLIDADO ?
      this.f.txtRazSocc.setValue('CONSOLIDADO') : this.f.txtRazSocc.setValue('');
      this.autocompletarNombre().subscribe();

  }*/


  private obtenerValoresPerido(): any {
    if (this.inputid) {
      return this.funcionesGenerales.obtenerPeriodoAlEditar(this.inputid.perServicio);
    } else {
      return { year: 'AAAA', month: 'MM' };
    }
  }

  public NombreRazonSocial(): void {
    this.txtRazSoc = '';    
    if (!this.f.ruc.errors) {
      this.autocompletarNombre().subscribe();
    }
  }

  private autocompletarNombre(): Observable<any> {    
    
    if (!this.f.ruc.errors && this.txtRazSoc === '') {
      this.spinner.show();
      return this.personaService.obtenerContribuyente(this.f.ruc.value).
        pipe(
          tap(data => this.obtenerRazonSocialContribuyente(data)),
          catchError(
            error => {
              //debugger;
              //this.inputid.codTipDoc === ConstantesDocumentos.RUC ? this.f.txtRazSocc.enable() : this.f.txtRazSocc.disable();
              if (this.f.cmbTipoDocumento.value === ConstantesDocumentos.RUC){
                this.f.ruc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS14_EX03 });
              }
              this.spinner.hide();
              return throwError(error);
            })
        );
    }
    
    return of({});
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void {
    if (this.f.cmbTipoDocumento.value === ConstantesDocumentos.RUC){
      this.f.txtRazSocc.setValue(data.ddpNombre.trim());
      //this.txtRazSoc = data.ddpNombre.trim();      
    }
    this.spinner.hide();
  }

  public validarEspacio(val: any): void {
    this.f.ruc.setValue(val.trim());
  }

  private validarDuplicidadRegistro(): boolean {
    return this.inputListaCasilla111.some(x => {
      return Number(this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value)) === Number(x.perServicio) &&
        this.f.ruc.value === x.numDoc && (this.inputid ? this.inputid !== x : true);
    });
  }

  private generarCorrelativo(): void {
    const listaSinRuc = this.inputListaCasilla111.filter(x => x.codTipDoc === ConstantesDocumentos.SIN_RUC);
    const correlativo = listaSinRuc.length !== 0 ? Number([...listaSinRuc].pop().numDoc) + 1 : 1;
    this.f.ruc.setValue(this.pad('0' + correlativo, 8));
  }

  private pad(str, max): void {
    str = str.toString();
    return str.length < max ? this.pad('0' + str, max) : str;
  }

  public metodo(): void {
    this.dateSubmitted = true;
    this.submitted = true;
    this.autocompletarNombre().subscribe(() => {
      if (this.frmCasilla111.invalid) {
        return;
      }
      this.validarDuplicidadRegistro() ? this.mostrarMensaje.callModal(ConstantesExcepciones.CUS14_EX08) : this.agregarOactualizarRegistro();
    });
  }

  private agregarOactualizarRegistro(): void {
    const casilla111Model = {
      //codTipDoc: this.f.cmbTipoDocumento.value,
      codTipDoc: this.f.cmbTipoDocumento.value,
      numDoc: this.f.ruc.value,
      desRazSoc: this.f.txtRazSocc.value.toUpperCase(),
      perServicio: this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value),
      mtoPercibido: Number(this.f.mensual.value)
    };

    if (!this.inputid) {
      this.inputListaCasilla111.push(casilla111Model);
      this.mostrarMensaje.callModal(this.mensajeConformidadGuardado);
      this.listaCasilla111.emit(this.inputListaCasilla111);
    } else if (!this.equals(this.inputid, casilla111Model)) {
      this.inputListaCasilla111[this.inputidIndex] = casilla111Model;
      this.listaCasilla111.emit(this.inputListaCasilla111);
    }
    this.activeModal.close();
  }

  private equals(obj: Casilla111, objNuevo: Casilla111): boolean {
    return objNuevo.codTipDoc === obj.codTipDoc &&
      objNuevo.numDoc === obj.numDoc &&
      objNuevo.desRazSoc === obj.desRazSoc &&
      objNuevo.perServicio === obj.perServicio &&
      objNuevo.mtoPercibido === obj.mtoPercibido;
  }
}