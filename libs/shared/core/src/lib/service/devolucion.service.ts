import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DevolucionPlataforma, DevolucionRespuesta, DevolucionSolicitud, TributoDevolucion } from '@rentas/shared/types';
import { DevolucionFactoryUtil } from '@rentas/shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevolucionService {

  constructor(
    private http: HttpClient
  ) { }

  public linkDevolucion(uri: string, solicitud: DevolucionSolicitud): Observable<DevolucionRespuesta> {
    return this.http.post<DevolucionRespuesta>(uri, solicitud);
  }

  public tieneDevolucion(tipo: DevolucionPlataforma): Array<TributoDevolucion> {
    return DevolucionFactoryUtil.newInstancia(tipo).getDevolucionPorTributo();
  }

}
