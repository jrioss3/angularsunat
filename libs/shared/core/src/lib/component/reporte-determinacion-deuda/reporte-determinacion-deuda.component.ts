import { Component, OnInit } from '@angular/core';
import { Casilla } from '@rentas/shared/types';
import { ReporteUtil } from '@rentas/shared/utils';
import { CasillaService } from '../../service/casilla.service';

@Component({
  selector: 'rentas-reporte-determinacion-deuda',
  templateUrl: './reporte-determinacion-deuda.component.html',
  styleUrls: ['./reporte-determinacion-deuda.component.css']
})
export class ReporteDeterminacionDeudaComponent extends ReporteUtil implements OnInit {

  casilla100: Casilla;
  casilla101: Casilla;
  casilla103: Casilla;
  casilla105: Casilla;
  casilla106: Casilla;
  casilla107: Casilla;
  casilla120: Casilla;
  casilla108: Casilla;
  casilla110: Casilla;
  casilla113: Casilla;
  casilla111: Casilla;
  casilla686: Casilla;
  casilla610: Casilla;

  casilla123: Casilla;
  casilla136: Casilla;
  casilla134: Casilla;
  casilla125: Casilla;
  casilla129: Casilla;
  casilla279: Casilla;
  casilla783: Casilla;
  casilla504: Casilla;
  casilla506: Casilla;
  casilla126: Casilla;
  casilla127: Casilla;
  casilla128: Casilla;
  casilla130: Casilla;
  casilla131: Casilla;

  public mtoCas783: string;

  public credImprenta: any;
  public impuestoRtaEmpresa: any;

  constructor(private casillaService: CasillaService) {
    super();
  }

  ngOnInit(): void {

    this.casilla100 = this.casillaService.obtenerCasilla('100');
    this.casilla101 = this.casillaService.obtenerCasilla('101');
    this.casilla103 = this.casillaService.obtenerCasilla('103');
    this.casilla105 = this.casillaService.obtenerCasilla('105');
    this.casilla106 = this.casillaService.obtenerCasilla('106');
    this.casilla107 = this.casillaService.obtenerCasilla('107');
    this.casilla120 = this.casillaService.obtenerCasilla('120');
    this.casilla108 = this.casillaService.obtenerCasilla('108');
    this.casilla110 = this.casillaService.obtenerCasilla('110');
    this.casilla113 = this.casillaService.obtenerCasilla('113');
    this.casilla111 = this.casillaService.obtenerCasilla('111');
    this.casilla686 = this.casillaService.obtenerCasilla('686');
    this.casilla610 = this.casillaService.obtenerCasilla('610');
    this.casilla123 = this.casillaService.obtenerCasilla('123');
    this.casilla136 = this.casillaService.obtenerCasilla('136');
    this.casilla134 = this.casillaService.obtenerCasilla('134');
    this.casilla125 = this.casillaService.obtenerCasilla('125');
    this.casilla129 = this.casillaService.obtenerCasilla('129');
    this.casilla279 = this.casillaService.obtenerCasilla('279');
    this.casilla504 = this.casillaService.obtenerCasilla('504');
    this.casilla506 = this.casillaService.obtenerCasilla('506');
    this.casilla126 = this.casillaService.obtenerCasilla('126');
    this.casilla127 = this.casillaService.obtenerCasilla('127');
    this.casilla128 = this.casillaService.obtenerCasilla('128');
    this.casilla130 = this.casillaService.obtenerCasilla('130');
    this.casilla131 = this.casillaService.obtenerCasilla('131');
    this.casilla783 = this.casillaService.obtenerCasilla('783');

    this.credImprenta = this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta;
    this.impuestoRtaEmpresa = this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa;
    this.mtoCas783 = this.cambiar10ToYesNo(this.credImprenta.mtoCas783);
  }

  public habilitarCasItan(): boolean {
    const anioRenta = this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    return Number(anioRenta) >= 2021 && Number(this.credImprenta.mtoCas279) > 0;
  }

}
