import { Component, Input, OnInit } from '@angular/core';
import { SessionStorage, ReporteUtil } from '@rentas/shared/utils';
import { UserData } from '@rentas/shared/types';

@Component({
  selector: 'rentas-reporte-header',
  templateUrl: './reporte-header.component.html',
  styleUrls: ['./reporte-header.component.css']
})
export class ReporteHeaderComponent extends ReporteUtil implements OnInit {

  @Input() texto: string;

  dataReporteDefinitivo: boolean;

  cabecera: any = null;
  userData: UserData;
  public no20 = true;
  public numRuc: string;
  public numDni: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.cabecera = this.preDeclaracion.declaracion.generales.cabecera;
    this.userData = SessionStorage.getUserData();

    this.numRuc = this.userData.numRUC;

    if (this.userData.map.ddpData.ddp_estado === '20') {
      this.no20 = false;
      this.numDni = this.numRuc.substring(2, this.numRuc.length - 1);
    }
    this.cabecera = this.preDeclaracion.declaracion.generales.cabecera;

  }

}
