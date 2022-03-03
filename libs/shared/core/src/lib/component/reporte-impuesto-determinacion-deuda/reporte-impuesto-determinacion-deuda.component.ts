import { Component, OnInit } from '@angular/core';
import { Casilla } from '@rentas/shared/types';
import { ReporteUtil } from '@rentas/shared/utils';
import { CasillaService } from '../../service/casilla.service';

@Component({
  selector: 'rentas-reporte-impuesto-determinacion-deuda',
  templateUrl: './reporte-impuesto-determinacion-deuda.component.html',
  styleUrls: ['./reporte-impuesto-determinacion-deuda.component.css']
})
export class ReporteImpuestoDeterminacionDeudaComponent extends ReporteUtil implements OnInit {

  casilla137 : Casilla;
  casilla138 : Casilla;
  casilla139 : Casilla;
  casilla142 : Casilla;
  casilla505 : Casilla;
  casilla141 : Casilla;
  casilla144 : Casilla;
  casilla145 : Casilla;
  casilla146 : Casilla;
  casilla180 : Casilla;
  casDetDeudaPJ: any;

  constructor(private casillaService: CasillaService) {
    super();
  }

  ngOnInit(): void {

    this.casilla137 = this.casillaService.obtenerCasilla('137');
    this.casilla138 = this.casillaService.obtenerCasilla('138');
    this.casilla139 = this.casillaService.obtenerCasilla('139');
    this.casilla142 = this.casillaService.obtenerCasilla('142');
    this.casilla505 = this.casillaService.obtenerCasilla('505');
    this.casilla141 = this.casillaService.obtenerCasilla('141');
    this.casilla144 = this.casillaService.obtenerCasilla('144');
    this.casilla145 = this.casillaService.obtenerCasilla('145');
    this.casilla146 = this.casillaService.obtenerCasilla('146');
    this.casilla180 = this.casillaService.obtenerCasilla('180');

    this.casDetDeudaPJ = this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ;

  }

}
