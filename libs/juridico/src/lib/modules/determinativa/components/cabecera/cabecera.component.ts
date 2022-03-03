import { AbrirModalService, DevolucionService, ModalConfirmarService, PagosPreviosService, PredeclaracionService as Pdservice } from '@rentas/shared/core';
import { ConstantesIdentificacion } from './../../../../utils/constantesIdentificacion';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalReportePreliminarComponent } from '@path/juridico/report-center/tipo-reporte-preliminar/tipo-reporte-preliminar.component';
import { DeterminaDeudaComponent } from '../determina-deuda/determina-deuda.component';
import { PreDeclaracionModel } from '@path/juridico/models/preDeclaracionModel';
import { Observable, of, EMPTY, throwError } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { ValidacionesService } from '@path/juridico/services/validaciones.service';
import { PasarelaPagosService } from '@path/juridico/services/pasarela-pagos.service';
import { EjercicioAnteriorService } from '@path/juridico/services/ejercicio-anterior.service';
import { InicializadorService } from '@path/juridico/services/inicializadorService.service';
import { MensajeGenerales, Rutas } from '@rentas/shared/constantes';
import { DevolucionPlataforma, Formulario, FraccionamientoPlataforma, ParametrosConstancia, PlataformaPresentacion, TipoPagoPresentacion } from '@rentas/shared/types';
import { FactoryPresentacionUitl, FraccionamientoFactoryUtil, SessionStorage } from '@rentas/shared/utils';
import { ChatErrorService, ErroresService, DispositivoService } from '@rentas/shared/core';
import { FormulasService } from '@path/juridico/services/formulas.service';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';

@Component({
  selector: 'app-cabecerasecdet',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css'],
})
export class CabeceraSecDeterminativaComponent implements OnInit {

  public pathInformativa = `/${Rutas.JURIDICO_INFORMATIVA}`;
  public btnValidar = false;
  public btnPresentarPagar = false;
  public btnAnterior = false;
  public btnSiguiente = true;
  private siguientePadre = 'tabImpuestoRenta';
  private anteriorPadre: string;
  private siguienteHijo = 'tabPasivoPatrimonio';
  private anteriorHijo: string;
  private primerTabPadre = true;
  private ultimoTabHijo = false;
  @ViewChild('tabPadre', { static: false }) tabPadre;
  @ViewChild('tabHijo', { static: false }) tabHijo;
  @ViewChild(DeterminaDeudaComponent, { static: false }) determinacion: DeterminaDeudaComponent;
  private ipCliente: string;
  private tabHijoActual = '';
  public formulario: Formulario;
  public ayuda: string;
  public anioRenta = '';

  constructor(
    private abrirModalService: AbrirModalService,
    private modalMensejaService: ModalConfirmarService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dispositivoService: DispositivoService,
    private pasarelaPagosService: PasarelaPagosService,
    private preDeclaracionService: PreDeclaracionService,
    private validacionesService: ValidacionesService,
    private errorChat: ChatErrorService,
    private inicializadorService: InicializadorService,
    private ejercicioAnteriorService: EjercicioAnteriorService,
    private pagosPreviosService: PagosPreviosService,
    private erroresService: ErroresService,
    private pdService: Pdservice,
    private devolucionService: DevolucionService,
    public fs: FormulasService,
  ) { }

  ngOnInit(): void {
    this.formulario = SessionStorage.getFormulario();
    this.ayuda = this.formulario.ayudas.find(e => e.codAyuda === '002').uri;
    this.anioRenta = this.preDeclaracionService.obtenerNumeroEjercicio();
    this.fs.inicializarMontos();

    this.dispositivoService
      .getIp()
      .pipe(tap((ip) => (this.ipCliente = ip)))
      .subscribe();
    setTimeout(() => {
      this.mensajeDeterminativa();
    }, 100);

    this.revisarErroresSesion(null);
  }

  private mensajeDeterminativa(): void {
    const RMT = SessionStorage.getAnexo5();
    if (RMT && String(this.fs.casInformativa.mtoCas213) !== ConstantesIdentificacion.REGIMEN_MYPE) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.mensajeMYPEDet.replace('AAAA', this.anioRenta), 'Mensaje');
    } else {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.mensajeDeterminativa, 'Mensaje');
    }
  }

  private validarPreDeclaracion(): Observable<any> {
    return this.pdService.validarPD()
      .pipe(
        catchError((error) => {
          this.spinner.hide();
          if (error?.error?.errors) {
            SessionStorage.setErroresBackend([]);
            this.revisarErroresSesion(error);
            const listaErrores = this.erroresService.obtenerListaErrorMensaje(error);
            this.erroresService.mostrarModalError(listaErrores);
          }
          return EMPTY;
        })
      )
  }

  private revisarErroresSesion(error: null): void {
    let arregloErrores = [];
    arregloErrores = arregloErrores.concat(this.validacionesService.errorsArrayObjDet);
    arregloErrores = arregloErrores.concat(this.validacionesService.errorsArrayObjInfo);
    if (error != null && error != undefined) {
      const listaErrores = this.erroresService.obtenerListaErrorMensaje(error);
      SessionStorage.setErroresBackend(listaErrores);
    }
    const arregloErroresBackend = SessionStorage.getErroresBackend();

    if (arregloErroresBackend != null && arregloErroresBackend !== undefined) {
      arregloErrores = arregloErrores.concat(arregloErroresBackend)
    }

    if (arregloErrores.length !== 0 && arregloErrores != null && (arregloErrores !== []) !== undefined) {
      this.errorChat.enviarMensaje(arregloErrores, true);
    } else {
      this.errorChat.enviarMensaje(arregloErrores, false);
    }
  }

  public abrirSelTipoRepModal(): void {
    this.abrirModalService.abrirModal(ModalReportePreliminarComponent);
  }

  public beforeChange($event): void {
    if (!this.validacionesService.validarEstadosFinancieros() &&
      $event.activeId === 'tabEstadosFinancieros'
    ) {
      this.anteriorPadre = 'tabEstadosFinancieros';
      this.siguientePadre = 'tabImpuestoRenta';
      this.primerTabPadre = true;
      this.ultimoTabHijo = false;
      switch (this.tabHijoActual) {
        case 'tabActivo': {
          this.btnAnterior = false;
          this.btnSiguiente = true;
          this.btnValidar = false;
          this.btnPresentarPagar = false;
          this.anteriorHijo = 'tabActivo';
          this.siguienteHijo = 'tabPasivoPatrimonio';
          break;
        }
        case 'tabPasivoPatrimonio': {
          this.btnAnterior = true;
          this.btnSiguiente = true;
          this.btnValidar = false;
          this.btnPresentarPagar = false;
          this.anteriorHijo = 'tabActivo';
          this.siguienteHijo = 'tabEstadoGanancia';
          break;
        }
        case 'tabEstadoGanancia': {
          this.btnAnterior = true;
          this.btnSiguiente = true;
          this.btnValidar = false;
          this.btnPresentarPagar = false;
          this.anteriorHijo = 'tabPasivoPatrimonio';
          this.siguienteHijo = 'tabEstadoGanancia';
          this.ultimoTabHijo = true;
          break;
        }
      }
      $event.preventDefault();
    } else {
      this.anteriorHijo = 'tabActivo';
      this.siguienteHijo = 'tabPasivoPatrimonio';
      this.primerTabPadre = false;
      this.ultimoTabHijo = false;
      switch ($event.nextId) {
        case 'tabEstadosFinancieros': {
          this.btnAnterior = false;
          this.btnSiguiente = true;
          this.btnValidar = false;
          this.btnPresentarPagar = false;
          this.anteriorPadre = 'tabEstadosFinancieros';
          this.siguientePadre = 'tabImpuestoRenta';
          this.primerTabPadre = true;
          break;
        }
        case 'tabImpuestoRenta': {
          this.btnAnterior = true;
          this.btnSiguiente = true;
          this.btnValidar = false;
          this.btnPresentarPagar = false;
          this.anteriorPadre = 'tabEstadosFinancieros';
          this.siguientePadre = 'tabCContraImpRenta';
          break;
        }
        case 'tabCContraImpRenta': {
          this.btnAnterior = true;
          this.btnSiguiente = true;
          this.btnValidar = false;
          this.btnPresentarPagar = false;
          this.anteriorPadre = 'tabImpuestoRenta';
          this.siguientePadre = 'tabDeterminacionDeuda';
          break;
        }
        case 'tabDeterminacionDeuda': {
          this.btnAnterior = true;
          this.btnSiguiente = false;
          this.btnValidar = true;
          this.btnPresentarPagar = true;
          this.anteriorPadre = 'tabCContraImpRenta';
          this.siguientePadre = 'tabBalanceComprobacion';
          break;
        }
      }
    }
  }

  public childbeforeChange($event): void {

    this.tabHijoActual = $event.nextId;
    this.anteriorPadre = 'tabEstadosFinancieros';
    this.siguientePadre = 'tabImpuestoRenta';
    this.primerTabPadre = true;
    this.ultimoTabHijo = false;
    switch ($event.nextId) {
      case 'tabActivo': {
        this.btnAnterior = false;
        this.btnSiguiente = true;
        this.btnValidar = false;
        this.btnPresentarPagar = false;
        this.anteriorHijo = 'tabActivo';
        this.siguienteHijo = 'tabPasivoPatrimonio';
        break;
      }
      case 'tabPasivoPatrimonio': {
        this.btnAnterior = true;
        this.btnSiguiente = true;
        this.btnValidar = false;
        this.btnPresentarPagar = false;
        this.anteriorHijo = 'tabActivo';
        this.siguienteHijo = 'tabEstadoGanancia';
        break;
      }
      case 'tabEstadoGanancia': {
        this.btnAnterior = true;
        this.btnSiguiente = true;
        this.btnValidar = false;
        this.btnPresentarPagar = false;
        this.anteriorHijo = 'tabPasivoPatrimonio';
        this.siguienteHijo = 'tabEstadoGanancia';
        this.ultimoTabHijo = true;
        break;
      }
    }
  }

  public clickAnterior(): void {
    if (!this.primerTabPadre) {
      this.tabPadre.select(this.anteriorPadre);
      this.anteriorHijo = 'tabActivo';
      if (
        this.anteriorPadre === 'tabEstadosFinancieros' &&
        this.siguientePadre === 'tabImpuestoRenta'
      ) {
        setTimeout(() => {
          this.tabHijo.select('tabEstadoGanancia');
        }, 50);
      }
      this.siguienteHijo = 'tabPasivoPatrimonio';
    } else {
      this.tabHijo.select(this.anteriorHijo);
      this.anteriorPadre = 'tabEstadosFinancieros';
      this.siguientePadre = 'tabImpuestoRenta';
    }
  }

  public clickSiguiente(): void {
    if (this.primerTabPadre && !this.ultimoTabHijo) {
      this.tabHijo.select(this.siguienteHijo);
      this.anteriorPadre = 'tabEstadosFinancieros';
      this.siguientePadre = 'tabImpuestoRenta';
    } else {
      if (!this.validacionesService.validarEstadosFinancieros()) {
        return;
      }
      this.tabPadre.select(this.siguientePadre);
      this.anteriorHijo = 'tabActivo';
      this.siguienteHijo = 'tabPasivoPatrimonio';
    }
  }

  public bloquearTeclas(event): void {
    event.preventDefault();
  }

  public guardarDeclaracion(cumple: boolean) {
    return cumple ? this.pdService.guardar() : this.never();
  }

  public empty(): Observable<never> {
    this.spinner.hide();
    return EMPTY;
  }

  public clickValidar(): void {
    this.spinner.show();

    this.siCumpleValidarFormulario().pipe(
      switchMap((cumple) =>
        cumple ? this.pdService.guardar() : this.empty()
      ),
      switchMap(() => this.validarPreDeclaracion()),
    ).subscribe(() => {
      this.spinner.hide();
      this.modalMensejaService.msgConfirmar('Usted Puede Presentar y Pagar');
      SessionStorage.setErroresBackend([]);
    });

  }

  public presentarPague(): void {
    const esPagoCero = this.obtenerCantidadApagar() === 0;
    this.spinner.show();
    this.pagosPreviosService.verificarPagoEnProceso()
      .pipe(
        tap(() => this.spinner.hide()),
        switchMap(() => this.modalMensejaService.msgPresentarPagarForm(esPagoCero)),
        switchMap((dioAceptar) =>
          dioAceptar ? this.siCumpleValidarFormulario() : EMPTY
        ),
        switchMap((cumple) => (cumple ? this.validarYGuardar() : this.never())),
        switchMap(() => this.obtenerCantidades()),
        switchMap((monto) =>
          monto === 0
            ? this.presentarPagar().pipe(
              tap((resp) => this.irConstancia(monto, resp))
            )
            : this.parametriaPasarela().pipe(
              tap((resp) => this.irPasarela(monto, resp))
            )
        ),
        catchError((error) => {
          this.spinner.hide();
          if (this.erroresService.esErrorPagoEnProceso(error)) {
            this.modalMensejaService.msgErrorPagoEnProceso(error);
          } else {
            this.erroresService.mostarModalError(error);
          }
          return throwError(error);
        })
      )
      .subscribe();
  }

  private parametriaPasarela(): Observable<any> {
    return this.pasarelaPagosService.parametriaPasarela();
  }

  private never(): Observable<never> {
    this.spinner.hide();
    return EMPTY;
  }

  private presentarPagar(): Observable<any> {

    const request = FactoryPresentacionUitl.newInstance(PlataformaPresentacion.JURIDICO)
      .setTipoPago(TipoPagoPresentacion.PAGOCERO)
      .setDireccionIP(this.ipCliente)
      .buildRequest();

    return this.pasarelaPagosService.presentarPagar(request);
  }

  private tieneFraccionamiento() {
    const uit = this.fs.comboService.obtenerUitEjercicioActual();
    return FraccionamientoFactoryUtil.newInstancia(FraccionamientoPlataforma.JURIDICO).tieneFraccionamiento(uit);
  }

  private irConstancia(monto: number, resp: any): void {
    this.spinner.hide();

    const paran: ParametrosConstancia = {
      respuesta: resp,
      tieneFrancionamiento: this.tieneFraccionamiento(),
      devoluciones: this.devolucionService.tieneDevolucion(DevolucionPlataforma.JURIDICO),
      monto
    }

    const navigationExtras: NavigationExtras = { state: paran };
    this.router.navigate([Rutas.JURIDICO_PAGO_CONSTANCIA], navigationExtras);
  }

  private irPasarela(
    nomtoApagar: number,
    response: any
  ): void {
    this.spinner.hide();
    const navigationExtras: NavigationExtras = {
      state: [response, nomtoApagar],
    };
    this.router.navigate([Rutas.JURIDICO_PAGO_PASARELA], navigationExtras);
  }

  private siCumpleValidarFormulario(): Observable<boolean> {
    let bol = false;
    if (!this.validarTabs()) {
      this.validacionesService.validarDeterminativa('tab');
      bol = this.validacionesService.errorsArrayObjDet.length === 0 && this.validacionesService.errorsArrayObjInfo.length === 0;
    } else {
      this.validacionesService.validarDeterminativa('');
      bol = this.validacionesService.errorsArrayObjDet.length === 0 && this.validacionesService.errorsArrayObjInfo.length === 0;
    }
    return of(bol);
  }

  private obtenerCantidades(): Observable<number> {
    return of(this.obtenerCantidadApagar());
  }

  private obtenerCantidadApagar(): number {
    let monto = 0;
    if (!this.validarTabs()) {
      monto = !!this.determinacion.fs.casDetDeudaPJ.mtoCas180
        ? this.determinacion.fs.casDetDeudaPJ.mtoCas180
        : 0;
    } else {
      monto = 0;
    }
    return Number(monto.toString());
  }

  private validarYGuardar(): Observable<any> {
    this.spinner.show();
    return this.pdService.guardar()
      .pipe(switchMap(() => this.validarPreDeclaracion()));
  }

  public validarTabs(): boolean {
    return (Number(this.fs.casInformativa.mtoCas217) === Number(ConstantesIdentificacion.INAFECTO_SI) &&
      this.tabHijoActual === 'tabEstadoGanancia');
  }

  public resetearPd(): void {
    this.spinner.show();
    this.pdService
      .validarReestablecer()
      .pipe(
        catchError((error) => {
          this.modalMensejaService.msgValidaciones(error.error.errors[0].msg, 'Mensaje');
          this.spinner.hide();
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.spinner.hide();
        const mensajeModal =
          Number(SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.generales.cabecera.indRectificatoria) === 0
            ? MensajeGenerales.reseterPD_Original
            : MensajeGenerales.resetearPD_Rectificatoria;
        this.modalMensejaService.msgConfirmar(mensajeModal).subscribe((result) => {
          if (result === 'SI') {
            this.resetearPdEndpoint();
            SessionStorage.setErroresInfo([]);
            SessionStorage.setErroresDetEstados([]);
            SessionStorage.setErroresDet([]);
            this.revisarErroresSesion(null);
          }
        });
      });
  }

  private resetearPdEndpoint(): void {
    this.spinner.show();
    this.pdService
      .reestablecerPersonalizado()
      .pipe(
        catchError((error) => {
          this.erroresService.mostarModalError(error);
          this.spinner.hide();
          return throwError(error);
        })
      )
      .subscribe((data) => {
        SessionStorage.setPreDeclaracion(data);
        this.inicializadorService.inicializarInformativa();
        this.inicializadorService.inicializarDeterminativa();
        this.ejercicioAnteriorService.cargarDataEjercicioAnterior();
        this.router.navigate([Rutas.JURIDICO_INFORMATIVA]);
        this.spinner.hide();
      });
  }
}
