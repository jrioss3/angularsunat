import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ConstantesUris } from '../utils/constantesUris';
import { map } from 'rxjs/operators';
import { environment } from '@rentas/shared/environments';
import { SessionStorage } from '@rentas/shared/utils';
import { Formulario } from '@rentas/shared/types';

@Injectable({
  providedIn: 'root'
})
export class PasarelaPagosService {

  constructor(
    private http: HttpClient) { }

  parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  public presentarPagar(request: any): Observable<any> {
    const uri = ConstantesUris.URI_PASARELA_PRESENTE_PAGE;
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    // .append('X-Custom-Udata', JSON.stringify(this.parseJwt(this.getxCustomUdata()).userdata));
    return this.http.post(uri, request, { headers })
      .pipe(
        map(response => response as any)
      );
  }

  /**
   * Este metodo se llama cuando el monto a pagar no es cero.
   * la funcionalidad que cumple este metdo
   */
  public parametriaPasarela(): Observable<any> {
    const uri = ConstantesUris.URI_PARAMETRIA_PASARELA;
    return this.http.get<any>(uri);
  }

  /*
  * Este metodo se utilza para validar cuando el contribuyente seleciona pagar.
  */
  public validarPresentacion(
    request: any,
    entidadFinanciera: any
  ): Observable<any> {

    const uri = ConstantesUris.URI_VALIDAR_PRESENTACION;
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('codMedpag', entidadFinanciera.codMedPag.toString())
      .append('codEntFin', entidadFinanciera.codEntFin.toString());
    // .append('X-Custom-Udata', JSON.stringify(this.parseJwt(this.getxCustomUdata()).userdata));
    return this.http.post(uri, JSON.parse(JSON.stringify(request)), { headers }).pipe(
      map(response => response as any)
    );
  }

  public proxypagoRealizarPago(
    response: any,
    entidadFinanciera: any,
    montoApagar: number
  ): Observable<any> {

    const uri = ConstantesUris.URI_PROXYPAGO_REGISTRO_REALIZARPAGO;
    const idFormulario = SessionStorage.getFormulario<Formulario>().codFormulario;
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('IdFormulario', idFormulario)
      .append('IdCache', '12312');
    // .append('X-Custom-Udata', JSON.stringify(this.parseJwt(this.getxCustomUdata()).userdata));
    const tramaQA: any = {
      numeroPago: '',
      codEntFinan: '',
      tipoOpera: '',
      numOperaBanco: '',
      fechaPago: '',
      horaPago: '',
      numRuc: '',
      impPago: this.padLeft(montoApagar, 12),
      codRespBanco: '',
      tipoServicio: '',
    };

    const request: any = {
      numTransApliCli: response.resultado.numeroOperacionSunat,
      numPas: '1',
      numMedPagPas: '2',
      codTipmon: '00',
      codMedpag: entidadFinanciera.codMedPag.toString(),
      codEntFin: entidadFinanciera.codEntFin.toString(),
      tipoOperacion: '1',
      codTipSer: '01',
      mtoOpe: montoApagar.toString(),
      codMedPre: '01',
      codAplCli: '01',
      habilitaQA: environment.habilita_qa, // 1: Solicitud a los bancos, 0: Simulación
      tipoTrama: '01',
      tramaQA
    };

    return this.http.post(uri, request, { headers }).pipe(
      map(resp => resp as any)
    );
  }

  public validarFraccionamiento(codDep: string, numRuc: string): Observable<{ cod: string, msg: string }> {
    const uri = ConstantesUris.URI_PASARELA_VALIDAR_FRACCIONAMIENTO;
    return this.http.get<{ cod: string, msg: string }>(`${uri}?codDep=${codDep}&numRuc=${numRuc}`);
  }

  padLeft(value, length): string {
    return (value.toString().length < length) ? this.padLeft('0' + value, length) :
      value;
  }
}
