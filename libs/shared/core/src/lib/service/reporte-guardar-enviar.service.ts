import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReporteGuardarSolicitud } from '@rentas/shared/types';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ReporteGuardarEnviarService {

  constructor(private http: HttpClient) { }

  public guardar(uri: string, solicutud: ReporteGuardarSolicitud): Observable<{ file: Blob, name: string }> {
    return this.http.post(uri, solicutud, {
      responseType: 'blob',
      observe: 'response',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).pipe(
      map(respuesta => {
        return {
          file: respuesta.body,
          name: respuesta.headers
            .get('content-disposition').trim().split('=').pop()
        }
      })
    );
  }

  public enviar(uri: string, solicutud: ReporteGuardarSolicitud) {
    return this.http.post(uri, solicutud);
  }

}