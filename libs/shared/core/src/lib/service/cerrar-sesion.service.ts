import { ConstantesUris } from '@rentas/shared/constantes';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CerrarSesionService {
  constructor(private http: HttpClient) {}

  public logaut(): Observable<any> {
    return this.http.delete(ConstantesUris.URI_CERRAR_SESION);
  }

  public async logautEvent() {
    return await this.http.delete(ConstantesUris.URI_CERRAR_SESION).toPromise();
  }
}
