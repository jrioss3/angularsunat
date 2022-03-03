import { PreDeclaracionService } from './preDeclaracion.service';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConstantesUris } from './../utils/constantesUris';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStorage } from '@rentas/shared/utils';
import { Formulario } from '@rentas/shared/types';
import { PreDeclaracionModel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProcesarPresentarPagarService {

  constructor(
    private http: HttpClient,
    private predeclaracionService: PreDeclaracionService
  ) { }

  public presentarPagar( request: any): Observable<any> {
    const uri = ConstantesUris.URI_PASARELA_PRESENTE_PAGE;

    /*let header = new HttpHeaders();
    header = header.append("timeout",`${ 10000 }`);
    header = header.append("Content-Type",`application/json;charset=utf-8`);*/
    return this.http.post(uri, request)
      .pipe(
        tap(console.log),
        map(response => response as any)
      );
  }

  public validarFraccionamiento(codDep: string, numRuc: string ): Observable<{cod: string, msg: string}> {
    const uri = ConstantesUris.URI_PASARELA_VALIDAR_FRACCIONAMIENTO;
    return this.http.get<{cod: string, msg: string}>(`${uri}?codDep=${codDep}&numRuc=${numRuc}`);
  }

  public validarFechaVencimiento(): Observable<{isDentroVencimiento: boolean; mensaje: string}> {
    const ruc = SessionStorage.getUserData().numRUC;
    const periodo = SessionStorage.getPreDeclaracion<PreDeclaracionModel>().perTri;
    const formulario = SessionStorage.getFormulario<Formulario>().codFormulario;

    const uri = ConstantesUris.URI_VALIDAR_FECHA_VENCIMIENTO + '?numRuc=' +  ruc +
      '&periodo=' + periodo + '&formulario=' + formulario;

    return this.http.get<{isDentroVencimiento: boolean; mensaje: string}>(uri);
  }

  public fraccionamientoRegistroSolicitudes(numOrd: string, desCas: '1'|'2'): Observable<any> {

    const uri = ConstantesUris.URI_FRACCIONAMIENTO_REGISTRO_SOLICITUDES;

    const codFor = SessionStorage.getFormulario<Formulario>().codFormulario;
    // const desCas = '1';
    const codDepen = SessionStorage.getUserData().codDepend;

    const request = {
      cod_for : codFor,
      num_ord : numOrd,
      des_cas : desCas,
      cod_depen : codDepen
    };

    return this.http.post(uri, request);
  }

  public obtenerUriFraccionamiento(request: any): Observable<any> {
    const uri = ConstantesUris.URI_PASARELA_VALIDAR_FRACCIONAMIENTO;
    const data = request.build();
    return this.http.post<any>(uri, data);
  }

  public obtenerUriDevolucion(request: any): Observable<any> {
    const uri = ConstantesUris.URI_LINK_DEVOLUCION;
    const data = request.build();
    return this.http.post<any>(uri, data);
  }
}