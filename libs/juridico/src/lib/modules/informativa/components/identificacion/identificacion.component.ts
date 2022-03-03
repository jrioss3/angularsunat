import { ConstantesIdentificacion } from './../../../../utils/constantesIdentificacion';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { PreDeclaracionModel } from '@path/juridico/models/preDeclaracionModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConstantesParametros, MensajeGenerales, ConstantesCasillas, ConstantesCadenas } from '@rentas/shared/constantes';
import { FuncionesGenerales, SessionStorage } from '@rentas/shared/utils';
import { ListaParametro } from '@rentas/shared/types';
import { ComboService, CasillaService, ModalConfirmarService } from '@rentas/shared/core';
import { DonacionesComponent } from '../donaciones/donaciones.component';

@Component({
  selector: 'app-identificacion',
  templateUrl: './identificacion.component.html',
  styleUrls: ['./identificacion.component.css']
})
export class IdentificacionComponent implements OnInit {

  public registerForm: FormGroup;
  public basesLegales: ListaParametro[];
  public basesLegales2: ListaParametro[];
  private preDeclaracionObject: PreDeclaracionModel;
  private funcionesGenerales: FuncionesGenerales;
  private anio: string;
  public submitted = false;
  private RMT: boolean
  public casilla803 = this.casillaService.obtenerCasilla('803');
  public casilla210 = this.casillaService.obtenerCasilla('210');
  public casilla5 = this.casillaService.obtenerCasilla('005');
  public casilla213 = this.casillaService.obtenerCasilla('213');
  public casilla216 = this.casillaService.obtenerCasilla('216');
  public casilla217 = this.casillaService.obtenerCasilla('217'); public montoCasilla217: number;
  public casilla221 = this.casillaService.obtenerCasilla('221');
  public casilla222 = this.casillaService.obtenerCasilla('222');
  public formato_alfanumerico = ConstantesCasillas.FORMATO_ALFANUMERICO;
  public montoCasilla803: number;
  public listaSINO = this.getListaSiNo();
  public listaTipoRegimen: ListaParametro[];
  public ORIGINAL = {
    valor: ConstantesIdentificacion.ORIGINAL,
    desc: ConstantesIdentificacion.ORIGINAL_DES
  }
  public SUSTITUTORIA = {
    valor: ConstantesIdentificacion.SUSTITUTORIA,
    desc: ConstantesIdentificacion.SUSTITUTORIA_DES
  }
  @ViewChild(DonacionesComponent, { static: true }) component3: DonacionesComponent;

  constructor(
    private comboService: ComboService,
    private preDeclaracionservice: PreDeclaracionService,
    private modalMensejaService: ModalConfirmarService,
    private formBuilder: FormBuilder,
    private casillaService: CasillaService) {
    this.registerForm = this.formBuilder.group({
      rdRectiSusti: [''],
      cboEjercicio: ['', Validators.required],
      rdExoneradoRenta: [''],
      casilla210: ['', Validators.required],
      casilla216: ['', Validators.required],
      rdInafectoRenta: [''],
      casilla221: ['', Validators.required],
      casilla222: ['', Validators.required]
    });
  }

  public ngOnInit() {
    this.ejecutarInicializacion('inicio');
  }

  public ejecutarInicializacion(tipo: any): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.RMT = SessionStorage.getAnexo5();
    this.preDeclaracionObject = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    this.anio = this.preDeclaracionservice.obtenerNumeroEjercicio();
    this.listaTipoRegimen = this.comboService.obtenerComboPorNumero(this.casilla213?.codParam ?? '');
    this.basesLegales = this.comboService.obtenerComboPorNumero(this.casilla210?.codParam ?? '');
    this.basesLegales2 = this.comboService.obtenerComboPorNumero(this.casilla221?.codParam ?? '');
    this.montoCasilla803 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas803);
    this.montoCasilla217 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas217);
    const montoCasilla210 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas210);
    const montoCasilla221 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas221);
    const montoCasilla216 = this.funcionesGenerales.
      opcionalText(this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas216);
    const montoCasilla222 = this.funcionesGenerales.
      opcionalText(this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas222);
    const montoCasilla213 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas213);

    const valorRectiSusti = this.preDeclaracionObject.declaracion.generales.cabecera.indRectificatoria;

    this.registerForm.patchValue({
      rdRectiSusti: valorRectiSusti,
      cboEjercicio: montoCasilla213 !== null ? String(montoCasilla213) : '',
      rdExoneradoRenta: this.montoCasilla803 ? String(this.montoCasilla803) : ConstantesIdentificacion.EXONERADO_NO,
      casilla210: montoCasilla210 ? String(montoCasilla210) : '',
      casilla216: montoCasilla216 ? montoCasilla216 : '',
      rdInafectoRenta: this.montoCasilla217 ? String(this.montoCasilla217) : ConstantesIdentificacion.INAFECTO_NO,
      casilla221: montoCasilla221 ? String(montoCasilla221) : '',
      casilla222: montoCasilla222 ? montoCasilla222 : ''
    });

    this.f.rdRectiSusti.disable();

    // EXONERADO
    if (this.f.rdExoneradoRenta.value === ConstantesIdentificacion.EXONERADO_SI) {
      setTimeout(() => {
        this.f.rdExoneradoRenta.enable();
        this.f.casilla210.enable();
        this.f.rdInafectoRenta.disable();
        this.casilla210.indEditable = true;
        this.desactivarInafecta();
        if (this.f.casilla210.value === ConstantesIdentificacion.OTROS_EXONERADO) {
          this.f.casilla216.enable();
          this.casilla216.indEditable = true;
        } else {
          this.f.casilla216.disable();
          this.casilla216.indEditable = false;
        }
      }, 20);
    } else {
      setTimeout(() => {
        this.f.rdInafectoRenta.enable();
        this.desactivarExonerado();
      }, 20);
    }

    // INAFECTO
    if (this.f.rdInafectoRenta.value === ConstantesIdentificacion.INAFECTO_SI) {
      setTimeout(() => {
        this.f.rdInafectoRenta.enable();
        this.f.casilla221.enable();
        this.f.rdExoneradoRenta.disable();
        this.casilla221.indEditable = true;
        this.desactivarExonerado();
        if (this.f.casilla221.value === ConstantesIdentificacion.OTROS_INAFECTO) {
          this.f.casilla222.enable();
          this.casilla222.indEditable = true
        } else {
          this.f.casilla222.disable();
          this.casilla222.indEditable = false;
        }
      }, 20);
    } else {
      setTimeout(() => {
        this.f.rdExoneradoRenta.enable();
        this.desactivarInafecta();
      }, 20);
    }

    if (tipo === 'Reinicio') {
      this.component3.ejecutarInicializacion();
    }
  }

  public get f() { return this.registerForm.controls; }

  public cambiarTipoRegimen() {
    this.f.cboEjercicio.markAsTouched();
    if (this.RMT && this.f.cboEjercicio.value === ConstantesIdentificacion.REGIMEN_MYPE) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.mensajeMYPEInfo.replace('AAAA', this.anio), 'Mensaje');
    }
    this.persistirPreDeclaracion();
  }

  public radioExoneracionSi() {
    this.f.casilla210.enable();
    this.limpiarInafecta();
    this.desactivarInafecta();
    this.persistirPreDeclaracion();
    this.casilla210.indEditable = !this.f.casilla210.disabled;
  }

  public radioExoneracionNo() {
    this.f.casilla210.setValue('');
    this.f.casilla216.setValue('');
    this.desactivarExonerado();
    this.f.rdInafectoRenta.enable();
    this.persistirPreDeclaracion();
  }

  public radioInafectoSi() {
    this.f.rdInafectoRenta.markAsTouched();
    this.openM03();
  }

  public radioInafectoNo() {
    this.f.casilla222.setValue('');
    this.f.casilla221.setValue('');
    this.desactivarInafecta();
    this.f.rdExoneradoRenta.enable();
    this.persistirPreDeclaracion();
  }

  private limpiarExonerado() {
    this.f.casilla210.setValue('');
    this.f.casilla216.setValue('');
    this.f.rdExoneradoRenta.setValue(ConstantesIdentificacion.EXONERADO_NO);
    this.f.rdExoneradoRenta.disable();
  }

  private desactivarExonerado() {
    this.f.casilla210.disable();
    this.f.casilla216.disable();
    this.casilla210.indEditable = false;
    this.casilla216.indEditable = false;
  }

  private desactivarInafecta() {
    this.f.casilla221.disable();
    this.f.casilla222.disable();
    this.casilla221.indEditable = false;
    this.casilla222.indEditable = false;
  }

  private limpiarInafecta() {
    this.f.casilla221.setValue('');
    this.f.casilla222.setValue('');
    this.f.rdInafectoRenta.setValue(ConstantesIdentificacion.INAFECTO_NO);
    this.f.rdInafectoRenta.disable();
  }

  private openM03() {
    this.modalMensejaService.msgBotonesSINO(MensajeGenerales.CUS02_EX03).subscribe($e => {
      if ($e === ConstantesCadenas.RESPUESTA_SI) {
        this.f.casilla221.enable();
        this.limpiarExonerado();
        this.desactivarExonerado();
      } else {
        this.f.rdInafectoRenta.setValue(ConstantesIdentificacion.INAFECTO_NO);
      }
      this.persistirPreDeclaracion();
    });
  }

  public cambiarBaseLegalExonerado() {
    if (this.f.casilla210.value === ConstantesIdentificacion.OTROS_EXONERADO) {
      this.f.casilla216.enable();
    } else {
      this.f.casilla216.disable();
      this.f.casilla216.setValue('');
    }
    this.casilla216.indEditable = !this.f.casilla216.disabled;
    this.persistirPreDeclaracion();
  }

  public cambiarBaseLegalInafecto() {
    if (this.f.casilla221.value === ConstantesIdentificacion.OTROS_INAFECTO) {
      this.f.casilla222.enable();
    } else {
      this.f.casilla222.disable();
      this.f.casilla222.setValue('');
    }
    this.casilla222.indEditable = !this.f.casilla222.disabled;
    this.persistirPreDeclaracion();
  }

  public validar(): boolean {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return false;
    }
    return true;
  }

  public persistirPreDeclaracion(): void {
    this.preDeclaracionObject = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas801 = Number(SessionStorage.getUserData().numRUC);

    this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas803 =
      this.f.rdExoneradoRenta.value ? this.f.rdExoneradoRenta.value : null;

    this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas210 =
      this.f.casilla210.value ? this.f.casilla210.value : null;

    this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas216 =
      this.f.casilla216.value ? this.f.casilla216.value.toUpperCase() : null;

    this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas217 =
      this.f.rdInafectoRenta.value ? this.f.rdInafectoRenta.value : null;

    this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas221 =
      this.f.casilla221.value ? this.f.casilla221.value : null;

    this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas222 =
      this.f.casilla222.value ? this.f.casilla222.value.toUpperCase() : null;

    this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas213 =
      this.f.cboEjercicio.value ? this.f.cboEjercicio.value : null;

    if (this.f.rdInafectoRenta.value === ConstantesIdentificacion.INAFECTO_SI) {
      this.eliminarDataDeterminativa();
    }
    SessionStorage.setPreDeclaracion(this.preDeclaracionObject);
  }

  private eliminarDataDeterminativa() {
    const determinaDeuda = {
      refTabla: 't6739casdetdeuda',
      numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
      mtoCas137: null,
      mtoCas138: null,
      mtoCas139: null,
      mtoCas142: null,
      mtoCas505: null,
      mtoCas141: null,
      mtoCas144: null,
      mtoCas145: null,
      mtoCas146: null,
      mtoCas180: null
    };
    const credContraImpuesto = {
      refTabla: 't6738cascreditoimp',
      numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
      mtoCas123: null,
      mtoCas136: null,
      mtoCas134: null,
      mtoCas126: null,
      mtoCas125: null,
      mtoCas504: null,
      mtoCas127: null,
      mtoCas128: null,
      mtoCas130: null,
      mtoCas129: null,
      mtoCas506: null,
      mtoCas131: null,
      mtoCas279: null,
      mtoCas202: null,
      mtoCas203: null,
      mtoCas204: null,
      mtoCas297: Number(this.preDeclaracionObject.declaracion.seccDeterminativa.credImpuestoRta.credImprenta.mtoCas297),
      mtoCas783: null,
    };
    const impRenta = {
      refTabla: 't6741casimpuestore',
      numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
      mtoCas100: null,
      mtoCas101: null,
      mtoCas103: null,
      mtoCas105: null,
      mtoCas106: null,
      mtoCas107: null,
      mtoCas120: null,
      mtoCas108: null,
      mtoCas110: null,
      mtoCas113: null,
      mtoCas111: null,
      mtoCas686: null,
      mtoCas610: null,
      mtoCas880: null
    };
    this.preDeclaracionObject.declaracion.seccDeterminativa.credImpuestoRta.credImprenta = credContraImpuesto;
    this.preDeclaracionObject.declaracion.seccDeterminativa.credImpuestoRta.casilla126.lisCasilla126 = [];
    this.preDeclaracionObject.declaracion.seccDeterminativa.credImpuestoRta.casilla128.lisCasilla128 = [];
    this.preDeclaracionObject.declaracion.seccDeterminativa.credImpuestoRta.casilla130.lisCasilla130 = [];
    this.preDeclaracionObject.declaracion.seccDeterminativa.credImpuestoRta.casilla131.lisCasilla131 = [];
    this.preDeclaracionObject.declaracion.determinacionDeuda.pagosPrevios.lisPagosPrevios = [];
    this.preDeclaracionObject.declaracion.determinacionDeuda.casDetDeudaPJ = determinaDeuda;
    this.preDeclaracionObject.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa = impRenta;
    this.preDeclaracionObject.declaracion.seccDeterminativa.impuestoRta.casilla108.lisCasilla108 = [];
  }

  public getListaSiNo() {
    return [
      { val: ConstantesIdentificacion.EXONERADO_SI, desc: 'Si' },
      { val: ConstantesIdentificacion.EXONERADO_NO, desc: 'No' }
    ]
  }

  public changeInafectoRenta(value) {
    this.f.rdInafectoRenta.setValue(value);
    value === ConstantesIdentificacion.INAFECTO_SI ? this.radioInafectoSi() : this.radioInafectoNo();
  }

  public changeExoneradaRenta(value) {
    this.f.rdExoneradoRenta.setValue(value);
    value === ConstantesIdentificacion.EXONERADO_SI ? this.radioExoneracionSi() : this.radioExoneracionNo();
  }
}
