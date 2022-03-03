import { ResumenTrabajo } from './../models/SeccionDeterminativa/DetRentaTrabajoModel';
import { ResumenSegunda } from './../models/SeccionDeterminativa/DetRentaSegundaModel';
import { ResumenPrimera } from './../models/SeccionDeterminativa/DetRentaPrimeraModel';
import { ComboService } from '@rentas/shared/core';
import { Casilla100Cabecera, DeclaracionModel, InfAlquileresModel, InfCondominoModel } from '@path/natural/models';
import { environment } from '@rentas/shared/environments';
import { Injectable } from '@angular/core';
import { PreDeclaracionModel } from '../models/preDeclaracionModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantesUris } from '../utils/constantesUris';
import { ConstantesParametros } from '../utils/constantesParametros';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ActividadesEconomicas } from '../models/actividadesEconomicas';
import { map, catchError } from 'rxjs/operators';
import * as sha1 from 'js-sha1';
import { ParametrosHoteles514 } from '../models/parametrosModelCasilla514';
import { SessionStorage } from '@rentas/shared/utils';
import { EstadoFraccionamiento, Formulario, TipoFrac, TipoPlataformaFrac, UserData } from '@rentas/shared/types';
import { ObtenerMotivoObservacionPipe } from '../modules/determinativa/components/fuente-externa/cas514/pipes/obtener-motivo-observacion.pipe';
import { ConstantesCombos } from '@rentas/shared/constantes';

@Injectable()
export class PreDeclaracionService {

    preDeclaracion: PreDeclaracionModel;

    constructor(
        private http: HttpClient,
        private router: Router,
        private comboService: ComboService) { }

    cargarPreDeclaracion(ruc: string, periodo: string, indorigen?: string) {

        SessionStorage.setErroresInfo([]);
        SessionStorage.setErroresDetEstados([]);
        SessionStorage.setErroresBackend([]);
        const paramns = indorigen ?
            // tslint:disable-next-line: max-line-length
            '?ruc=' + ruc + '&periodo=' + periodo + ConstantesParametros.COD_PERIODO_ANUAL + '&formulario=' + ConstantesParametros.COD_FORMULARIO_PPNN + '&tipodeclaracion=' + ConstantesParametros.COD_TIPO_DECLARACION + '&indorigen=' + indorigen :
            // tslint:disable-next-line: max-line-length
            '?ruc=' + ruc + '&periodo=' + periodo + ConstantesParametros.COD_PERIODO_ANUAL + '&formulario=' + ConstantesParametros.COD_FORMULARIO_PPNN + '&tipodeclaracion=' + ConstantesParametros.COD_TIPO_DECLARACION;
        return this.http.get<PreDeclaracionModel>(ConstantesUris.URI_BASE_PD + environment.tmp_slash + paramns);
    }

    obtenerRuc(): string {
        return this.preDeclaracion.numRuc;
    }

    exportarPreDeclaracion_PPNN(correo: string[]) {
        // this.inicializadorService.inicializarDeterminativa();
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        const obj = { correos: correo, declaracionPN: this.preDeclaracion.declaracion };
        return this.http.post(ConstantesUris.URI_EXPORTAR_PPNN, obj);
    }

    descargarPreDeclaracionSimple_MA_PPNN(): Observable<any> {
        const correo = null;
        // this.inicializadorService.inicializarDeterminativa();
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        const user = SessionStorage.getUserData();
        const obj = { correos: correo, declaracionPN: this.preDeclaracion.declaracion, razonSocial: user.nombreCompleto };
        return this.http.post(ConstantesUris.URI_DESCARGAR_PPNN_PRELIMINAR_SIMPLE, obj, {
            responseType: 'blob',
            // 'Accept-Encoding: gzip, deflate' \
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
    }

    descargarPreDeclaracionSimple_PPNN(obj: any): Observable<any> {
        /*
        const correo = null;
        this.preDeclaracion = this.obtenerPreclaracion();
        const obj = {correos: correo, declaracionPN: this.preDeclaracion.declaracion};
        */
        return this.http.post(ConstantesUris.URI_DESCARGAR_PPNN_SIMPLE, obj, {
            responseType: 'blob',
            // 'Accept-Encoding: gzip, deflate' \
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
    }

    enviarPreDeclaracionSimple_MA_PPNN(correo: string[]) {
        // this.inicializadorService.inicializarDeterminativa();
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        const user = SessionStorage.getUserData();
        const obj = { correos: correo, declaracionPN: this.preDeclaracion.declaracion, razonSocial: user.nombreCompleto };
        return this.http.post(ConstantesUris.URI_ENVIAR_PPNN_PRELIMINAR_SIMPLE, obj);
    }

    enviarPreDeclaracionSimple_PPNN(correo: string[], numeroOrden: any) {
        // this.inicializadorService.inicializarDeterminativa();
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        const preDeclaracionClon = JSON.parse(JSON.stringify(this.preDeclaracion));
        preDeclaracionClon.declaracion.generales.cabecera.numOrden = numeroOrden;
        const user = SessionStorage.getUserData();
        // this.preDeclaracion = this.obtenerPreclaracion();
        const obj = { correos: correo, declaracionPN: preDeclaracionClon.declaracion, razonSocial: user.nombreCompleto };
        // const headers = new HttpHeaders()
        //    .append('X-Custom-Udata', this.getxCustomUdata());
        return this.http.post(ConstantesUris.URI_ENVIAR_PPNN_SIMPLE, obj/*, {headers}*/);
    }

    validarNumeroOrden(numRuc: string, numOrden: string, periodo: string): Observable<any> {
        return this.http.get(ConstantesUris.URI_OBTENER_PLANILLA + '/' + numRuc + '/' + numOrden + '/' + periodo);
    }

    validarNumeroComprobante1683(numOrden: string): Observable<any> {
        return this.http.get(ConstantesUris.URI_CONSULTA_LEGACY_OBTENER_ALQUILER + '/' + numOrden);
    }

    validarNumeroComprobante1676(numOrden: string): Observable<any> {
        return this.http.get(ConstantesUris.URI_CONSULTA_LEGACY_OBTENER_TRABAJADOR_HOGAR + '/' + numOrden);
    }

    validarNumeroComprobante(parametros: ParametrosHoteles514): Observable<any> {
        return this.http.get(ConstantesUris.URI_CONSULTA_LEGACY_BOLETA +
            '/' + parametros.numRuc + '/' + parametros.codTipComprob + '/' + parametros.serie + '/' +
            parametros.numComp + '/' + parametros.numEjercicio);
    }

    validarNumeroComprobanteRHE(parametros: ParametrosHoteles514): Observable<any> {
        return this.http.get(ConstantesUris.URI_CONSULTA_LEGACY_RHE +
            '/' + parametros.numRuc + '/' + parametros.codTipComprob + '/' + parametros.serie + '/' +
            parametros.numComp + '/' + parametros.numEjercicio);
    }

    validarNroComprobanteRH(numRuc: string, codTipComprob: string, serie: string, numComp: number, numEjercicio: number): Observable<any> {
        return this.http.get(ConstantesUris.URI_CONSULTA_LEGACY_RHE +
            '/' + numRuc + '/' + codTipComprob + '/' + serie + '/' + numComp + '/' + numEjercicio);
    }

    validarActividadEconomica(numRuc: string): Observable<any> {
        return this.http.get<ActividadesEconomicas>(ConstantesUris.URI_CONSULTA_ACTIVIDAD_ECONOMICA + '/' + numRuc);
    }

    guardarItemListaCasilla100(objeto: any) {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.casilla100Cabecera.lisCas100Cab.push(objeto);
        this.preDeclaracion = this.preDeclaracion;
        SessionStorage.setPreDeclaracion(this.preDeclaracion);
    }

    cargarListaCasilla100() {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        const listaActual = this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.casilla100Cabecera.lisCas100Cab;
        return listaActual;
    }

    guardarDeclaracion(cambioAnioAnterior?: string) {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        if (!!!cambioAnioAnterior) {
            this.preDeclaracion.indActWeb = '1';
        }
        SessionStorage.setPreDeclaracion(this.preDeclaracion);
        return this.http.post(ConstantesUris.URI_BASE_PD + '/save', this.preDeclaracion);
    }

    reestablecerPersonalizado() {
        // verificar indRectificatoria
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        const numEjercicio = this.obtenerAnioEjercicio().toString();
        const paramns = 'reset?ruc=' + this.preDeclaracion.numRuc +
            '&periodo=' + numEjercicio + ConstantesParametros.COD_PERIODO_ANUAL +
            '&formulario=' + ConstantesParametros.COD_FORMULARIO_PPNN +
            '&tipodeclaracion=' + ConstantesParametros.COD_TIPO_DECLARACION;
        return this.http.post(ConstantesUris.URI_BASE_PD + environment.tmp_slash + paramns, null);
    }

    public obtenerNumSec(): string {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        return this.preDeclaracion.declaracion.generales.cabecera.numSec + '';
    }    

    /*descargarPersonalizado(numRuc: string, periodo: string): Observable<any> {
        //return this.http.get(ConstantesUris.URI_OBTENER_PLANILLA + '/' + numRuc + '/' + numOrden + '/' + periodo);
        
        return this.http.get(ConstantesUris.URI_DESCARGA_PERSONALIZADO +
            `?numRuc=${numRuc}&ejercicio=${periodo}`);/*
            .pipe(
                map(() => true),
                catchError(() => of(false))
            );
    
    }*/

    public descargarPersonalizado(numRuc: string, periodo: string): Observable<{ nameFile: string, content: ArrayBuffer }> {
        /*const uri = ConstantesUris.URI_OBTENER_PLANILLA
          .replace('{numeroOperacionSunat}', numRuc);*/          
        return this.http.get(ConstantesUris.URI_DESCARGA_PERSONALIZADO +
            `?numRuc=${numRuc}&ejercicio=${periodo}`, { observe: 'response', responseType: 'arraybuffer' }).pipe(
          map(resp => {            
            const content = resp.body;
            const nameFile = resp.headers.get('Content-disposition')
              .replace(/"/g, '')
              .split('=').pop();
            return { nameFile, content };
          })
        );
      }

    validarPD() {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        if (environment.tmp_slash === '/') {  // esta validacion es solo temporal.
            return this.http.post(ConstantesUris.URI_VALIDAR +
                'validaDJ', this.preDeclaracion); // '/validaDJ?numSec=' +
            // this.preDeclaracion.declaracion.generales.cabecera.numSec);
        }
        return this.http.post(ConstantesUris.URI_VALIDAR + '/' + this.obtenerAnioEjercicio(), this.preDeclaracion);
        // return this.http.get(ConstantesUris.URI_VALIDAR + '/' + this.obtenerAnioEjercicio() + '/' +
        //                        this.preDeclaracion.declaracion.generales.cabecera.numSec);
    }

    obtenerAnioEjercicio() {
        return SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.generales.cabecera.numEjercicio;
    }

    obtenerRucPredeclaracion(): string {
        return SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.generales.cabecera.numRuc;
    }

    obtenerResumenPrimera(): ResumenPrimera {
        return SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.seccDeterminativa.rentaPrimera.resumenPrimera;
    }

    obtenerResumenSegunda(): ResumenSegunda {
        return SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.seccDeterminativa.rentaSegunda.resumenSegunda;
    }

    obtenerResumenTrabajo(): ResumenTrabajo {
        return SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo;
    }

    obtenerListaTributos(): Array<any> {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        let tributos: any[];
        tributos = [];

        let importePagar;
        importePagar = 0;
        let importeDeuda;
        importeDeuda = 0;

        const codTriPrimera = '030702'; // PRIMERA
        const codTriSegunda = '030704'; // SEGUNDA
        const codTriTrabajo = '030703'; // TRABAJO

        // PRIMERA
        if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523) === 1) {
            importePagar = this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166 : 0;
            importeDeuda = this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas164 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas164 : 0;

            const tributoUnico: any = {
                codTri: codTriPrimera,
                indDel: '0', // 0 FIJO
                indVig: '1', // 1 FIJO
                mtoBasImp: 0, // -> no sabemos
                mtoImpres: 0, // -> no sabemos
                mtoPagTot: importePagar, // Importe a pagar
                mtoResPag: 0, // 0 FIJO
                mtoTotDeu: importeDeuda, // lo que debemos, en la casilla de deuda.
                perTri: Number(this.obtenerAnioEjercicio().toString() + '13') // DEMO 201913
            };
            tributos.push(tributoUnico);
        }

        // SEGUNDA
        if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524) === 1) {
            importePagar = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366 : 0;
            importeDeuda = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas365 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas365 : 0;

            const tributoUnico: any = {
                codTri: codTriSegunda,
                indDel: '0', // 0 FIJO
                indVig: '1', // 1 FIJO
                mtoBasImp: 0, // -> no sabemos
                mtoImpres: 0, // -> no sabemos
                mtoPagTot: importePagar, // Importe a pagar
                mtoResPag: 0, // 0 FIJO
                mtoTotDeu: importeDeuda, // lo que debemos, en la casilla de deuda.
                perTri: Number(this.obtenerAnioEjercicio().toString() + '13') // DEMO 201913
            };
            tributos.push(tributoUnico);
        }

        // TRABAJO
        if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525 === 1)) {
            importePagar = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168 : 0;
            importeDeuda = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas146 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas146 : 0;

            const tributoUnico: any = {
                codTri: codTriTrabajo,
                indDel: '0', // 0 FIJO
                indVig: '1', // 1 FIJO
                mtoBasImp: 0, // -> no sabemos
                mtoImpres: 0, // -> no sabemos
                mtoPagTot: importePagar, // Importe a pagar
                mtoResPag: 0, // 0 FIJO
                mtoTotDeu: importeDeuda, // lo que debemos, en la casilla de deuda.
                perTri: Number(this.obtenerAnioEjercicio().toString() + '13') // DEMO 201913
            };
            tributos.push(tributoUnico);
        }

        return tributos;
    }

    fraccionamiento(): EstadoFraccionamiento {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        const indRectificatoria = this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria;
        let importePagarA;
        importePagarA = 0;
        let importeDeudaA;
        importeDeudaA = 0;

        let importePagarB;
        importePagarB = 0;
        let importeDeudaB;
        importeDeudaB = 0;

        let importePagarC;
        importePagarC = 0;
        let importeDeudaC;
        importeDeudaC = 0;

        let importePagar;
        importePagar = 0;
        let importeDeuda;
        importeDeuda = 0;

        let resultadoA;
        resultadoA = 0;
        let resultadoB;
        resultadoB = 0;
        let resultadoC;
        resultadoC = 0;

        const valorUIT = this.comboService.obtenerUitEjercicioActual();

        let tieneDeuda = false;
        let respuesta = false;

        if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523) === 1) {
            importePagarA = this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166 : 0;
            importeDeudaA = this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas164 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas164 : 0;
        }

        if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524) === 1) {
            importePagarB = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366 : 0;
            importeDeudaB = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas365 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas365 : 0;
        }

        if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525) === 1) {
            importePagarC = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168 : 0;
            importeDeudaC = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas146 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas146 : 0;
        }

        if ((importeDeudaA - importePagarA) > 0) {
            resultadoA = importeDeudaA - importePagarA;
            tieneDeuda = true;
        }

        if ((importeDeudaB - importePagarB) > 0) {
            resultadoB = importeDeudaB - importePagarB;
            tieneDeuda = true;
        }

        if ((importeDeudaC - importePagarC) > 0) {
            resultadoC = importeDeudaC - importePagarC;
            tieneDeuda = true;
        }

        if (tieneDeuda) {
            // (Casilla 164 – Casilla 166) + (Casilla 365 – Casilla 366) + (Casilla 146 – Casilla 168) > = 10 % UIT
            if ((resultadoA + resultadoB + resultadoC) >= valorUIT * 0.10) {
                respuesta = true;
            }
        }

        // return respuesta && indRectificatoria === '0';
        return {
            tieneFraccionamiento: respuesta && indRectificatoria === '0',
            mesaje: '¿Desea solicitar Fraccionamiento por las deudas que se generen en esta declaración anual?',
            tipoPlaforma: TipoPlataformaFrac.NATURAL,
            tipo: TipoFrac.MAYOR_10_PORCIENTO_UIT
        }
    }

    private isDevolucionNidi(): boolean {
        const ddpData = SessionStorage.getUserData().map.ddpData;
        return ddpData.ddp_estado === '20' &&
            ddpData.ddp_flag22 === '10' && ddpData.ddp_tpoemp === '-';
    }

    private cumpleReglasDevolucion() {
        const userData: UserData = SessionStorage.getUserData();
        return userData.map.ddpData.ddp_tpoemp === '01' ||
            userData.map.ddpData.ddp_tpoemp === '02' ||
            userData.map.ddpData.ddp_tpoemp === '03' ||
            userData.map.ddpData.ddp_tpoemp === '04' ||
            userData.map.ddpData.ddp_tpoemp === '05' ||
            userData.map.ddpData.ddp_tpoemp === '06' ||
            this.isDevolucionNidi();
    }

    generarValHash() {
        const predeclaracion = SessionStorage.getPreDeclaracion();
        SessionStorage.setValHash(sha1(predeclaracion));
    }

    devolucion():
        Array<any> {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        let respuesta: Array<any>;
        respuesta = [];
        let userData: UserData;
        userData = SessionStorage.getUserData();

        let declaroPrimera: number;
        let declaroSegunda: number;
        let declaroTrabajo: number;

        // 1 => Declaro, 0 => No Declaro
        declaroPrimera = Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523);
        declaroSegunda = Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524);
        declaroTrabajo = Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525);

        // Declaración de Objetos a retornar
        const devolucionPrimera = {
            tipo: 'primera',
            cumple: false,
            link: 'Solicitud de Devolución - 1RA Categoría',
            codTributo: '030702',
            mtoTributo: 0,
            descripcionTributo: 'RENTA - REGULARIZ. - RENTA DE CAPITAL'
        };

        const devolucionSegunda = {
            tipo: 'segunda',
            cumple: false,
            link: 'Solicitud de Devolución - 2DA Categoría',
            codTributo: '030704',
            mtoTributo: 0,
            descripcionTributo: 'RTA.-REGULARIZ.-RTA.2DA.CATEG'
        };

        const devolucionTrabajo = {
            tipo: 'trabajo',
            cumple: false,
            link: 'Solicitud de Devolución - Rentas del Trabajo',
            codTributo: '030703',
            mtoTributo: 0,
            descripcionTributo: 'RENTA - REGULARIZ. - RENTA DE TRABAJO'
        };

        /*
        Rentas de Capital Primera Categoría
        •       Persona natural cuya clasificación es ddp_tpoemp “01”, “02”, 03, 04 y si es Nidi . (verificar campo de ddp: ddp_tpoemp)
        •       La casilla 160 debe ser igual a “1”, indicador de que solicita la devolución.
        •       El monto de la casilla 159 debe ser mayor a cero.
        */
        if (declaroPrimera === 1) {
            if (this.cumpleReglasDevolucion()) {

                if (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas160) === 1 &&
                    Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas159) > 0) {

                    const monto = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas159);
                    devolucionPrimera.cumple = true;
                    devolucionPrimera.mtoTributo = monto;
                }
            }
        }

        /*
        Rentas de Capital Segunda Categoría
        •       Persona natural cuya clasificación es ddp_tpoemp “01”, “02”, 03, 04 y si es Nidi (verificar campo de ddp: ddp_tpoemp)
        •       La casilla 161 debe ser igual a “1”, indicador de que solicita la devolución.
        •       El monto de la casilla 360 debe ser mayor a cero.
        */
        if (declaroSegunda === 1) {
            if (this.cumpleReglasDevolucion()) {

                if (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas361) === 1 &&
                    Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas360) > 0) {

                    const monto = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas360);
                    devolucionSegunda.cumple = true;
                    devolucionSegunda.mtoTributo = monto;
                }
            }
        }

        /*
        Rentas de Trabajo y/o Fuente Extranjera
        •       Persona natural cuya clasificación es ddp_tpoemp “01”, “02”, 03, 04 y si es Nidi  (verificar campo de ddp: ddp_tpoemp)
        •       La casilla 140 debe ser igual a “1”, indicador de que solicita la devolución.
        •       El monto de la casilla 141 debe ser mayor a cero.
        */
        if (declaroTrabajo === 1) {
            if (this.cumpleReglasDevolucion()) {
                if (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas140) === 1 &&
                    Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas141) > 0) {

                    const monto = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas141);
                    devolucionTrabajo.cumple = true;
                    devolucionTrabajo.mtoTributo = monto;
                }
            }
        }

        respuesta.push(devolucionPrimera);
        respuesta.push(devolucionSegunda);
        respuesta.push(devolucionTrabajo);
        return respuesta;
    }

    public validarMontoRentaMayorCero(): boolean {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        const cas523 = Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523);
        const cas524 = Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524);
        const cas525 = Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525);

        let montoPrimera = 0;
        let montoSegunda = 0;
        let montoTercera = 0;

        if (cas523 === 1) {
            montoPrimera = this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166 : 0;
        }
        if (cas524 === 1) {
            montoSegunda = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366 : 0;
        }
        if (cas525 === 1) {
            montoTercera = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168 ?
                this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168 : 0;
        }

        return montoPrimera > 0 || montoSegunda > 0 || montoTercera > 0;
    }

    public getDesFor(): string {
        return SessionStorage.getFormulario<Formulario>().descripcion;
    }

    public getCodFor(): string {
        return SessionStorage.getFormulario<Formulario>().codFormulario;
    }

    public getCantidadFormularios(): number {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        const casilla = this.preDeclaracion.declaracion.seccInformativa.casillaInformativa;
        return Array.of(casilla.mtoCas523, casilla.mtoCas524, casilla.mtoCas525)
            .filter(e => e === 1)
            .reduce((carry, e) => carry + e);
    }

    obtenerIdentificacionBien(ruc: string, periodo: string): Observable<any> {
        let ejercicioAnterior = '';
        if (Number(periodo) >= 2019) {
            ejercicioAnterior = ConstantesParametros.COD_FORMULARIO_PPNN;
        } else {
            ejercicioAnterior = ConstantesParametros.COD_FORMULARIO_PPNN_2018;
        }
        return this.http.get(ConstantesUris.URI_CONSULTA_IDENTIFICACION_BIEN +
            `?ruc=${ruc}&periodo=${periodo + ConstantesParametros.COD_PERIODO_ANUAL}` +
            `&formulario=${ejercicioAnterior}` +
            `&tipodeclaracion=${ConstantesParametros.COD_TIPO_DECLARACION}`)
            .pipe(map((data: PreDeclaracionModel) => {
                const casilla100 = data.declaracion.seccDeterminativa
                    .rentaPrimera.casilla100Cabecera.lisCas100Cab as Array<Casilla100Cabecera>;
                const alquileresSinValorAlquiler = this.quitarValorAlquilerAnual(data);
                const condominosSinValorBien = this.quitarValorBienCondominos(data);
                const tipoDeclara = data.declaracion.seccInformativa.casillaInformativa.mtoCas552;
                return { casilla100, alquileresSinValorAlquiler, condominosSinValorBien, tipoDeclara };
            }),
                catchError(error => of({
                    casilla100: [], alquileresSinValorAlquiler: [],
                    condominosSinValorBien: [], tipoDeclara: null
                }))
            );
    }

    consultaBirta(dni: string, numDNI: string, periodo: string, codTri: string, codOrigInconsistencia: string): Observable<any> {
        return this.http.get(ConstantesUris.URI_CONSULTA_BIRTA + '/' + dni + '/' + numDNI +
            '/' + periodo + ConstantesParametros.COD_PERIODO_ANUAL +
            '/' + codTri + '/' + codOrigInconsistencia);
    }

    enviarCorreo(): Observable<any> {
        const declaracion = this.preDeclaracionActualizadaInconsistenciasRubros();
        const user = SessionStorage.getUserData();       
        const obj = { correos: ['aaa@bbb.com.pe'], declaracionPN: declaracion, razonSocial: user.nombreCompleto };
        return this.http.post(ConstantesUris.URI_DESCARGAR_PDF, obj, {
            responseType: 'blob',
            observe: 'response',
            // 'Accept-Encoding: gzip, deflate' \
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
    }

    private quitarValorAlquilerAnual(data: any): Array<InfAlquileresModel> {
        const alquileres = data.declaracion.seccInformativa
            .alquileres.lisAlquileres as Array<InfAlquileresModel>;
        alquileres.forEach(x => {
            x.mtoAlquiler = 0;
        });
        return alquileres;
    }

    private quitarValorBienCondominos(data: any): Array<InfCondominoModel> {
        const condominos = data.declaracion.seccInformativa
            .condominos.lisCondomino as Array<InfCondominoModel>;
        condominos.forEach(x => {
            x.mtoValBien = 0;
        });
        return condominos;
    }

    actualizarPreDeclaracion(objeto: any) {
        SessionStorage.setPreDeclaracion(objeto);
    }

    private preDeclaracionActualizadaInconsistenciasRubros(): DeclaracionModel {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        let declaracion = this.preDeclaracion.declaracion;
        const lstParametriaObservaciones = this.comboService.obtenerComboPorNumero(ConstantesCombos.OBSERVACIONES_GASTOS_DEDUCIBES);
        const observacionPipe = new ObtenerMotivoObservacionPipe();

        const listaRubros = declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
        listaRubros.forEach((rubro) => {
            if (rubro.indTipoGasto !== '04') {
                rubro.casilla514Detalle.lisCas514.forEach((item) => {
                    const inconsistencias = observacionPipe.transform(item, lstParametriaObservaciones, this.obtenerAnioEjercicio());
                    item.desInconsistencia = inconsistencias.replace(/.<br\/>/g, '. ');
                    //debugger
                })
            }
        })

        declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera = listaRubros;
        //console.log(listaRubros);
        return declaracion
    }
}
