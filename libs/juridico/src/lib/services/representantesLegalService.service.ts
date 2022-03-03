import { ConstantesSocios } from './../utils/constantesSocios';
import { InfPrinAccionistasModel } from './../models/SeccionInformativa/infPrinAccionistasModel';
import { PreDeclaracionModel } from './../models/preDeclaracionModel';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConstantesUris } from '../utils/constantesUris';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { InfCasInformativaModel } from '../models/SeccionInformativa/infCasInformativaModel';
import { InfAlquileresModel } from '../models/SeccionInformativa/infAlquileresModel';
import { ConstantesParametros } from '@rentas/shared/constantes';
import { ListaRepresentantes } from '@rentas/shared/types';

@Injectable()
export class RepresentasLegalesService {

    constructor(private http: HttpClient) { }

    obtenerRepresentantesLegales(numRuc: string) {
        return this.http.get<ListaRepresentantes>
            (ConstantesUris.URI_REPRESENTANTES_LEGALES + '/' + numRuc)
            .pipe(catchError(() => {
                return of([]);
            }));
    }

    obtenerRegimen(numRuc: string, anio: string): Observable<boolean> {
        return this.http.get(ConstantesUris.URI_ANEXO_5 + '/' + numRuc + '/' + anio).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    /**
     * 
     * @param ruc ruc del contribuyente
     * @param periodo Periodo seleccionado menos 1
     */
    obtenerDatosEjercicioAnterior(ruc: string, periodo: string): Observable<any> {
        let ejercicioAnterior = '';
        if (Number(periodo) >= 2019) {
            ejercicioAnterior = ConstantesParametros.COD_FORMULARIO_PPJJ;
        } else {
            ejercicioAnterior = ConstantesParametros.COD_FORMULARIO_PPJJ_ANTERIOR;
        }
        return this.http.get(ConstantesUris.URI_CONSULTA_DATOS_CONTADOR +
            `?ruc=${ruc}&periodo=${periodo + ConstantesParametros.COD_PERIODO_ANUAL}` +
            `&formulario=${ejercicioAnterior}` +
            `&tipodeclaracion=${ConstantesParametros.COD_TIPO_DECLARACION}`)
            .pipe(map((data: PreDeclaracionModel) => {
                const datosContador = data.declaracion.seccInformativa.casInformativa as InfCasInformativaModel;
                let listaSocios = data.declaracion.seccInformativa.prinAccionistas.lisPrinAccionistas as InfPrinAccionistasModel[];
                const arrastreAnterior = data.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa.mtoCas880;
                const listaAlquileres = data.declaracion.seccInformativa.alquileres.lisAlquileres as InfAlquileresModel[];
                listaSocios = listaSocios.filter(x => x.codTipDocSocio !== ConstantesSocios.CONSOLIDADO);
                listaAlquileres.forEach(x => x.mtoAlquiler = 0);
                return { contador: datosContador, socios: listaSocios, arrastre: arrastreAnterior, alquileres: listaAlquileres };
            }),
                catchError(() => of({ contador: null, socios: [], arrastre: null, alquileres: [] }))
            );
    }

    obtenerCasilla107(ruc: string, periodo: string): Observable<any> {
        return this.http.get(ConstantesUris.URI_CONSULTA_DATOS_CONTADOR +
            `?ruc=${ruc}&periodo=${periodo + ConstantesParametros.COD_PERIODO_ANUAL}` +
            `&formulario=${ConstantesParametros.COD_FORMULARIO_PPJJ}` +
            `&tipodeclaracion=${ConstantesParametros.COD_TIPO_DECLARACION}`)
            .pipe(map((data: PreDeclaracionModel) => {
                const casilla107 = data.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa.mtoCas107;
                return { casilla107: casilla107, consulto: true };
            }),
                catchError(() => of({ casilla107: null, consulto: true }))
            );
    }

    public obtenerSociosFichaRuc(numRuc: string): Observable<InfPrinAccionistasModel[]> {
        return this.http.get<any>(ConstantesUris.URI_CONSULTA_FICHA_RUC + '/' + numRuc)
            .pipe(map((data: any) => {
                return this.formatearListaSocios(data);
            }),
                catchError(() => of([]))
            );
    }

    private formatearListaSocios(lista): InfPrinAccionistasModel[] {
        const listaSocios: InfPrinAccionistasModel[] = [];
        lista.map(socio => {
            const socioModel = {
                numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                codTipDocSocio: socio.codTipoSocio === '' ? null : socio.codTipoSocio,
                codTipDocPrincipal: this.esNumero(socio.codTipoDocSocio) ? socio.codTipoDocSocio.padStart(2, "0") : socio.codTipoDocSocio,
                numDocPrincipal: socio.numDocSocio,
                desDocPrincipal: socio.nomRazonSocial,
                fecNacPrincipal: socio.fecNacSocio,
                codPais: socio.codPais === '-' || socio.codPais === '' ? null : socio.codPais,
                porParticipacion: socio.porPorcentaje,
                fecConstitucion: socio.fecConstSocio
            }
            listaSocios.push(socioModel);
        })
        return listaSocios;
    }

    private esNumero(valor) {
        return String(valor).match(/^[0-9]*$/);
    }
}
