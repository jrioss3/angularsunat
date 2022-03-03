import { Injectable } from '@angular/core';

@Injectable()
export class PrincipalesSociosService {
  
  public valorPreguntaSocios = false;
  public lugarDeCarga = '';

  constructor() { }

  public respondioPregunta(valor: boolean) {
    this.valorPreguntaSocios = valor;
  }

  public lugarDeCargaDeData(valor: string) {
    this.lugarDeCarga = valor;
  }
}
