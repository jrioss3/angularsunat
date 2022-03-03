import { MostrarMensajeService } from './../../../../../../services/mostrarMensaje.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../../../../components/error-message/validation.service';
import { ListaParametrosModel } from '@path/natural/models/comboUriModel';
import { ConstantesExcepciones } from '@path/natural/utils';
import { ParametriaFormulario } from '@path/natural/services';
import { EMPTY, of, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Casilla116 } from '@path/natural/models';
import { PersonaJuridica, PersonaNatural } from '@rentas/shared/types';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { ConstantesCombos, ConstantesDocumentos } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
})

export class Cas116MantenimientoComponent implements OnInit {

  @Input() inputLista116: Casilla116[];
  @Output() lista116Ready = new EventEmitter<Casilla116[]>();
  @Input() inputRenta116: Casilla116;
  @Input() inputIndex: number;

  public submitted = false;
  public mensaje116 = ConstantesExcepciones;
  public frmCasilla116: FormGroup;
  public listTipoRenta: Array<any>;
  public listRTFI: Array<any>;
  public listPais: ListaParametrosModel[];
  public listBene: any[];
  public listCDI: any[];
  public listTiDoc: any[];
  public mantenimiento = true;
  public parrafo = false;
  public RTFIIsDisabled = false;
  public PaisIsDisabled = false;
  public CDIIsDisabled = false;
  public TipDocIsDisabled = false;
  public funcionesGenerales: FuncionesGenerales;
  private readonly codTipoRentasServPers = ['7', '8'];
  private readonly codPaisesHabilitarCampos = ['9211', '9149', '9105', '9169', '9097', '9239', '9767', '9493', '9607', '9190'];
  private readonly mensajeConformidadGuardado = 'Se grabaron los datos exitosamente';
  public placeholderNombre = '';
  public placeholderNroDoc = '';
  public placeholderRentaNeta = '';
  private readonly codTipDocPadron = [ConstantesDocumentos.RUC, ConstantesDocumentos.DNI];
  public tamanioNroDoc = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private cus30Service: ParametriaFormulario,
    private fb: FormBuilder,
    private comboService: ComboService,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService,
    private mostrarMensaje: MostrarMensajeService) { }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.obtenerListasParametria();

    this.frmCasilla116 = this.fb.group({
      TipoRenta: [this.inputRenta116 ? this.inputRenta116.codTipRenta : '', Validators.required],
      RTFI: [this.inputRenta116 ? this.inputRenta116.codTipRentaRtfi : '', Validators.required],
      Pais: [this.inputRenta116 ? this.inputRenta116.codPais : '', Validators.required],
      BeneficioDI: [this.inputRenta116 ? this.inputRenta116.codBenef : '', Validators.required],
      CDI: [this.inputRenta116 ? this.inputRenta116.codCdi : '', Validators.required],
      txtRazon: [this.inputRenta116 ? this.inputRenta116.desPagador : '', [Validators.required, Validators.maxLength(50)]],
      TipDoc: [this.inputRenta116 ? this.inputRenta116.codTipDocPagador : '', Validators.required],
      txtNumDoc: [this.inputRenta116 ? this.inputRenta116.numDocPagador : '', Validators.required],
      txtRentaNetaP: [this.inputRenta116 ? this.inputRenta116.mtoImpuesto : '', Validators.required]
    }, {
      validators: [
        ValidationService.validarMontoRenta('TipoRenta', 'txtRentaNetaP'),
        ValidationService.validarNrodoc('TipDoc', 'txtNumDoc', 'CUS30')
      ]
    });

    this.deshabilitarCamposYSetearValores();

    if (this.inputRenta116) {
      this.tamanioNroDoc = this.funcionesGenerales.maximoDigitosNumeroDocumento(this.inputRenta116.codTipDocPagador, 0);
      this.tipoRenta();
      this.changePais(true);
    }
  }

  public get f() { return this.frmCasilla116.controls; }

  private obtenerListasParametria(): void {
    const listaParametro = [ConstantesDocumentos.CARNET_DE_EXTRANJERIA, ConstantesDocumentos.RUC, ConstantesDocumentos.PASAPORTE,
    ConstantesDocumentos.PTP, ConstantesDocumentos.CARNET_IDENTIDAD, ConstantesDocumentos.NIT, ConstantesDocumentos.DNI];
    this.listTipoRenta = this.cus30Service.obtenerTipoRenta();
    this.listRTFI = this.cus30Service.obtenerTipoRentaRTFI();
    this.listPais = this.comboService.obtenerComboPorNumero(ConstantesCombos.PAISES);
    this.listCDI = this.cus30Service.obtenerOpcionCDI();
    this.listTiDoc = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO, listaParametro);
    this.listBene = this.cus30Service.obtenerDobleImposicion();
  }

  private deshabilitarCamposYSetearValores(): void {
    const camposDeshabilitados = [this.f.Pais, this.f.txtRentaNetaP, this.f.BeneficioDI, this.f.txtRazon, this.f.TipDoc,
    this.f.txtNumDoc, this.f.CDI, this.f.RTFI];
    this.funcionesGenerales.desHabilitarCampos(camposDeshabilitados);
    this.PaisIsDisabled = true;
    this.TipDocIsDisabled = true;
    this.CDIIsDisabled = true;
    this.RTFIIsDisabled = true;
  }

  private camposCambioRenta(): Array<any> {
    return [this.f.RTFI, this.f.BeneficioDI, this.f.CDI, this.f.TipDoc, this.f.txtNumDoc, this.f.txtRazon];
  }

  public tipoRenta(): void {
    this.placeholderRentaNeta = 'ingresar';
    if (this.codTipoRentasServPers.includes(this.f.TipoRenta.value)) {
      if (!this.inputRenta116) {
        this.funcionesGenerales.setearVacioEnCampos(this.camposCambioRenta().concat([this.f.Pais]));
      }
      this.funcionesGenerales.desHabilitarCampos(this.camposCambioRenta());
      this.f.Pais.enable();
      this.f.txtRentaNetaP.enable();
      this.PaisIsDisabled = false;
      this.RTFIIsDisabled = true;
      this.CDIIsDisabled = true;
      this.TipDocIsDisabled = true;
    } else if (this.f.TipoRenta.value !== '' && !this.codTipoRentasServPers.includes(this.f.TipoRenta.value)) {
      this.f.Pais.enable();
      this.f.txtRentaNetaP.enable();
      this.f.RTFI.enable();
      this.PaisIsDisabled = false;
      this.RTFIIsDisabled = false;
    } else {
      if (!this.inputRenta116) {
        this.f.Pais.setValue('');
        this.f.txtRentaNetaP.setValue('');
        this.f.RTFI.setValue('');
      }
      this.f.Pais.disable();
      this.PaisIsDisabled = true;
      this.f.txtRentaNetaP.disable();
      this.f.RTFI.disable();
      this.RTFIIsDisabled = true;
      this.placeholderRentaNeta = '';
      this.changePais();
    }
  }

  private camposCambioPais(): Array<any> {
    return [this.f.txtRazon, this.f.TipDoc, this.f.txtNumDoc];
  }

  public changePais(isEdit?: boolean): void {
    this.placeholderNroDoc = 'ingresar';
    this.placeholderNombre = 'ingresar';
    if (this.codPaisesHabilitarCampos.includes(this.f.Pais.value)) {
      this.funcionesGenerales.habilitarCampos(this.camposCambioPais().concat(this.f.BeneficioDI));
      this.TipDocIsDisabled = false;
    } else if (this.f.Pais.value === '9063' || this.f.Pais.value === '9249') { // ARGENTINA Y ESTADOS UNIDOS
      this.f.BeneficioDI.disable();
      this.f.BeneficioDI.setValue('');
      this.TipDocIsDisabled = false;
      this.funcionesGenerales.habilitarCampos(this.camposCambioPais());
    } else {
      this.funcionesGenerales.desHabilitarCampos(this.camposCambioPais().concat(this.f.BeneficioDI));
      this.funcionesGenerales.setearVacioEnCampos(this.camposCambioPais().concat(this.f.BeneficioDI));
      this.TipDocIsDisabled = true;
      this.placeholderNroDoc = '';
      this.placeholderNombre = '';
    }
    this.changeBeneficioDI(isEdit);
  }

  public changeBeneficioDI(isEdit?: boolean): void {
    if (this.f.BeneficioDI.value === '2') {
      this.f.CDI.enable();
    } else {
      this.f.CDI.setValue(this.inputRenta116 && isEdit ? this.inputRenta116.codCdi : '');
      this.f.CDI.disable();
    }
  }

  public ocultar(): void {
    this.mantenimiento = true;
    this.parrafo = false;
  }

  public mostrar(): void {
    this.mantenimiento = false;
    this.parrafo = true;
  }

  public validarDocumento(): void {
    this.f.txtNumDoc.setValue('');
    this.tamanioNroDoc = this.funcionesGenerales.maximoDigitosNumeroDocumento(this.f.TipDoc.value, 0);
  }

  public validarEspacio(val: any): void {
    this.f.txtNumDoc.setValue(val.trim());
  }

  /** 1. VALIDAR EXISTENCIA DEL CONTRIBUYENTE EN EL PADRON ---------------------------------------------------------- */
  public obtenerNombre(): void {
    this.autocompletarNombre().subscribe(() => this.spinner.hide());
  }

  private autocompletarNombre(): Observable<any> {
    if (!this.f.txtNumDoc.errors && this.codTipDocPadron.includes(this.f.TipDoc.value)) {
      this.spinner.show();
      return this.tipoContribuyente().pipe(
        switchMap(this.validarPersona.bind(this)),
        catchError(error => {
          switch (this.f.TipDoc.value) {
            case ConstantesDocumentos.DNI: this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS30_EX04 }); break;
            case ConstantesDocumentos.RUC: this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS30_EX03 }); break;
          }
          this.spinner.hide();
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private tipoContribuyente(): Observable<string> {
    if (this.codTipDocPadron.includes(this.f.TipDoc.value)) {
      return of(this.f.TipDoc.value);
    } else {
      return EMPTY;
    }
  }

  private validarPersona(tipo: string): Observable<PersonaJuridica | PersonaNatural> {
    return tipo === ConstantesDocumentos.DNI ?
      this.personaService.obtenerPersona(this.f.txtNumDoc.value) :
      this.personaService.obtenerContribuyente(this.f.txtNumDoc.value);
  }
  /** 1.FIN VALIDACION-------------------------------------------------------------------------------------------------------- */

  public metodo(): void {
    this.submitted = true;
    this.autocompletarNombre().subscribe(() => {
      this.spinner.hide();
      this.agregarOactualizarRegistro();
    });
  }

  private agregarOactualizarRegistro(): void {
    if (this.frmCasilla116.invalid) {
      return;
    }

    const casilla116Object = {
      codPais: this.f.Pais.value,
      desPais: this.listPais.filter(x => x.val === this.f.Pais.value)[0].desc.toUpperCase(),
      codTipRenta: this.f.TipoRenta.value,
      desTipRenta: this.listTipoRenta.filter(x => x.val === this.f.TipoRenta.value)[0].desc.toUpperCase(),
      codTipRentaRtfi: this.f.RTFI.value,
      codBenef: this.f.BeneficioDI.value,
      codCdi: this.f.CDI.value,
      desPagador: this.f.txtRazon.value.toUpperCase(),
      codTipDocPagador: this.f.TipDoc.value,
      numDocPagador: this.f.txtNumDoc.value.toUpperCase(),
      mtoImpuesto: Number(this.f.txtRentaNetaP.value)
    };

    if (!this.inputRenta116) {
      this.inputLista116.push(casilla116Object);
      this.lista116Ready.emit(this.inputLista116);
      this.mostrarMensaje.callModal(this.mensajeConformidadGuardado);
    } else if (!this.equals(this.inputRenta116, casilla116Object)) {
      this.inputLista116[this.inputIndex] = casilla116Object;
      this.lista116Ready.emit(this.inputLista116);
    }
    this.activeModal.close();
  }

  private equals(obj: Casilla116, objNuevo: Casilla116): boolean {
    return objNuevo.codPais === obj.codPais &&
      objNuevo.desPais === obj.desPais &&
      objNuevo.codTipRenta === obj.codTipRenta &&
      objNuevo.desTipRenta === obj.desTipRenta &&
      objNuevo.codTipRentaRtfi === obj.codTipRentaRtfi &&
      objNuevo.codBenef === obj.codBenef &&
      objNuevo.codCdi === obj.codCdi &&
      objNuevo.desPagador === obj.desPagador &&
      objNuevo.codTipDocPagador === obj.codTipDocPagador &&
      objNuevo.numDocPagador === obj.numDocPagador &&
      objNuevo.mtoImpuesto === obj.mtoImpuesto;
  }
}
