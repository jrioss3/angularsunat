import { Injectable } from '@angular/core';
import { PreDeclaracionService } from './preDeclaracion.service';

@Injectable()
export class HabilitarCasillas2021Service {

  public anioRenta = '';

  constructor(private preDeclaracionService: PreDeclaracionService) {}

  public habilitarCasillasITAN(): boolean { 
    this.anioRenta = this.preDeclaracionService.obtenerNumeroEjercicio();
    return Number(this.anioRenta) >= 2021;
  }
}
