import { Injectable } from '@angular/core';
import { TipoReporte } from '@rentas/shared/types';
import { ReporteJuridicoComponent } from '../component/reporte-juridico/reporte-juridico.component';
import { ReporteNaturalComponent } from '../component/reporte-natural/reporte-natural.component';
import { AbrirModalService } from './abrir-modal.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteSimpleService {

  constructor(private abrirModalService: AbrirModalService) { }

  public mostrarReporteJuridico(paran: {
    preDeclaracion: any,
    tipoReporte: TipoReporte,
    razonSocial: string,
    fechaPresentacion?: string,
    numOrden?: string
  }): void {
    const modalRef = this.abrirModalService.abrirModal(ReporteJuridicoComponent, { size: 'lg' });
    this.setNumOrdenIsDefinitivo(paran.preDeclaracion, paran.numOrden, paran.tipoReporte);
    modalRef.componentInstance.preDeclaracion = paran.preDeclaracion;
    modalRef.componentInstance.tipoReporte = paran.tipoReporte;
    modalRef.componentInstance.razonSocial = paran.razonSocial;
    modalRef.componentInstance.fechaPresentacion = paran.fechaPresentacion;
    modalRef.componentInstance.numOrden = paran.numOrden;
  }

  public mostrarReporteNatural(paran: {
    preDeclaracion: any,
    tipoReporte: TipoReporte,
    razonSocial: string,
    fechaPresentacion?: string,
    numOrden?: string
  }): void {
    const modalRef = this.abrirModalService.abrirModal(ReporteNaturalComponent, { size: 'lg' });
    this.setNumOrdenIsDefinitivo(paran.preDeclaracion, paran.numOrden, paran.tipoReporte);
    modalRef.componentInstance.preDeclaracion = paran.preDeclaracion;
    modalRef.componentInstance.tipoReporte = paran.tipoReporte;
    modalRef.componentInstance.razonSocial = paran.razonSocial;
    modalRef.componentInstance.fechaPresentacion = paran.fechaPresentacion;
    modalRef.componentInstance.numOrden = paran.numOrden;
  }

  private setNumOrdenIsDefinitivo(preDeclaracion: any, numOrden: string, tipoReporte: TipoReporte): any {
    if (tipoReporte === TipoReporte.DEFINITIVO) {
      preDeclaracion.declaracion.generales.cabecera.numOrden = numOrden;
    }
    return preDeclaracion;
  }

}
