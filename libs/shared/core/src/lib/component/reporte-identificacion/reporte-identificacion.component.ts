import { Component, OnInit } from '@angular/core';
import { ConstantesCombos } from '@rentas/shared/constantes';
import { ReporteUtil } from '@rentas/shared/utils';
import { ListaParametro } from '@rentas/shared/types';

@Component({
  selector: 'rentas-reporte-identificacion',
  templateUrl: './reporte-identificacion.component.html',
  styleUrls: ['./reporte-identificacion.component.css']
})
export class ReporteIdentificacionComponent extends ReporteUtil implements OnInit {

  public indRectificatoria: string;
  public casInformativa: any;
  public impuestoRtaEmpresa: any;
  public mtoCas803: string;
  public mtoCas217: string;
  public mtoCas829: string;
  public mtoCas819: string;
  private exoneracion: ListaParametro[];
  private inafecto: ListaParametro[];
  public mostrarArrastre = false;

  constructor() {
    super();
  }

  ngOnInit(): void {

    this.indRectificatoria = this.getDescripcionRectificatoria();
    this.impuestoRtaEmpresa = this.getImpuestoRtaEmpresa();
    this.exoneracion = this.getListaParametro(ConstantesCombos.BASES_LEGALES);
    this.inafecto = this.getListaParametro(ConstantesCombos.BASES_LEGALES2);

    if (Number(this.impuestoRtaEmpresa?.mtoCas107 ?? '') !== 0 && this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108.lisCasilla108.length === 0) {
      this.mostrarArrastre = true;
    }

    this.casInformativa = this.preDeclaracion.declaracion.seccInformativa.casInformativa;
    this.mtoCas803 = this.cambiar10ToYesNo(this.casInformativa.mtoCas803);
    this.mtoCas217 = this.cambiar10ToYesNo(this.casInformativa.mtoCas217);
    this.mtoCas829 = this.cambiar10ToYesNo(this.casInformativa.mtoCas829);
    this.mtoCas819 = this.cambiar10ToYesNo(this.casInformativa.mtoCas819);

  }

  private getDescripcionRectificatoria() {
    const valor = this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria;
    if ('0' === valor) {
      return 'Original';
    } else {
      return 'Sustitutoría/Rectificatoría';
    }
  }

  private getImpuestoRtaEmpresa() {
    return this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa;
  }

  public obtenerValorExo(val: number): string {
    const documento = this.exoneracion.filter(x => x.val === String(val));
    return documento.length !== 0 ? documento[0].desc : '';
  }

  public obtenerValorIna(val: number): string {
    const documento = this.inafecto.filter(x => x.val === String(val));
    return documento.length !== 0 ? documento[0].desc : '';
  }

}
