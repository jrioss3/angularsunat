import { Component, OnInit } from '@angular/core';
import { ReporteUtil } from '@rentas/shared/utils';
import { CasillaService } from '../../service/casilla.service';

@Component({
  selector: 'rentas-reporte-trabajo-renta',
  templateUrl: './reporte-trabajo-renta.component.html',
  styleUrls: ['./reporte-trabajo-renta.component.css']
})
export class ReporteTrabajoRentaComponent extends ReporteUtil implements OnInit {

  casilla107: any;
  casilla507: any;
  casilla508: any;
  casilla108: any;
  casilla509: any;
  casilla111: any;
  casilla510: any;
  casilla511: any;
  casilla514: any;
  casilla512: any;
  casilla522: any;
  casilla519: any;
  casilla513: any;
  casilla116: any;
  casilla517: any;
  // DETERMINA DEUDA
  casilla120: any;
  casilla122: any;
  casilla158: any;
  casilla167: any;
  casilla563: any;
  casilla564: any;
  casilla565: any;
  casilla125: any;
  casilla127: any;
  casilla128: any;
  casilla130: any;
  casilla131: any;
  casilla141: any;
  casilla140: any;
  casilla142: any;
  casilla144: any;
  casilla145: any;
  casilla146: any;
  casilla168: any;

  resumenTrabajo: any;

  constructor(private casillaService: CasillaService) {
    super();
  }

  ngOnInit(): void {

    this.casilla107 = this.casillaService.obtenerCasilla('107');
    this.casilla507 = this.casillaService.obtenerCasilla('507');
    this.casilla508 = this.casillaService.obtenerCasilla('508');
    this.casilla108 = this.casillaService.obtenerCasilla('108');
    this.casilla509 = this.casillaService.obtenerCasilla('509');
    this.casilla111 = this.casillaService.obtenerCasilla('111');
    this.casilla510 = this.casillaService.obtenerCasilla('510');
    this.casilla511 = this.casillaService.obtenerCasilla('511');
    this.casilla514 = this.casillaService.obtenerCasilla('514');
    this.casilla512 = this.casillaService.obtenerCasilla('512');
    this.casilla522 = this.casillaService.obtenerCasilla('522');
    this.casilla519 = this.casillaService.obtenerCasilla('519');
    this.casilla513 = this.casillaService.obtenerCasilla('513');
    this.casilla116 = this.casillaService.obtenerCasilla('116');
    this.casilla517 = this.casillaService.obtenerCasilla('517');
    // DETERMINA DEUDA
    this.casilla120 = this.casillaService.obtenerCasilla('120');
    this.casilla122 = this.casillaService.obtenerCasilla('122');
    this.casilla158 = this.casillaService.obtenerCasilla('158');
    this.casilla167 = this.casillaService.obtenerCasilla('167');
    this.casilla563 = this.casillaService.obtenerCasilla('563');
    this.casilla564 = this.casillaService.obtenerCasilla('564');
    this.casilla565 = this.casillaService.obtenerCasilla('565');
    this.casilla125 = this.casillaService.obtenerCasilla('125');
    this.casilla127 = this.casillaService.obtenerCasilla('127');
    this.casilla128 = this.casillaService.obtenerCasilla('128');
    this.casilla130 = this.casillaService.obtenerCasilla('130');
    this.casilla131 = this.casillaService.obtenerCasilla('131');
    this.casilla141 = this.casillaService.obtenerCasilla('141');
    this.casilla140 = this.casillaService.obtenerCasilla('140');
    this.casilla142 = this.casillaService.obtenerCasilla('142');
    this.casilla144 = this.casillaService.obtenerCasilla('144');
    this.casilla145 = this.casillaService.obtenerCasilla('145');
    this.casilla146 = this.casillaService.obtenerCasilla('146');
    this.casilla168 = this.casillaService.obtenerCasilla('168');
    this.resumenTrabajo = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo;
  }

}
