import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantesUris } from '@rentas/shared/constantes';
import { environment } from '@rentas/shared/environments';
import { ConstanciaRespuesta } from '@rentas/shared/types';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MensajeFraccionamientoComponent } from '../mensaje-fraccionamiento/mensaje-fraccionamiento.component';
import { Descas } from '../types/descas';
import { FechaVencimientoResponse } from '../types/fecha-vencimiento-response';
import { LinkFrancionamientoRespuesta } from '../types/link-fraccionamiento-respuesta';
import { SolicitudRespuesta } from '../types/solicitud-respuesta';
import { DetalleTributo } from '@rentas/shared/types';
import { SessionStorage } from '@rentas/shared/utils';
import { AbrirModalService } from '@rentas/shared/core';

@Injectable()
export class FraccionamientoService {

  private constanciaRespuesta: ConstanciaRespuesta;
  private uriRegistroSolicitudes = ConstantesUris.URI_FRACCIONAMIENTO_REGISTRO_SOLICITUDES;
  private uriFechaVencimiento = ConstantesUris.URI_VALIDAR_FECHA_VENCIMIENTO;
  private uriGetLinkFrancionamiento = ConstantesUris.URI_PASARELA_VALIDAR_FRACCIONAMIENTO;

  constructor(
    private http: HttpClient,
    private abrirModalService: AbrirModalService) { }

  public mostrarMensaje(): void {

    this.validarFechaVencimiento().subscribe(response => {
      if (response.isDentroVencimiento) {
        this.registroSolicitudes(Descas.FRANCIONAMIENTO_SI).pipe(
          switchMap(_respuesta => this.obtenerLinkFrancionamiento())
        ).subscribe(this.handlerLinkFrancionamiento.bind(this));
      } else {
        this.registroSolicitudes(Descas.FRANCIONAMIENTO_NO)
          .subscribe();
      }
    });

  }

  public setConstanciaRespuesta(constanciaRespuesta: ConstanciaRespuesta): void {
    this.constanciaRespuesta = constanciaRespuesta;
  }

  private validarFechaVencimiento(): Observable<FechaVencimientoResponse> {
    const numRuc = SessionStorage.getnumRuc();
    const perTri = SessionStorage.getPreDeclaracion<any>().perTri;
    const codfor = SessionStorage.getCodFormulario();
    const uri = `${this.uriFechaVencimiento}?numRuc=${numRuc}&periodo=${perTri}&formulario=${codfor}`;
    return this.http.get<FechaVencimientoResponse>(uri);
  }

  private registroSolicitudes(descas: Descas): Observable<SolicitudRespuesta> {
    const cod_for = SessionStorage.getCodFormulario();
    const num_ord = this.constanciaRespuesta.constancias[0].numeroOrden;
    const cod_depen = SessionStorage.getUserData().codDepend;
    const per_tri = SessionStorage.getPreDeclaracion<any>().perTri;
    const des_cas = descas;
    return this.http.post<SolicitudRespuesta>(this.uriRegistroSolicitudes, {
      cod_for, num_ord, cod_depen, des_cas, per_tri
    });
  }

  private obtenerLinkFrancionamiento(): Observable<LinkFrancionamientoRespuesta> {
    return this.http.post<LinkFrancionamientoRespuesta>(
      this.uriGetLinkFrancionamiento, this.getRequest()
    );
  }

  private getRequest() {
    const numOrden = this.constanciaRespuesta.constancias[0].numeroOrden;
    const numRuc = SessionStorage.getnumRuc();
    const razonSocial = SessionStorage.getrazonSocial();
    const codFormulario = SessionStorage.getCodFormulario();
    const usuSol = SessionStorage.getUsuarioSOL();
    const fechaActual = new Date();
    const tributos = this.constanciaRespuesta.constancias[0].detalleTributos;
    const listTributo = tributos
      .filter(this.pagoMayorCero)
      .map(this.tributoFraccionamiento)

    return {
      numRuc,
      razonSocial,
      codFormulario,
      numOrden,
      listTributo,
      usuSol,
      fechaActual
    }
  }

  private pagoMayorCero(e: DetalleTributo) {
    return (e.totalDeuda - e.montoPago) > 0
  }

  private tributoFraccionamiento(e: DetalleTributo) {
    return {
      codTributo: e.codigoTributo,
      descTributo: e.descripcionTributo,
      mtoTributo: e.totalDeuda - e.montoPago,
    }
  }

  private handlerLinkFrancionamiento(respuesta: LinkFrancionamientoRespuesta) {
    const link = environment.uri_base_fraccionamiento + respuesta.data;
    const modalRef = this.abrirModalService.abrirModal(MensajeFraccionamientoComponent, { size: 'lg' });
    modalRef.componentInstance.link = link;
  }

}
