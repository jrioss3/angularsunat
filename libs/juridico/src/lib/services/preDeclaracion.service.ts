import { DetDeterminacionDeudaModel } from './../models/SeccionDeterminativa/detDeterminacionDeudaModel';
import { ConstantesIdentificacion } from './../utils/constantesIdentificacion';
import { environment } from '@rentas/shared/environments';
import { Injectable } from '@angular/core';
import { PreDeclaracionModel } from '../models/preDeclaracionModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantesUris } from '../utils/constantesUris';
import { InfCasInformativaModel } from '../models/SeccionInformativa/infCasInformativaModel';
import { ImpRtaEmpresaModel } from '../models/SeccionDeterminativa/impRtaEmpresaModel';
import { DetCredImpuestoRtaModel } from '../models/SeccionDeterminativa/detCredImpuestoRtaModel';
import { ActivoEmp, PasivoPatrEmp, Ganancia } from '../models/SeccionDeterminativa/detEstFinancierosModel';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import * as sha1 from 'js-sha1';
import { ConstantesParametros } from '@rentas/shared/constantes';
import { ComboService, TipoCasillaService } from '@rentas/shared/core';
import { SessionStorage } from '@rentas/shared/utils';
import { UserData, TributoDevolucion } from '@rentas/shared/types';

@Injectable()
export class PreDeclaracionService {

    preDeclaracion: PreDeclaracionModel;

    constructor(private http: HttpClient, private comboService: ComboService,
        private tipoCasillaService: TipoCasillaService) { }

    cargarPreDeclaracion(ruc: string, periodo: string, indorigen?: string) {
        SessionStorage.setErroresInfo([]);
        SessionStorage.setErroresDet([]);
        const paramns = indorigen ?
            '?ruc=' + ruc + '&periodo=' + periodo + ConstantesParametros.COD_PERIODO_ANUAL +
            '&formulario=' + ConstantesParametros.COD_FORMULARIO_PPJJ + '&tipodeclaracion='
            + ConstantesParametros.COD_TIPO_DECLARACION + '&indorigen=' + indorigen :
            '?ruc=' + ruc + '&periodo=' + periodo + ConstantesParametros.COD_PERIODO_ANUAL +
            '&formulario=' + ConstantesParametros.COD_FORMULARIO_PPJJ + '&tipodeclaracion='
            + ConstantesParametros.COD_TIPO_DECLARACION;

        return this.http.get<PreDeclaracionModel>(ConstantesUris.URI_BASE_PD + environment.tmp_slash + paramns);
    }

    exportarPreDeclaracion_PPJJ(correo: string[]) {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        const obj = { correos: correo, declaracionPJ: this.preDeclaracion.declaracion };
        return this.http.post(ConstantesUris.URI_EXPORTAR_PPJJ, obj);
    }

    descargarPreDeclaracionSimple_MA_PPJJ(): Observable<any> {
        const correo = null;
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        const user = SessionStorage.getUserData();
        const obj = { correos: correo, declaracionPJ: this.preDeclaracion.declaracion, razonSocial: user.nombreCompleto };
        return this.http.post(ConstantesUris.URI_DESCARGAR_PPJJ_PRELIMINAR_SIMPLE, obj, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
    }

    descargarPreDeclaracionSimple_PPJJ(obj: any): Observable<any> {
        return this.http.post(ConstantesUris.URI_DESCARGAR_PPJJ_SIMPLE, obj, {
            responseType: 'blob',
            // 'Accept-Encoding: gzip, deflate' \
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
    }

    enviarPreDeclaracionSimple_MA_PPJJ(correo: string[]) {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        const user = SessionStorage.getUserData();
        const obj = { correos: correo, declaracionPJ: this.preDeclaracion.declaracion, razonSocial: user.nombreCompleto };
        return this.http.post(ConstantesUris.URI_ENVIAR_PPJJ_PRELIMINAR_SIMPLE, obj);
    }

    enviarPreDeclaracionSimple_PPJJ(correo: string[], numeroOrden: any) {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        const preDeclaracionClon = JSON.parse(JSON.stringify(this.preDeclaracion));
        preDeclaracionClon.declaracion.generales.cabecera.numOrden = numeroOrden;
        const user = SessionStorage.getUserData();
        const obj = { correos: correo, declaracionPJ: preDeclaracionClon.declaracion, razonSocial: user.nombreCompleto };
        return this.http.post(ConstantesUris.URI_ENVIAR_PPJJ_SIMPLE, obj);
    }

    guardarDeclaracion(indiAnt?: string) {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        SessionStorage.setPreDeclaracion(this.preDeclaracion);
        return this.http.post(ConstantesUris.URI_BASE_PD + '/save', this.preDeclaracion);
    }

    reestablecerPersonalizado() {
        const numEjercicio = this.obtenerNumeroEjercicio().toString();
        const paramns = 'reset?ruc=' + this.preDeclaracion.numRuc +
            '&periodo=' + numEjercicio + ConstantesParametros.COD_PERIODO_ANUAL +
            '&formulario=' + ConstantesParametros.COD_FORMULARIO_PPJJ +
            '&tipodeclaracion=' + ConstantesParametros.COD_TIPO_DECLARACION;
        return this.http.post(ConstantesUris.URI_BASE_PD /*+ '/' +*/ + environment.tmp_slash + paramns, null);
    }

    generarValHash() {
        const predeclaracion = SessionStorage.getPreDeclaracion();
        SessionStorage.setValHash(sha1(predeclaracion));
    }

    validarPD() {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        if (environment.tmp_slash === '/') {
            return this.http.post(ConstantesUris.URI_VALIDAR +
                '/validaDJ', this.preDeclaracion); // ?numSec=' +
            /*this.preDeclaracion.declaracion.generales.cabecera.numSec);*/
        }
        return this.http.post(ConstantesUris.URI_VALIDAR + '/'
            + this.obtenerNumeroEjercicio(), this.preDeclaracion); /*  + '/' +
            this.preDeclaracion.declaracion.generales.cabecera.numSec);*/
    }

    public obtenerNumSec(): string {
        return SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.generales.cabecera.numSec + '';
    }

    obtenerNumeroEjercicio(): string {
        return SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.generales.cabecera.numEjercicio;
    }

    obtenerRucPredeclaracion(): string {
        return SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.generales.cabecera.numRuc;
    }

    obtenerMontosPreDeclaracion(): Array<any> {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        let casillas: any[]; // Casillas ==> mtoCas
        casillas = [];

        // Informativa
        // seccInformativa ==> casInformativa
        let casillaInf: InfCasInformativaModel;
        casillaInf = this.preDeclaracion.declaracion.seccInformativa.casInformativa;
        for (const prop in casillaInf) {
            // refTabla
            if (prop.toString().indexOf('refTabla') !== 0 && prop.toString().indexOf('numFormul') !== 0
                && prop.toString() !== 'mtoCas002') {
                const casillaCurrent: any = {
                    codTipCam: '01',
                    desValCas: casillaInf[`${prop}`] ? casillaInf[`${prop}`].toString() : null,
                    indDel: '0',
                    numCas: Number(prop.toString().substr(6))
                };
                casillas.push(casillaCurrent);
            }
        }

        // Determinativa
        // seccDeterminativa/impuestoRta ==> impuestoRtaEmpresa
        let casillaImpuestoRE: ImpRtaEmpresaModel;
        casillaImpuestoRE = this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa;
        for (const prop in casillaImpuestoRE) {
            // refTabla
            if (prop.toString() !== 'refTabla' && prop.toString() !== 'numFormul') {
                const casillaCurrent: any = {
                    codTipCam: '01',
                    desValCas: casillaImpuestoRE[`${prop}`] ? casillaImpuestoRE[`${prop}`].toString() : null,
                    indDel: '0',
                    numCas: Number(prop.toString().substr(6))
                };
                casillas.push(casillaCurrent);
            }
        }

        // seccDeterminativa/credImpuestoRta ==> credImprenta
        let casillaCredImprenta: DetCredImpuestoRtaModel;
        casillaCredImprenta = this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta;
        for (const prop in casillaCredImprenta) {
            // refTabla
            if (prop.toString() !== 'refTabla' && prop.toString() !== 'numFormul') {
                const casillaCurrent: any = {
                    codTipCam: '01',
                    desValCas: casillaCredImprenta[`${prop}`] ? casillaCredImprenta[`${prop}`].toString() : null,
                    indDel: '0',
                    numCas: Number(prop.toString().substr(6))
                };
                casillas.push(casillaCurrent);
            }
        }

        // seccDeterminativa/estFinancieros ==> activoEmp
        let casillaActivoEmp: ActivoEmp;
        casillaActivoEmp = this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.activoEmp;
        for (const prop in casillaActivoEmp) {
            // refTabla
            if (prop.toString() !== 'refTabla' && prop.toString() !== 'numFormul') {
                const casillaCurrent: any = {
                    codTipCam: '01',
                    desValCas: casillaActivoEmp[`${prop}`] ? casillaActivoEmp[`${prop}`].toString() : null,
                    indDel: '0',
                    numCas: Number(prop.toString().substr(6))
                };
                casillas.push(casillaCurrent);
            }
        }

        // seccDeterminativa/estFinancieros ==> pasivoPatrEmp
        let casillaPasivoPE: PasivoPatrEmp;
        casillaPasivoPE = this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.pasivoPatrEmp;
        for (const prop in casillaPasivoPE) {
            // refTabla
            if (prop.toString() !== 'refTabla' && prop.toString() !== 'numFormul') {
                const casillaCurrent: any = {
                    codTipCam: '01',
                    desValCas: casillaPasivoPE[`${prop}`] ? casillaPasivoPE[`${prop}`].toString() : null,
                    indDel: '0',
                    numCas: Number(prop.toString().substr(6))
                };
                casillas.push(casillaCurrent);
            }
        }

        // seccDeterminativa/estFinancieros ==> ganancia
        let casillaGanancia: Ganancia;
        casillaGanancia = this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia;
        for (const prop in casillaGanancia) {
            // refTabla
            if (prop.toString() !== 'refTabla' && prop.toString() !== 'numFormul') {
                const casillaCurrent: any = {
                    codTipCam: '01',
                    desValCas: casillaGanancia[`${prop}`] ? casillaGanancia[`${prop}`].toString() : null,
                    indDel: '0',
                    numCas: Number(prop.toString().substr(6))
                };
                casillas.push(casillaCurrent);
            }
        }
        let userData: UserData;
        userData = SessionStorage.getUserData();

        // Casillas auditoría
        const casilla2: any = {
            codTipCam: '01',
            desValCas: userData.numRUC,
            indDel: '0',
            numCas: 2
        };

        casillas.push(casilla2);

        const casilla5: any = {
            codTipCam: '01',
            desValCas: this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria,
            indDel: '0',
            numCas: 5
        };

        casillas.push(casilla5);
        const monto180 = this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180;
        const casilla180: any = {
            codTipCam: '01',
            desValCas: monto180 == null ? null : String(monto180),
            indDel: '0',
            numCas: 180
        };

        casillas.push(casilla180);

        const casilla61: any = {
            codTipCam: '01',
            desValCas: '1',
            indDel: '0',
            numCas: 61
        };

        casillas.push(casilla61);

        const casilla13: any = {
            codTipCam: '01',
            desValCas: moment().format('DD/MM/YYYY'),
            indDel: '0',
            numCas: 13
        };
        casillas.push(casilla13);

        const casilla58: any = {
            codTipCam: '01',
            desValCas: moment().format('HH:mm:ss'),
            indDel: '0',
            numCas: 58
        };
        casillas.push(casilla58);

        const casilla7: any = {
            codTipCam: '01',
            desValCas: this.obtenerNumeroEjercicio().toString() + '13',
            indDel: '0',
            numCas: 7
        };
        casillas.push(casilla7);

        // ingresar el valor a la casilla 801
        const index081 = casillas.findIndex(e => e.numCas === 801);
        casillas[index081].desValCas = SessionStorage.getUserData().numRUC;

        /**
         * Indicador de rectificatoria auditoria
         * 0 = No Rectifica
         * 1 = Rectifica
         */
        const casilla805: any = {
            codTipCam: '01',
            desValCas: this.obtenerRetificatoria(),
            indDel: '0',
            numCas: 805
        };
        casillas.push(casilla805);

        /**
         * Indicador de rectificatoria
         * 0 = No Rectifica
         * 1 = Rectifica
         */
        const casilla871: any = {
            codTipCam: '01',
            desValCas: this.obtenerRetificatoria(),
            indDel: '0',
            numCas: 871
        };
        casillas.push(casilla871);

        return this.setTipoCam(casillas);
    }

    private setTipoCam(casillas: Array<any>): Array<any> {
        return casillas.map(e => {
            const casilla = this.tipoCasillaService.findTipoCasilla(e.numCas);
            const codTipCam = !!casilla ? casilla.tipoCasilla : '00';
            return { ...e, codTipCam };
        });
    }

    obtenerListaTributos(): Array<any> {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        let tributos: any[];
        tributos = [];

        let importePagar;
        importePagar = 0;
        let importeDeuda;
        importeDeuda = 0;
        let mtoCas217;

        // ES INAFECTO ???  1 ==>SI, 0 ==>NO
        mtoCas217 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas217 ?
            this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas217 : ConstantesIdentificacion.INAFECTO_NO;

        if (Number(mtoCas217) === Number(ConstantesIdentificacion.INAFECTO_NO)) { // NO
            importeDeuda = this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas146 ?
                this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas146 : 0;
            importePagar = this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180 ?
                this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180 : 0;
        }

        const tributoUnico: any = {
            codTri: ConstantesUris.CODTRIBUTO, // 8131 FIJO EN PPJJ
            indDel: '0', // 0 FIJO
            indVig: '1', // 1 FIJO
            mtoBasImp: 0, // -> no sabemos
            mtoImpres: 0, // -> no sabemos
            mtoPagTot: importePagar, // Importe a pagar
            mtoResPag: 0, // 0 FIJO
            mtoTotDeu: importeDeuda, // lo que debemos, en la casilla de deuda.
            perTri: Number(this.obtenerNumeroEjercicio().toString() + '13') // DEMO 201913
        };
        tributos.push(tributoUnico);
        return tributos;
    }

    obtenerRetificatoria(): string {
        return this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria;
    }

    obtenerCasDetDeudaPJ(): DetDeterminacionDeudaModel {
        return SessionStorage.getPreDeclaracion<any>().declaracion.determinacionDeuda.casDetDeudaPJ;
    }

    fraccionamiento(): boolean {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();

        let importePagar = 0;
        let importeDeuda = 0;

        const valorUIT = this.comboService.obtenerUitEjercicioActual();

        let respuesta: boolean;
        respuesta = false;

        // (Casilla 461 – Casilla 462) + Casilla  473 + Casilla 475 + (Casilla 477 – Casilla 433) + Casilla 481
        let monto461 = 0;
        let monto462 = 0;
        let monto473 = 0;
        let monto475 = 0;
        let monto477 = 0;
        let monto433 = 0;

        let noInafecta = true;

        // lógica

        let mtoCas217;

        // ES INAFECTO ???  1 ==>SI, 0 ==>NO
        mtoCas217 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas217 ?
            this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas217 : ConstantesIdentificacion.INAFECTO_NO;

        if (Number(mtoCas217) === Number(ConstantesIdentificacion.INAFECTO_NO)) { // NO
            importeDeuda = this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas146 ?
                this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas146 : 0;
            importePagar = this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180 ?
                this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180 : 0;
            noInafecta = true;
        }

        if (noInafecta) {
            if ((importeDeuda - importePagar) >= (valorUIT * 0.10)) {
                // 1.- (Casilla 146 – Casilla 180)  > = 10 % UIT
                if (String(this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria) === ConstantesIdentificacion.ORIGINAL) {
                    // 2.- Si la declaración corresponde a una ddjj original
                    monto461 = Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas461);
                    monto462 = Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas462);
                    monto473 = Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas473);
                    monto475 = Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas475);
                    monto477 = Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas477);
                    monto433 = Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas433);
                    // monto481 = Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas481);
                    if (((monto461 - monto462) + monto473 + monto475 + (monto477 - monto433) + 0) <= (150 * valorUIT)) {
                        // 3.- Si los ingresos anuales consignados en la declaración presentada son menores o iguales a 150 UIT.
                        // Se considera como ingresos anuales lo siguiente para el FV 710:
                        // (Casilla 461 – Casilla 462) + Casilla  473 + Casilla 475 + (Casilla 477 – Casilla 433) + Casilla 481
                        respuesta = true;
                    }
                }
            }
        }
        return respuesta;
    }

    devolucion(): Array<TributoDevolucion> {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        let valor137;
        let valor138;
        let importePagar;
        importePagar = 0;
        let mtoCas217;

        let respuesta: Array<TributoDevolucion>;
        respuesta = [];

        // ES INAFECTO ???  1 ==>SI, 0 ==>NO
        // Cuando es NO muestra determinación de la Deuda
        mtoCas217 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas217 ?
            this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas217 : ConstantesIdentificacion.INAFECTO_NO;

        if (Number(mtoCas217) === Number(ConstantesIdentificacion.INAFECTO_NO)) { // NO
            // a. La casilla 137 del formulario 710 que se ha presentado, debe ser igual a “1” indicador de que solicita la devolución.
            // b. El monto de la casilla 138 del Formulario Virtual 710 que se ha presentado,
            // debe ser mayor a cero, así sea S/. 1.00 o S/. 2.00 se habilitará el link.
            valor137 = this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas137;
            valor138 = this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas138;

            if (Number(valor137) === 1 && Number(valor138) > 0) {

                respuesta.push({
                    tipo: 'juridico',
                    cumple: true,
                    link: 'Solicitud Devolución - 3RA Categoría',
                    codTributo: ConstantesUris.CODTRIBUTO,
                    mtoTributo: Number(valor138),
                    descripcionTributo: 'RENTA - REGULARIZ. - PERS. JUR.'
                });
            }
        }

        return respuesta;
    }

    getImporteDelaDeuda(): number {
        const monto180 = this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180;
        const monto146 = this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas146;
        return monto146 - monto180;
    }

    getImporteDevolucion(): number {
        const monto138 = this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas138;
        return Number(monto138);
    }

    enviarCorreo(): Observable<any> {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        let user = SessionStorage.getUserData();
        const obj = { correos: ['aaa@bbb.com.pe'], declaracionPJ: this.preDeclaracion.declaracion, razonSocial: user.nombreCompleto };
        return this.http.post(ConstantesUris.URI_DESCARGAR_PDF, obj, {
            responseType: 'blob',
            observe: 'response',
            // 'Accept-Encoding: gzip, deflate' \
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
    }
}
