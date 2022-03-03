import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { C127MainComponent } from '../cas127/main/main.component';
import { C128MainComponent } from '../cas128/main/main.component';
import { Sddc130MainComponent } from '../cas130/main/main.component';
import { SdCas358Component } from '../cas358/main/main.component';
import { SdCas359Component } from '../cas359/main/main.component';
import { SddCas122MainComponent } from '../cas122/main/main.component';
import { Sddc131MainComponent } from '../cas131/main/main.component';
import { UtilsComponent } from '../../../../../components/utils/utils.component';
import { PreDeclaracionService } from '@path/natural/services/preDeclaracion.service';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { IndicadorRentaService } from '../../../../../services/indicador-renta.service';
import { ConstantesExcepciones, ConstantesParametros } from '@path/natural/utils';
import { PagosPreviosService, CasillaService, InteresMoratorioService } from '@rentas/shared/core';
import { TributoPagado } from '@path/natural/models/tributo-pagado';
import { C162MainComponent } from '../cas162/main/main.component';
import { ConstantesTributos } from '../../../../../utils/constantesTributos';
import { C363MainComponent } from '../cas363/main/main.component';
import { C144MainComponent } from '../cas144/main/main.component';
import { ConstantesCasillas } from '@rentas/shared/constantes';
import { ParametriaFormulario } from '@path/natural/services';
import { SessionStorage, FuncionesGenerales } from '@rentas/shared/utils';
@Component({
  selector: 'app-sddmain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class SddMainComponent implements OnInit {
  private preDeclaracion: PreDeclaracionModel;
  private funcionesGenerales: FuncionesGenerales;
  // -------------------------REFERENCIAS
  public refcasilla523: number;
  public refcasilla524: number;
  public refcasilla525: number;
  // RENTA PRIMERA
  public casilla153 = this.casillaService.obtenerCasilla('153'); public montoCasilla153: number;
  public casilla367 = this.casillaService.obtenerCasilla('367'); public montoCasilla367: number;
  public casilla368 = this.casillaService.obtenerCasilla('368'); public montoCasilla368: number;
  public casilla369 = this.casillaService.obtenerCasilla('369'); public montoCasilla369: number;
  public casilla370 = this.casillaService.obtenerCasilla('370'); public montoCasilla370: number;
  public casilla156 = this.casillaService.obtenerCasilla('156'); public montoCasilla156: number;
  public casilla133 = this.casillaService.obtenerCasilla('133'); public montoCasilla133: number;
  public casilla159 = this.casillaService.obtenerCasilla('159'); public montoCasilla159: number;
  public casilla160 = this.casillaService.obtenerCasilla('160'); public montoCasilla160: string;
  public casilla161 = this.casillaService.obtenerCasilla('161'); public montoCasilla161: number;
  public casilla162 = this.casillaService.obtenerCasilla('162'); public montoCasilla162: number;
  public casilla163 = this.casillaService.obtenerCasilla('163'); public montoCasilla163: number;
  public casilla164 = this.casillaService.obtenerCasilla('164'); public montoCasilla164: number;
  public casilla166 = this.casillaService.obtenerCasilla('166'); public montoCasilla166: number;
  public disabledCasilla160: boolean;
  public readonlycasilla162: boolean;
  // RENTA SEGUNDA
  public casilla357 = this.casillaService.obtenerCasilla('357'); public montoCasilla357: number;
  public casilla388 = this.casillaService.obtenerCasilla('388'); public montoCasilla388: number;
  public casilla358 = this.casillaService.obtenerCasilla('358'); public montoCasilla358: number;
  public casilla359 = this.casillaService.obtenerCasilla('359'); public montoCasilla359: number;
  public casilla360 = this.casillaService.obtenerCasilla('360'); public montoCasilla360: number;
  public casilla361 = this.casillaService.obtenerCasilla('361'); public montoCasilla361: string;
  public casilla362 = this.casillaService.obtenerCasilla('362'); public montoCasilla362: number;
  public casilla363 = this.casillaService.obtenerCasilla('363'); public montoCasilla363: number;
  public casilla364 = this.casillaService.obtenerCasilla('364'); public montoCasilla364: number;
  public casilla365 = this.casillaService.obtenerCasilla('365'); public montoCasilla365: number;
  public casilla366 = this.casillaService.obtenerCasilla('366'); public montoCasilla366: number;
  public disabledCasilla361: boolean;
  public readonlycasilla363: boolean;
  // RENTA TRABAJO
  public casilla120 = this.casillaService.obtenerCasilla('120'); public montoCasilla120: number;
  public casilla122 = this.casillaService.obtenerCasilla('122'); public montoCasilla122: number;
  public casilla158 = this.casillaService.obtenerCasilla('158'); public montoCasilla158: number;
  public casilla167 = this.casillaService.obtenerCasilla('167'); public montoCasilla167: number;
  public casilla563 = this.casillaService.obtenerCasilla('563'); public montoCasilla563: number;
  public casilla564 = this.casillaService.obtenerCasilla('564'); public montoCasilla564: number;
  public casilla565 = this.casillaService.obtenerCasilla('565'); public montoCasilla565: number;
  public casilla125 = this.casillaService.obtenerCasilla('125'); public montoCasilla125: number;
  public casilla127 = this.casillaService.obtenerCasilla('127'); public montoCasilla127: number;
  public casilla128 = this.casillaService.obtenerCasilla('128'); public montoCasilla128: number;
  public casilla130 = this.casillaService.obtenerCasilla('130'); public montoCasilla130: number;
  public casilla131 = this.casillaService.obtenerCasilla('131'); public montoCasilla131: number;
  public casilla140 = this.casillaService.obtenerCasilla('140'); public montoCasilla140: string;
  public casilla141 = this.casillaService.obtenerCasilla('141'); public montoCasilla141: number;
  public casilla142 = this.casillaService.obtenerCasilla('142'); public montoCasilla142: number;
  public casilla144 = this.casillaService.obtenerCasilla('144'); public montoCasilla144: number;
  public casilla145 = this.casillaService.obtenerCasilla('145'); public montoCasilla145: number;
  public casilla146 = this.casillaService.obtenerCasilla('146'); public montoCasilla146: number;
  public casilla168 = this.casillaService.obtenerCasilla('168'); public montoCasilla168: number;
  public disabledCasilla140: boolean;
  public esAnioEjercicio2019: boolean;
  public tipoCasilla: string;
  public anioEjercicio: number;
  public listaTributosPagados: Array<TributoPagado>;
  public pagosPreviosRentaPrimera: any;
  public pagosPreviosRentaSegunda: any;
  public pagosPreviosRentaTrabajo: any;
  public listaPagosPrevios: any;
  public listaDevolucionAplicacion = this.parametriaFormulario.obtenerOpcionesDevolucionAplicacion();
  private indRectificatoria;
  constructor(
    private modalService: NgbModal,
    private preDeclaracionservice: PreDeclaracionService,
    private casillaService: CasillaService,
    private indicadorRentaService: IndicadorRentaService,
    private parametriaFormulario: ParametriaFormulario,
    private pagosPreviosService: PagosPreviosService,
    private interesMoratorio: InteresMoratorioService) { }
  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.indRectificatoria = this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria ?? '0';
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.anioEjercicio = Number(this.preDeclaracionservice.obtenerAnioEjercicio());
    this.showCasillas2019();
    this.listaPagosPrevios = this.preDeclaracion.declaracion.determinacionDeuda.pagosPrevios.lisPagosPrevios;
    // Seteo las referencias
    // RENTA PRIMERA
    this.montoCasilla153 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas153);
    this.montoCasilla367 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas367);
    this.montoCasilla368 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas368);
    this.montoCasilla369 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas369);
    this.montoCasilla370 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas370);
    this.montoCasilla156 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas156);
    this.montoCasilla133 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas133);
    this.montoCasilla159 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas159);
    this.montoCasilla161 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas161);
    this.montoCasilla162 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas162);
    this.montoCasilla163 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas163);
    this.montoCasilla164 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas164);
    this.montoCasilla166 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166);
    // RENTA SEGUNDA
    this.montoCasilla357 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas357);
    this.montoCasilla388 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas388);
    this.montoCasilla358 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas358);
    this.montoCasilla359 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas359);
    this.montoCasilla360 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas360);
    this.montoCasilla362 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas362);
    this.montoCasilla363 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas363);
    this.montoCasilla364 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas364);
    this.montoCasilla365 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas365);
    this.montoCasilla366 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366);
    // RENTA TRABAJO
    this.montoCasilla120 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas120);
    this.montoCasilla122 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas122);
    this.montoCasilla158 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas158);
    this.montoCasilla167 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas167);
    this.montoCasilla563 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas563);
    this.montoCasilla564 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas564);
    this.montoCasilla565 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas565);
    this.montoCasilla125 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas125);
    this.montoCasilla127 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas127);
    this.montoCasilla128 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas128);
    this.montoCasilla130 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas130);
    this.montoCasilla131 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas131);
    this.montoCasilla141 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas141);
    this.montoCasilla142 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas142);
    this.montoCasilla144 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas144);
    this.montoCasilla145 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas145);
    this.montoCasilla146 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas146);
    this.montoCasilla168 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168);
    this.montoCasilla160 = this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas160 ?
      String(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas160) : null;
    this.montoCasilla361 = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas361 ?
      String(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas361) : null;
    this.montoCasilla140 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas140 ?
      String(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas140) : null;
    this.refcasilla523 = this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523 ?
      this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523 : 0;
    this.refcasilla524 = this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524 ?
      this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524 : 0;
    this.refcasilla525 = this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525 ?
      this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525 : 0;
    if (Number(this.refcasilla523) === 1) {
      this.activarCasilla160();
      this.activarCasillas162y163();
    }
    if (Number(this.refcasilla524) === 1) {
      this.activarCasilla361();
      this.activarCasillas363y364();
    }
    if (Number(this.refcasilla525) === 1) {
      this.activarCasilla141();
      this.activarCasilla145();
    }
    this.calculoCasilla145();
    this.calculoCasilla163();
    this.calculoCasilla364();
    this.getPagosPrevios();
    this.cambiarTipoCasillasInteresMoratorio();
  }
  // -------------------------------------------------------------------------------------------------------------------------
  // INTERFAZ RENTA PRIMERA
  public abrirCas162(event): void {
    event.srcElement.blur();
    event.preventDefault();
    const modalRef = this.modalService.open(C162MainComponent, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
    modalRef.componentInstance.pagosPreviosRentaPrimera = this.pagosPreviosRentaPrimera;
    modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
      this.montoCasilla162 = $resultado;
      this.calcularCasilla164()
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------
  // INTERFAZ RENTA SEGUNDA
  public abrirCas358(event): void {
    event.srcElement.blur();
    event.preventDefault();
    const modalRef = this.modalService.open(SdCas358Component, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
    modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
      this.montoCasilla358 = $resultado;
      this.calcularCasillas360y362();
    });
  }
  public abrirCas359(event): void {
    event.srcElement.blur();
    event.preventDefault();
    const modalRef = this.modalService.open(SdCas359Component, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class2' }));
    modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
      this.montoCasilla359 = $resultado;
      this.calcularCasillas360y362();
    });
  }
  public abrirCas363(event): void {
    event.srcElement.blur();
    event.preventDefault();
    const modalRef = this.modalService.open(C363MainComponent, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
    modalRef.componentInstance.pagosPreviosRentaSegunda = this.pagosPreviosRentaSegunda;
    modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
      this.montoCasilla363 = $resultado;
      this.calcularCasilla365()
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------
  // INTERFAZ RENTA TRABAJO
  public abrirCas122(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.modalService.open(SddCas122MainComponent, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla122 = $resultado;
        this.calcularCasilla158();
      });
    }, 300);
  }
  public abrirCas127(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.modalService.open(C127MainComponent, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class' }));
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla127 = $resultado;
        this.calcularCasilla141y142();
      });
    }, 300);
  }
  public abrirCas128(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.modalService.open(C128MainComponent, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla128 = $resultado;
        this.calcularCasilla141y142();
      });
    }, 300);
  }
  public abrirCas130(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.modalService.open(Sddc130MainComponent, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class' }));
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla130 = $resultado;
        this.calcularCasilla141y142();
      });
    }, 300);
  }
  public abrirCas131(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.modalService.open(Sddc131MainComponent, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class' }));
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla131 = $resultado;
        this.calcularCasilla141y142();
      });
    }, 300);
  }
  public abrirCas144(event): void {
    event.srcElement.blur();
    event.preventDefault();
    const modalRef = this.modalService.open(C144MainComponent, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
    modalRef.componentInstance.pagosPreviosRentaTrabajo = this.pagosPreviosRentaTrabajo;
    modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
      this.montoCasilla144 = $resultado;
      this.calcularCasilla146()
    });
  }
  public seleccionarPrimera(valor: any): void {
    this.montoCasilla160 = valor;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas160 = Number(valor);
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.mostrarMensajeDevolucionPrimera();
  }
  public seleccionarSegunda(valor: any): void {
    this.montoCasilla361 = valor;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas361 = Number(valor);
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.mostrarMensajeDevolucionSegunda();
  }
  public seleccionarTrabajo(valor: any): void {
    this.montoCasilla140 = valor;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas140 = Number(valor);
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.mostrarMensajeDevolucionTrabajo();
  }
  private mostrarMensajeDevolucionPrimera(): void {
    if (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas160) === 1) {
      this.callModal('Recuerde que podrá presentar su Solicitud de Devolución' +
        ' ‐ F. 1649 en el enlace habilitado en el Resumen de Transacciones.');
    }
  }
  private mostrarMensajeDevolucionSegunda(): void {
    if (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas361) === 1) {
      this.callModal('Recuerde que podrá presentar su Solicitud de Devolución' +
        ' ‐ F. 1649 en el enlace habilitado en el Resumen de Transacciones.');
    }
  }
  private mostrarMensajeDevolucionTrabajo(): void {
    if (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas140) === 1) {
      this.callModal('Recuerde que podrá presentar su Solicitud de Devolución' +
        ' ‐ F. 1649 en el enlace habilitado en el Resumen de Transacciones.');
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------
  // Calculos RENTA PRIMERA
  public calcularCasilla156(): void {
    const resultado = Number(this.montoCasilla368) - (Number(this.montoCasilla369) + Number(this.montoCasilla370));
    this.montoCasilla156 = resultado < 0 ? 0 : resultado;
    if (resultado < 0) {
      this.callModal(ConstantesExcepciones.CUS18_EX01);
    }
    this.calcularCasilla159y161();
  }
  public calcularCasilla159y161(): void {
    const resultado = Number(this.montoCasilla153) -
      Number(this.montoCasilla156) -
      Number(this.montoCasilla133);
    if (resultado < 0) {
      this.montoCasilla159 = Math.abs(resultado);
      this.montoCasilla161 = 0;
    } else {
      this.montoCasilla159 = 0;
      this.montoCasilla161 = resultado;
    }
    this.activarCasilla160();
    this.activarCasillas162y163();
    this.calculoCasilla163();
  }
  private activarCasilla160(): void {
    if (this.montoCasilla159 > 0) {
      this.disabledCasilla160 = false;
    } else {
      this.disabledCasilla160 = true;
      this.montoCasilla160 = null;
    }
  }
  private activarCasillas162y163(): void {
    if (Number(this.montoCasilla161) > 0) {
      this.readonlycasilla162 = false;
      this.casilla163.indEditable = true;
    } else {
      this.readonlycasilla162 = true;
      this.montoCasilla163 = null;
      this.casilla163.indEditable = false;
    }
  }
  public calcularCasilla164(): void {
    this.montoCasilla164 = this.calculoCasilla164();
    this.guardarRentaPrimera();
  }
  public changecasilla166(): void {
    if (this.montoCasilla166 > this.montoCasilla164) {
      this.callModal(ConstantesExcepciones.CUS18_EX02);
    }
    else if (this.montoCasilla166 <= 0 && this.montoCasilla164 > 0) {
      this.callModal(ConstantesExcepciones.CUS18_EX03);
    }
    this.guardarRentaPrimera();
  }
  // -------------------------------------------------------------------------------------------------------------------------
  // Calculos RENTA SEGUNDA
  public calcularCasillas360y362(): void {
    const operacion = Number(this.montoCasilla357) -
      Number(this.montoCasilla388) -
      Number(this.montoCasilla358) -
      Number(this.montoCasilla359);
    if (operacion < 0) {
      this.montoCasilla360 = Math.abs(operacion);
      this.montoCasilla362 = 0;
    } else {
      this.montoCasilla360 = 0;
      this.montoCasilla362 = operacion;
    }
    this.activarCasilla361();
    this.activarCasillas363y364();
    this.calculoCasilla364();
  }
  private activarCasilla361(): void {
    if (this.montoCasilla360 > 0) {
      this.disabledCasilla361 = false;
    } else {
      this.disabledCasilla361 = true;
      this.montoCasilla361 = null;
    }
  }
  private activarCasillas363y364(): void {
    if (this.montoCasilla362 > 0) {
      this.readonlycasilla363 = false;
      this.casilla364.indEditable = true;
    } else {
      this.readonlycasilla363 = true;
      this.montoCasilla364 = null;
      this.casilla364.indEditable = false;
    }
  }
  public calcularCasilla365(): void {
    this.montoCasilla365 = this.calculoCasilla365();
    this.guardarRentaSegunda();
  }
  public changecasilla366(): void {
    if (this.montoCasilla366 > this.montoCasilla365) {
      this.callModal(ConstantesExcepciones.CUS20_EX01);
    } else if (this.montoCasilla366 <= 0 && this.montoCasilla365 > 0) {
      this.callModal(ConstantesExcepciones.CUS20_EX02);
    }
    this.guardarRentaSegunda();
  }
  // -------------------------------------------------------------------------------------------------------------------------
  // Calculos RENTA TRABAJO
  private calcularCasilla158(): void {
    const resultado = Number(this.montoCasilla120) - Number(this.montoCasilla122);
    this.montoCasilla158 = resultado < 0 ? 0 : resultado;
    this.calcularCasilla141y142();
  }
  public calcularCasilla125(): void {
    const resultado = Number(this.montoCasilla563) - (Number(this.montoCasilla564) + Number(this.montoCasilla565));
    this.montoCasilla125 = resultado < 0 ? 0 : resultado;
    if (resultado < 0) {
      this.callModal(ConstantesExcepciones.CUS23_EX01);
    }
    this.calcularCasilla141y142();
  }
  public calcularCasilla141y142(): void {
    let resultado = 0;
    if (this.montoCasilla120 >= this.montoCasilla122) {
      resultado = Number(this.montoCasilla120) - Number(this.montoCasilla122) - Number(this.montoCasilla125) -
        Number(this.montoCasilla127) - Number(this.montoCasilla128) - Number(this.montoCasilla130) - Number(this.montoCasilla131);
    } else {
      resultado = 0 - Number(this.montoCasilla125) - Number(this.montoCasilla127) - Number(this.montoCasilla128) - Number(this.montoCasilla130) - Number(this.montoCasilla131);
    }
    if (resultado < 0) {
      this.montoCasilla141 = Math.abs(resultado);
      this.montoCasilla142 = 0;
    } else {
      this.montoCasilla141 = 0;
      this.montoCasilla142 = resultado;
    }
    this.activarCasilla141();
    this.activarCasilla145();
    this.calculoCasilla145();
  }
  private activarCasilla141(): void {
    if (this.montoCasilla141 > 0) {
      this.disabledCasilla140 = false;
    } else {
      this.disabledCasilla140 = true;
      this.montoCasilla140 = null;
    }
  }
  private activarCasilla145(): void {
    if (this.montoCasilla142 > 0) {
      this.casilla145.indEditable = true
    } else {
      this.montoCasilla145 = null
      this.casilla145.indEditable = false
    }
  }
  public calcularCasilla146(): void {
    this.montoCasilla146 = this.calculoCasilla146();
    this.guardarRentaTrabajo();
  }
  public changecasilla168(): void {
    if (this.montoCasilla168 > this.montoCasilla146) {
      this.callModal(ConstantesExcepciones.CUS23_EX02);
    } else if (this.montoCasilla168 <= 0 && this.montoCasilla146 > 0) {
      this.callModal(ConstantesExcepciones.CUS23_EX03);
    }
    this.guardarRentaTrabajo();
  }
  private callModal(excepcionName: string): void {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
  }
  private guardarRentaPrimera(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas368 = this.montoCasilla368;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas369 = this.montoCasilla369;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas370 = this.montoCasilla370;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas156 = this.montoCasilla156;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas159 = this.montoCasilla159;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas160 = Number(this.montoCasilla160);
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas161 = this.montoCasilla161;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas162 = this.montoCasilla162;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas163 = this.montoCasilla163;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas164 = this.montoCasilla164;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166 = this.montoCasilla166;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.indicadorRentaService.obtenerIndicadorRentaModel();
  }
  private guardarRentaSegunda(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas388 = this.montoCasilla388;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas360 = this.montoCasilla360;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas361 = Number(this.montoCasilla361);
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas362 = this.montoCasilla362;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas363 = this.montoCasilla363;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas364 = this.montoCasilla364;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas365 = this.montoCasilla365;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366 = this.montoCasilla366;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.indicadorRentaService.obtenerIndicadorRentaModel();
  }
  private guardarRentaTrabajo(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas158 = this.montoCasilla158;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas563 = this.montoCasilla563;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas564 = this.montoCasilla564;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas565 = this.montoCasilla565;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas125 = this.montoCasilla125;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas141 = this.montoCasilla141;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas140 = Number(this.montoCasilla140);
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas142 = this.montoCasilla142;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas144 = this.montoCasilla144;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas145 = this.montoCasilla145;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas146 = this.montoCasilla146;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168 = this.montoCasilla168;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.indicadorRentaService.obtenerIndicadorRentaModel();
  }
  private showCasillas2019(): void {
    if (this.anioEjercicio == ConstantesParametros.COD_ANIO_EJERCICIO_REFERENCIAL) {
      this.esAnioEjercicio2019 = true;
      this.tipoCasilla = ConstantesCasillas.CODIGO_TIPO_CASILLA_CALCULADA;
    } else {
      this.esAnioEjercicio2019 = false;
      this.tipoCasilla = ConstantesCasillas.CODIGO_TIPO_CASILLA_EDITABLE_FORMATO_NUMERICO;
    }
  }
  private getPagosPrevios(): void {
    //console.log("nro de pagos previos : ", this.listaPagosPrevios.length)
    //console.log("año de ejercicio: ",this.anioEjercicio)
    if (this.listaPagosPrevios.length > 0 && this.anioEjercicio >= 2021) {
     // console.log("hay data en pagos previos del periodo 2021")
      if (Number(this.refcasilla523) === 1) {
        this.obtenerPagosPreviosRentaPrimera();
        this.actualizarPreDeclaracionPagosPreviosRentaPrimera();
      }
      if (Number(this.refcasilla524) === 1) {
        this.obtenerPagosPreviosRentaSegunda();
        this.actualizarPreDeclaracionPagosPreviosRentaSegunda();
      }
      if (Number(this.refcasilla525) === 1) {
        this.obtenerPagosPreviosRentaTrabajo();
        this.actualizarPreDeclaracionPagosPreviosRentaTrabajo();
      }
    }
    else {
     // console.log("no hay data en pagos previos")
      this.pagosPreviosService.getPagosPrevios().subscribe((data) => {
        if (Number(this.refcasilla523) === 1) {
          this.obtenerPagosPreviosRentaPrimera(data);
          this.listaPagosPrevios = this.pagosPreviosService.obtenerListaPagosPrevios(this.listaPagosPrevios, this.pagosPreviosRentaPrimera, ConstantesTributos.RENTA_CAPITAL.codigo);
          this.actualizarPreDeclaracionPagosPreviosRentaPrimera();
        }
        if (Number(this.refcasilla524) === 1) {
          this.obtenerPagosPreviosRentaSegunda(data);
          this.listaPagosPrevios = this.pagosPreviosService.obtenerListaPagosPrevios(this.listaPagosPrevios,this.pagosPreviosRentaSegunda,ConstantesTributos.RENTA_2DA_CATEGORIA.codigo);
          this.actualizarPreDeclaracionPagosPreviosRentaSegunda();
        }
        if (Number(this.refcasilla525) === 1) {
          this.obtenerPagosPreviosRentaTrabajo(data);
          this.listaPagosPrevios = this.pagosPreviosService.obtenerListaPagosPrevios(this.listaPagosPrevios,this.pagosPreviosRentaTrabajo,ConstantesTributos.RENTA_TRABAJO.codigo);
          this.actualizarPreDeclaracionPagosPreviosRentaTrabajo();
        }
      });
    }
  }
  // RENTA PRIMERA
  private actualizarPreDeclaracionPagosPreviosRentaPrimera(): void {
    this.montoCasilla162 = this.pagosPreviosService.obtenerMontoPagosPreviosPorTributo(this.pagosPreviosRentaPrimera);
    this.montoCasilla164 = this.calculoCasilla164();
    this.preDeclaracion.declaracion.determinacionDeuda.pagosPrevios.lisPagosPrevios = this.listaPagosPrevios;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas162 = this.montoCasilla162;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas164 = this.montoCasilla164;
    this.preDeclaracionservice.actualizarPreDeclaracion(this.preDeclaracion);
  }
  public calculoCasilla164(): number {
    const resultado = Number(this.montoCasilla161) -
      Number(this.montoCasilla162) +
      Number(this.montoCasilla163);
    return resultado < 0 ? 0 : resultado;
  }
  private obtenerPagosPreviosRentaPrimera(data?): void {
    if (data) {
      const pagosPreviosRentaPrimeraServicio = this.pagosPreviosService.obtenerPagosPreviosPorTributo(
        data,
        ConstantesTributos.RENTA_CAPITAL.codigo
      );
      this.pagosPreviosRentaPrimera = this.pagosPreviosService.obtenerListaFinalPagosPreviosPorTributo(
        this.listaPagosPrevios,
        ConstantesTributos.RENTA_CAPITAL.codigo,
        pagosPreviosRentaPrimeraServicio
      );
    } else {
      this.pagosPreviosRentaPrimera = this.pagosPreviosService.obtenerPagosPreviosPorTributo(
        this.listaPagosPrevios,
        ConstantesTributos.RENTA_CAPITAL.codigo
      );
    }
  }
  // RENTA SEGUNDA
  private actualizarPreDeclaracionPagosPreviosRentaSegunda(): void {
    this.montoCasilla363 = this.pagosPreviosService.obtenerMontoPagosPreviosPorTributo(this.pagosPreviosRentaSegunda);
    this.montoCasilla365 = this.calculoCasilla365();
    this.preDeclaracion.declaracion.determinacionDeuda.pagosPrevios.lisPagosPrevios = this.listaPagosPrevios;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas363 = this.montoCasilla363;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas365 = this.montoCasilla365;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }
  public calculoCasilla365(): number {
    const resultado = Number(this.montoCasilla362) - Number(this.montoCasilla363) + Number(this.montoCasilla364);
    return resultado < 0 ? 0 : resultado;
  }
  private obtenerPagosPreviosRentaSegunda(data?): void {
    if (data) {
      const pagosPreviosRentaSegundaServicio = this.pagosPreviosService.obtenerPagosPreviosPorTributo(
        data,
        ConstantesTributos.RENTA_2DA_CATEGORIA.codigo
      );
      this.pagosPreviosRentaSegunda = this.pagosPreviosService.obtenerListaFinalPagosPreviosPorTributo(
        this.listaPagosPrevios,
        ConstantesTributos.RENTA_2DA_CATEGORIA.codigo,
        pagosPreviosRentaSegundaServicio
      );
    } else {
      this.pagosPreviosRentaSegunda = this.pagosPreviosService.obtenerPagosPreviosPorTributo(
        this.listaPagosPrevios,
        ConstantesTributos.RENTA_2DA_CATEGORIA.codigo
      );
    }
  }
  // RENTA TRABAJO
  private actualizarPreDeclaracionPagosPreviosRentaTrabajo(): void {
    this.montoCasilla144 = this.pagosPreviosService.obtenerMontoPagosPreviosPorTributo(this.pagosPreviosRentaTrabajo);
    this.montoCasilla146 = this.calculoCasilla146();
    this.preDeclaracion.declaracion.determinacionDeuda.pagosPrevios.lisPagosPrevios = this.listaPagosPrevios;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas144 = this.montoCasilla144;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas146 = this.montoCasilla146;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }
  public calculoCasilla146(): number {
    const resultado = Number(this.montoCasilla142) - Number(this.montoCasilla144) + Number(this.montoCasilla145);
    return resultado < 0 ? 0 : resultado;
  }
  private obtenerPagosPreviosRentaTrabajo(data?): void {
    if (data) {
      const pagosPreviosRentaTrabajoServicio = this.pagosPreviosService.obtenerPagosPreviosPorTributo(
        data,
        ConstantesTributos.RENTA_TRABAJO.codigo
      );
      this.pagosPreviosRentaTrabajo = this.pagosPreviosService.obtenerListaFinalPagosPreviosPorTributo(
        this.listaPagosPrevios,
        ConstantesTributos.RENTA_TRABAJO.codigo,
        pagosPreviosRentaTrabajoServicio
      );
    } else {
      this.pagosPreviosRentaTrabajo = this.pagosPreviosService.obtenerPagosPreviosPorTributo(
        this.listaPagosPrevios,
        ConstantesTributos.RENTA_TRABAJO.codigo
      );
    }
  }
  public calculoCasilla145(): void {
    if (this.indRectificatoria === '0' && Number(this.refcasilla525) === 1) {
      const monto = Number(this.montoCasilla142) - Number(this.montoCasilla144);
      if (monto > 0) {
        this.montoCasilla145 = this.interesMoratorio.getInteresMoratorioNatural(ConstantesTributos.RENTA_TRABAJO.codigo, monto);
      } else {
        this.montoCasilla145 = 0;
      }
    }
    if (this.indRectificatoria !== '0') {
      this.montoCasilla145 = null;
    }
    this.calcularCasilla146();
  }
  public calculoCasilla163(): void {
    if (this.indRectificatoria === '0' && Number(this.refcasilla523) === 1) {
      const monto = Number(this.montoCasilla161) - Number(this.montoCasilla162);
      if (monto > 0) {
        this.montoCasilla163 = this.interesMoratorio.getInteresMoratorioNatural(ConstantesTributos.RENTA_CAPITAL.codigo, monto);
      } else {
        this.montoCasilla163 = 0;
      }
    }
    if (this.indRectificatoria !== '0') {
      this.montoCasilla163 = null;
    }
    this.calcularCasilla164();
  }
  public calculoCasilla364(): void {
    if (this.indRectificatoria === '0' && Number(this.refcasilla524) === 1) {
      const monto = Number(this.montoCasilla362) - Number(this.montoCasilla363);
      if (monto > 0) {
        this.montoCasilla364 = this.interesMoratorio.getInteresMoratorioNatural(ConstantesTributos.RENTA_2DA_CATEGORIA.codigo, monto);
      } else {
        this.montoCasilla364 = 0;
      }
    }
    if (this.indRectificatoria !== '0') {
      this.montoCasilla364 = null;
    }
    this.calcularCasilla365();
  }
  private cambiarTipoCasillasInteresMoratorio(): void {
    if (this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria === '1') {
      this.casilla163.indEditable = true;
      this.casilla364.indEditable = true;
      this.casilla145.indEditable = true;
      this.casilla163.codTipCas = ConstantesCasillas.CODIGO_TIPO_CASILLA_EDITABLE_FORMATO_NUMERICO;
      this.casilla364.codTipCas = ConstantesCasillas.CODIGO_TIPO_CASILLA_EDITABLE_FORMATO_NUMERICO;
      this.casilla145.codTipCas = ConstantesCasillas.CODIGO_TIPO_CASILLA_EDITABLE_FORMATO_NUMERICO;
    } else {
      this.casilla163.codTipCas = ConstantesCasillas.CODIGO_TIPO_CASILLA_CALCULADA;
      this.casilla364.codTipCas = ConstantesCasillas.CODIGO_TIPO_CASILLA_CALCULADA;
      this.casilla145.codTipCas = ConstantesCasillas.CODIGO_TIPO_CASILLA_CALCULADA;
    }
  }
}