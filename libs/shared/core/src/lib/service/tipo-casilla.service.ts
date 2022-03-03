import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConstantesParametros, ConstantesUris } from '@rentas/shared/constantes';
import { TipoCasilla } from '@rentas/shared/types';
import { SessionStorage } from '@rentas/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class TipoCasillaService {

  private readonly codFormularioJuridico = ConstantesParametros.COD_FORMULARIO_PPJJ;
  private readonly codFormularioNatural = ConstantesParametros.COD_FORMULARIO_PPNN;
  private readonly codBoleta = '1662';

  constructor(
    private http: HttpClient
  ) { }

  cargarTiposCasilla(): Observable<Array<TipoCasilla>> {

    const uri = ConstantesUris.URI_TIPO_CASILLAS;

    const forJuridico = new RegExp('^' + this.codFormularioJuridico + '.*$', 'i');
    const forNatural = new RegExp('^' + this.codFormularioNatural + '.*$', 'i');
    const forBoleta = new RegExp('^' + this.codBoleta + '.*$', 'i');

    return this.http.get(uri).pipe(
      map((resp: any) => resp.listaParametros as Array<any>),
      map( listaParametros => listaParametros.filter( e => 
          forJuridico.test(e.codParametro) ||
          forNatural.test(e.codParametro) ||
          forBoleta.test(e.codParametro)
      )),
      map( listaParametros => listaParametros.map(TipoCasilla.newInstance))
    );
  }

  findTipoCasilla(numCasilla: number): TipoCasilla {
    const casillas = SessionStorage.getTipoCasillas();
    return casillas.find( e => Number(e.numCasilla) === numCasilla);
  }

}
