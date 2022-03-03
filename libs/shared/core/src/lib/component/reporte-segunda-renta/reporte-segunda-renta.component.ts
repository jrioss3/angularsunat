import { Component, OnInit } from '@angular/core';
import { ReporteUtil } from '@rentas/shared/utils';
import { CasillaService } from '../../service/casilla.service';

@Component({
  selector: 'rentas-reporte-segunda-renta',
  templateUrl: './reporte-segunda-renta.component.html',
  styleUrls: ['./reporte-segunda-renta.component.css']
})
export class ReporteSegundaRentaComponent extends ReporteUtil implements OnInit {

  // SEGUNDA
  casilla350: any;
  casilla385: any;
  casilla355: any;
  casilla353: any;
  casilla354: any;
  casilla356: any;
  // DETERMINATIVA DEUDA
  casilla357: any;
  casilla388: any;
  casilla358: any;
  casilla359: any;
  casilla360: any;
  casilla361: any;
  casilla362: any;
  casilla363: any;
  casilla364: any;
  casilla365: any;
  casilla366: any;
  resumenSegunda: any;

  constructor(private casillaService: CasillaService) {
    super();
  }

  ngOnInit(): void {

    // SEGUNDA
    this.casilla350 = this.casillaService.obtenerCasilla('350');
    this.casilla385 = this.casillaService.obtenerCasilla('385');
    this.casilla355 = this.casillaService.obtenerCasilla('355');
    this.casilla353 = this.casillaService.obtenerCasilla('353');
    this.casilla354 = this.casillaService.obtenerCasilla('354');
    this.casilla356 = this.casillaService.obtenerCasilla('356');
    // DETERMINATIVA DEUDA
    this.casilla357 = this.casillaService.obtenerCasilla('357');
    this.casilla388 = this.casillaService.obtenerCasilla('388');
    this.casilla358 = this.casillaService.obtenerCasilla('358');
    this.casilla359 = this.casillaService.obtenerCasilla('359');
    this.casilla360 = this.casillaService.obtenerCasilla('360');
    this.casilla361 = this.casillaService.obtenerCasilla('361');
    this.casilla362 = this.casillaService.obtenerCasilla('362');
    this.casilla363 = this.casillaService.obtenerCasilla('363');
    this.casilla364 = this.casillaService.obtenerCasilla('364');
    this.casilla365 = this.casillaService.obtenerCasilla('365');
    this.casilla366 = this.casillaService.obtenerCasilla('366');
    this.resumenSegunda = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda;
  }

}
