import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ValidarPresentacionRespuesta, Presentacion, MedioPago } from '@rentas/shared/types';
import { Observable } from 'rxjs';
import { ConstantesUris } from '@rentas/shared/constantes';

@Injectable({
  providedIn: 'root'
})
export class PasarelaService {

  constructor(private http: HttpClient) { }

  validarPresentacion(solicitud:Presentacion, codMedPag: string, codEntFin: string) {
    const uri = ConstantesUris.URI_VALIDAR_PRESENTACION;
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('codMedpag', codMedPag)
      .append('codEntFin', codEntFin);

    return this.http.post<ValidarPresentacionRespuesta>(uri, solicitud, { headers });
  }

}
