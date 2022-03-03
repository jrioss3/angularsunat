import { ConstantesExcepciones, ConstantesMensajesInformativos } from '@path/natural/utils';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InfFuenteEstModel } from '@path/natural/models/SeccionInformativa/InfFuenteEstModel';
import { ComboService } from '@rentas/shared/core';
import { ListaParametrosModel } from '@path/natural/models/comboUriModel';
import { ParametriaFormulario } from '@path/natural/services/parametriaformulario.service';
import { CasillasUtil } from '@rentas/shared/utils';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '@path/natural/components';
import { MostrarMensajeService } from '@path/natural/services';
import { ConstantesCombos } from '@rentas/shared/constantes';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
})
export class C999MantenimientoComponent extends CasillasUtil implements OnInit {

  @Input() inputListaExtranjera: InfFuenteEstModel[];
  @Output() listaExtranjera = new EventEmitter<InfFuenteEstModel[]>();
  @Input() inputRenta: InfFuenteEstModel;
  @Input() inputId: number;

  public listaTipoRenta: ListaParametrosModel[];
  public listaPaises: ListaParametrosModel[];
  public frmCasilla999: FormGroup;
  public submitted = false;
  public mensajeCas999 = ConstantesExcepciones;

  constructor(
    public activeModal: NgbActiveModal, 
    private comboService: ComboService,
    private cus30Service: ParametriaFormulario,
    private fb: FormBuilder,
    private mostrarMensaje: MostrarMensajeService) {
      super();
    }

  ngOnInit(): void {
    this.inicializarCombobox();

    this.frmCasilla999 = this.fb.group({
      cmbTipoRenta: [this.inputRenta ? this.inputRenta.codTipRenta : '', Validators.required],
      cmbPais: [this.inputRenta ? this.inputRenta.codPais : '', Validators.required],
      txtRentaNetaPercibida: [this.inputRenta ? this.inputRenta.mtoImpuesto : '', Validators.required]
    }, {
      validator: [
        ValidationService.soloNumeros('txtRentaNetaPercibida', 'CUS05', 'si', 'si')
      ]
    })
  }

  private inicializarCombobox(): void {
    this.listaTipoRenta = this.cus30Service.obtenerTipoRentaCUS05();
    this.listaPaises = this.comboService.obtenerComboPorNumero(ConstantesCombos.PAISES);
  }

  public get f() { return this.frmCasilla999.controls; }

  public metodo(): void {
    this.submitted = true;
    if (this.frmCasilla999.invalid) {
      return;
    }
    this.validarRegistroDuplicado() ? this.mostrarMensaje.callModal(ConstantesExcepciones.CUS05_EX10) : this.agregarOActualizar();
  }

  private validarRegistroDuplicado(): boolean {
    return this.inputListaExtranjera.some(x => {
      return this.f.cmbPais.value === x.codPais && this.f.cmbTipoRenta.value === x.codTipRenta
        && (this.inputRenta ? x !== this.inputRenta : true);
    });
  }

  private agregarOActualizar(): void {
    const nombrePais = this.listaPaises.filter(x => x.val === this.f.cmbPais.value)[0].desc;
    const descTipRenta = this.listaTipoRenta.filter(x => x.val === this.f.cmbTipoRenta.value)[0].desc;

    const extranjera = {
      codPais: this.f.cmbPais.value,
      desPais: nombrePais.toUpperCase(),
      codTipRenta: this.f.cmbTipoRenta.value,
      desTipRenta: descTipRenta.toUpperCase(),
      mtoImpuesto: Number(this.f.txtRentaNetaPercibida.value)
    };

    if (!this.inputRenta) {
      this.inputListaExtranjera.push(extranjera);
      this.listaExtranjera.emit(this.inputListaExtranjera);
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_GRABADO_DATOS_EXITOSO)
    } else if (!this.equals(this.inputRenta, extranjera)) {
      this.inputListaExtranjera[this.inputId] = extranjera;
      this.listaExtranjera.emit(this.inputListaExtranjera);
    }
    this.activeModal.close();
  }

  private equals(obj: InfFuenteEstModel, objNuevo: InfFuenteEstModel): boolean {
    return obj.codPais === objNuevo.codPais &&
      obj.desPais === objNuevo.desPais &&
      obj.codTipRenta === objNuevo.codTipRenta &&
      obj.desTipRenta === objNuevo.desTipRenta &&
      obj.mtoImpuesto === objNuevo.mtoImpuesto;
  }
}
