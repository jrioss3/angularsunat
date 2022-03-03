import { Component, OnInit } from '@angular/core';
import { Casilla } from '@rentas/shared/types';
import { ReporteUtil } from '@rentas/shared/utils';
import { CasillaService } from '../../service/casilla.service';

@Component({
  selector: 'rentas-reporte-estados-financieros',
  templateUrl: './reporte-estados-financieros.component.html',
  styleUrls: ['./reporte-estados-financieros.component.css']
})
export class ReporteEstadosFinancierosComponent extends ReporteUtil implements OnInit {

  public casilla359: Casilla;
  public casilla360: Casilla;
  public casilla361: Casilla;
  public casilla362: Casilla;
  public casilla363: Casilla;
  public casilla364: Casilla;
  public casilla365: Casilla;
  public casilla366: Casilla;
  public casilla367: Casilla;
  public casilla368: Casilla;
  public casilla369: Casilla;
  public casilla370: Casilla;
  public casilla371: Casilla;
  public casilla372: Casilla;
  public casilla373: Casilla;
  public casilla374: Casilla;
  public casilla375: Casilla;
  public casilla376: Casilla;
  public casilla377: Casilla;
  public casilla378: Casilla;
  public casilla379: Casilla;
  public casilla380: Casilla;
  public casilla381: Casilla;
  public casilla382: Casilla;
  public casilla383: Casilla;
  public casilla384: Casilla;
  public casilla385: Casilla;
  public casilla386: Casilla;
  public casilla387: Casilla;
  public casilla388: Casilla;
  public casilla389: Casilla;
  public casilla390: Casilla;
  public casilla401: Casilla;
  public casilla402: Casilla;
  public casilla403: Casilla;
  public casilla404: Casilla;
  public casilla405: Casilla;
  public casilla406: Casilla;
  public casilla407: Casilla;
  public casilla408: Casilla;
  public casilla409: Casilla;
  public casilla410: Casilla;
  public casilla411: Casilla;
  public casilla412: Casilla;
  public casilla414: Casilla;
  public casilla415: Casilla;
  public casilla416: Casilla;
  public casilla417: Casilla;
  public casilla418: Casilla;
  public casilla419: Casilla;
  public casilla420: Casilla;
  public casilla421: Casilla;
  public casilla422: Casilla;
  public casilla423: Casilla;
  public casilla424: Casilla;
  public casilla425: Casilla;
  public casilla426: Casilla;
  public casilla461: Casilla;
  public casilla462: Casilla;
  public casilla463: Casilla;
  public casilla464: Casilla;
  public casilla466: Casilla;
  public casilla467: Casilla;
  public casilla468: Casilla;
  public casilla469: Casilla;
  public casilla470: Casilla;
  public casilla471: Casilla;
  public casilla472: Casilla;
  public casilla473: Casilla;
  public casilla475: Casilla;
  public casilla476: Casilla;
  public casilla477: Casilla;
  public casilla478: Casilla;
  public casilla480: Casilla;
  public casilla484: Casilla;
  public casilla485: Casilla;
  public casilla486: Casilla;
  public casilla487: Casilla;
  public casilla489: Casilla;
  public casilla490: Casilla;
  public casilla492: Casilla;
  public casilla493: Casilla;

  public activoEmp: any;
  public pasivoPatrEmp: any;

  public cabecera: any;
  public ganancia: any;
  public anio = '';

  constructor(private casillaService: CasillaService) { super(); }

  ngOnInit(): void {

    this.casilla359 = this.casillaService.obtenerCasilla('359');
    this.casilla360 = this.casillaService.obtenerCasilla('360');
    this.casilla361 = this.casillaService.obtenerCasilla('361');
    this.casilla362 = this.casillaService.obtenerCasilla('362');
    this.casilla363 = this.casillaService.obtenerCasilla('363');
    this.casilla364 = this.casillaService.obtenerCasilla('364');
    this.casilla365 = this.casillaService.obtenerCasilla('365');
    this.casilla366 = this.casillaService.obtenerCasilla('366');
    this.casilla367 = this.casillaService.obtenerCasilla('367');
    this.casilla368 = this.casillaService.obtenerCasilla('368');
    this.casilla369 = this.casillaService.obtenerCasilla('369');
    this.casilla370 = this.casillaService.obtenerCasilla('370');
    this.casilla371 = this.casillaService.obtenerCasilla('371');
    this.casilla372 = this.casillaService.obtenerCasilla('372');
    this.casilla373 = this.casillaService.obtenerCasilla('373');
    this.casilla374 = this.casillaService.obtenerCasilla('374');
    this.casilla375 = this.casillaService.obtenerCasilla('375');
    this.casilla376 = this.casillaService.obtenerCasilla('376');
    this.casilla377 = this.casillaService.obtenerCasilla('377');
    this.casilla378 = this.casillaService.obtenerCasilla('378');
    this.casilla379 = this.casillaService.obtenerCasilla('379');
    this.casilla380 = this.casillaService.obtenerCasilla('380');
    this.casilla381 = this.casillaService.obtenerCasilla('381');
    this.casilla382 = this.casillaService.obtenerCasilla('382');
    this.casilla383 = this.casillaService.obtenerCasilla('383');
    this.casilla384 = this.casillaService.obtenerCasilla('384');
    this.casilla385 = this.casillaService.obtenerCasilla('385');
    this.casilla386 = this.casillaService.obtenerCasilla('386');
    this.casilla387 = this.casillaService.obtenerCasilla('387');
    this.casilla388 = this.casillaService.obtenerCasilla('388');
    this.casilla389 = this.casillaService.obtenerCasilla('389');
    this.casilla390 = this.casillaService.obtenerCasilla('390');
    this.casilla401 = this.casillaService.obtenerCasilla('401');
    this.casilla402 = this.casillaService.obtenerCasilla('402');
    this.casilla403 = this.casillaService.obtenerCasilla('403');
    this.casilla404 = this.casillaService.obtenerCasilla('404');
    this.casilla405 = this.casillaService.obtenerCasilla('405');
    this.casilla406 = this.casillaService.obtenerCasilla('406');
    this.casilla407 = this.casillaService.obtenerCasilla('407');
    this.casilla408 = this.casillaService.obtenerCasilla('408');
    this.casilla409 = this.casillaService.obtenerCasilla('409');
    this.casilla410 = this.casillaService.obtenerCasilla('410');
    this.casilla411 = this.casillaService.obtenerCasilla('411');
    this.casilla412 = this.casillaService.obtenerCasilla('412');
    this.casilla414 = this.casillaService.obtenerCasilla('414');
    this.casilla415 = this.casillaService.obtenerCasilla('415');
    this.casilla416 = this.casillaService.obtenerCasilla('416');
    this.casilla417 = this.casillaService.obtenerCasilla('417');
    this.casilla418 = this.casillaService.obtenerCasilla('418');
    this.casilla419 = this.casillaService.obtenerCasilla('419');
    this.casilla420 = this.casillaService.obtenerCasilla('420');
    this.casilla421 = this.casillaService.obtenerCasilla('421');
    this.casilla422 = this.casillaService.obtenerCasilla('422');
    this.casilla423 = this.casillaService.obtenerCasilla('423');
    this.casilla424 = this.casillaService.obtenerCasilla('424');
    this.casilla425 = this.casillaService.obtenerCasilla('425');
    this.casilla426 = this.casillaService.obtenerCasilla('426');

    this.casilla461 = this.casillaService.obtenerCasilla('461');
    this.casilla462 = this.casillaService.obtenerCasilla('462');
    this.casilla463 = this.casillaService.obtenerCasilla('463');
    this.casilla464 = this.casillaService.obtenerCasilla('464');
    this.casilla466 = this.casillaService.obtenerCasilla('466');
    this.casilla467 = this.casillaService.obtenerCasilla('467');
    this.casilla468 = this.casillaService.obtenerCasilla('468');
    this.casilla469 = this.casillaService.obtenerCasilla('469');
    this.casilla470 = this.casillaService.obtenerCasilla('470');
    this.casilla471 = this.casillaService.obtenerCasilla('471');
    this.casilla472 = this.casillaService.obtenerCasilla('472');
    this.casilla473 = this.casillaService.obtenerCasilla('473');
    this.casilla475 = this.casillaService.obtenerCasilla('475');
    this.casilla476 = this.casillaService.obtenerCasilla('476');
    this.casilla477 = this.casillaService.obtenerCasilla('477');
    this.casilla478 = this.casillaService.obtenerCasilla('478');
    this.casilla480 = this.casillaService.obtenerCasilla('480');
    this.casilla484 = this.casillaService.obtenerCasilla('484');
    this.casilla485 = this.casillaService.obtenerCasilla('485');
    this.casilla486 = this.casillaService.obtenerCasilla('486');
    this.casilla487 = this.casillaService.obtenerCasilla('487');
    this.casilla489 = this.casillaService.obtenerCasilla('489');
    this.casilla490 = this.casillaService.obtenerCasilla('490');
    this.casilla492 = this.casillaService.obtenerCasilla('492');
    this.casilla493 = this.casillaService.obtenerCasilla('493');


    this.activoEmp = this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.activoEmp;
    this.pasivoPatrEmp = this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.pasivoPatrEmp;
    this.cabecera = this.preDeclaracion.declaracion.generales.cabecera;

    this.anio = this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    this.ganancia = this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia;
  }

}
