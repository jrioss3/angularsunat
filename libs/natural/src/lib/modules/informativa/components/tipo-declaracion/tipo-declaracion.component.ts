// import { FuncionesGenerales } from '@path/natural/utils';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsComponent } from '../../../../components/utils/utils.component';
import { ValidationService } from '../../../../components/error-message/validation.service';
import { FormGroup, FormBuilder, Validators, NgModel } from '@angular/forms';
import { ConstantesExcepciones } from '@path/natural/utils/constantesExcepciones';
import { PreDeclaracionService, ParametriaFormulario } from '@path/natural/services';
import { PreDeclaracionModel, ListaParametrosModel } from '@path/natural/models';
import { Observable, throwError, of, EMPTY } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { MostrarMensajeService } from '@path/natural/services/mostrarMensaje.service';
import { ConstantesMensajesInformativos } from '@path/natural/utils';
import { ConsultaPersona, ComboService, CasillaService } from '@rentas/shared/core';
import { ConstantesCombos , ConstantesDocumentos } from '@rentas/shared/constantes';
import { SessionStorage, FuncionesGenerales, CasillasUtil} from '@rentas/shared/utils';
import { PersonaJuridica, PersonaNatural } from '@rentas/shared/types';

@Component({
  selector: 'app-tipo-declaracion',
  templateUrl: './tipo-declaracion.component.html',
  styleUrls: ['./tipo-declaracion.component.css']
})
export class TipoDeclaracionComponent extends CasillasUtil implements OnInit {

  @Output() enviarData: any = new EventEmitter<any>();

  public casilla523 = this.casillaService.obtenerCasilla('523'); private montoCasilla523: number;
  public casilla524 = this.casillaService.obtenerCasilla('524'); private montoCasilla524: number;
  public casilla525 = this.casillaService.obtenerCasilla('525'); private montoCasilla525: number;
  public casilla552 = this.casillaService.obtenerCasilla('552'); public rdtTipoDeclara: number;
  public casilla601 = this.casillaService.obtenerCasilla('601'); public rdtIncluyeSociedadConyugal: string;
  public casilla235 = this.casillaService.obtenerCasilla('235'); public valorCasilla235: string;
  public casilla236 = this.casillaService.obtenerCasilla('236'); public valorCasilla236: string;
  public casilla700 = this.casillaService.obtenerCasilla('700'); public valorCasilla700: string;
  public casilla516 = this.casillaService.obtenerCasilla('516');
  public tipodeclaraForm: FormGroup;
  private funcionesGenerales: FuncionesGenerales;
  public submitted = false;
  public mensajeExcepcion = ConstantesExcepciones;
  public maxLengthCas236: number;
  public maxLengthCas700: number;
  public rdtDeclaOriginal: string;
  public chkTipoRentaPCategoria = false;
  public chkTipoRentaSCategoria = true;
  public chkTipoRentaFteExt = false;
  public tipoDocumentos: ListaParametrosModel[];
  // public rdtTipoDeclaraEnabled: boolean;

  private existeDataPadron: boolean;
  private ruc20Autorizados: ListaParametrosModel[];
  private validarChkRentas: any;
  private preDeclaracion: PreDeclaracionModel;
  public listaOpcionesDeclaracion: ListaParametrosModel[] = [];
  public listaTiposDeclaracion: ListaParametrosModel[] = [];
  public listaOpcionesSiNo: ListaParametrosModel[] = [];
  public checkSeleccionado = 1;
  public checkDeseleccionado = 0;
  public SOCIEDAD_CONYUGAL = 2;
  public descripcionTipoRenta: string;
  public descripcionRentaPrimera: string;
  public descripcionRentaSegunda: string;
  public descripcionRentaTrabajo: string;

  mobNumberPattern = "^[a-zA-Z0-9 ]*$";

  constructor(
    private modalService: NgbModal,
    private preDeclaracionservice: PreDeclaracionService,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private comboService: ComboService,
    private casillaService: CasillaService,
    private mostrarMensaje: MostrarMensajeService,
    private cus01Service: ParametriaFormulario,) {
      super();
      this.tipodeclaraForm = this.formBuilder.group({
        cmbTipoDocumentoConyuge: [],
        txtNumDoc: ['', Validators.required],
        txtNombreConyuge : [Validators.pattern(/^[a-zA-Z0-9 ]*$/)]
      },
        { validator: [ValidationService.validarNrodoc('cmbTipoDocumentoConyuge', 'txtNumDoc', 'CUS02', '', '', this.ruc20Autorizados)
                      ] }
      );
  }

  ngOnInit() {
    this.inicializarComponente();
  }

  public inicializarComponente(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.existeDataPadron = false;
    this.ruc20Autorizados = this.comboService.obtenerComboPorNumero('R06');
    this.rdtDeclaOriginal = this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria === '0' ? '1' : '2';
    this.montoCasilla523 = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523);
    this.montoCasilla524 = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524);
    this.montoCasilla525 = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525);
    this.rdtIncluyeSociedadConyugal = String(this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas601));
    this.rdtTipoDeclara = this.funcionesGenerales
      .opcionalUno(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas552);
    this.valorCasilla235 = this.funcionesGenerales
      .opcionalText(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas235);
    this.valorCasilla236 = this.funcionesGenerales
      .opcionalText(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas236);
    this.valorCasilla700 = this.funcionesGenerales
      .opcionalText(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas700);

    this.chkTipoRentaPCategoria = this.montoCasilla523 === 0 ? false : true;
    this.chkTipoRentaSCategoria = this.montoCasilla524 === 0 ? false : true;
    this.chkTipoRentaFteExt = this.montoCasilla525 === 0 ? false : true;

    const listaDocumentos = [ConstantesDocumentos.RUC, ConstantesDocumentos.DNI, ConstantesDocumentos.CARNET_DE_EXTRANJERIA,
    ConstantesDocumentos.PASAPORTE, ConstantesDocumentos.PTP, ConstantesDocumentos.CARNET_IDENTIDAD];
    this.tipoDocumentos = this.comboService.obtenerComboPorNumero(this.casilla235?.codParam ?? '', listaDocumentos);
    // flgTD
    // this.setFlagEnabledTipoDeclaracion();
    
    // 1:new   2:rect  null_zero:?
    this.validarChkRentas = {
      rentaP: false,
      rentaS: false,
      rentaT: false
    };
    /* this.tipodeclaraForm = this.formBuilder.group({
      cmbTipoDocumentoConyuge: [this.valorCasilla235],
      txtNumDoc: [this.valorCasilla236, Validators.required],
    },
      { validator: ValidationService.validarNrodoc('cmbTipoDocumentoConyuge', 'txtNumDoc', 'CUS02', '', '', this.ruc20Autorizados) }
    ); */

    this.tipodeclaraForm.patchValue({
      cmbTipoDocumentoConyuge: this.valorCasilla235,
      txtNumDoc:this.valorCasilla236,
      txtNombreConyuge : this.valorCasilla700
    });

    if (this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.RUC){
      this.casilla700.indEditable = false;
    }else if (this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.DNI){
      this.casilla700.indEditable = false;
    }else{
      this.casilla700.indEditable = true;
    }

    // Habilitar información de cónyugue
    if (Number(this.rdtIncluyeSociedadConyugal) !== 1) {
      this.f.cmbTipoDocumentoConyuge.disable();
      this.f.txtNumDoc.disable();
      this.casilla235.indEditable = false;
      this.casilla236.indEditable = false;
      this.casilla700.indEditable = false;
    } else {
      this.maxLengthCas236 = this.setLengthCasilla236(this.valorCasilla235);
      this.maxLengthCas700 = this.setLengthCasilla700(this.valorCasilla235);
    }
    // this.savePD();
    this.updatePreDeclarativa();
    this.preDeclaracionservice.generarValHash();

    this.listaOpcionesDeclaracion = this.cus01Service.obtenerOpcionesDeclaracion();
    this.listaTiposDeclaracion = this.cus01Service.obtenerTiposDeclaracion();
    this.listaOpcionesSiNo = this.cus01Service.obtenerOpcionesSiNo();

    this.setDescripcionRentas();
  }

  public get f() { return this.tipodeclaraForm.controls; }

  public checkPreDeclarativa(chkTipoRenta: any): void {
    const tipoRentaMarcada = chkTipoRenta.target.checked;
    const checkid = chkTipoRenta.target.id;
    if (tipoRentaMarcada) {
      this.updatePreDeclarativa();
    } else {
      this.desmarcarTipoRenta(checkid).subscribe(() => {
        this.updatePreDeclarativa();
      });
    }
  }

  public habilitarCasItan(): boolean {
    const anioRenta = this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    return Number(anioRenta) >= 2021;
  }

  private updatePreDeclarativa(): void {
    // this.setFlagEnabledTipoDeclaracion();
    // this.rdtTipoDeclara = this.rdtTipoDeclaraEnabled ? 1 : this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas552;
    this.savePD();
    this.validarChkRentas.rentaP = this.chkTipoRentaPCategoria;
    this.validarChkRentas.rentaS = this.chkTipoRentaSCategoria;
    this.validarChkRentas.rentaT = this.chkTipoRentaFteExt;
    let rentas = new Object();
    rentas = {
      rentaP: this.chkTipoRentaPCategoria,
      rentaS: this.chkTipoRentaSCategoria,
      rentaT: this.chkTipoRentaFteExt
    };
    sessionStorage.setItem('rentas', JSON.stringify(rentas));

    this.enviarData.emit(this.validarChkRentas);
    if (this.chkTipoRentaPCategoria || this.chkTipoRentaSCategoria || this.chkTipoRentaFteExt) {
      sessionStorage.setItem('determinativa', 'true');
    } else {
      sessionStorage.setItem('determinativa', 'false');
    }
  }

  private desmarcarTipoRenta(checkid: string): Observable<any> {
    let tipoRenta = '';
    switch (checkid) {
      case 'chkTipoRentaPCategoria': {
        tipoRenta = '1';
        return this.quieresDesmarcarRenta(tipoRenta).pipe(
          tap((resp) => {
            if (resp === 'si') {
              this.chkTipoRentaPCategoria = false;
              this.eliminarDataRentaPrimera();
            } else if (resp === 'no') {
              this.chkTipoRentaPCategoria = true;
            }
          }));
      }
      case 'chkTipoRentaSCategoria': {
        tipoRenta = '2';
        return this.quieresDesmarcarRenta(tipoRenta).pipe(tap((resp) => {
          if (resp === 'si') {
            this.chkTipoRentaSCategoria = false;
            this.eliminarDataRentaSegunda();
          } else if (resp === 'no') {
            this.chkTipoRentaSCategoria = true;
          }
        }));
      }
      case 'chkTipoRentaFteExt': {
        tipoRenta = '3';
        return this.quieresDesmarcarRenta(tipoRenta).pipe(tap((resp) => {
          if (resp === 'si') {
            this.chkTipoRentaFteExt = false;
            this.eliminarDataRentaTercera();
          } else if (resp === 'no') {
            this.chkTipoRentaFteExt = true;
          }
        }));
      }
    }
  }

  private quieresDesmarcarRenta(renta): Observable<any> {
    let tipoRenta = '';
    if (renta === '1') {
      tipoRenta = ' de Primera Categoría';
    } else if (renta === '2') {
      tipoRenta = ' de Segunda Categoría';
    } else if (renta === '3') {
      tipoRenta = ' de Renta de Trabajo';
    }
    const modal = {
      titulo: 'Mensaje',
      mensaje: 'Si desmarca la renta' + tipoRenta + ', perderá la información existente de dicha renta'
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.nameTab = 'Desmarcar-TipoRenta';
    modalRef.componentInstance.modal = modal;
    return modalRef.componentInstance.respuesta;
  }

  private eliminarDataRentaPrimera(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera = {
      refTabla: 't5385casprimera',
      mtoCas100: null,
      mtoCas557: null,
      mtoCas558: null,
      mtoCas102: null,
      mtoCas501: null,
      mtoCas502: null,
      mtoCas515: null,
      mtoCas153: null,
      mtoCas367: null,
      mtoCas368: null,
      mtoCas369: null,
      mtoCas370: null,
      mtoCas156: null,
      mtoCas133: null,
      mtoCas159: null,
      mtoCas161: null,
      mtoCas162: null,
      mtoCas163: null,
      mtoCas164: null,
      mtoCas166: null,
      mtoCas160: null,
    };
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.casilla100Cabecera.lisCas100Cab = [];
    this.eliminarDataCondominos();
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  private eliminarDataRentaSegunda(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda = {
      refTabla: 't5386cassegunda',
      mtoCas350: null,
      mtoCas353: null,
      mtoCas354: null,
      mtoCas355: null,
      mtoCas385: null,
      mtoCas356: null,
      mtoCas357: null,
      mtoCas388: null,
      mtoCas358: null,
      mtoCas359: null,
      mtoCas360: null,
      mtoCas362: null,
      mtoCas363: null,
      mtoCas364: null,
      mtoCas365: null,
      mtoCas366: null,
      mtoCas361: null
    };
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla350.lisCas350 = [];
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla355.lisCas355 = [];
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla385.lisCas385 = [];
    this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda.impRetenidoRentas.lisCas359 = [];
    this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda.pagoDirectoIR.lisCas358 = [];
    this.eliminarDataAlquileresPagados();
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  private eliminarDataRentaTercera(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo = {
      refTabla: 't9030cascuarta',
      mtoCas107: null,
      mtoCas507: null,
      mtoCas508: null,
      mtoCas108: null,
      mtoCas509: null,
      mtoCas111: null,
      mtoCas510: null,
      mtoCas511: null,
      mtoCas514: null,
      mtoCas512: null,
      mtoCas522: null,
      mtoCas519: null,
      mtoCas513: null,
      mtoCas116: null,
      mtoCas517: null,
      mtoCas120: null,
      mtoCas122: null,
      mtoCas158: null,
      mtoCas167: null,
      mtoCas563: null,
      mtoCas564: null,
      mtoCas565: null,
      mtoCas125: null,
      mtoCas127: null,
      mtoCas128: null,
      mtoCas130: null,
      mtoCas131: null,
      mtoCas141: null,
      mtoCas142: null,
      mtoCas144: null,
      mtoCas145: null,
      mtoCas146: null,
      mtoCas168: null,
      mtoCas140: null,
    };
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla107.lisCas107 = [];
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla108.lisCas108 = [];
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla111.lisCas111 = [];
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla116.lisCas116 = [];
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera = [];
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla519.lisCas519 = [];
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla522.lisCas522 = [];
    this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.credIRFuenteExtran.lisCas122 = [];
    this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.impRetenRentasQnta.lisCas131 = [];
    this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.impRetenidoRentas.lisCas130 = [];
    this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.pagoDirectIRQuinta.lisCas128 = [];
    this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.pagoDirectoIR.lisCas127 = [];
    this.eliminarDataAlquileresPagados();
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  public enabledConyuge(value): void {
    //debugger;
    this.rdtIncluyeSociedadConyugal = value;
    if (Number(this.rdtIncluyeSociedadConyugal) === 1) {
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_RTA_PRIMERA_INCLUYE_SOCIEDAD_CONYUGAL);
      this.f.cmbTipoDocumentoConyuge.enable();
      this.f.cmbTipoDocumentoConyuge.setValue(ConstantesDocumentos.RUC);
      this.maxLengthCas236 = 11;
      this.f.txtNumDoc.enable();
      this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas601 = Number(this.rdtIncluyeSociedadConyugal); // SC
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
    
      this.casilla236.indEditable = true;
    } else {
      this.f.cmbTipoDocumentoConyuge.disable();
      this.f.txtNumDoc.disable();
      this.f.cmbTipoDocumentoConyuge.setValue('');
      this.f.txtNumDoc.setValue('');
      this.f.txtNombreConyuge.disable();
      this.f.txtNombreConyuge.setValue('');
      this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas601 = Number(this.rdtIncluyeSociedadConyugal); // SC
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
      this.existeDataPadron = false;
      sessionStorage.setItem('SUNAT.errorPadronConyugue', '0');
      // this.casilla235.indEditable = false;
      this.casilla236.indEditable = false;
      this.casilla700.indEditable = false;
    }
    this.agregar();
  }

  public enabledSociedadConyugal(value): void {
    this.rdtTipoDeclara = value;
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas552 = this.rdtTipoDeclara;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    
    const mtoCas523 = this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523;
    const mtoCas524 = this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524;
    const mtoCas525 = this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525;

    if (
      this.rdtTipoDeclara == this.SOCIEDAD_CONYUGAL &&
      mtoCas523 == this.checkDeseleccionado &&
      mtoCas524 == this.checkDeseleccionado &&
      mtoCas525 == this.checkSeleccionado
    ) {
      this.mostrarMensaje.callModal(
        ConstantesMensajesInformativos.MSJ_SOCIEDAD_CONYUGAL
      );
    }
  }

  private savePD(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523 = !this.chkTipoRentaPCategoria ? 0 : 1;
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524 = !this.chkTipoRentaSCategoria ? 0 : 1;
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525 = !this.chkTipoRentaFteExt ? 0 : 1;
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas552 = this.rdtTipoDeclara; // TD
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas601 = Number(this.rdtIncluyeSociedadConyugal); // SC
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }
  public agregar_2(): void{
    const anioRenta = this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    if (Number(anioRenta) >= 2021){
      this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas700 =
      this.f.txtNombreConyuge.value.toUpperCase() !== '' ? this.f.txtNombreConyuge.value.toUpperCase() : null;
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
    }    
  }

  public agregar(): void {
   
    this.obtenerNombre();

    switch (this.f.cmbTipoDocumentoConyuge.value) {
      case ConstantesDocumentos.DNI: {
        this.f.txtNombreConyuge.setErrors({ '{excepccion01}': '' });
        break;
      }
      case ConstantesDocumentos.RUC: {
        this.f.txtNombreConyuge.setErrors({ '{excepccion01}': '' });
        break;
      }
    }
    //this.f.txtNombreConyuge.setErrors({ '{excepccion01}': '' });
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas235 =
      this.f.cmbTipoDocumentoConyuge.value !== '' ? this.f.cmbTipoDocumentoConyuge.value : null;
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas236 =
      this.f.txtNumDoc.value.toUpperCase() !== '' ? this.f.txtNumDoc.value.toUpperCase() : null;

    const anioRenta = this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    if (Number(anioRenta) >= 2021){
      this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas700 =
      this.f.txtNombreConyuge.value.toUpperCase() !== '' ? this.f.txtNombreConyuge.value.toUpperCase() : null;
    }
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.validarPadron();
  }

  public validar(): boolean {
    this.submitted = true;
    
    if (this.tipodeclaraForm.invalid && this.existeDataPadron === false && Number(this.rdtIncluyeSociedadConyugal) === 1) {
      return false;
    }
    return true;
  }
 

  public validarDocumento(): void {    
    this.f.cmbTipoDocumentoConyuge.valueChanges.subscribe(data => {
      this.f.txtNumDoc.markAsUntouched();
      this.f.txtNumDoc.setValue(this.f.txtNumDoc.value);
    });
    this.f.txtNumDoc.setValue('');
    this.f.txtNombreConyuge.setValue("");
    this.maxLengthCas236 = this.setLengthCasilla236(this.f.cmbTipoDocumentoConyuge.value)
    sessionStorage.setItem('SUNAT.errorPadronConyugue', '0');
    this.existeDataPadron = false;

    if (this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.RUC){
      this.casilla700.indEditable = false;
      this.f.txtNombreConyuge.disable();
    }else if (this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.DNI){
      this.casilla700.indEditable = false;
      this.f.txtNombreConyuge.disable();
    }else{
      this.casilla700.indEditable = true;
      this.f.txtNombreConyuge.enable();
    }    
    
    this.agregar();
  }

  public validarPadron(): void {
    this.existeDataPadron = false;
    this.validarNombreRazonSocial().subscribe();
  }

  public validarEspacio(val: any): void {
    this.f.txtNumDoc.setValue(val.trim());
  }

  public keyPress(event): void {
    let pattern;
    let inputChar;
    if (this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.RUC ||
      this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.DNI) {
      pattern = /[0-9]/;
      inputChar = String.fromCharCode(event.charCode);

    } else if (this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.PASAPORTE
      || this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.CARNET_DE_EXTRANJERIA
      || this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.PTP
      || this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.CARNET_IDENTIDAD) {
      pattern = /[a-zA-Z0-9-ñÑ]/;
      inputChar = String.fromCharCode(event.charCode);
    }
    if (!pattern.test(inputChar) && (event.charCode !== 45) && (event.charCode !== 32) && (event.charCode !== 0)) {
      event.preventDefault();
    }
  }

  private validarNombreRazonSocial(): Observable<any> {
    if (this.cumpleCondicion()) {
      this.spinner.show();
      return this.tipoContribuyente().pipe(
        switchMap(tipo => tipo === ConstantesDocumentos.DNI ? this.validarExistenciaPersona() : this.validarExistenciaContribuyente()),
        catchError(error => {
         
          this.spinner.hide();
          this.guardarErrorExistenciaPadron();
          return throwError(error);
        })
      );
    }
    return of({});
  }

  

  private validarExistenciaPersona(): Observable<any> {
    return this.personaService.obtenerPersona(this.f.txtNumDoc.value).pipe(
      tap(() => (this.existeDataPadron = true,
        this.spinner.hide(),
        sessionStorage.setItem('SUNAT.errorPadronConyugue', '0')
      ))
    );
  }

  private validarExistenciaContribuyente(): Observable<any> {
    return this.personaService.obtenerContribuyente(this.f.txtNumDoc.value).pipe(
      tap(() => (this.existeDataPadron = true,
        this.spinner.hide(),
        sessionStorage.setItem('SUNAT.errorPadronConyugue', '0')
      ))
    );
  }

  private tipoContribuyente(): Observable<string> {
    if (this.f.txtNumDoc.value && this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.DNI) {
      return of(ConstantesDocumentos.DNI);
    } else if ((this.f.txtNumDoc.value && this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.RUC)) {
      return of(ConstantesDocumentos.RUC);
    } else {
      return EMPTY;
    }
  }

  private guardarErrorExistenciaPadron(): void {
    switch (this.f.cmbTipoDocumentoConyuge.value) {
      case ConstantesDocumentos.DNI: {
        sessionStorage.setItem('SUNAT.errorPadronConyugue', '1');
        this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS02_EX01 });
        break;
      }
      case ConstantesDocumentos.RUC: {
        sessionStorage.setItem('SUNAT.errorPadronConyugue', '2');
        this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS02_EX02 });
        break;
      }
    }
  }

  private eliminarDataCondominos(): void {
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas559 = null;
    this.preDeclaracion.declaracion.seccInformativa.condominos.lisCondomino = [];
  }

  private eliminarDataAlquileresPagados(): void {
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas602 = null;
    this.preDeclaracion.declaracion.seccInformativa.alquileres.lisAlquileres = [];
  }

  // private setFlagEnabledTipoDeclaracion(): void {
  //   if (this.chkTipoRentaFteExt && !this.chkTipoRentaPCategoria && !this.chkTipoRentaSCategoria) {
  //     this.rdtTipoDeclaraEnabled = false;
  //   } else {
  //     this.rdtTipoDeclaraEnabled = true;
  //   }
  // }

  private setLengthCasilla236(codTipDoc): number {
    switch(codTipDoc) {
      case '' : return 0;
      case ConstantesDocumentos.RUC : return 11;
      case ConstantesDocumentos.DNI : return 8;
      default : return 15;
    }
  }

  private setLengthCasilla700(codTipDoc): number {
    switch(codTipDoc) {
      case '' : return 0;
      case ConstantesDocumentos.RUC : return 0;
      case ConstantesDocumentos.DNI : return 0;
      default : return 100;
    }
  }

  private setDescripcionRentas(): void {
    this.descripcionTipoRenta = this.casilla523.descripcion.split('-')[0];
    this.descripcionRentaPrimera = this.casilla523.descripcion.split('-')[1];
    this.descripcionRentaSegunda = this.casilla524.descripcion.split('-')[1];
    this.descripcionRentaTrabajo = this.casilla525.descripcion.split('-')[1];
  }

  public obtenerNombre(): void {
   
    this.existeDataPadron = false;
    const val = this.f.cmbTipoDocumentoConyuge.value; 
   
    switch (val){
      case ConstantesDocumentos.RUC:{
        this.f.txtNombreConyuge.setValue("");
        this.autocompletarNombreRUC().subscribe(() => {
         
          this.existeDataPadron = true;
          this.spinner.hide();
         
        });
        break;
      }
      case ConstantesDocumentos.DNI:{
        this.f.txtNombreConyuge.setValue("");
        this.autocompletarNombreDNI().subscribe(() => {
          this.existeDataPadron = true;
        
          this.spinner.hide();
         
        });
        break;
      }      
    }     
  }

  private condicion(): boolean {    
    return !this.f.txtNumDoc.errors && (this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.RUC || this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.DNI) && !this.existeDataPadron;
  }

  private cumpleCondicion(): boolean {
    return !this.f.txtNumDoc.errors && !this.existeDataPadron && !this.f.cmbTipoDocumentoConyuge.errors &&
      (this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.RUC ||
        this.f.cmbTipoDocumentoConyuge.value === ConstantesDocumentos.DNI);
  }


  private autocompletarNombreRUC(): Observable<any> {
   
    if (this.cumpleCondicion()) {
      this.spinner.show();
      this.f.txtNombreConyuge.setValue("");
      return this.personaService.obtenerContribuyente(this.f.txtNumDoc.value).pipe(
        tap(data => this.obtenerRazonSocialContribuyente(data)),
        catchError(error => {
         
          this.spinner.hide();
          this.f.txtNombreConyuge.setValue("");
          this.guardarErrorExistenciaPadron();
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void{
    sessionStorage.setItem('SUNAT.errorPadronConyugue', '0');
    this.f.txtNombreConyuge.setValue(data.ddpNombre.trim());
 
    const anioRenta = this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    if (Number(anioRenta) >= 2021){
      this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas700 =
      this.f.txtNombreConyuge.value !== '' ? this.f.txtNombreConyuge.value : null; 
    }    
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.spinner.hide();

  }

  private autocompletarNombreDNI(): Observable<any> {
   
    if (this.cumpleCondicion()) {
      this.spinner.show();      
      return this.personaService.obtenerPersona(this.f.txtNumDoc.value).pipe(
        tap(data => this.obtenerNombreNatural(data)),
        catchError(error => {
         
          this.spinner.hide();
          this.f.txtNombreConyuge.setValue("");
          this.guardarErrorExistenciaPadron();
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private obtenerNombreNatural(data: PersonaNatural): void{
    sessionStorage.setItem('SUNAT.errorPadronConyugue', '0');
    this.f.txtNombreConyuge.setValue(data.desNombrePnat.trim() + " " + data.desApepatPnat.trim()+ " " + data.desApematPnat.trim());
    //this.txtRazSoc = data.ddpNombre.trim();
    const anioRenta = this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    if (Number(anioRenta) >= 2021){
      this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas700 =
      this.f.txtNombreConyuge.value !== '' ? this.f.txtNombreConyuge.value : null;
    }    
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.spinner.hide();
  }





}
