import { Injectable } from '@angular/core';
import { ConstantesUris } from '@rentas/shared/constantes';
import { Constancia } from '@rentas/shared/types';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionStorage } from '@rentas/shared/utils';
import { Formulario } from '@rentas/shared/types';
import { environment } from '@rentas/shared/environments';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(
    private http: HttpClient
  ) { }

  public proxypagoRealizarPago(
    numeroOperacionSunat: string,
    codMedPag: string, 
    codEntFin: string, 
    montoApagar: number
  ): Observable<Constancia>{
    const uri = ConstantesUris.URI_PROXYPAGO_REGISTRO_REALIZARPAGO;

    const idFormulario = SessionStorage.getFormulario<Formulario>().codFormulario;
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('IdFormulario', idFormulario)
      .append('IdCache', '12312');
    
    const tramaQA = {
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

    const request = {
      numTransApliCli: numeroOperacionSunat,
      numPas: '1',
      numMedPagPas: '2',
      codTipmon: '00',
      codMedpag: codMedPag.toString(),
      codEntFin: codEntFin.toString(),
      tipoOperacion: '1',
      codTipSer: '01',
      mtoOpe: montoApagar.toString(),
      codMedPre: '01',
      codAplCli: '01',
      habilitaQA: environment.habilita_qa, // 1: Solicitud a los bancos, 0: Simulación
      tipoTrama: '01',
      tramaQA
    };

    return this.http.post<Constancia>(uri, request, { headers });

  }

  padLeft(value, length): string {
    return (value.toString().length < length) ? this.padLeft('0' + value, length) :
      value;
  }

}
