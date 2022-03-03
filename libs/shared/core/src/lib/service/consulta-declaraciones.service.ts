import { Injectable } from '@angular/core';
import { ConstantesUris } from '@rentas/shared/constantes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Consulta, Presentacion, RowConstnacia } from '@rentas/shared/types';
import { SessionStorage } from '@rentas/shared/utils'
import { map, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { ConstanciaRespuestaUtil } from '@rentas/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ConsultaDeclaracionesService {

  constructor(private http: HttpClient) { }

  public obtenerDeclaraciones(formulario: string, ejercicio: string): Observable<Consulta[]> {
    const ruc = SessionStorage.getnumRuc();
    return this.http.get(ConstantesUris.URI_CONSULTA_DECLARACIONES.replace('{numRuc}', ruc).replace('{ejercicio}', ejercicio).replace('{formulario}', formulario))
      .pipe(map((data: any) => {
        return data.presentacion;
      }),
        catchError(() => of([]))
      );
  }

  public obtenerDetalle(idPresentacion: string): Observable<Presentacion> {
    return this.http.get<Presentacion>(ConstantesUris.URI_CONSULTA_DETALLE_FORMULARIO.replace('{idPresentacion}', idPresentacion));
  }

  public obtenerConstancia(idPresentacion: string): Observable<RowConstnacia[]> {
    return this.http.get(ConstantesUris.URI_CONSULTA_CONSTANCIA_FORMULARIO.replace('{idPresentacion}', idPresentacion))
      .pipe(map(respueta => new ConstanciaRespuestaUtil(respueta).getListRowConstancias()));
  }

  public obtenerVisorCompleto(numeroOperacionSunat: string): Observable<{ nameFile: string, content: ArrayBuffer }> {
    const uri = ConstantesUris.URI_VISORCONSTANCIA_GUARDAR_COMPLETO
      .replace('{numeroOperacionSunat}', numeroOperacionSunat);
    return this.http.get(uri, { observe: 'response', responseType: 'arraybuffer' }).pipe(
      map(resp => {
        const content = resp.body;
        const nameFile = resp.headers.get('Content-disposition')
          .replace(/"/g, '')
          .split('=').pop();
        return { nameFile, content };
      })
    );
  }

}
