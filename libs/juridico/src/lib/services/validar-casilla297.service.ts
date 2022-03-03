import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantesUris } from '@rentas/shared/constantes';
import { SessionStorage } from '@rentas/shared/utils';
import { Observable } from 'rxjs';
import { DetCredImpuestoRtaModelCas297 } from '../models/SeccionDeterminativa/detCredImpuestoRtaModel';

@Injectable()
export class ValidarCasilla297Service {

  constructor(
    private http: HttpClient) { }

  public obtenerDetalleCas297(modelo: DetCredImpuestoRtaModelCas297, tipoSaldo: string): Observable<any> {
    const uri = ConstantesUris.URI_CONSULTAR_CAS_297;
    const preDeclaracion = SessionStorage.getPreDeclaracion<any>();
    const numRuc = preDeclaracion.numRuc;
    const cod_depen = SessionStorage.getUserData().codDepend;

    return this.http.get<number>(`${uri}/${cod_depen}/${numRuc}?indTipo=${tipoSaldo}&numVal=${modelo.numVal ?? ''}&numRes=${modelo.numRes ?? ''}&codFormul=${modelo.codFor ?? ''}&numOrdDj=${modelo.numDoc ?? ''}`);
  }
}
