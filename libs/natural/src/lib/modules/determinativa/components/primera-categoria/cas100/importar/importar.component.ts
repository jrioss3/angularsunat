import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Casilla100Cabecera } from '@path/natural/models/SeccionDeterminativa/DetRentaPrimeraModel';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { PreDeclaracionService } from '@path/natural/services/preDeclaracion.service';
import { DatePipe } from '@angular/common';
import { ConstantesPlaceHolder, ConstantesExcepciones } from '@path/natural/utils';
import { ErrorListComponent } from '@path/natural/components';
import { ListaParametrosModel } from '@path/natural/models';
import { Observable, from, of } from 'rxjs';
import { flatMap, map, catchError, reduce, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { ConstantesCombos, ConstantesDocumentos } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils';

@Component({
    selector: 'app-importar',
    templateUrl: './importar.component.html',
    styleUrls: ['./importar.component.css']
})
export class ScCas100ImportarComponent implements OnInit {

    private ruc: string;
    private periodo: string;
    public labelArchivo = ConstantesPlaceHolder.TEXTO_SELECCIONAR_ARCHIVO;
    private funcionesGenerales: FuncionesGenerales;
    private file: any;
    private datos: Array<Array<any>>;
    private importarListaCasilla100: Casilla100Cabecera[];
    @Output() ListaCasilla100 = new EventEmitter<Casilla100Cabecera[]>();
    private listaFormularios: ListaParametrosModel[];

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private preDeclaracionService: PreDeclaracionService,
        private comboService: ComboService,
        private consultaPersona: ConsultaPersona,
        private spinner: NgxSpinnerService,
        private apiDate: DatePipe) { }

    ngOnInit(): void {
        this.funcionesGenerales = FuncionesGenerales.getInstance();
        this.importarListaCasilla100 = [];
        this.ruc = this.preDeclaracionService.obtenerRucPredeclaracion();
        this.periodo = this.preDeclaracionService.obtenerAnioEjercicio();
        this.listaFormularios = this.comboService.obtenerComboPorNumero(ConstantesCombos.FORMULARIOS);
    }

    public setFileUpload(event: any): void {
        this.file = event;
        if (this.funcionesGenerales.siAdjuntoArchivo(event)) {
            if (this.funcionesGenerales.cargoArchivoCorrecto(event)) {
                this.funcionesGenerales.readExcel(event)
                    .then(datos => this.datos = this.obtenerDatosFiltrados(datos));
                this.labelArchivo = (this.funcionesGenerales.getNameArchivo(event));
            } else {
                this.callModal(ConstantesPlaceHolder.ERROR_EXTENSION_INCORRECTA)
                    .pipe(tap(() => this.activeModal.close('Close click')))
                    .subscribe();
            }
        } else {
            this.datos = null;
            this.labelArchivo = ConstantesPlaceHolder.TEXTO_SELECCIONAR_ARCHIVO;
        }
    }

    public validarImportar(): void {
        if (this.noASelecionadoArchivo()) {
            this.callModal(ConstantesPlaceHolder.ERROR_NO_HAY_ARCHIVO_EXCEL)
                .pipe(tap(() => this.activeModal.close('Close click')))
                .subscribe();
        } else if (this.noCumpleNombreEstablecido()) {
            this.callModal(ConstantesPlaceHolder.ERROR_CONTENIDO_INCORRECTO)
                .pipe(tap(() => this.activeModal.close('Close click')))
                .subscribe();
        } else {
            this.validarDatos();
        }
    }

    private noASelecionadoArchivo(): boolean {
        return !!!this.datos;
    }

    private noCumpleNombreEstablecido(): boolean {
        const regexpNombre = new RegExp(`^0709+${this.periodo}+${this.ruc}+100`);
        return !this.funcionesGenerales.elNombreCumpleCon(regexpNombre, this.file);
    }

    private obtenerDatosFiltrados(data: any): Array<Array<any>> {
        let datosFiltrados = data.map(fila => fila.splice(0, 12));
        datosFiltrados = datosFiltrados.filter(fila => fila.join('').length > 0);
        datosFiltrados = datosFiltrados.splice(2, datosFiltrados.length - 1);
        return datosFiltrados;
    }

    private validarDocumentos(lista: Array<any>): Observable<Array<any>> {
        return from(lista).pipe(
            flatMap(item => {
                if (!!item[0] && !!item[1] && item[0].substring(0, 2).trim() === ConstantesDocumentos.DNI) {
                    return this.consultaPersona.obtenerPersona(item[1])
                        .pipe(
                            map(x => {
                                return ({ ...item, documentoCorrecto: true });
                            }),
                            catchError(error => {
                                return of({ ...item, documentoCorrecto: false });
                            })
                        );
                } else if (!!item[0] && !!item[1] && item[0].substring(0, 2).trim() === ConstantesDocumentos.RUC) {
                    return this.consultaPersona.obtenerContribuyente(item[1])
                        .pipe(
                            map(x => {
                                return ({ ...item, documentoCorrecto: true });
                            }),
                            catchError(error => {
                                return of({ ...item, documentoCorrecto: false });
                            })
                        );
                }
                return of({ ...item, documentoCorrecto: true });
            }),
            reduce((carry, e) => [...carry, e], []),
            map(listaAOrdendar => listaAOrdendar.sort(this.compareFn))
        );
    }

    private compareFn(a, b): number {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
        return 0;
    }

    private validarDatos(): void {
        this.spinner.show();
        this.datos = this.datos.map((x, i) => ({ ...x, id: i + 1 }));

        this.validarDocumentos(this.datos)
            .subscribe(datos => {
                this.validarTuplas(datos);
                this.spinner.hide();
            });
    }

    private validarTuplas(lista: Array<Array<any>>): void {
        const errorsArrayObj = [];
        lista.forEach(cabecera => {
            // TIPO DOCUMENTO
            if (!!!cabecera[0] || !this.validarTipoDocumento(cabecera[0])) {
                errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX09}`);
                return false;
            }
            // NUMERO DOCUMENTO
            if (!!cabecera[1]) {
                if (cabecera[0].substring(0, 2).trim() === ConstantesDocumentos.DNI) {
                    if (!this.funcionesGenerales.isNumber(cabecera[1])) {
                        errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                        return false;
                    } else if (String(cabecera[1]).length !== 8) {
                        errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                        return false;
                    } else if (!Object(cabecera).documentoCorrecto) {
                        errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX05}`);
                        return false;
                    }
                } else if (cabecera[0].substring(0, 2).trim() === ConstantesDocumentos.RUC) {
                    if (!this.funcionesGenerales.isNumber(cabecera[1])) {
                        errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                        return false;
                    } else if (String(cabecera[1]).length !== 11) {
                        errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                        return false;
                    } else if (!Object(cabecera).documentoCorrecto) {
                        errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX03}`);
                        return false;
                    } else if (String(cabecera[1]) === this.ruc) {
                        errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX04}`);
                        return false;
                    }
                } else if (!this.validarRestoDocumento(cabecera[0], cabecera[1])) {
                    errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                    return false;
                }
            } else {
                errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX10}`);
                return false;
            }
            // TIPO BIEN
            if (!!!cabecera[2] || !this.validarTipoBien(cabecera[2])) {
                errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                return false;
            }
            // SUBTIPO BIEN
            if (!!!cabecera[3] || !this.validarSubTipoBien(cabecera[2], cabecera[3])) {
                errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                return false;
            }
            // DESCRIPCION DEL BIEN
            if (!this.validarDescripcionBien(cabecera[2], cabecera[3], cabecera[4])) {
                errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                return false;
            }
            // PARTIDA REGISTRAL
            if (!!cabecera[5] && !this.validarPartidaRegistral(cabecera[5])) {
                errorsArrayObj.push(`Fila ${Object(cabecera).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                return false;
            }
            cabecera = this.datos.find(x => Object(x).id === Object(cabecera).id);
            if (this.importarListaCasilla100.length === 0 || !!cabecera) {
                const casilla100 = {
                    codTipDoc: cabecera[0].substring(0, 2).trim(),
                    numDoc: String(cabecera[1]).toUpperCase(),
                    codTipBien: this.obtenerTipoBien(cabecera[2]),
                    codBien: null,
                    numNro: this.obtenerDescripcion(this.obtenerTipoBien(cabecera[2]), cabecera[3].substring(0, 2), cabecera[4]),
                    desPartidaReg: cabecera[5] ? String(cabecera[5]).toUpperCase() : null,
                    numArrend: null,
                    codUbigeo2: null,
                    desBien: cabecera[3].substring(0, 2),
                    codTipVia: null,
                    mtoGravado: null,
                    mtoPagSinInt: null,
                    desVia: null,
                    codTipZona: null,
                    desZona: null,
                    numKilometro: null,
                    numManzana: null,
                    numInterior: null,
                    numDpto: null,
                    numLote: null,
                    desReferenc: null,
                    numSumLuz: null,
                    numSumAgua: null,
                    indArchPers: null,
                    lisCas100Detalles: [],
                    desRazSoc : null
                };
                const listaDetalle = this.datos.filter(x => this.perteceneACabecera(x, cabecera));
                listaDetalle.forEach(detalle => {
                    // PERIODO DEL DETALLE
                    if (!!detalle[6]) {
                        if (!this.validarPeriodo(detalle[6])) {
                            errorsArrayObj.push(`Fila ${Object(detalle).id} : ${ConstantesExcepciones.CUS19_EX21}`);
                            this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                            return false;
                        } else if (this.validarRangoPeriodoMayor(detalle[6])) {
                            errorsArrayObj.push(`Fila ${Object(detalle).id} :
                             ${ConstantesExcepciones.CUS19_EX23.replace('AAAA', this.periodo)}`);
                            this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                            return false;
                        } else if (this.validarRangoPeriodoMenor(detalle[6])) {
                            errorsArrayObj.push(`Fila ${Object(detalle).id} :
                             ${ConstantesExcepciones.CUS19_EX22.replace('AAAA', this.periodo)}`);
                            this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                            return false;
                        }
                    } else {
                        errorsArrayObj.push(`Fila ${Object(detalle).id} : ${ConstantesExcepciones.CUS19_EX02}`);
                        this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                        return false;
                    }
                    // NUMERO DE FORMULARIO
                    if (!!!detalle[7] || !this.validarNroFormulario(detalle[7])) {
                        errorsArrayObj.push(`Fila ${Object(detalle).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                        this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                        return false;
                    }
                    // NUMERO DE ORDEN
                    if (!!detalle[8]) {
                        if (!this.funcionesGenerales.isNumber(detalle[8])) {
                            errorsArrayObj.push(`Fila ${Object(detalle).id} : ${ConstantesExcepciones.CUS19_EX24}`);
                            this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                            return false;
                        }
                    } else {
                        errorsArrayObj.push(`Fila ${Object(detalle).id} : ${ConstantesExcepciones.CUS19_EX02}`);
                        this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                        return false;
                    }
                    // FECHA DE PAGO
                    if (!!detalle[9]) {
                        if (!this.validarFormatoFecha(detalle[9])) {
                            errorsArrayObj.push(`Fila ${Object(detalle).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                            this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                            return false;
                        } else if (!this.validarFechaPago(detalle[9])) {
                            errorsArrayObj.push(`Fila ${Object(detalle).id} : ${ConstantesExcepciones.CUS19_EX25}`);
                            this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                            return false;
                        }
                    } else {
                        errorsArrayObj.push(`Fila ${Object(detalle).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                        this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                        return false;
                    }
                    // MONTO GRAVADO
                    if (detalle[10] === undefined || !this.validarMontos(detalle[10])) {
                        errorsArrayObj.push(`Fila ${Object(detalle).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                        this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                        return false;
                    }
                    // PAGO SIN INTERESES
                    if (detalle[11] === undefined || !this.validarMontos(detalle[11])) {
                        errorsArrayObj.push(`Fila ${Object(detalle).id} : ${ConstantesExcepciones.CUS19_EX01}`);
                        this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                        return false;
                    }
                    // CALCULO
                    if (!this.validarCalculo(detalle[7], detalle[10], detalle[11])) {
                        errorsArrayObj.push(`Fila ${Object(detalle).id} : Calculo incorrecto para el formulario ${detalle[7]}`);
                        this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                        return false;
                    }
                    // REGISTROS DUPLICADOS
                    const guardar = casilla100.lisCas100Detalles.some(x => {
                        return x.numOrdOpe === detalle[8].toString();
                    });
                    if (guardar) {
                        errorsArrayObj.push(`Fila ${Object(detalle).id} : ${ConstantesExcepciones.CUS19_EX11}: ${detalle[8]}`);
                    }
                    casilla100.lisCas100Detalles.push({
                        refTabla: '0709',
                        perPago: String(detalle[6]).substring(4) + String(detalle[6]).substring(0, 4),
                        numFormulario: detalle[7],
                        numOrdOpe: detalle[8].toString(),
                        fecPago: this.formatearFecha(detalle[9]),
                        mtoPagSInt: detalle[11],
                        mtoGravado: detalle[10],
                        indAceptado: '1',
                        indArchPers: '0'
                    });
                    this.datos = this.datos.filter(x => Object(x).id !== Object(detalle).id);
                });
                this.importarListaCasilla100.push(casilla100);
            }
        });
        if (errorsArrayObj.length !== 0) {
            this.showErrorsArray(errorsArrayObj);
        } else {
            this.ListaCasilla100.emit(this.importarListaCasilla100);
        }
        this.activeModal.close();
    }

    private showErrorsArray(errorList: string[]): void {
        const modal = {
            titulo: 'Errores',
            errorList: (errorList)
        };
        const modalRef = this.modalService.open(ErrorListComponent, this.funcionesGenerales.getModalOptions({}));
        modalRef.componentInstance.modal = modal;
    }
    // REGISTRA LOS DETALLES DE LAS CABECERAS
    private perteceneACabecera(listaCabecera: any, listaDetalle: any): boolean {
        return listaCabecera[0] === listaDetalle[0]
            && listaCabecera[1] === listaDetalle[1]
            && listaCabecera[2] === listaDetalle[2]
            && listaCabecera[3] === listaDetalle[3]
            && (!!listaCabecera[4] || !!listaDetalle[4] ?
                String(this.obtenerDescripcion(this.obtenerTipoBien(listaCabecera[2]), listaCabecera[3].substring(0, 2), listaCabecera[4]))
                ===
                String(this.obtenerDescripcion(this.obtenerTipoBien(listaDetalle[2]), listaDetalle[3].substring(0, 2), listaDetalle[4]))
                : true)
            && listaCabecera[5] === listaDetalle[5];
    }
    // OBTIENE LA DESCRIPCION DEL BIEN
    private obtenerDescripcion(tipoBien: string, subTipo: string, descripcion): string {
        descripcion = String(descripcion);
        if (subTipo === '01' && tipoBien === '01') {
            return descripcion.substring(0, 6).trim().toUpperCase();
        } else if (subTipo === '04' && tipoBien === '01') {
            return descripcion.substring(0, 25).trim().toUpperCase();
        } else if (subTipo === '01' && tipoBien === '02') {
            return null;
        } else if (subTipo === '01' && tipoBien === '03') {
            return descripcion.substring(0, 10).trim().toUpperCase();
        } else if ((subTipo === '03' || subTipo === '04') && tipoBien === '03') {
            return descripcion.substring(0, 10).trim().toUpperCase();
        } else if (subTipo === '02' && tipoBien === '03') {
            return descripcion.substring(0, 25).trim().toUpperCase();
        }
    }
    // VALIDA LOS TIPOS DE DOCUMENTOS VALIDOS
    private validarTipoDocumento(tipoDocumento: any): boolean {
        return [ConstantesDocumentos.RUC,
        ConstantesDocumentos.DNI,
        ConstantesDocumentos.PASAPORTE,
        ConstantesDocumentos.CARNET_DE_EXTRANJERIA,
        ConstantesDocumentos.PTP,
        ConstantesDocumentos.CARNET_IDENTIDAD].includes(tipoDocumento.substring(0, 2).trim());
    }
    // VALIDA EL NUMERO DE DOCUMENTO
    private validarRestoDocumento(tipoDoc: any, numeroDoc: any): boolean {
        return (tipoDoc.substring(0, 2).trim() === ConstantesDocumentos.PASAPORTE
            || tipoDoc.substring(0, 2).trim() === ConstantesDocumentos.PTP
            || tipoDoc.substring(0, 2).trim() === ConstantesDocumentos.CARNET_IDENTIDAD
            || tipoDoc.substring(0, 2).trim() === ConstantesDocumentos.CARNET_DE_EXTRANJERIA
            || tipoDoc.substring(0, 2).trim() === ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS_NATURAL)
            && String(numeroDoc).length < 15 && !!String(numeroDoc).match(/^[a-zA-Z0-9]*$/);
    }
    // VALIDA EL TIPO DE BIEN
    private validarTipoBien(tipoBien: any): boolean {
        return ['02', '01', '03'].includes(this.obtenerTipoBien(tipoBien));
    }
    // VALIDA LOS SUBTIPO DE BIENES
    private validarSubTipoBien(tipoBien: any, subTipo: any): boolean {
        if (this.obtenerTipoBien(tipoBien) === '01') {
            return ['01', '04'].includes(subTipo.substring(0, 2));
        } else if (this.obtenerTipoBien(tipoBien) === '02') {
            return subTipo.substring(0, 2) === '01';
        } else if (this.obtenerTipoBien(tipoBien) === '03') {
            return ['01', '02', '03', '04'].includes(subTipo.substring(0, 2));
        }
    }
    // VALIDA LA DESCRIPCION DE CADA TIPO DE BIEN
    private validarDescripcionBien(tipoBien: any, subTipo: any, descripcion: any): boolean {
        if (subTipo.substring(0, 2) === '01' && this.obtenerTipoBien(tipoBien) === '01') {
            return !!descripcion && String(descripcion).length >= 6 && !!String(descripcion).match(/^[ a-zA-Z0-9ñÑ]*$/);
        } else if (subTipo.substring(0, 2) === '04' && this.obtenerTipoBien(tipoBien) === '01') {
            return !!descripcion && !!String(descripcion).match(/^[ a-zA-Z0-9ñÑ]*$/);
        } else if (subTipo.substring(0, 2) === '01' && this.obtenerTipoBien(tipoBien) === '03') {
            return !!descripcion && String(descripcion).length >= 10 && !!String(descripcion).match(/^[ a-zA-Z0-9ñÑ]*$/);
        } else if ((subTipo.substring(0, 2) === '03' || subTipo.substring(0, 2) === '04')
            && this.obtenerTipoBien(tipoBien) === '03') {
            return !!descripcion && String(descripcion).length >= 10 && !!String(descripcion).match(/^[ a-zA-Z0-9ñÑ]*$/);
        } else if (subTipo.substring(0, 2) === '02' && this.obtenerTipoBien(tipoBien) === '03') {
            return !!descripcion && !!String(descripcion).match(/^[ a-zA-Z0-9ñÑ]*$/);
        } else {
            return true;
        }
    }
    // VALIDA PARTIDA REGISTRAL
    private validarPartidaRegistral(partida: any): boolean {
        return !!String(partida).match(/^[ a-zA-Z0-9ñÑ]*$/);
    }
    // VALIDA EL PERIODO DE LOS DETALLES
    private validarPeriodo(periodo: any): boolean {
        return !!String(periodo).match(/^([12]\d{3}(0[1-9]|1[0-2]))$/);
    }
    // VALIDA QUE EL PERIODO NO SEA MENOR AL ANIO
    private validarRangoPeriodoMenor(periodo: any): boolean {
        return Number(String(periodo).substr(0, 4)) < Number(this.periodo);
    }
    // VALIDA QUE EL PERIODO NO SEA MAYOT AL ANIO
    private validarRangoPeriodoMayor(periodo: any): boolean {
        return Number(String(periodo).substr(0, 4)) > Number(this.periodo);
    }
    // VALIDA QUE EL NUMERO DE FORMULARIO SEA UNA VALIDO
    private validarNroFormulario(numero: any): boolean {
        return this.listaFormularios.some(x => x.val === String(numero));
    }
    // VALIDA EL FORMATO DE LAS FECHAS
    private validarFormatoFecha(fecha: any): boolean {
        if (typeof fecha === 'string') {
            return !!fecha.match(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/);
        } else {
            return fecha > 0;
        }
    }
    // VALIDA QUE LA FECHA NO SEA MAYOR AL SISTEMA
    private validarFechaPago(fecha: any): boolean {
        const fechaPago = this.apiDate.transform(this.formatearFecha(fecha).split('\'T\'')[0], 'dd/MM/yyyy');
        const fechaActual = this.apiDate.transform(new Date(), 'dd/MM/yyyy');
        return this.transformaraDias(fechaPago) <= this.transformaraDias(fechaActual);
    }
    // VALIDA LOS MONTOS DE LOS DETALLES
    private validarMontos(monto: any): boolean {
        return !!String(monto).match(/^[0-9]*$/);
    }
    private obtenerTipoBien(valor: string): string {
        valor = valor.substr(0, 4).replace('_', '');
        return valor.replace('_', '');
    }
    // TRANSFORMA LA FECHA
    private formatearFecha(valor: any): string {
        if (typeof valor === 'number') {
            return this.apiDate.transform(new Date((valor - (25567 + 1)) * 86400 * 1000), 'yyyy-MM-dd') + 'T00:00:00.000-05:00';
        } else {
            return this.apiDate.transform(this.moverDiaAmes(valor), 'yyyy-MM-dd') + 'T00:00:00.000-05:00';
        }
    }
    // VALIDAR CALCULO DE MONTOS
    private validarCalculo(numeroForm: any, montoGrav: any, montoInt: any): boolean {
        if (String(numeroForm) === '1683') {
            const monto = Number(montoGrav) * 0.05;
            return montoInt === Math.round(monto);
        } else {
            const monto = Number(montoInt) * 20;
            return montoGrav === Math.round(monto);
        }
    }
    // TRANSFORMAR LA FECHA
    private transformaraDias(fecha: string): number {
        const dia = fecha.split('/')[0];
        const mes = fecha.split('/')[1];
        const anio = fecha.split('/')[2];
        const meses = Number(mes) + Number(anio) * 12;
        const dias = Number(dia) + meses * 30;
        return dias;
    }
    // ORDENAR LA FECHA
    private moverDiaAmes(fecha: string): string {
        return `${fecha.split('/')[1]}/${fecha.split('/')[0]}/${fecha.split('/')[2]}`;
    }

    private callModal(message: string): Observable<any> {
        const modal = {
            titulo: 'Mensaje',
            mensaje: message
        };
        const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
        modalRef.componentInstance.modal = modal;
        modalRef.componentInstance.nameTab = 'ImportarArchivoCas100';
        return modalRef.componentInstance.respuesta;
    }
}
