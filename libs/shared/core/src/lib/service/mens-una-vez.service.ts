import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MensUnaVezService {
  
  private dtmMostrarMensaje = true;

  constructor() { }

  getDtmMostrarMensaje(): boolean {
    return this.dtmMostrarMensaje;
  }

  setDtmMostrarMensaje(dtmMostrarMensaje: boolean): void {
    this.dtmMostrarMensaje = dtmMostrarMensaje;
  }

}
