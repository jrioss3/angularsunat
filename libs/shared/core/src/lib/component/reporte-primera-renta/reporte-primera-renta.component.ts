import { Component, OnInit } from '@angular/core';
import { ReporteCasilla } from '@rentas/shared/types';
import { ReporteUtil } from '@rentas/shared/utils';
import { CasillaService } from '../../service/casilla.service';

@Component({
  selector: 'rentas-reporte-primera-renta',
  templateUrl: './reporte-primera-renta.component.html',
  styleUrls: ['./reporte-primera-renta.component.css']
})
export class ReportePrimeraRentaComponent extends ReporteUtil implements OnInit {

  casilla100: ReporteCasilla;
  casilla557: ReporteCasilla;
  casilla558: ReporteCasilla;
  casilla102: ReporteCasilla;
  casilla501: ReporteCasilla;
  casilla502: ReporteCasilla;
  casilla515: ReporteCasilla;
  casilla153: ReporteCasilla;
  casilla367: ReporteCasilla;
  casilla368: ReporteCasilla;
  casilla369: ReporteCasilla;
  casilla370: ReporteCasilla;
  casilla156: ReporteCasilla;
  casilla133: ReporteCasilla;
  casilla159: ReporteCasilla;
  casilla161: ReporteCasilla;
  casilla162: ReporteCasilla;
  casilla163: ReporteCasilla;
  casilla164: ReporteCasilla;
  casilla166: ReporteCasilla;
  casilla160: ReporteCasilla;

  resumenPrimera: any;

  constructor(private casillaService: CasillaService) {
    super();
  }

  ngOnInit(): void {

    // PRIMERA
    this.casilla100 = this.casillaService.obtenerCasilla('100');
    this.casilla557 = this.casillaService.obtenerCasilla('557');
    this.casilla558 = this.casillaService.obtenerCasilla('558');
    this.casilla102 = this.casillaService.obtenerCasilla('102');
    this.casilla501 = this.casillaService.obtenerCasilla('501');
    this.casilla502 = this.casillaService.obtenerCasilla('502');
    this.casilla515 = this.casillaService.obtenerCasilla('515');
    // DETERMINACION DEUDA
    this.casilla160 = this.casillaService.obtenerCasilla('160');
    this.casilla153 = this.casillaService.obtenerCasilla('153');
    this.casilla367 = this.casillaService.obtenerCasilla('367');
    this.casilla368 = this.casillaService.obtenerCasilla('368');
    this.casilla369 = this.casillaService.obtenerCasilla('369');
    this.casilla370 = this.casillaService.obtenerCasilla('370');
    this.casilla156 = this.casillaService.obtenerCasilla('156');
    this.casilla133 = this.casillaService.obtenerCasilla('133');
    this.casilla159 = this.casillaService.obtenerCasilla('159');
    this.casilla161 = this.casillaService.obtenerCasilla('161');
    this.casilla162 = this.casillaService.obtenerCasilla('162');
    this.casilla163 = this.casillaService.obtenerCasilla('163');
    this.casilla164 = this.casillaService.obtenerCasilla('164');
    this.casilla166 = this.casillaService.obtenerCasilla('166');

    this.resumenPrimera = this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera;
  }

}
