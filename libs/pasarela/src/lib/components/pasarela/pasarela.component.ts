import { Component, Inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DispositivoService, AutoGuardadoService, PagosPreviosService, DevolucionService, ComboService, ErroresService, ModalConfirmarService, PagosService, PopupVisaService } from '@rentas/shared/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { ConstantesPagos, Rutas } from '@rentas/shared/constantes';
import { NavigationExtras, Router } from '@angular/router';
import {
  PasarelaRespuesta,
  EntidadFinancieraRespuesta,
  MedioPago,
  ValidarPresentacionRespuesta,
  PlataformaPresentacion,
  TipoPagoPresentacion,
  ParametrosConstancia,
  DevolucionPlataforma,
  FraccionamientoPlataforma,
  EstadoFraccionamiento
} from '@rentas/shared/types';
import { Observable, of, throwError } from 'rxjs';
import { ModalMensajeVisaComponent } from '../modal-mensaje-visa/modal-mensaje-visa.component';
import { ModalConfirmarPagoComponent } from '../modal-confirmar-pago/modal-confirmar-pago.component';
import { FactoryPresentacionUitl, FraccionamientoFactoryUtil, SessionStorage } from '@rentas/shared/utils';
import { PasarelaService } from '@rentas/shared/core';


@Component({
  selector: 'rentas-pasarela',
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.css']
})
export class PasarelaComponent implements OnInit {

  ipCliente: string;
  pasarelaRespuesta: PasarelaRespuesta;
  entidadFinancieraSelected: EntidadFinancieraRespuesta;
  montoApagar: number;

  constructor(
    private router: Router,
    private autoGuardadoService: AutoGuardadoService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private dispositivoService: DispositivoService,
    private pagosPreviosService: PagosPreviosService,
    private pasarelaService: PasarelaService,
    private devolucionService: DevolucionService,
    private comboService: ComboService,
    private erroresService: ErroresService,
    private msgConfirmar: ModalConfirmarService,
    private pagosService: PagosService,
    private popupVisaService: PopupVisaService,
    @Inject(ConstantesPagos.PLATAFORMA) private plataforma: PlataformaPresentacion
  ) {

    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state;

    if (!this.isSendParan(state)) {
      this.router.navigate([Rutas.BIENVENIDA]);
      return;
    }

    this.pasarelaRespuesta = state[0];
    this.montoApagar = state[1];

    this.dispositivoService.getIp()
      .pipe(tap((ip) => (this.ipCliente = ip)))
      .subscribe();

  }

  ngOnInit(): void {
    this.autoGuardadoService.detenerAutoGuardado();
  }

  clickPresentarPagar() {

    if (!!this.popupVisaService.getPopUp() && !this.popupVisaService.isClosed()) {
      this.popupVisaService.getPopUp().focus();
      return;
    }

    this.showModalIfIsVisa().pipe(
      switchMap(() => this.showModalConfirmarPago())
    ).subscribe(siAcepto => {
      if (siAcepto) {
        this.pesentarPagar();
      }
    });

  }

  pesentarPagar() {
    this.spinner.show();
    this.pagosPreviosService.verificarPagoEnProceso().pipe(
      switchMap(() => this.validarPresentacion()),
      switchMap((resp) => this.handlerProxyPago(resp)),
      catchError((error) => this.handlerError(error))
    ).subscribe(constancia => {
      this.spinner.hide();
      this.irConstancia(constancia);
    });
  }

  private handlerError(error) {
    this.spinner.hide();
    if (this.erroresService.esErrorPagoEnProceso(error)) {
      this.msgConfirmar.msgErrorPagoEnProceso(error);
    } else {
      this.erroresService.mostarModalError(error);
    }
    return throwError(error);
  }

  private irConstancia(respuesta: any): void {
    this.spinner.hide();
    const paran: ParametrosConstancia = {
      respuesta,
      tieneFrancionamiento: this.tieneFraccionamiento(
        this.getPlataformaFraccinamiento(this.plataforma)
      ),
      devoluciones: this.devolucionService.tieneDevolucion(
        this.getPlataformaDevolucion(this.plataforma)
      ),
      monto: this.montoApagar
    }
    const navigationExtras: NavigationExtras = { state: paran };

    if(this.plataforma === PlataformaPresentacion.JURIDICO) {
      this.router.navigate([Rutas.JURIDICO_PAGO_CONSTANCIA], navigationExtras);
    } else {
      this.router.navigate([Rutas.NATURAL_PAGO_CONSTANCIA], navigationExtras);
    }

  }

  private handlerProxyPago(resp: ValidarPresentacionRespuesta): Observable<any> {
    const medioPago = this.getMedioPagoSelected();
    if(this.getCodigoMedioPagoSelected() === MedioPago.VISA) {
      this.spinner.hide();
      return this.popupVisaService.open(
        resp.resultado.numeroOperacionSunat,
        medioPago.codMedPag.toString(),
        medioPago.codEntFin.toString(),
        this.montoApagar
      );
    } else {
      return this.pagosService.proxypagoRealizarPago(
        resp.resultado.numeroOperacionSunat,
        medioPago.codMedPag.toString(),
        medioPago.codEntFin.toString(),
        this.montoApagar
      );
    }
  }

  private validarPresentacion(): Observable<ValidarPresentacionRespuesta> {
    const tipoPago = this.getTipoPago();
    const codMedPag = this.getMedioPagoSelected().codMedPag.toString();
    const codEntFin = this.getMedioPagoSelected().codEntFin.toString();

    const solicitud = FactoryPresentacionUitl.newInstance(this.plataforma)
      .setTipoPago(tipoPago)
      .setDireccionIP(this.ipCliente)
      .setTrubutosDefault()
      .buildRequest();

    return this.pasarelaService.validarPresentacion(solicitud, codMedPag, codEntFin);
  }

  showModalIfIsVisa(): Observable<boolean> {
    const medioPagoSelected = this.getCodigoMedioPagoSelected();
    if (MedioPago.VISA === medioPagoSelected) {
      return this.modalService
        .open(ModalMensajeVisaComponent, { size: 'lg' })
        .componentInstance.evento;
    }
    return of(true);
  }

  showModalConfirmarPago(): Observable<boolean> {
    const modalRef = this.modalService
      .open(ModalConfirmarPagoComponent, { size: 'lg' });
    modalRef.componentInstance.montoApagar = this.montoApagar;
    modalRef.componentInstance.medioPagoSelected = this.getMedioPagoSelected();
    return modalRef.componentInstance.evento;
  }

  private isSendParan(state: any): boolean {
    return !!state;
  }

  private getMedioPagoSelected() {
    const codEntFin = this.entidadFinancieraSelected.codEntFin;
    return this.pasarelaRespuesta.mediosPago.flatMap(itemMedioPago => {
      return itemMedioPago.entidadFinanciera
        .map(entidadFinanciera => ({ ...itemMedioPago, ...entidadFinanciera }));
    }).find(item => item.codEntFin === codEntFin)
  }

  private getCodigoMedioPagoSelected(): MedioPago {
    const codMedioPago = this.getMedioPagoSelected().codMedPag;
    return codMedioPago.toString() as MedioPago;
  }

  public tieneFraccionamiento(tipo: FraccionamientoPlataforma): EstadoFraccionamiento {
    const uit = this.comboService.obtenerUitEjercicioActual();
    return FraccionamientoFactoryUtil.newInstancia(tipo).tieneFraccionamiento(uit);
  }

  private getTipoPago(): TipoPagoPresentacion {
    const medioPago = this.getCodigoMedioPagoSelected();
    switch (medioPago) {
      case MedioPago.NPS: return TipoPagoPresentacion.NPS;
      case MedioPago.VISA: return TipoPagoPresentacion.BANCOS;
      case MedioPago.BANCOS: return TipoPagoPresentacion.BANCOS;
      case MedioPago.CUENTA_DETRACCIONES: return TipoPagoPresentacion.BANCOS;
      default: return TipoPagoPresentacion.PAGOCERO;
    }
  }

  private getPlataformaDevolucion(plataforma: PlataformaPresentacion): DevolucionPlataforma {
    switch(plataforma) {
      case PlataformaPresentacion.JURIDICO: return DevolucionPlataforma.JURIDICO;
      case PlataformaPresentacion.NATURAL:return DevolucionPlataforma.NATURAL;
    }
  }

  private getPlataformaFraccinamiento(plataforma: PlataformaPresentacion): FraccionamientoPlataforma {
    switch(plataforma) {
      case PlataformaPresentacion.JURIDICO: return FraccionamientoPlataforma.JURIDICO;
      case PlataformaPresentacion.NATURAL:return FraccionamientoPlataforma.NATURAL;
    }
  }

}
