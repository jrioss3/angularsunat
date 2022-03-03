import { Component, OnInit } from '@angular/core';
import { ConstanciaService } from '../core/constancia.service';
import { NpsRespuesta, Interes, PagoProyectado } from '@rentas/shared/types';
import { Nidi } from '@rentas/shared/utils';

@Component({
  selector: 'rentas-tab-nps',
  templateUrl: './tab-nps.component.html',
  styleUrls: ['./tab-nps.component.css']
})
export class TabNpsComponent extends Nidi implements OnInit {

  public npsRespuesta: NpsRespuesta = null;

  constructor(private constanciaService: ConstanciaService) {
    super();
    this.npsRespuesta = this.constanciaService.getNpsRespuesta();
  }

  ngOnInit(): void {

  }

  obtenerTotalInteres(): Array<{ monto: number }> {
    let item = 0;
    let item2 = 0;
    let item3 = 0;
    for (let i = 0; i < this.npsRespuesta.nps.pagoProyectado.length; i++) {
      item += this.npsRespuesta.nps.pagoProyectado[i].interes[0].monto;
      item2 += this.npsRespuesta.nps.pagoProyectado[i].interes[1].monto;
      item3 += this.npsRespuesta.nps.pagoProyectado[i].interes[2].monto;
    }
    return Array.of(
      { monto: item },
      { monto: item2 },
      { monto: item3 },
    );
  }

  getInteres(): Array<Interes> {
    return this.npsRespuesta.nps.pagoProyectado[0].interes;
  }

  getPagoProyectado(): Array<PagoProyectado> {
    return this.npsRespuesta.nps.pagoProyectado;
  }

  get razonSocial(): string {
    return this.constanciaService.getConstanciaRespuesta().resultado.razonSocial;
  }
}
