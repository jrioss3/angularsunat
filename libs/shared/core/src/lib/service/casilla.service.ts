import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantesParametros, ConstantesUris } from '@rentas/shared/constantes';
import { SessionStorage } from '@rentas/shared/utils';
import { Observable } from 'rxjs';
import { ComboService } from './combo.service';
import { Casilla } from '@rentas/shared/types';


@Injectable({
  providedIn: 'root'
})
export class CasillaService {

  constructor(
    private http: HttpClient,
    private comboService: ComboService) { }

  obtenerCasillasPN(ejercicio): Observable<any> {
    return this.http.get<any>(
      ConstantesUris.URI_BASE +
      'web' +
      '/' +
      ejercicio +
      '/' +
      ConstantesUris.GENERAL_FORMULARIO +
      '/' +
      ConstantesParametros.COD_FORMULARIO_PPNN +
      '/' +
      ConstantesUris.FORMULARIO_CASILLA
    );
  }

  obtenerCasillasPJ(ejercicio) {
    return this.http.get<any>(
      ConstantesUris.URI_BASE +
      'web' +
      '/' +
      ejercicio +
      '/' +
      ConstantesUris.GENERAL_FORMULARIO +
      '/' +
      ConstantesParametros.COD_FORMULARIO_PPJJ +
      '/' +
      ConstantesUris.FORMULARIO_CASILLA
    );
  }

  obtenerCasilla(id: string) {
    const casillas = SessionStorage.getCasillas();
    const casilla = casillas.find(item => item.numCas === id) || {} as Casilla;
    casilla.descAyuda = this.evaluarCadena(casilla?.descAyuda);
    casilla.descripcion = this.evaluarCadena(casilla?.descripcion);
    casilla.longMinima = Number(casilla?.longMinima);
    casilla.longMaxima = Number(casilla?.longMaxima);
    return casilla;
  }

  private obtenerEjercicio(): string {
    return SessionStorage.getPreDeclaracion<any>()
      .declaracion
      .generales
      .cabecera
      .numEjercicio;
  }

  private evaluarCadena(cadena = ''): string {
    const uit = this.comboService.obtenerUitEjercicioActual();
    cadena = cadena || '';
    cadena = cadena
      .replace(new RegExp('AAAA-1', 'g'), (Number(this.obtenerEjercicio()) - 1).toString())
      .replace(new RegExp('AAAA\\+1', 'g'), (Number(this.obtenerEjercicio()) + 1).toString())
      .replace(new RegExp('AAAA', 'g'), this.obtenerEjercicio())
      .replace(new RegExp('MTO_UITX24', 'g'), String(uit * 24))
      .replace(new RegExp('MTO_UITX7', 'g'), String(uit * 7))
      .replace(new RegExp('MTO_UITX3', 'g'), String(uit * 3))
      .replace(new RegExp('MTO_UIT', 'g'), String(uit));
    return cadena;
  }

  public filtrarFilaAsistentePorCodigoFila(codigo: string, filaAsistente: any): string {
    const data = filaAsistente.find((item) => item.codFila === codigo);
    return data?.descripcion || ""
  }
}
