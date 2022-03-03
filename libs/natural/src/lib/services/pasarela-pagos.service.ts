import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
    private http: HttpClient
    // private predeclaracionService: PreDeclaracionService
  ) { }

  public presentarPagar(request: any): Observable<any> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const uri = ConstantesUris.URI_PASARELA_PRESENTE_PAGE;
    //console.log(request);
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
    request: any, entidadFinanciera: any
  ): Observable<any> {

    const uri = ConstantesUris.URI_VALIDAR_PRESENTACION;
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('codMedpag', entidadFinanciera.codMedPag.toString())
      .append('codEntFin', entidadFinanciera.codEntFin.toString());

    return this.http.post(uri, request, {headers}).pipe(
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

  private padLeft(value, length): string {
    return (value.toString().length < length) ? this.padLeft('0' + value, length) :
    value;
  }

  parseJwt(token) {
    //console.log(token);
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    console.log('pass');
    return JSON.parse(jsonPayload);
  }

}

