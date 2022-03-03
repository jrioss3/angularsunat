import { EjercicioAnterior } from '@path/natural/services/ejercicio-anterior.services';
import { OnInit, Component, ViewChild } from '@angular/core';
import { NgbTabChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationExtras } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalReportePreliminarComponent } from '@path/natural/report-center/tipo-reporte-preliminar/tipo-reporte-preliminar.component';
import { Observable, of, EMPTY, throwError, empty } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { PreDeclaracionModel } from '@path/natural/models';
import { PreDeclaracionService, PasarelaPagosService, InicializadorService } from '@path/natural/services';
import { ConstantesExcepciones, ConstantesMensajesInformativos } from '@path/natural/utils';
import { ErrorListComponent, UtilsComponent } from '@path/natural/components';
import { ValidacionesService } from '@path/natural/services/validacionesService';
import { MensajeValidacionAnexoComponent } from '../mensaje-validacion-anexo/mensaje-validacion-anexo.component';
import { MensajeGenerales, Rutas } from '@rentas/shared/constantes';
import { ParametrosConstancia, Formulario, PlataformaPresentacion, TipoPagoPresentacion } from '@rentas/shared/types';
import { SessionStorage, FuncionesGenerales } from '@rentas/shared/utils';
import { FactoryPresentacionUitl } from '@rentas/shared/utils';
import {
  DispositivoService,
  ChatErrorService,
  ErroresService,
  ModalConfirmarService,
  PagosPreviosService,
  PredeclaracionService as Pdservice,
  MensUnaVezService
} from '@rentas/shared/core';
import { saveAs } from 'file-saver';
import { UserData } from '@rentas/shared/types';
import { MostrarMensajeService } from '@path/natural/services/mostrarMensaje.service';


@Component({
  selector: 'app-cabecerasecdet',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css'],
})
export class CabeceraSecDeterminativaComponent implements OnInit {
  public anioRenta = '';
  public mostrarBtnAnterior = false;
  public mostrarBtnSiguiente = false;
  public mostrarBtnValidar = false;
  public mostrarBtnPresentarPagar = false;
  private preDeclaracion: PreDeclaracionModel;
  public formularioCabecera: Formulario;
  public rentas: any;
  private handlerTab: HandlerTabs;
  private cabeceraFormularioSeleccionado: any;
  public linkAyuda: string;
  private funcionesGenerales: FuncionesGenerales;
  private ctrlModalError;

  @ViewChild('tab') tab;
  private ipCliente: string;

  public pathInformativa = `/${Rutas.NATURAL_INFORMATIVA}`;
  constructor(
    public router: Router,
    public predeclaracionService: PreDeclaracionService,
    public modalService: NgbModal,
    public pasrelaPagosService: PasarelaPagosService,
    public dispositivoService: DispositivoService,
    public spiner: NgxSpinnerService,
    private errorChat: ChatErrorService,
    private inicializadorService: InicializadorService,
    private validacionesService: ValidacionesService,
    private ejercicioAnterior: EjercicioAnterior,
    private pagosPreviosService: PagosPreviosService,
    private msgConfirmar: ModalConfirmarService,
    private erroresService: ErroresService,
    private pdservice: Pdservice,
    private mensUnaVezService: MensUnaVezService,
    private mostrarMensaje: MostrarMensajeService
  ) {}

  ngOnInit(): void {

    this.rentas = JSON.parse(sessionStorage.getItem('rentas'));
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.formularioCabecera = SessionStorage.getFormulario<Formulario>();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.linkAyuda = this.formularioCabecera.ayudas.find(e => e.codAyuda === '002').uri;

    this.cabeceraFormularioSeleccionado = SessionStorage.getCabeceraFormSele();

    this.anioRenta = this.predeclaracionService.obtenerAnioEjercicio();
    this.mostrarBtnAnterior = false;
    this.mostrarBtnSiguiente = true;
    this.mostrarBtnValidar = false;
    this.mostrarBtnPresentarPagar = false;
    this.handlerTab = this.intanciarHandlerTab();
    const primertabActivo = this.handlerTab.primerActivo();
    setTimeout(() => this.tab.select(primertabActivo.id), 100);

    this.dispositivoService.getIp()
      .pipe(tap((ip) => (this.ipCliente = ip)))
      .subscribe();
    this.ctrlModalError = 1;
    this.revisarErroresSesion(null);
    
    if(this.mensUnaVezService.getDtmMostrarMensaje()) {
      this.mensUnaVezService.setDtmMostrarMensaje(false);
      setTimeout(() => this.validarDeclaracionesInconsistentes(), 100);
    }
  }

  private revisarErroresSesion(error:null): void {
    const arregloErroresListaInformativa = SessionStorage.getErroresInfo();
    const arregloErroresListaDeterminativa = SessionStorage.getErroresDet();
    const arregloErroresDeterminativaEstados = SessionStorage.getErroresDetEstados();
    const arregloErroresBackend = SessionStorage.getErroresBackend();
    
    let arregloErrores = [];
    if(error != null && error !== undefined){
      const listaErrores = this.erroresService.obtenerListaErrorMensaje(error);
      SessionStorage.setErroresBackend(listaErrores);
      arregloErrores = arregloErrores.concat(listaErrores);
    }
    if (arregloErroresListaInformativa != null && arregloErroresListaInformativa !== undefined) {
      arregloErrores = arregloErrores.concat(arregloErroresListaInformativa);
    }
    if (arregloErroresListaDeterminativa != null && arregloErroresListaDeterminativa !== undefined) {
      arregloErrores = arregloErrores.concat(arregloErroresListaDeterminativa);
    }
    if (arregloErroresDeterminativaEstados != null && arregloErroresDeterminativaEstados !== undefined) {
      arregloErrores = arregloErrores.concat(arregloErroresDeterminativaEstados);
    }
    if(
      arregloErroresBackend != null &&
      arregloErroresBackend !== undefined
    ){
      arregloErrores = arregloErrores.concat(arregloErroresBackend)
    }
    if (arregloErrores.length !== 0 && arregloErrores != null && (arregloErrores !== []) !== undefined) {
      this.errorChat.enviarMensaje(arregloErrores, true);
      // const listaErrores = this.erroresService.obtenerListaErrorMensaje(error);
      if(this.ctrlModalError!= 1){
        this.erroresService.mostrarModalError(arregloErrores);
      }
    } else {
      this.errorChat.enviarMensaje(arregloErrores, false);
    }
  }

  public MostrarConfirmacion(): Observable <String>{
    this.spiner.hide();
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
    this.spiner.show();
    this.pdservice.validarPersonalizado().pipe(
      switchMap(data => this.MostrarConfirmacion()),
      tap(respuesta => respuesta === 'si' ? this.resetearPdEndpoint() : EMPTY),
      catchError((error) => {
        if(error.status == "422"){
          this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_NO_HAY_REGISTROS_ARCHIVO_PERSONALIZADO);
        }else{
          this.erroresService.mostarModalError(error);
        }
        this.spiner.hide();
        return throwError(error);
      })
    ).subscribe();
  }

  private resetearPdEndpoint(): void {
    this.spiner.show();
    this.pdservice
      .reestablecerPersonalizado()
      .subscribe((data) => {
        SessionStorage.setPreDeclaracion(data);
        this.inicializadorService.inicializarInformativa();
        this.inicializadorService.inicializarDeterminativa();
        this.ejercicioAnterior.setearAlquileresCondominosEjercicioAnterior();
        SessionStorage.setErroresInfo([]);
        SessionStorage.setErroresDetEstados([]);
        SessionStorage.setErroresDet([]);
        SessionStorage.setErroresBackend([]);
        this.errorChat.enviarMensaje([], false);
        this.router.navigate([Rutas.NATURAL_INFORMATIVA]);
        this.spiner.hide();
      });
  }

 /*private handlerError_reset(error): Observable<any>{
    this.spiner.hide();    
    
    if(error.status == "422"){
      this.mostrarMensaje.callModal("Sr. Contribuyente, no cuenta con información del archivo personalizado");
    }
    return throwError(error);
  }*/

  private intanciarHandlerTab(): HandlerTabs {
    // tslint:disable-next-line: no-use-before-declare
    return new HandlerTabs(
      Array.of<Tab>(
        // tslint:disable-next-line: no-use-before-declare
        new Tab('tabRentaPrimeraCategoria', !this.rentas.rentaP),
        // tslint:disable-next-line: no-use-before-declare
        new Tab('tabRentaSegundaCategoria', !this.rentas.rentaS),
        // tslint:disable-next-line: no-use-before-declare
        new Tab('tabFuenteExtranjera', !this.rentas.rentaT),
        // tslint:disable-next-line: no-use-before-declare
        new Tab('tabDeterminacion', false)
      )
    );
  }

  public beforeChange($event): void {
    switch ($event.nextId) {
      case 'tabRentaPrimeraCategoria': {
        this.mostrarBtnAnterior = false;
        this.mostrarBtnSiguiente = true;
        this.mostrarBtnValidar = false;
        this.mostrarBtnPresentarPagar = false;
        break;
      }
      case 'tabRentaSegundaCategoria': {
        this.mostrarBtnAnterior = true;
        this.mostrarBtnSiguiente = true;
        this.mostrarBtnValidar = false;
        this.mostrarBtnPresentarPagar = false;
        break;
      }
      case 'tabFuenteExtranjera': {
        this.mostrarBtnAnterior = true;
        this.mostrarBtnSiguiente = true;
        this.mostrarBtnValidar = false;
        this.mostrarBtnPresentarPagar = false;
        break;
      }
      case 'tabDeterminacion': {
        this.mostrarBtnAnterior = true;
        this.mostrarBtnSiguiente = false;
        this.mostrarBtnValidar = true;
        this.cabeceraFormularioSeleccionado.esPresentacion
          ? this.mostrarBtnPresentarPagar = true
          : this.mostrarBtnPresentarPagar = false
        break;
      }
    }
  }

  private handlerError(error): Observable<any>{
    this.spiner.hide();    
    
    if(error.status == "422"){
      this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_NO_HAY_REGISTROS_ARCHIVO_PERSONALIZADO);
    }
    return throwError(error);
  }

  public descargarPd(): void {    
    this.spiner.show();
    let userDatos: UserData;
    userDatos = SessionStorage.getUserData();//userDatos.numRUC , this.anioRenta
    

    this.predeclaracionService.descargarPersonalizado(userDatos.numRUC,this.anioRenta).pipe(catchError((error) => this.handlerError(error)))
    .subscribe(respuesta => {      
      const blob = new Blob([respuesta.content],{ type: "application/zip"});
      saveAs(blob, respuesta.nameFile);
      this.spiner.hide();
    },error => {
      console.log(error)
      this.spiner.hide()      
      //this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_NO_HAY_REGISTROS_ARCHIVO_PERSONALIZADO)
    } , () => this.spiner.hide());
  }

  public abrirSelTipoReporPreliminar(): void {    
    this.modalService.open(
      ModalReportePreliminarComponent,
      this.funcionesGenerales.getModalOptions({})
    );
  }

  private validarPreDeclaracion(): Observable<any> {
    this.ctrlModalError = 0;
    return this.predeclaracionService
      .validarPD()
      .pipe(
        catchError((error) => {
          if(error?.error?.errors){
            SessionStorage.setErroresBackend([]);
            this.revisarErroresSesion(error);
          }
          this.spiner.hide();
          return EMPTY; // throwError(error);
        })
      )
  }

  public clickAnterior(): void {
    this.handlerTab.anterior(this.tab.activeId, (tab) => {
      this.tab.select(tab.id);
    });
  }

  public clickSiguiente(): void {
    this.handlerTab.sigiente(this.tab.activeId, (tab) => {
      this.tab.select(tab.id);
    });
  }

  public clickValidar(): void {
    this.validacionesService.bttnvalidarAction();

    if (
      !this.validacionesService.erroresPrimera &&
      !this.validacionesService.erroresSegunda &&
      !this.validacionesService.erroresTrabajo &&
      !this.validacionesService.erroresInformativa
    ) {
      // Mandar guardar
      this.spiner.show();
      this.guardarDeclaracionAndValidarPd().subscribe(() => {
        this.spiner.hide();
        SessionStorage.setErroresBackend([]);
        this.validacionesService.callModal(ConstantesExcepciones.CUS17_EX19);
      }, () => this.spiner.hide());
    }
  }

  public presentar(): void {
    this.spiner.show();
    const esPagocero = !this.predeclaracionService.validarMontoRentaMayorCero();
    this.pagosPreviosService.verificarPagoEnProceso()
      .pipe(
        tap(() => this.spiner.hide()),
        switchMap(() => this.msgConfirmar.msgPresentarPagarForm(esPagocero)),
        switchMap((dioAceptar) =>
          dioAceptar
            ? this.pasaElFormulario().pipe(tap(() => this.spiner.show()))
            : EMPTY
        ),
        switchMap((valido) =>
          valido === true ? this.guardarDeclaracionAndValidarPd() : this.never()
        ),
        switchMap(() => this.obtenerCantidades()),
        switchMap((montoPagar) =>
          montoPagar === 0
            ? this.presentarPagar().pipe(
              tap((resp) => this.irConstancia(montoPagar, resp))
            )
            : this.parametriaPasarela().pipe(
              tap((resp) => this.irPasarela(montoPagar, resp))
            )
        ),
        catchError((error) => {
          this.spiner.hide();
          if (this.erroresService.esErrorPagoEnProceso(error)) {
            this.msgConfirmar.msgErrorPagoEnProceso(error);
          } else {
            this.erroresService.mostarModalError(error);
          }
          return throwError(error);
        })
      )
      .subscribe();
  }

  private never(): Observable<never> {
    this.spiner.hide();
    return EMPTY;
  }

  private hideSpiner(resp?: any): void {
    this.spiner.hide();
  }

  private irConstancia(monto: number, response: any): void {
    this.hideSpiner();

    const paran: ParametrosConstancia = {
      respuesta: response,
      tieneFrancionamiento: this.predeclaracionService.fraccionamiento(),
      devoluciones: this.predeclaracionService.devolucion(),
      monto
    }

    const navigationExtras: NavigationExtras = { state: paran };
    this.router.navigate([Rutas.NATURAL_PAGO_CONSTANCIA], navigationExtras);
  }

  private irPasarela(
    nomtoApagar: number,
    response: any
  ): void {
    this.hideSpiner();
    const navigationExtras: NavigationExtras = {
      state: [response, nomtoApagar, this.obtenerMontos()],
    };
    this.router.navigate([Rutas.NATURAL_PAGO_PASARELA], navigationExtras);
  }

  private pasaElFormulario(): Observable<boolean> {
    this.validacionesService.bttnvalidarAction();
    const bol =
      this.validacionesService.erroresPrimera ||
      this.validacionesService.erroresSegunda ||
      this.validacionesService.erroresTrabajo ||
      this.validacionesService.erroresInformativa;
    return of(!bol);
  }

  private guardarDeclaracionAndValidarPd(): Observable<any> {
    return this.predeclaracionService.guardarDeclaracion().pipe(
      switchMap(() => this.validarPreDeclaracion())
      // catchError( error => of())
    );
  }

  private obtenerCantidades(): Observable<number> {
    const montoPagar = this.obtenerCantidadApagar();
    return of(montoPagar);
  }

  private presentarPagar(): Observable<any> {

    const request = FactoryPresentacionUitl.newInstance(PlataformaPresentacion.NATURAL)
      .setTipoPago(TipoPagoPresentacion.PAGOCERO)
      .setDireccionIP(this.ipCliente)
      .buildRequest();

    return this.pasrelaPagosService.presentarPagar(request);
  }

  private parametriaPasarela(): Observable<any> {
    return this.pasrelaPagosService.parametriaPasarela();
  }

  private obtenerCantidadApagar(): number {
    const montoPagar = this.obtenerMontos().reduce((carry, e) => carry + e.monto, 0);
    return montoPagar;
  }

  private obtenerMontos(): Array<{ activo: boolean; monto: number }> {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    const c166 = this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera
      .resumenPrimera.mtoCas166;
    const c366 = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda
      .resumenSegunda.mtoCas366;
    const c168 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo
      .resumenTrabajo.mtoCas168;
    const montos = Array.from([
      { activo: this.validacionesService.isActivo523(), monto: c166 },
      { activo: this.validacionesService.isActivo524(), monto: c366 },
      { activo: this.validacionesService.isActivo525(), monto: c168 },
    ]);

    return montos
      .filter((e) => e.activo)
      .map((e) => ({ ...e, monto: !!!e.monto ? 0 : Number(e.monto.toString()) }));
  }

  private validarDeclaracionesInconsistentes(): void {
    const numRUC = this.predeclaracionService.obtenerRucPredeclaracion();
    const numDNI = numRUC.length === 11 ? numRUC.substring(2, 10) : numRUC;
    const periodo = Number(this.predeclaracionService.obtenerAnioEjercicio());
    const codTrib = '030502';
    const codOrigInconsistencia = '01';
    const mensajeDeclaIncos = [];

    mensajeDeclaIncos.push(ConstantesMensajesInformativos.MSJ_DECLARACIONES_INCONSISTENTE_PARRAFO_1.replace('{year}', this.anioRenta));
    mensajeDeclaIncos.push(ConstantesMensajesInformativos.MSJ_GRABADO_AUTOMATICO);
    mensajeDeclaIncos.push(ConstantesMensajesInformativos.MSJ_DECLARACIONES_INCONSISTENTE_PARRAFO_2);

    this.openModalInicial()
      .pipe(
        switchMap((resp) =>
          resp === 'si'
            ? this.consultaBirta(
              numDNI,
              periodo,
              codTrib,
              codOrigInconsistencia,
              mensajeDeclaIncos
            )
            : EMPTY
        )
      )
      .subscribe(
        () => { },
        () => {
          this.consultaEsPersonalizado()
            .pipe(
              tap((resp) =>
                resp ? this.mensajePersonalizado() : this.mensajeNoPersonalizado()
              )
            )
            .subscribe();
        }
      );
  }

  private consultaBirta(
    numDNI,
    periodo,
    codTrib,
    codOrigInconsistencia,
    mensajeDeclaIncos
  ): Observable<any> {
    return this.predeclaracionService
      .consultaBirta('dni', numDNI, periodo, codTrib, codOrigInconsistencia)
      .pipe(
        switchMap(() => this.mensajeDeclaracionInconsistente(mensajeDeclaIncos)),
        switchMap((resp) =>
          resp === 'si' ? this.consultaEsPersonalizado() : EMPTY
        ),
        tap((resp) =>
          resp ? this.mensajePersonalizado() : this.mensajeNoPersonalizado()
        )
      );
  }

  private mensajeDeclaracionInconsistente(
    mensajeDeclaIncos: string[]
  ): Observable<any> {
    const modal = {
      titulo: 'Mensaje informativo',
      errorList: mensajeDeclaIncos,
    };
    const modalRef = this.modalService.open(
      MensajeValidacionAnexoComponent,
      this.funcionesGenerales.getModalOptions({ size: 'lg' })
    );
    modalRef.componentInstance.modal = modal;
    modalRef.componentInstance.tipoEstilo = 'S';
    return modalRef.componentInstance.respuesta;
  }

  private consultaEsPersonalizado(): Observable<boolean> {
    return Number(this.preDeclaracion.declaracion.generales.cabecera.indProceso) ===
      1
      ? of(true)
      : of(false);
  }

  private mensajePersonalizado(): void {
    const mensajePersonalizado = ConstantesMensajesInformativos.MSJ_BIRTA_PERSONALIZADO;
    const modal = {
      titulo: 'Mensaje informativo',
      mensaje: mensajePersonalizado,
    };
    const modalRef = this.modalService.open(
      UtilsComponent,
      this.funcionesGenerales.getModalOptions({})
    );
    modalRef.componentInstance.modal = modal;
  }

  private mensajeNoPersonalizado(): void {
    const mensajeNoPersonalizado = ConstantesMensajesInformativos.MSJ_BIRTA_NO_PERSONALIZADO.replace(/{year}/g, this.anioRenta);
    const modal = {
      titulo: 'Mensaje informativo',
      mensaje: mensajeNoPersonalizado,
    };
    const modalRef = this.modalService.open(
      UtilsComponent,
      this.funcionesGenerales.getModalOptions({})
    );
    modalRef.componentInstance.modal = modal;
  }

  private openModalInicial(): Observable<any> {
    const messageSomeLines = [];
    messageSomeLines.push(ConstantesMensajesInformativos.MSJ_INFORMACION_REFERENCIAL_RENTAS);
    messageSomeLines.push(ConstantesMensajesInformativos.MSJ_GRABADO_AUTOMATICO);
    return this.callModalSomeLines(messageSomeLines);
  }

  private callModalSomeLines(errorList1: string[]): Observable<any> {
    const modal = {
      titulo: 'Mensaje informativo',
      errorList: errorList1,
    };
    const modalRef = this.modalService.open(
      MensajeValidacionAnexoComponent,
      this.funcionesGenerales.getModalOptions({ size: 'lg' })
    );
    modalRef.componentInstance.modal = modal;
    modalRef.componentInstance.tipoEstilo = 'S';
    return modalRef.componentInstance.respuesta;
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
    if (!!tabSiguiente || this.esUltimo(id) === true) {
      listen(tabSiguiente, this.esUltimo(id));
    }
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

  public setItemTab(id: string, value: boolean): void {
    const index = this.listaTab.findIndex((e) => e.id === id);
    this.lista[index].estado = value;
  }

  public primerActivo(): Tab {
    return this.lista.filter((e) => e.estado === false)[0];
  }
}

class Tab {
  constructor(public id: string, public estado: boolean) { }

  setEstado(estado: boolean): void {
    this.estado = estado;
  }
}
