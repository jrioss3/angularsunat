import { Injectable } from '@angular/core';
import { Navigation } from '@angular/router';
import {
  ConstanciaRespuesta,
  ParametrosConstancia,
  TributoDevolucion,
  NpsRespuesta,
  MedioPago,
  EstadoFraccionamiento
} from '@rentas/shared/types';
import { ConstanciaRespuestaUtil } from '@rentas/shared/utils';

@Injectable()
export class ConstanciaService {

  private parametros: ParametrosConstancia = null;
  private constanciaUitl: ConstanciaRespuestaUtil = null;
  constructor() { }

  /**
   * metodo que recepciona los parametros de pago o cabecera.
   * @param navigation
   */
  public setState(navigation: Navigation): void {
    this.parametros = navigation?.extras?.state as ParametrosConstancia;
    if(this.parametros) {
      this.constanciaUitl =  new ConstanciaRespuestaUtil(this.parametros.respuesta);
    }
  }

  /**
   * verifica si tiene parametros enviados
   * @returns boolean
   */
  public checkNavigationEextras(): boolean {
    if (this.parametros) {
      return true;
    }
    return false;
  }

  /**
   * se obtiene la respuesta de constancia
   * para armar todo el componente
   */
  public getConstanciaRespuesta(): ConstanciaRespuesta {
    return this.constanciaUitl.constanciaRespuesta;
  }

  public getFracionamiento(): EstadoFraccionamiento {
    return this.parametros.tieneFrancionamiento;
  }

  public tieneDevolucion(): boolean {
    return this.parametros.devoluciones.filter(e => e.cumple).length > 0;
  }

  public getTributoDevolucion(): Array<TributoDevolucion> {
    return this.parametros.devoluciones.filter(e => e.cumple);
  }

  public esPagoNps(): boolean {
    return this.constanciaUitl.esPagoNps;
  }

  public getNpsRespuesta(): NpsRespuesta {
    return this.constanciaUitl.npsRespuesta;
  }

  public getMedioPago(): MedioPago {
    return this.constanciaUitl.medioPago;
  }

  public getNumeroOperacion() {
    if(this.getMedioPago() === MedioPago.NPS) {
      return this.getNpsRespuesta().numeroNPS;
    }
    return this.getConstanciaRespuesta().resultadoPago.numeroOperacionBancaria;
  }

  public getListRowConstancias() {
    return this.constanciaUitl.getListRowConstancias();
  }

}
