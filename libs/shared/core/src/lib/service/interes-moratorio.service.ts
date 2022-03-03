import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantesUris } from '@rentas/shared/constantes';
import { SessionStorage } from '@rentas/shared/utils';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InteresMoratorioService {

    constructor(private http: HttpClient) { }

    public obtenerFactorInteresMoratorio(tributo: string):Observable<{ factorInteres: number }> {
        const uri = ConstantesUris.URI_OBTENER_INTERES_MORATORIO;
        const preDeclaracion = SessionStorage.getPreDeclaracion<any>();
        const numRuc = preDeclaracion.numRuc;
        const periodo = preDeclaracion.perTri;

        return this.http.get<{ factorInteres: number }>(`${uri}/${tributo}/${periodo}/${numRuc}`);
    }

    public getInteresMoratorioNatural(tributo: string, montoDeuda: number): number {
        return Math.round(SessionStorage.getFactorInteresMoratorioNatural().find(factor => factor.id == tributo).factor * montoDeuda);
    }
}
