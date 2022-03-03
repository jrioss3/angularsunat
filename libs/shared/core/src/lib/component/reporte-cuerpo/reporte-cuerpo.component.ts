import { Component, OnInit } from '@angular/core';
import { ReporteUtil, SessionStorage } from '@rentas/shared/utils';
import { UserData } from '@rentas/shared/types'
import * as moment from 'moment';

@Component({
  selector: 'rentas-reporte-cuerpo',
  templateUrl: './reporte-cuerpo.component.html',
  styleUrls: ['./reporte-cuerpo.component.css']
})
export class ReporteCuerpoComponent extends ReporteUtil implements OnInit {

  userData: UserData;
  numRuc: string;
  cabecera: any;
  no20 = true;
  numDni: string;
  tipoDeclaracion: string;
  fechaActual:string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.userData = SessionStorage.getUserData();
    this.numRuc = this.userData.numRUC;
    this.cabecera = this.preDeclaracion.declaracion.generales.cabecera;

    if ((this.userData.map.ddpData.ddp_flag22 === '10') && (this.userData.map.ddpData.ddp_estado === '20')) {
      this.no20 = false;
      this.numDni = this.numRuc.substring(2, this.numRuc.length - 1);
    }

    this.tipoDeclaracion = this.getDescRectificatoriOriginal(
      this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria
    );

    this.fechaActual = moment().format('DD/MM/YYYY');
  }

}
