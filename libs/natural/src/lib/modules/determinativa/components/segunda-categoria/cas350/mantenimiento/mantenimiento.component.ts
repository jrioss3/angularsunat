import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationService } from '../../../../../../components/error-message/validation.service';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantesExcepciones } from '@path/natural/utils';
import { ListaParametrosModel, Casilla350 } from '@path/natural/models';
import { PreDeclaracionService, ParametriaFormulario } from '@path/natural/services';
import { Observable, throwError, of, EMPTY, zip } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { PersonaJuridica, PersonaNatural } from '@rentas/shared/types';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { ConstantesCombos, ConstantesDocumentos } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils'

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class C350MantenimientoComponent implements OnInit {

  public frmCasilla350: FormGroup;
  public descTipdoc: string;
  public nroDoc: string;
  public submitted = false;
  public mensaje350 = ConstantesExcepciones;
  private funcionesGenerales: FuncionesGenerales;
  public anio: number;
  public tiposDocumento: ListaParametrosModel[];
  public listaFuenteRenta: Array<any>;
  public listaTiposDocumento: ListaParametrosModel[] = [];
  public placeholder = 'ingresar';
  public numRazPlaceholder = 'ingresar';
  public longitudNroDoc: number;

  @Input() inputListaCasilla350: Casilla350[];
  @Output() lista350Ready = new EventEmitter<Casilla350[]>();
  @Input() inputCasilla350: Casilla350;
  @Input() inputIndexCasilla350: number;


  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private cus10Service: ParametriaFormulario,
    private preDeclaracionservice: PreDeclaracionService,
    private fb: FormBuilder,
    private comboService: ComboService,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.anio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    const rucDeclarante = this.preDeclaracionservice.obtenerRucPredeclaracion();
    this.listaFuenteRenta = this.cus10Service.obtenerfuenteperdida();

    this.descTipdoc = 'Tipo de documento';
    this.nroDoc = 'Número de documento';
    const listaParametro = [ConstantesDocumentos.DNI, ConstantesDocumentos.CARNET_DE_EXTRANJERIA, ConstantesDocumentos.RUC,
    ConstantesDocumentos.PASAPORTE, ConstantesDocumentos.DOC_TRIBUTARIO_PAIS_ORIGEN, ConstantesDocumentos.PTP,
    ConstantesDocumentos.CARNET_IDENTIDAD, ConstantesDocumentos.SIN_RUC];
    this.tiposDocumento = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO, listaParametro);

    this.frmCasilla350 = this.fb.group({
      txtRazonSocial: [this.inputCasilla350 ? this.inputCasilla350.desRazSoc : '', Validators.required],
      cmbTipoFuenteRenta: [this.inputCasilla350 ? this.inputCasilla350.codTipFteRta : '', Validators.required],
      cmbTipoDocumento: [this.inputCasilla350 ? this.inputCasilla350.codTipDoc : '', Validators.required],
      txtNumDoc: [this.inputCasilla350 ? this.inputCasilla350.numDoc : '', Validators.required],
      periodo: [this.obtenerValoresPerido()],
      txtPrecVenta: [this.inputCasilla350 ? this.inputCasilla350.mtoPrecVenta : '', Validators.required],
      txtCostComputable: [this.inputCasilla350 ? this.inputCasilla350.mtoCostoComp : '', Validators.required],
      txtMonGanancia: [this.inputCasilla350 ? this.inputCasilla350.mtoGanancia : '', Validators.required],
      txtCantValores: [this.inputCasilla350 ? this.inputCasilla350.cntVal : '', Validators.required],
      txtRucEmisora: [this.inputCasilla350 ? this.inputCasilla350.numRucEmi : '', Validators.required],
      txtRazonSocialEmi: [this.inputCasilla350 ? this.inputCasilla350.desRazSocEmi : '', Validators.required],
    }, {
      validators:
        [
          ValidationService.validarNrodoc('cmbTipoDocumento', 'txtNumDoc', 'CUS09', rucDeclarante),
          ValidationService.validarNrodoc(ConstantesDocumentos.RUC, 'txtRucEmisora', 'CUS09', rucDeclarante),
          ValidationService.soloNumeros('txtPrecVenta', 'CUS09', 'si', '', 'cmbTipoFuenteRenta', ''),
          ValidationService.soloNumeros('txtCostComputable', 'CUS09', 'si', '', 'cmbTipoFuenteRenta', ''),
          ValidationService.soloNumeros('txtMonGanancia', 'CUS09', 'si', '', 'cmbTipoFuenteRenta', 'si'),
          ValidationService.soloNumeros('txtCantValores', 'CUS09', '', '', '', ''),
        ]
    });

    this.f.cmbTipoDocumento.disable();
    this.f.txtRazonSocialEmi.disable();

    if (this.inputCasilla350) {
      this.deshabilitarCamposAlEditar();
      this.descripcionCamposYListaTipoDocumento();
      Number(this.f.cmbTipoFuenteRenta.value) === 3 ? this.f.txtMonGanancia.disable() : this.f.txtMonGanancia.enable();
    }
  }

  public get f() {
    return this.frmCasilla350.controls;
  }

  private obtenerValoresPerido(): any {
    if (this.inputCasilla350) {
      return this.funcionesGenerales.obtenerPeriodoAlEditar(this.inputCasilla350.perRta);
    } else {
      return { year: 'AAAA', month: 'MM' };
    }
  }

  public calculoMontoGanancia(): void {
    const calculo = Number(this.f.txtPrecVenta.value) - Number(this.f.txtCostComputable.value);
    this.f.txtMonGanancia.setValue(calculo.toFixed(2));
  }

  private deshabilitarCamposAlEditar(): void {
    const campos = [this.f.cmbTipoFuenteRenta, this.f.cmbTipoDocumento, this.f.txtNumDoc, this.f.txtPrecVenta, this.f.txtCostComputable,
    this.f.txtCantValores, this.f.txtRucEmisora, this.f.txtRazonSocial];
    this.funcionesGenerales.desHabilitarCampos(campos);
    this.placeholder = '';
  }

  private descripcionCamposYListaTipoDocumento(): void {
    this.listaTiposDocumento = [];
    switch (this.f.cmbTipoFuenteRenta.value) {
      case '01': {
        this.descTipdoc = 'Tipo de documento';
        this.nroDoc = 'Número de documento';
        this.longitudNroDoc = 11;
        this.listaTiposDocumento = this.tiposDocumento.filter(x => x.val === ConstantesDocumentos.RUC);
        break;
      }
      case '02': {
        this.descTipdoc = 'Tipo de documento';
        this.nroDoc = 'Número de documento';
        this.longitudNroDoc = 11;
        this.listaTiposDocumento = this.tiposDocumento.filter(x => x.val === ConstantesDocumentos.SIN_RUC);
        break;
      }
      case '03': {
        this.descTipdoc = 'Tipo de documento del adquirente o comprador';
        this.nroDoc = 'Número de documento del adquirente o comprador';
        this.listaTiposDocumento = this.tiposDocumento.filter(x => x.val !== ConstantesDocumentos.SIN_RUC);
        break;
      }
      default: {
        this.descTipdoc = 'Tipo de documento';
        this.nroDoc = 'Número de documento';
        this.longitudNroDoc = 0;
      }
    }
  }

  public cambiarFuenteRenta(): void {
    this.placeholder = '';
    this.establecerValores();
  }

  private limiteSuperiorLongitudNroDoc(): void {
    switch (this.f.cmbTipoDocumento.value) {
      case '': this.longitudNroDoc = 0; break;
      case ConstantesDocumentos.DNI: this.longitudNroDoc = 8; break;
      case ConstantesDocumentos.RUC: this.longitudNroDoc = 11; break;
      case ConstantesDocumentos.SIN_RUC: this.longitudNroDoc = 11; break;
      default: this.longitudNroDoc = 15; break;
    }
  }

  private establecerValores(): void {
    this.descripcionCamposYListaTipoDocumento();
    const campos = [this.f.txtRazonSocial, this.f.txtPrecVenta, this.f.txtCostComputable, this.f.txtMonGanancia, this.f.txtCantValores,
    this.f.txtRucEmisora, this.f.txtRazonSocialEmi];
    const campoDeshabilitado = [this.f.cmbTipoDocumento, this.f.txtPrecVenta, this.f.txtCostComputable, this.f.txtCantValores,
    this.f.txtRucEmisora];
    switch (this.f.cmbTipoFuenteRenta.value) {
      case '01': {
        this.f.cmbTipoDocumento.setValue(ConstantesDocumentos.RUC);
        this.funcionesGenerales.setearVacioEnCampos(campos.concat(this.f.txtNumDoc));
        this.f.txtNumDoc.enable();
        this.f.txtMonGanancia.enable();
        this.funcionesGenerales.desHabilitarCampos(campoDeshabilitado.concat(this.f.txtRazonSocial));
        this.numRazPlaceholder = '';
        break;
      }

      case '02': {
        this.f.cmbTipoDocumento.setValue(ConstantesDocumentos.SIN_RUC);
        this.generarCorrelativo();
        this.funcionesGenerales.setearVacioEnCampos(campos);
        this.f.txtMonGanancia.enable();
        this.f.txtRazonSocial.enable();
        this.funcionesGenerales.desHabilitarCampos(campoDeshabilitado.concat(this.f.txtNumDoc));
        this.numRazPlaceholder = 'ingresar';
        break;
      }

      case '03': {
        this.funcionesGenerales.setearVacioEnCampos(campos.concat(this.f.txtNumDoc, this.f.cmbTipoDocumento));
        this.placeholder = 'ingresar';
        this.f.txtMonGanancia.disable();
        this.funcionesGenerales.habilitarCampos(campoDeshabilitado.concat(this.f.txtNumDoc, this.f.txtRazonSocial));
        this.numRazPlaceholder = 'ingresar';
        break;
      }

      default:
        this.funcionesGenerales.setearVacioEnCampos(campos.concat(this.f.txtNumDoc, this.f.cmbTipoDocumento));
        this.placeholder = 'ingresar';
        this.numRazPlaceholder = 'ingresar';
        this.f.cmbTipoDocumento.disable();
        const camposHabilitados = [this.f.txtNumDoc, this.f.txtPrecVenta, this.f.txtCostComputable, this.f.txtMonGanancia,
        this.f.txtCantValores, this.f.txtRucEmisora, this.f.txtRazonSocial];
        this.funcionesGenerales.habilitarCampos(camposHabilitados);
        break;
    }
  }

  private generarCorrelativo(): void {
    const listaSinRuc = this.inputListaCasilla350.filter(x => Number(x.codTipFteRta) === 2);
    listaSinRuc.sort((x, y) => {
      if (Number(x.numDoc) > Number(y.numDoc)) {
        return 1;
      }
      if (Number(x.numDoc) < Number(y.numDoc)) {
        return -1;
      }
      return 0;
    });
    const correlativo = listaSinRuc.length !== 0 ? Number([...listaSinRuc].pop().numDoc) + 1 : 1;
    this.f.txtNumDoc.setValue(String(correlativo).padStart(11, '0'));
  }

  public habilitarcampo(): void {
    const tipDocRUCyDNI = [ConstantesDocumentos.DNI, ConstantesDocumentos.RUC];
    const tipDocDistintoRUCyDNI = [ConstantesDocumentos.PASAPORTE, ConstantesDocumentos.CARNET_DE_EXTRANJERIA, ConstantesDocumentos.PTP,
    ConstantesDocumentos.CARNET_IDENTIDAD, ConstantesDocumentos.DOC_TRIBUTARIO_PAIS_ORIGEN];
    this.f.txtRazonSocial.setValue('');
    this.f.txtNumDoc.setValue('');
    this.limiteSuperiorLongitudNroDoc();
    if (tipDocDistintoRUCyDNI.includes(this.f.cmbTipoDocumento.value)) {
      this.f.txtRazonSocial.enable();
      this.numRazPlaceholder = 'ingresar';
    } else if (tipDocRUCyDNI.includes(this.f.cmbTipoDocumento.value)) {
      this.f.txtRazonSocial.disable();
      this.numRazPlaceholder = '';
    } else {
      this.numRazPlaceholder = 'ingresar';
      this.f.txtRazonSocial.enable();
    }
  }

  public validarEspacio(val: any): void {
    this.f.txtNumDoc.setValue(val.trim());
  }
  /** 1.Obtener Nombre / Razon Social del contribuyente si existe en la base de SUNAT --------------------------------------- */
  public obtenerNombreRazonSocial(): void {
    if (this.f.txtRazonSocial.disabled === true) {
      this.f.txtRazonSocial.setValue('');
    }
    this.autocompletarNombreRazonSocial().subscribe();
  }

  private cumpleCondicion(): boolean {
    return !this.f.txtNumDoc.errors && this.f.txtRazonSocial.value === '' &&
      (this.f.cmbTipoDocumento.value === ConstantesDocumentos.RUC || this.f.cmbTipoDocumento.value === ConstantesDocumentos.DNI);
  }

  private tipoContribuyente(): Observable<string> {
    if (this.f.txtNumDoc.value && this.f.cmbTipoDocumento.value === ConstantesDocumentos.DNI) {
      return of(ConstantesDocumentos.DNI);
    } else if (this.f.txtNumDoc.value && this.f.cmbTipoDocumento.value === ConstantesDocumentos.RUC) {
      return of(ConstantesDocumentos.RUC);
    } else {
      this.f.txtRazonSocial.setValue('');
      return EMPTY;
    }
  }

  private autocompletarNombreRazonSocial(): Observable<any> {
    if (this.cumpleCondicion()) {
      this.spinner.show();
      return this.tipoContribuyente()
        .pipe(
          switchMap(tipo => tipo === ConstantesDocumentos.DNI ? this.validarExistenciaPersona() : this.validarExistenciaContribuyente()),
          catchError(error => {
            switch (this.f.cmbTipoDocumento.value) {
              case ConstantesDocumentos.DNI: this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX03 }); break;
              case ConstantesDocumentos.RUC: this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX04 }); break;
            }
            this.spinner.hide();
            return throwError(error);
          })
        );
    }
    return of({});
  }

  private validarExistenciaPersona(): Observable<any> {
    return this.personaService.obtenerPersona(this.f.txtNumDoc.value)
      .pipe(
        tap(data => this.obtenerNombrePersona(data)));
  }

  private obtenerNombrePersona(data: PersonaNatural): void {
    const nombre = data.desNombrePnat + ' ' + data.desApepatPnat + ' ' + data.desApematPnat;
    this.f.txtRazonSocial.setValue(nombre);
    this.f.txtRazonSocial.disable();
    this.spinner.hide();
  }

  private validarExistenciaContribuyente(): Observable<any> {
    return this.personaService.obtenerContribuyente(this.f.txtNumDoc.value)
      .pipe(
        tap(data => this.obtenerRazonSocialContribuyente(data)));
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void {
    this.f.txtRazonSocial.setValue(data.ddpNombre.trim());
    this.f.txtRazonSocial.disable();
    this.spinner.hide();
  }
  /** 2. OBTENER LA RAZON SOCIAL DEL EMISOR SI EXISTE EN LA BASE DE SUNAT ------------------------------------------------------- */
  public obtenerRazonSocialEmisor(): void {
    if (this.f.txtRazonSocial.disabled === true) {
      this.f.txtRazonSocialEmi.setValue('');
    }
    this.autocompletarRazonSocialEmisor().subscribe();
  }

  private cumpleCondicionRucEmisora(): boolean {
    return !this.f.txtRucEmisora.errors && this.f.txtRucEmisora.value;
  }

  private autocompletarRazonSocialEmisor(): Observable<any> {
    if (this.cumpleCondicionRucEmisora()) {
      this.spinner.show();
      return this.personaService.obtenerContribuyente(this.f.txtRucEmisora.value)
        .pipe(
          tap(data => this.obtenerRazonSocialContribuyenteEmisor(data)),
          catchError(error => {
            this.f.txtRucEmisora.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX04 });
            this.spinner.hide();
            return throwError(error);
          })
        );
    }
    return of({});
  }

  private obtenerRazonSocialContribuyenteEmisor(data: PersonaJuridica): void {
    this.f.txtRazonSocialEmi.setValue(data.ddpNombre.trim());
    this.spinner.hide();
  }
  /** 2.FIN VALIDACION ------------------------------------------------------------------------------------------------------------ */

  private verificarDuplicidadRegistro(): boolean {
    return this.inputListaCasilla350.some(x => {
      return this.f.cmbTipoFuenteRenta.value === x.codTipFteRta &&
        this.f.cmbTipoDocumento.value === x.codTipDoc &&
        Number(this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value)) === Number(x.perRta) &&
        this.f.txtNumDoc.value === x.numDoc && (this.inputCasilla350 ? x !== this.inputCasilla350 : true);
    });
  }

  public metodo(): void {
    this.submitted = true;
    zip(this.autocompletarNombreRazonSocial(), this.autocompletarRazonSocialEmisor())
      .subscribe(() => {
        if (this.frmCasilla350.invalid) {
          return;
        }
        //this.verificarDuplicidadRegistro() ? this.callModal(ConstantesExcepciones.CUS09_EX11) : this.guardaroActualizarRegistro();
        this.guardaroActualizarRegistro();
      });
  }

  private guardaroActualizarRegistro(): void {

    const casilla350Model = {
      codTipFteRta: this.f.cmbTipoFuenteRenta.value,
      codTipDoc: this.f.cmbTipoDocumento.value,
      numDoc: this.f.txtNumDoc.value.toUpperCase(),
      desRazSoc: this.f.txtRazonSocial.value.toUpperCase(),
      perRta: this.funcionesGenerales.formatearPeriodoString(this.f.periodo.value),
      mtoCostoComp: Number(this.f.txtCostComputable.value),
      mtoPrecVenta: Number(this.f.txtPrecVenta.value),
      mtoGanancia: Number(this.f.txtMonGanancia.value),
      cntVal: Number(this.f.txtCantValores.value),
      numRucEmi: this.f.txtRucEmisora.value,
      desRazSocEmi: this.f.txtRazonSocialEmi.value.toUpperCase()
    };

    const validar = casilla350Model.mtoGanancia > 0 ? true : false;

    if (!this.inputCasilla350) {
      if (validar) {
        this.inputListaCasilla350.push(casilla350Model);
        this.lista350Ready.emit(this.inputListaCasilla350);
        this.callModal('Se grabaron los datos exitosamente');
      } else {
        this.callModal('El Monto de la ganancia debe ser mayor a cero.');
      }
    } else if (!this.equals(this.inputCasilla350, casilla350Model)) {
      this.inputListaCasilla350[this.inputIndexCasilla350] = casilla350Model;
      this.lista350Ready.emit(this.inputListaCasilla350);
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

  private equals(obj: Casilla350, objNuevo: Casilla350): boolean {
    return objNuevo.codTipFteRta === obj.codTipFteRta &&
      objNuevo.codTipDoc === obj.codTipDoc &&
      objNuevo.numDoc === obj.numDoc &&
      objNuevo.desRazSoc === obj.desRazSoc &&
      objNuevo.perRta === obj.perRta &&
      objNuevo.mtoCostoComp === obj.mtoCostoComp &&
      objNuevo.mtoPrecVenta === obj.mtoPrecVenta &&
      objNuevo.mtoGanancia === obj.mtoGanancia &&
      objNuevo.cntVal === obj.cntVal &&
      objNuevo.numRucEmi === obj.numRucEmi &&
      objNuevo.desRazSocEmi === obj.desRazSocEmi;
  }
}
