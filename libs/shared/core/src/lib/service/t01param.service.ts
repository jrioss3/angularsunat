import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantesUris } from '@rentas/shared/constantes';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class T01paramService {

  constructor(private http: HttpClient) { }

  obtenerParametros(codParametro: string): Observable<any> {
    return this.http.get<any>(ConstantesUris.URI_T01PARAM.replace('{codParametro}', codParametro))
      .pipe(map((data) => {
        if (codParametro === '123') {
          data.listaParametros = data.listaParametros.filter(x => x.desParametro.substring(55, 56) === '1');
        }
        return data.listaParametros;
      }),
        catchError(() => of([]))
      );
  }
}
