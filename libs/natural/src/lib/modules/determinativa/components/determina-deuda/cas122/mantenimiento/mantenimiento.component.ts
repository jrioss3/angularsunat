import { ConstantesExcepciones, ConstantesMensajesInformativos } from '@path/natural/utils';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '@path/natural/components/error-message/validation.service';
import { ParametriaFormulario, MostrarMensajeService } from '@path/natural/services';
import {ComboService} from '@rentas/shared/core';
import { ListaParametrosModel, DeudaCas122Model } from '@path/natural/models';
import { CasillasUtil } from '@rentas/shared/utils';
import { ConstantesCombos } from '@rentas/shared/constantes';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class Cas122MantenimientoComponent extends CasillasUtil implements OnInit {

  @Input() inputLista122: DeudaCas122Model[];
  @Output() lista122Ready = new EventEmitter<DeudaCas122Model[]>();
  @Input() inputCasilla122: DeudaCas122Model;
  @Input() inputIndexCasilla122: number;

  public submitted = false;
  public frmCasilla122: FormGroup;
  public listTipoRenta: Array<any>;
  public listPaises: ListaParametrosModel[];
  public mensajeErrorCasilla122 = ConstantesExcepciones;
  private descripcionPais: Array<any>;
  private descripcionRenta: Array<any>;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private cus24Service: ParametriaFormulario,
    private comboService: ComboService,
    private mostrarMensaje: MostrarMensajeService) {
      super();
     }

  ngOnInit(): void {
    this.obtenerListasDeParametria();

    this.frmCasilla122 = this.fb.group({
      cmbTipoRenta: [this.inputCasilla122 ? this.inputCasilla122.codTipRenta : '', Validators.required],
      cmbPais: [this.inputCasilla122 ? this.inputCasilla122.codPais : '', Validators.required],
      montoImpuesto: [this.inputCasilla122 ? this.inputCasilla122.mtoImpuesto : '', Validators.required]
    }, { validators: ValidationService.soloNumeros('montoImpuesto', 'CUS24', 'si', '') });
  }

  public get f() { return this.frmCasilla122.controls; }

  private obtenerListasDeParametria(): void {
    this.listTipoRenta = this.cus24Service.obtenerTipoRenta();
    this.listPaises = this.comboService.obtenerComboPorNumero(ConstantesCombos.PAISES);
  }

  private obtenerDescripciones(): void {
    this.descripcionPais = this.listPaises.filter(x => x.val === this.f.cmbPais.value);
    this.descripcionRenta = this.listTipoRenta.filter(x => x.val === this.f.cmbTipoRenta.value);
  }

  public metodo(): void {
    this.submitted = true;

    if (this.frmCasilla122.invalid) {
      return;
    }
    this.validarRegistroDuplicado() ? this.mostrarMensaje.callModal(ConstantesExcepciones.CUS24_EX04) : this.guardarOActualizar();
  }

  private validarRegistroDuplicado() {
    return this.inputLista122.some(x => {
      return this.f.cmbPais.value === x.codPais && this.f.cmbTipoRenta.value === x.codTipRenta &&
        (this.inputCasilla122 ? x !== this.inputCasilla122 : true);
    });
  }

  private guardarOActualizar(): void {
    this.obtenerDescripciones();
    const casilla122 = {
      codPais: this.f.cmbPais.value,
      codTipRenta: this.f.cmbTipoRenta.value,
      desPais: this.descripcionPais[0].desc.toUpperCase(),
      desTipRenta: this.descripcionRenta[0].desc.toUpperCase(),
      mtoImpuesto: Number(this.f.montoImpuesto.value)
    };

    if (!this.inputCasilla122) {
      this.inputLista122.push(casilla122);
      this.lista122Ready.emit(this.inputLista122);
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_GRABADO_DATOS_EXITOSO);
    } else if (!this.equals(this.inputCasilla122, casilla122)) {
      this.inputLista122[this.inputIndexCasilla122] = casilla122;
      this.lista122Ready.emit(this.inputLista122);
    }
    this.activeModal.close();
  }

  private equals(obj: DeudaCas122Model, objNuevo: DeudaCas122Model): boolean {
    return objNuevo.codPais === obj.codPais &&
      objNuevo.desPais === obj.desPais &&
      objNuevo.codTipRenta === obj.codTipRenta &&
      objNuevo.desTipRenta === obj.desTipRenta &&
      objNuevo.mtoImpuesto === obj.mtoImpuesto;
  }
}
