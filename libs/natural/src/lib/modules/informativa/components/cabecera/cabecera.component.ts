import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { PreDeclaracionService } from '@path/natural/services/preDeclaracion.service';
import { InicializadorService } from '@path/natural/services/inicializadorService.service';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { throwError, Observable, EMPTY } from 'rxjs';
import { TipoDeclaracionComponent } from '../tipo-declaracion/tipo-declaracion.component';
import { catchError,switchMap, tap  } from 'rxjs/operators';
import { ModalReportePreliminarComponent } from '@path/natural/report-center/tipo-reporte-preliminar/tipo-reporte-preliminar.component';
import { ValidacionesService } from '@path/natural/services/validacionesService';
import { ScMantenimientoComponent } from '../condominos/mantenimiento/mantenimiento.component';
import { IndicadorRentaService } from '@path/natural/services/indicador-renta.service';
import { CalcularMontosCasillaRentaPrimera } from '../utils/calcularMontosCasillaRentaPrimera';
import {
  ResumenPrimera,
  ResumenSegunda,
  ResumenTrabajo,
  Casilla350,
} from '@path/natural/models';
import { CalculoRentaPrimeraService } from '@path/natural/services/calculo-renta-primera.service';
import { CalcularMontosCasillaRentaSegunda } from '../utils/calcularMontosCasillaRentaSegunda';
import { CalcularMontosCasillaRentaTrabajo } from '../utils/calcularMontosCasillaRentaTrabajo';
import { CalculoRentaSegundaService } from '@path/natural/services/calculo-renta-segunda.service';
import { CalculoRentaTrabajoService } from '@path/natural/services/calculo-renta-trabajo.service';
import { EjercicioAnterior } from '@path/natural/services/ejercicio-anterior.services';
import { CorregirDataPersonalizadoCas350 } from '../utils/CorregirDataPersonalizadoCas350';
import { MensajeGenerales, Rutas } from '@rentas/shared/constantes';
import { SessionStorage, FuncionesGenerales } from '@rentas/shared/utils';
import { Formulario, UserData } from '@rentas/shared/types';
import { ErroresService, ChatErrorService, PredeclaracionService } from '@rentas/shared/core';
import { saveAs } from 'file-saver';
import { MostrarMensajeService } from '@path/natural/services/mostrarMensaje.service';
import { ConstantesMensajesInformativos } from '@path/natural/utils';

@Component({
  selector: 'app-cabecerasecinf',
  templateUrl: './cabecera.component.html',
})
export class CabeceraSecInformativaComponent implements OnInit {
  public anioRenta = '';
  public mostrarBtnanterior = false;
  private siguiente: string;
  private preDeclaracion: PreDeclaracionModel;
  public formularioCabecera: Formulario;
  private reinicio = false;
  private disabledTabTipoDeclaracion = false;
  public disabledTabCondomino = true;
  public disabledTabAlquilerPagados = true;
  public disabledTabGastos = true;
  public disabledTabOtros = true;
  private objetoInit: any;
  private rentas: any;
  private alquiler: boolean;
  private resumenPrimera: ResumenPrimera;
  private resumenSegunda: ResumenSegunda;
  private resumenTrabajo: ResumenTrabajo;
  private casilla350: Casilla350[];
  public linkAyuda: string;
  private funcionesGenerales: FuncionesGenerales;

  @ViewChild('tab') tab;
  @ViewChild(TipoDeclaracionComponent) component1: TipoDeclaracionComponent;
  @ViewChild(ScMantenimientoComponent) component2: ScMantenimientoComponent;
  private handlerTabs: HandlerTabs;

  constructor(
    private router: Router,
    private predeclaracionService: PreDeclaracionService,
    private inicializadorService: InicializadorService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private validacionesService: ValidacionesService,
    private indicadorRentaService: IndicadorRentaService,
    private calculoServicePrimera: CalculoRentaPrimeraService,
    private calculoServiceSegunda: CalculoRentaSegundaService,
    private calculoServiceTrabajo: CalculoRentaTrabajoService,
    private ejercicioAnterior: EjercicioAnterior,
    private erroresService: ErroresService,
    private chatErrorService: ChatErrorService,
    private pdservice: PredeclaracionService,
    private mostrarMensaje: MostrarMensajeService
  ) {
    this.handlerTabs = this.crearManejadorDeTab();
  }

  ngOnInit(): void {
    this.rentas = JSON.parse(sessionStorage.getItem('rentas'));
    this.alquiler = this.rentas
      ? this.rentas.alquiler
        ? this.rentas.alquiler
        : false
      : false;
    this.spinner.show();

    this.formularioCabecera = SessionStorage.getFormulario<Formulario>();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.linkAyuda = this.formularioCabecera.ayudas.find(e => e.codAyuda === '001').uri;

    this.inicializadorService.inicializarInformativa();
    this.inicializadorService.inicializarDeterminativa();
    this.indicadorRentaService.obtenerIndicadorRentaModel();
    this.preDeclaracion = SessionStorage.getPreDeclaracion();

    this.pdservice.runAutoSave();

    this.objetoInit = {};
    this.objetoInit.rentaP = this.preDeclaracion.declaracion.seccInformativa
      .casillaInformativa.mtoCas523
      ? Number(
        this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523.toString()
      )
      : 0;
    this.objetoInit.rentaS = this.preDeclaracion.declaracion.seccInformativa
      .casillaInformativa.mtoCas524
      ? Number(
        this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524.toString()
      )
      : 0;
    this.objetoInit.rentaT = this.preDeclaracion.declaracion.seccInformativa
      .casillaInformativa.mtoCas525
      ? Number(
        this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525.toString()
      )
      : 0;

    let rentas = new Object();
    rentas = {
      rentaP: this.objetoInit.rentaP ? true : false,
      rentaS: this.objetoInit.rentaS ? true : false,
      rentaT: this.objetoInit.rentaT ? true : false,
    };
    sessionStorage.setItem('rentas', JSON.stringify(rentas));

    if (this.objetoInit.rentaS || this.objetoInit.rentaP || this.objetoInit.rentaT) {
      sessionStorage.setItem('determinativa', 'true');
    } else {
      sessionStorage.setItem('determinativa', 'false');
    }

    this.enabledTabCondomino(this.objetoInit);

    this.anioRenta = this.predeclaracionService.obtenerAnioEjercicio();
    this.siguiente = 'tabCondominios';
    this.spinner.hide();
    if (this.alquiler) {
      this.rentas.alquiler = false;
      sessionStorage.setItem('rentas', JSON.stringify(this.rentas));
    }
    this.revisarErroresSesion();
    this.calcularMontoCasillas();
    this.corregirDataPersonalizadoCasilla350();

    setTimeout(() => {
      if (this.alquiler) {
        this.tab.select('tabAlquileresPagados');
        this.rentas.alquiler = false;
        sessionStorage.setItem('rentas', JSON.stringify(this.rentas));
      }
    }, 300);
  }

  private calcularMontoCasillas(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    if (
      Number(this.preDeclaracion.indProc) === 1 &&
      this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria === '0'
    ) {
      this.calculoRentaPrimera();
      this.calculoRentaSegunda();
      this.calculoRentaTrabajo();
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
      this.indicadorRentaService.obtenerIndicadorRentaModel();
      this.calculoServicePrimera.calcularCasilla153();
      this.calculoServiceSegunda.calcularCasilla357();
      this.calculoServiceTrabajo.calcularCasilla120();
    }
    this.predeclaracionService.generarValHash();
  }

  private corregirDataPersonalizadoCasilla350(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.casilla350 = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla350.lisCas350;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla350.lisCas350 = CorregirDataPersonalizadoCas350.newInstance(
      this.casilla350
    ).corregirData();
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  private revisarErroresSesion(): void {
    const arregloErroresListaInformativa = SessionStorage.getErroresInfo();
    const arregloErroresListaDeterminativa = SessionStorage.getErroresDet();
    const arregloErroresListaBackend = SessionStorage.getErroresBackend();

    let arregloErrores = [];

    if (arregloErroresListaInformativa != null && arregloErroresListaInformativa !== undefined) {
      arregloErrores = arregloErrores.concat(arregloErroresListaInformativa);
    }
    if (arregloErroresListaDeterminativa != null && arregloErroresListaDeterminativa !== undefined) {
      arregloErrores = arregloErrores.concat(arregloErroresListaDeterminativa);
    }
    if (arregloErroresListaBackend != null && arregloErroresListaBackend !== undefined) {
      arregloErrores = arregloErrores.concat(arregloErroresListaBackend);
    }
    if (arregloErrores.length !== 0 && arregloErrores != null && (arregloErrores !== []) !== undefined) {
      // this.serviceChat.enviarMensaje(arregloErrores, true);
      this.chatErrorService.enviarMensaje(arregloErrores, true);
    } else {
      // this.serviceChat.enviarMensaje(arregloErrores, false);
      this.chatErrorService.enviarMensaje(arregloErrores, false);
    }
  }

  private handlerError(error): Observable<any>{
    this.spinner.hide();    
    
    if(error.status == "422"){
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_NO_HAY_REGISTROS_ARCHIVO_PERSONALIZADO);
    }
    return throwError(error);
  }

  public descargarPd(): void {    
    this.spinner.show();
    let userDatos: UserData;
    userDatos = SessionStorage.getUserData();//userDatos.numRUC , this.anioRenta   

    this.predeclaracionService.descargarPersonalizado(userDatos.numRUC,this.anioRenta).pipe(catchError((error) => this.handlerError(error)))
    .subscribe(respuesta => {      
      const blob = new Blob([respuesta.content],{ type: "application/zip"});
      saveAs(blob, respuesta.nameFile);
      this.spinner.hide();
    },error => {
      console.log(error)
      this.spinner.hide()      
      //this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_NO_HAY_REGISTROS_ARCHIVO_PERSONALIZADO)
    } , () => this.spinner.hide());
  } 

  public MostrarConfirmacion(): Observable <String>{
    this.spinner.hide();
    const mensajeModal =
    Number(
      SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.generales
        .cabecera.indRectificatoria
    ) === 0
      ? MensajeGenerales.reseterPD_Original
      : MensajeGenerales.resetearPD_Rectificatoria;

    const modal = {
      titulo: 'Mensaje',
      mensaje: mensajeModal,
    };
    const modalRef = this.modalService.open(
      UtilsComponent,
      this.funcionesGenerales.getModalOptions({})
    );
    modalRef.componentInstance.modal = modal;
    modalRef.componentInstance.nameTab = 'Rectificatoria';
    /*modalRef.componentInstance.respuesta.subscribe((result) => {
      if (result === 'si') {
        this.resetearPdEndpoint();
      }
    });*/

   return modalRef.componentInstance.respuesta;

  }

  public resetearPd(): void {

    this.spinner.show();
    this.pdservice.validarPersonalizado().pipe(
      switchMap(data => this.MostrarConfirmacion()),
      tap(respuesta => respuesta === 'si' ? this.resetearPdEndpoint() : EMPTY),
      catchError((error) => {
        if(error.status == "422"){
          this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_NO_HAY_REGISTROS_ARCHIVO_PERSONALIZADO);
        }else{
          this.erroresService.mostarModalError(error);
        }
        this.spinner.hide();
        return throwError(error);
      })
    ).subscribe();
  }

  private resetearPdEndpoint(): void {

    this.spinner.show();
    this.pdservice
      .reestablecerPersonalizado()
      .subscribe((data) => {
        this.reinicio = true;
        SessionStorage.setPreDeclaracion(data);
        this.router.navigate([Rutas.NATURAL_INFORMATIVA]);
        this.tab.select('tabTipoDeclaracion');
        this.inicializadorService.inicializarInformativa();
        this.inicializadorService.inicializarDeterminativa();
        this.ejercicioAnterior.setearAlquileresCondominosEjercicioAnterior();
        setTimeout(() => {
          if (this.siguiente === 'tabCondominios') {
            this.component1.inicializarComponente();
            this.calcularMontoCasillas();
            this.corregirDataPersonalizadoCasilla350();
            SessionStorage.setErroresInfo([]);
            SessionStorage.setErroresDetEstados([]);
            SessionStorage.setErroresDet([]);
            SessionStorage.setErroresBackend([]);
            this.chatErrorService.enviarMensaje([], false);
          }
        }, 50);
        this.spinner.hide();
      });
  }

  private crearManejadorDeTab(): HandlerTabs {
    const lista: Array<Tab> = Array.of<Tab>(
      // tslint:disable-next-line: no-use-before-declare
      new Tab('tabTipoDeclaracion', this.disabledTabTipoDeclaracion),
      // tslint:disable-next-line: no-use-before-declare
      new Tab('tabCondominios', this.disabledTabCondomino),
      // tslint:disable-next-line: no-use-before-declare
      new Tab('tabAlquileresPagados', this.disabledTabAlquilerPagados),
      // tslint:disable-next-line: no-use-before-declare
      new Tab('tabAtribucionGastos', this.disabledTabGastos),
      // tslint:disable-next-line: no-use-before-declare
      new Tab('tabOtrosIngresos', this.disabledTabOtros)
    );
    // tslint:disable-next-line: no-use-before-declare
    return new HandlerTabs(lista);
  }

  public enabledTabCondomino(validarChkRentas: any): void {
    // this.disabledTabCondomino = val;
    this.disabledTabCondomino = !validarChkRentas.rentaP;
    this.disabledTabGastos = !validarChkRentas.rentaT;
    if (
      validarChkRentas.rentaP ||
      validarChkRentas.rentaS ||
      validarChkRentas.rentaT
    ) {
      this.disabledTabAlquilerPagados = false;
      this.disabledTabOtros = false;
    } else {
      this.disabledTabAlquilerPagados = true;
      this.disabledTabOtros = true;
    }
    this.actualizarEstadoHanderTab();
  }

  private actualizarEstadoHanderTab(): void {
    if (!!this.handlerTabs) {
      this.handlerTabs.setItemTab('tabCondominios', this.disabledTabCondomino);
      this.handlerTabs.setItemTab('tabAlquileresPagados', this.disabledTabAlquilerPagados);
      this.handlerTabs.setItemTab('tabAtribucionGastos', this.disabledTabGastos);
      this.handlerTabs.setItemTab('tabOtrosIngresos', this.disabledTabOtros);
    }
  }

  public abrirSelTipoReporPreliminar(): void {
    this.modalService.open(
      ModalReportePreliminarComponent,
      this.funcionesGenerales.getModalOptions({})
    );
  }

  public beforeChange($event): void {
    if (this.tab.activeId === 'tabTipoDeclaracion') {
      if (!this.validacionesService.validarTipoRenta() && !this.component1.validar()) {
        $event.preventDefault();
      } else {
        this.tabSiguiente($event);
      }
    } else if (this.tab.activeId === 'tabCondominios') {
      if (!this.validacionesService.validarCondominos()) {
        $event.preventDefault();
      } else {
        this.tabSiguiente($event);
      }
    } else {
      this.tabSiguiente($event);
    }
  }

  private tabSiguiente($event) {
    this.mostrarBtnanterior = $event.nextId !== 'tabTipoDeclaracion';
    this.siguiente = 'tabCondominios';
    switch ($event.nextId) {
      case 'tabTipoDeclaracion': {
        this.siguiente = 'tabCondominios';
        break;
      }
      case 'tabCondominios': {
        this.siguiente = 'tabAlquileresPagados';
        break;
      }
      case 'tabAlquileresPagados': {
        this.siguiente = 'tabAtribucionGastos';
        break;
      }
      case 'tabAtribucionGastos': {
        this.siguiente = 'tabOtrosIngresos';
        break;
      }
      case 'tabOtrosIngresos': {
        this.siguiente = 'tabOtrosIngresos';
        break;
      }
    }
  }

  public clickAnterior(): void {
    this.handlerTabs.anterior(this.tab.activeId, (tab) => {
      if (this.tab.activeId === 'tabCondominios') {
        if (!this.validacionesService.validarCondominos()) {
          return false;
        } else {
          this.tab.select(tab.id);
        }
      }
      this.tab.select(tab.id);
    });
  }

  public clickSiguiente(): void {
    this.handlerTabs.sigiente(this.tab.activeId, (tab, isUltimo) => {
      if (this.tab.activeId === 'tabTipoDeclaracion') {        
        if (!this.validacionesService.validarTipoRenta() && !this.component1.validar()) {
          return false;
        } else {
          this.tab.select(tab.id);
        }
      } else if (this.tab.activeId === 'tabCondominios') {
        if (!this.validacionesService.validarCondominos()) {
          return false;
        } else {
          this.tab.select(tab.id);
        }
      } else if (isUltimo) {
        if (!this.validacionesService.validarInformativa()) {
          return false;
        } else {
          this.router.navigate([Rutas.NATURAL_DETERMINATIVA]);
        }
      } else {
        this.tab.select(tab.id);
      }
    });
  }

  public validateTab(): void {
    if(!this.validacionesService.validarInformativa()) {
      event.preventDefault();
    } else {
      this.router.navigate([Rutas.NATURAL_DETERMINATIVA]);
    }
  }

  private calculoRentaPrimera(): void {
    this.resumenPrimera = this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera = CalcularMontosCasillaRentaPrimera.newInstance(
      this.resumenPrimera
    ).getMontosCalculados();
  }

  private calculoRentaSegunda(): void {
    this.resumenSegunda = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda = CalcularMontosCasillaRentaSegunda.newInstance(
      this.resumenSegunda
    ).getMontosCalculados();
  }

  private calculoRentaTrabajo(): void {
    this.resumenTrabajo = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo = CalcularMontosCasillaRentaTrabajo.newInstance(
      this.resumenTrabajo
    ).getMontosCalculados();
  }
}

class HandlerTabs {
  constructor(private lista: Array<Tab>) { }

  get listaTab() {
    return this.lista;
  }

  // tslint:disable-next-line: ban-types
  public sigiente(id: string, listen: Function) {
    const list: Array<Tab> = this.listaTab.filter((e) => e.estado === false);
    const index = list.findIndex((e) => e.id === id);
    const tabSiguiente = list[index + 1];
    // if (!!tabSiguiente || this.esUltimo(id) === true) {
    listen(tabSiguiente, this.esUltimo(id), this.tieneTipoRenta());
    // }
  }

  // tslint:disable-next-line: ban-types
  public anterior(id: string, listen: Function) {
    const list: Array<Tab> = this.listaTab.filter((e) => e.estado === false);
    const index = list.findIndex((e) => e.id === id);
    const tabAnterior = list[index - 1];
    if (!!tabAnterior) {
      listen(tabAnterior);
    }
  }

  private esUltimo(id: string): boolean {
    return this.listaTab.findIndex((e) => e.id === id) === this.listaTab.length - 1;
  }

  private tieneTipoRenta(): boolean {
    return this.listaTab.filter((e) => e.estado === false).length === 1;
  }

  setItemTab(id: string, value: boolean): void {
    const index = this.listaTab.findIndex((e) => e.id === id);
    this.lista[index].estado = value;
  }
}

class Tab {
  constructor(public id: string, public estado: boolean) { }
  setEstado(estado: boolean): void {
    this.estado = estado;
  }
}
