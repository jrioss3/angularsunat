import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../../../utils/ngb-date-parsear-formato';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Casilla385 } from '@path/natural/models/SeccionDeterminativa/DetRentaSegundaModel';
import { ComboService } from '@rentas/shared/core';
import { ListaParametrosModel } from '@path/natural/models/comboUriModel';
import { ParametriaFormulario, MostrarMensajeService } from '@path/natural/services';
import { ConstantesCasilla385, ConstantesExcepciones, ConstantesMensajesInformativos } from '@path/natural/utils';
import { CasillasUtil } from '@rentas/shared/utils';
import { ConstantesCombos } from '@rentas/shared/constantes';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato },
  ],
})
export class C385MantenimientoComponent extends CasillasUtil implements OnInit {
  @Input() inputLista385: Casilla385[];
  @Output() lista385Ready = new EventEmitter<Casilla385[]>();
  @Input() inputid: number;
  @Input() casilla385: Casilla385;

  public frmCasilla385: FormGroup;
  public submitted = false;
  public error385 = ConstantesExcepciones;
  public listTipFuenteRenta: any[];
  private paises: ListaParametrosModel[];
  public listaPaisesPorFuente: ListaParametrosModel[];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private cus31Service: ParametriaFormulario,
    private comboService: ComboService,
    private mostrarMensaje: MostrarMensajeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.inicializarCombobox();
    this.frmCasilla385 = this.fb.group({
      cmbFuenteRenta: [
        this.casilla385 ? this.casilla385.codTipRenta : '',
        Validators.required,
      ],
      cmbPaises: [
        this.casilla385 ? this.casilla385.codPais : '',
        Validators.required,
      ],
      txtMonNeto: [
        this.casilla385 ? this.casilla385.mtoImpuesto : '',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
    });

    if (this.casilla385) {
      this.cambiarFuenteRenta();
    } 
  }

  public get f() {
    return this.frmCasilla385.controls;
  }

  private inicializarCombobox(): void {
    this.listTipFuenteRenta = this.cus31Service.ObtenerTipoFuenteRenta();
    this.paises = this.comboService.obtenerComboPorNumero(
      ConstantesCombos.PAISES
    );
  }

  public cambiarFuenteRenta(): void {
    this.f.cmbPaises.setValue(this.casilla385 ? this.casilla385.codPais : '');
    const paisesMILA = [
      ConstantesCasilla385.CODIGO_PAIS_CHILE,
      ConstantesCasilla385.CODIGO_PAIS_COLOMBIA,
      ConstantesCasilla385.CODIGO_PAIS_MEXICO,
    ];
    switch (this.f.cmbFuenteRenta.value) {
      case ConstantesCasilla385.BIENES_INSCRITOS_REGISTRO_PUBLICO:
        this.listaPaisesPorFuente = this.paises;
        break;
      case ConstantesCasilla385.BIENES_NEGOCIADOS_MILA:
        this.listaPaisesPorFuente = this.paises.filter((x) =>
          paisesMILA.includes(x.val)
        );
        break;
      default:
        this.listaPaisesPorFuente = [];
        break;
    }
  }

  private validarRegistroDuplicado() {
    return this.inputLista385.some((x) => {
      return (
        this.f.cmbPaises.value === x.codPais &&
        this.f.cmbFuenteRenta.value === x.codTipRenta &&
        (this.casilla385 ? x !== this.casilla385 : true)
      );
    });
  }

  public guardarRegistro(): void {
    this.submitted = true;

    if (this.frmCasilla385.invalid) {
      return;
    }

    this.validarRegistroDuplicado()
      ? this.mostrarMensaje.callModal(ConstantesExcepciones.CUS31_EX03)
      : this.agregarOActualizar();
  }

  private agregarOActualizar(): void {
    const descripcionPais = this.listaPaisesPorFuente
      .filter((x) => Object(x).val === this.f.cmbPaises.value)[0]
      .desc.toUpperCase();
    const descripcionRenta = this.listTipFuenteRenta
      .filter((x) => Object(x).val === this.f.cmbFuenteRenta.value)[0]
      .desc.toUpperCase();

    const casilla385Object = {
      codPais: this.f.cmbPaises.value,
      desPais: descripcionPais,
      codTipRenta: this.f.cmbFuenteRenta.value,
      desTipRenta: descripcionRenta,
      mtoImpuesto: Number(this.f.txtMonNeto.value),
    };

    if (!this.casilla385) {
      this.inputLista385.push(casilla385Object);
      this.lista385Ready.emit(this.inputLista385);
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_GRABADO_DATOS_EXITOSO);
    } else if (!this.equals(this.casilla385, casilla385Object)) {
      this.inputLista385[this.inputid] = casilla385Object;
      this.lista385Ready.emit(this.inputLista385);
    }
    this.activeModal.close();
  }

  private equals(obj: Casilla385, objNuevo: Casilla385): boolean {
    return (
      objNuevo.codPais === obj.codPais &&
      objNuevo.desPais === obj.desPais &&
      objNuevo.codTipRenta === obj.codTipRenta &&
      objNuevo.desTipRenta === obj.desTipRenta &&
      objNuevo.mtoImpuesto === obj.mtoImpuesto
    );
  }
}
