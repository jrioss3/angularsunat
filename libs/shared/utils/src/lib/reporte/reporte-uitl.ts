import { Component, Input } from '@angular/core';
import { TipoReporte, Casilla } from '@rentas/shared/types';
import { SessionStorage } from '../session-storage/session-storage';

@Component({
  template: '',
})
export abstract class ReporteUtil {
  @Input() tipoReporte: TipoReporte;
  @Input() preDeclaracion: any;
  @Input() fechaPresentacion: string;
  @Input() numOrden: string;

  get esPreliminar(): boolean {
    return this.tipoReporte === TipoReporte.PRELIMINAR;
  }

  getListaParametro(id: string) {
    return SessionStorage.getCombos().find((combo) => combo.codigo === id)
      .listaParametro;
  }

  cambiar10ToYesNo(datoBinario: any) {
    let datoString = '';
    if (datoBinario == '1') {
      datoString = 'SI';
    } else if (datoBinario == '0') {
      datoString = 'NO';
    }
    return datoString;
  }

  getCasilla(id: string): Casilla {
    const casillas = SessionStorage.getCasillas();
    const casilla = casillas.find((item) => item.numCas === id);
    casilla.descAyuda = this.evaluarCadena(casilla.descAyuda);
    casilla.descripcion = this.evaluarCadena(casilla.descripcion);
    casilla.longMinima = Number(casilla.longMinima);
    casilla.longMaxima = Number(casilla.longMaxima);
    return casilla;
  }

  get numEjercicio() {
    return this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
  }

  evaluarCadena(cadena = ''): string {
    const ejercicio = this.numEjercicio;
    cadena = cadena || '';
    cadena = cadena
      .replace(new RegExp('AAAA-1', 'g'), (Number(ejercicio) - 1).toString())
      .replace(new RegExp('AAAA\\+1', 'g'), (Number(ejercicio) + 1).toString())
      .replace(new RegExp('AAAA', 'g'), ejercicio);

    return cadena;
  }

  getDescRectificatoriOriginal(datoBinario: any) {
    let datoString = '';
    if (datoBinario == '0') {
      datoString = 'Original';
    } else if (datoBinario == '1') {
      datoString = 'Sustitutoria/Rectificatoria';
    }
    return datoString;
  }
}
