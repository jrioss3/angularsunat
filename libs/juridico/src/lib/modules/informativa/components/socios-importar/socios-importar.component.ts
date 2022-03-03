import { ConstantesSocios } from '@path/juridico/utils/constantesSocios';
import { Observable, from, of } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { DatePipe } from '@angular/common';
import { flatMap, map, catchError, reduce } from 'rxjs/operators';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantesParametros, ConstantesCombos, ConstantesDocumentos, MensajeGenerales } from '@rentas/shared/constantes';
import { ChatErrorService, ComboService, ConsultaPersona, ModalConfirmarService, ValidacionService } from '@rentas/shared/core';
import { FuncionesGenerales } from '@rentas/shared/utils';
import { ListaParametro } from '@rentas/shared/types';
import { InfPrinAccionistasModel } from '@path/juridico/models/SeccionInformativa/infPrinAccionistasModel';

@Component({
  selector: 'app-importar',
  templateUrl: './socios-importar.component.html',
  styleUrls: ['./socios-importar.component.css']
})
// tslint:disable-next-line: no-use-before-declare
export class SociosImportarComponent implements OnInit {

  private event: any;
  public nombreArchivo = MensajeGenerales.TEXTO_SELECCIONAR_ARCHIVO;
  @Output() tuplasExcel = new EventEmitter<any>();
  private datos: Array<Array<any>>;
  private listaPaises: ListaParametro[];
  private funcionesGenerales: FuncionesGenerales;
  private anio: string;
  private ruc: string;
  private inputListaSocios: InfPrinAccionistasModel[];

  constructor(
    private modalConfirmarService: ModalConfirmarService,
    public activeModal: NgbActiveModal,
    private preDeclaracionService: PreDeclaracionService,
    private chatErrorService: ChatErrorService,
    private apiDate: DatePipe,
    private consultaPersona: ConsultaPersona,
    private comboService: ComboService,
    private spinner: NgxSpinnerService) {
    this.listaPaises = this.comboService.obtenerComboPorNumero(ConstantesCombos.PAISES);
  }

  ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.anio = this.preDeclaracionService.obtenerNumeroEjercicio();
    this.inputListaSocios = [];
    this.ruc = this.preDeclaracionService.obtenerRucPredeclaracion();
  }

  public setFileUpload($event) {
    this.event = $event;
    if (this.funcionesGenerales.siAdjuntoArchivo($event)) {
      if (this.funcionesGenerales.cargoArchivoCorrecto($event)) {
        this.funcionesGenerales.leerArchivoExcel($event)
          .then(datos => this.datos = this.obtenerDatosFiltrados(datos));
        this.nombreArchivo = (this.funcionesGenerales.getNameArchivo($event));
      } else {
        this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_EXTENSION_INCORRECTA, 'Mensaje');
        this.activeModal.close('Close click');
      }
    } else {
      this.datos = null;
      this.nombreArchivo = MensajeGenerales.TEXTO_SELECCIONAR_ARCHIVO;
    }
  }

  private obtenerDatosFiltrados(datos: any): Array<Array<any>> {
    let datosFiltrados = datos.map(fila => fila.splice(0, 8));
    datosFiltrados = datosFiltrados.filter(fila => fila.join('').length > 0);
    return datosFiltrados;
  }

  public importarExcel(): void {
    if (this.noAImportadoArchivoEstablecido()) {
      this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_NO_HAY_ARCHIVO_EXCEL, 'Mensaje');
      this.activeModal.close('Close click');
    } else if (this.noCumpleNombreEstablecido() || !this.esFormatoCorrecto()) {
      this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_CONTENIDO_INCORRECTO, 'Mensaje');
      this.activeModal.close('Close click');
    } else {
      this.validarDatos();
    }
  }

  private noCumpleNombreEstablecido(): boolean {
    const regexpNombre = new RegExp(`^0710+${this.anio}+${this.ruc}+SOCIOS$`);
    return !this.funcionesGenerales.elNombreCumpleCon(regexpNombre, this.event);
  }

  private noAImportadoArchivoEstablecido(): boolean {
    return !!!this.datos;
  }

  private esFormatoCorrecto(): boolean {
    return this.tieneTitulo() && this.tieneCabeceras();

  }

  private tieneCabeceras(): boolean {
    let cabeceras = this.datos.filter((x, i) => i === 1)[0];
    cabeceras = cabeceras.map(e => e.toUpperCase());
    return ['TIPO DE SOCIO'].includes(cabeceras[0]) && ['TIPO DE DOCUMENTO'].includes(cabeceras[1]) &&
      ['NÚMERO DE DOCUMENTO'].includes(cabeceras[2]) && ['NOMBRE/RAZÓN SOCIAL'].includes(cabeceras[3]) &&
      ['FECHA DE NACIMIENTO'].includes(cabeceras[4]) && ['PAÍS DE RESIDENCIA'].includes(cabeceras[5]) &&
      ['PORCENTAJE DE PARTICIPACIÓN'].includes(cabeceras[6]) &&
      ['FECHA EN QUE SE CONSTITUYE COMO SOCIO'].includes(cabeceras[7]);
  }

  private tieneTitulo(): boolean {
    const titulo = this.datos.filter((x, i) => i === 0)[0];
    return ['DETALLE DE LOS PRINCIPALES SOCIOS'].includes(titulo[0]);
  }

  private validarDatos(): void {
    this.spinner.show();
    const listaFiltrada = this.datos
      .splice(2, this.datos.length - 1)
      .filter(x => this.quitarVacias(x))
      .map((x, i) => ({ ...x, id: i + 1 }));

    this.validarDocumentos(listaFiltrada)
      .subscribe(data => {
        this.validarTuplas(data);
        this.spinner.hide();
      });
  }

  private quitarVacias(socio): boolean {
    return socio.length > 2 && socio.some(x => { return String(x).trim() !== '' } );
  }

  private validarDocumentos(lista: Array<any>): Observable<Array<any>> {
    return from(lista).pipe(
      flatMap(item => {
        if (!!item[1] && !!item[2] && item[1].substring(0, 2).trim() === ConstantesDocumentos.DNI) {
          return this.consultaPersona.obtenerPersona(item[2])
            .pipe(
              map(x => {
                item[3] = x.desNombrePnat + ' ' + x.desApepatPnat + ' ' + x.desApematPnat;
                item[4] = moment(x.fecNacPnat).utc().format('DD/MM/YYYY');
                return ({ ...item, documentoCorrecto: true });
              }),
              catchError(() => {
                return of({ ...item, documentoCorrecto: false });
              })
            );
        } else if (!!item[1] && item[1].substring(0, 2).trim() === ConstantesDocumentos.RUC) {
          return this.consultaPersona.obtenerContribuyente(item[2])
            .pipe(
              map(x => {
                item[3] = x.ddpNombre.trim();
                return ({ ...item, documentoCorrecto: true });
              }),
              catchError(() => {
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

  private validarTuplas(lista: Array<Array<any>>): void {
    const errorsArrayObj = [];
    let start = true;
    lista.forEach(x => {
      x[2] = String(x[2]);
      const tipsocio = x[0] ? x[0].substring(0, 2).toString() : undefined;
      const tipoDoc = x[1] ? x[1].substring(0, 2).trim() : undefined;
      const consolidadoExiste = this.inputListaSocios.find(m => m.codTipDocSocio === ConstantesSocios.CONSOLIDADO);
      const existeRegistroDuplicado = this.inputListaSocios.some(socio => {
        return socio.numDocPrincipal === x[2];
      });
      let porcentaje = this.inputListaSocios.reduce((total, socios) => total + Number(socios.porParticipacion), 0) + (x[6] || 0);
      if (start) {
        if (tipsocio === ConstantesSocios.CONSOLIDADO && x[6] === 100) {
          errorsArrayObj.push(`Fila ${Object(x).id} : ${MensajeGenerales.CUS5_EX07}`);
        }
        if (porcentaje <= 100) {
          // VALIDACIONES CONSOLIDADO
          if (tipsocio === ConstantesSocios.CONSOLIDADO) {
            if (consolidadoExiste) {
              errorsArrayObj.push(`Fila ${Object(x).id} : ${MensajeGenerales.CUS5_EX14}`);
              porcentaje = porcentaje - (x[6] || 0);
              return false;
            } else if (this.inputListaSocios.length < 100) {
              errorsArrayObj.push(`Fila ${Object(x).id} : ${MensajeGenerales.CUS5_EX07}`);
              porcentaje = porcentaje - (x[6] || 0);
              return false;
            }
          }
          // REGISTROS DUPLICADOS
          if (existeRegistroDuplicado) {
            errorsArrayObj.push(`Fila ${Object(x).id} : Ya se registro este número de Documento`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          // DOCUMENTO NO ENCONTRADO EN EL PADRON RUC
          if (!Object(x).documentoCorrecto) {
            let mensaje = '';
            if (ConstantesDocumentos.DNI === tipoDoc) {
              mensaje = MensajeGenerales.CUS5_EX02;
            } else if (ConstantesDocumentos.RUC === tipoDoc) {
              mensaje = MensajeGenerales.CUS5_EX01;
            }
            errorsArrayObj.push(`Fila ${Object(x).id} : ${mensaje}`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          // TIPO DE SOCIO
          if (!!!tipsocio || !this.verificarSocio(tipsocio)) {
            errorsArrayObj.push(`Fila ${Object(x).id} : Seleccione el tipo de Socio`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          // TIPO DE DOCUMENTO
          if (!!!tipoDoc || !this.verificarDocumento(tipsocio, tipoDoc)) {
            errorsArrayObj.push(`Fila ${Object(x).id} : Seleccione el tipo de Documento Correcto`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          if (tipsocio === ConstantesSocios.PERSONA_NATURAL_DOMICILIADO && tipoDoc === ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS) {
            errorsArrayObj.push(`Fila ${Object(x).id} : ${MensajeGenerales.CUS5_EX15}`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          // NUMERO DE DOCUMENTO
          if (!!!x[2] || x[2] === 'undefined' || !this.validarNumeroDocumento(tipoDoc, x[2])) {
            errorsArrayObj.push(`Fila ${Object(x).id} : Ingrese un Numero de Documento Correcto`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          // RAZON SOCIAL
          if (!!!x[3] || !this.validarRazonSocial(tipsocio, x[3].toString())) {
            errorsArrayObj.push(`Fila ${Object(x).id} : Ingrese un Nombre o Razón Social Correctos`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          // FECHA DE NACIMIENTO
          if (!this.validarFechaNac(tipsocio, x[4])) {
            let mensaje = '';
            if (tipsocio === ConstantesSocios.PERSONA_NATURAL_DOMICILIADO) {
              mensaje = 'Ingrese Fecha de Nacimiento';
            } else if (tipsocio === ConstantesSocios.PERSONA_JURICIDA_DOMICILIADO) {
              mensaje = 'Para el tipo de Socio' + x[0].substring(2).toString() + ' No debe Ingresar Fecha de Nacimiento';
            } else if (tipsocio === ConstantesSocios.PERSONA_NATURAL_NO_DOMICILIADO) {
              mensaje = 'Ingrese Fecha de Nacimiento';
            } else if (tipsocio === ConstantesSocios.PERSONA_JURICIDA_NO_DOMICILIADO) {
              mensaje = 'Para el tipo de Socio' + x[0].substring(2).toString() + ' No debe Ingresar Fecha de Nacimiento';
            } else {
              mensaje = 'Ingrese Fecha de Nacimiento';
            }
            errorsArrayObj.push(`Fila ${Object(x).id} : ${mensaje}`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          // VALIDACIONES FECHA DE NACIMIENTO
          if (!!x[4]) {
            if (!this.validarFormatoFechas(x[4])) {
              errorsArrayObj.push(`Fila ${Object(x).id} : Ingrese formato de fecha correcta dd/mm/yyyy`);
              porcentaje = porcentaje - (x[6] || 0);
              return false;
            }
            if (!this.validarFechas(tipsocio, x[4])) {
              let mensaje = '';
              if (tipsocio !== ConstantesSocios.CONSOLIDADO) {
                mensaje = 'La fecha de nacimiento es mayor a la fecha del sistema';
              } else {
                mensaje =
                  'Para el tipo de Socio' + x[0].substring(2).toString() + ' la Fecha debe ser 01/01/' + this.anio;
              }
              errorsArrayObj.push(`Fila ${Object(x).id} : ${mensaje}`);
              porcentaje = porcentaje - (x[6] || 0);
              return false;
            }
          }
          // PAIS
          if (!this.validarPais(tipsocio, x[5])) {
            let mensaje = '';
            if (tipsocio === ConstantesSocios.PERSONA_NATURAL_DOMICILIADO) {
              mensaje = 'Para el tipo de Socio' + x[0].substring(2).toString() + ' No debe Ingresar País de Residencia';
            } else if (tipsocio === ConstantesSocios.PERSONA_JURICIDA_DOMICILIADO) {
              mensaje = 'Para el tipo de Socio' + x[0].substring(2).toString() + ' No debe Ingresar País de Residencia';
            } else if (tipsocio === ConstantesSocios.PERSONA_NATURAL_NO_DOMICILIADO) {
              mensaje = 'Ingrese País de Residencia';
            } else if (tipsocio === ConstantesSocios.PERSONA_JURICIDA_NO_DOMICILIADO) {
              mensaje = 'Ingrese País de Residencia';
            } else {
              mensaje = 'Para el tipo de Socio' + x[0].substring(2).toString() + ' No debe Ingresar País de Residencia';
            }
            errorsArrayObj.push(`Fila ${Object(x).id} : ${mensaje}`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          if (!!x[5] && !this.verificarPais(x[5].substring(0, 4))) {
            errorsArrayObj.push(`Fila ${Object(x).id} : Ingrese un País Correcto`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          // PORCENTAJE
          if (!!!x[6] || !this.validarPorcentaje(x[6])) {
            errorsArrayObj.push(`Fila ${Object(x).id} : Ingrese Porcentaje de Participación`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          if (!this.validarPorcentajeTotal(tipsocio, x[6])) {
            let mensaje = '';
            if (tipsocio !== ConstantesSocios.CONSOLIDADO) {
              mensaje = MensajeGenerales.CUS5_EX06;
            } else {
              mensaje = MensajeGenerales.CUS5_EX07;
            }
            errorsArrayObj.push(`Fila ${Object(x).id} : ${mensaje}`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          // FECHA CONSTITUCION
          if (!!!x[7]) {
            errorsArrayObj.push(`Fila ${Object(x).id} : Ingrese Fecha en la que se constituyo como Socio`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          if (!this.validarFormatoFechas(x[7])) {
            errorsArrayObj.push(`Fila ${Object(x).id} : Ingrese formato de fecha correcta dd/mm/yyyy`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          if (!this.validarFechas(tipsocio, x[7])) {
            let mensaje = '';
            if (tipsocio !== ConstantesSocios.CONSOLIDADO) {
              mensaje = 'La fecha en la que se constituye como socio es mayor a la fecha del sistema';
            } else {
              mensaje = 'Para el tipo de Socio' + x[0].substring(2).toString() + ' la Fecha debe ser 01/01/' + this.anio;
            }
            errorsArrayObj.push(`Fila ${Object(x).id} : ${mensaje}`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          // FECHA NAC NO MAYOR A FECHA CONST
          if (!!x[4] && !this.validarDiferenciaFechas(x[4], x[7])) {
            errorsArrayObj.push(`Fila ${Object(x).id} :
                        La fecha de nacimiento debe ser menor que la fecha que se constituye como socio`);
            porcentaje = porcentaje - (x[6] || 0);
            return false;
          }
          const socios = {
            numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
            codTipDocSocio: tipsocio,
            codTipDocPrincipal: tipoDoc,
            numDocPrincipal: this.obtenerNumDoc(x[2], tipsocio),
            desDocPrincipal: String(x[3]).toUpperCase(),
            fecNacPrincipal: this.convertirFecha(x[4]),
            codPais: x[5] ? x[5].substring(0, 4) : null,
            porParticipacion: this.obtenerPorcentaje(x[6]),
            fecConstitucion: this.convertirFecha(x[7])
          };
          if (this.inputListaSocios.length === 100 && socios.codTipDocSocio === ConstantesSocios.CONSOLIDADO) {
            this.inputListaSocios.push(socios);
          } else if (this.inputListaSocios.length === 100 && socios.codTipDocSocio !== ConstantesSocios.CONSOLIDADO) {
            errorsArrayObj.push(MensajeGenerales.CUS5_EX12);
            return start = false;
          } else if (this.inputListaSocios.length < 100) {
            this.inputListaSocios.push(socios);
          } else {
            errorsArrayObj.push(MensajeGenerales.CUS5_EX12);
            return start = false;
          }
        } else {
          errorsArrayObj.push(MensajeGenerales.CUS5_EX08);
          return start = false;
        }
      }
    });
    if (errorsArrayObj.length !== 0) {
      this.chatErrorService.showErrorsArray(errorsArrayObj);
    } else {
      this.tuplasExcel.emit(this.inputListaSocios);
    }
    this.activeModal.close();
  }

  private obtenerNumDoc(numero: any, socio: any): string {
    if (socio !== ConstantesSocios.CONSOLIDADO) {
      return String(numero).toUpperCase();
    } else {
      return '000000000000';
    }
  }

  private convertirFecha(fecha: any): string {
    if (fecha) {
      if (typeof fecha === 'string') {
        fecha = this.apiDate.transform(this.trasformarFecha(fecha), 'yyyy-MM-dd') + 'T00:00:00.358-05:00';
      } else {
        fecha = this.apiDate.transform(new Date((fecha - (25567 + 1)) * 86400 * 1000), 'yyyy-MM-dd') + 'T00:00:00.358-05:00';
      }
      return fecha;
    }
    return null;
  }

  private verificarSocio(socio: any): boolean {
    return socio === ConstantesSocios.PERSONA_NATURAL_DOMICILIADO
      || socio === ConstantesSocios.PERSONA_JURICIDA_DOMICILIADO
      || socio === ConstantesSocios.PERSONA_NATURAL_NO_DOMICILIADO
      || socio === ConstantesSocios.PERSONA_JURICIDA_NO_DOMICILIADO
      || socio === ConstantesSocios.CONSOLIDADO;
  }

  private verificarDocumento(socio: any, tipoDoc: any): boolean {
    switch (socio) {
      case ConstantesSocios.PERSONA_NATURAL_DOMICILIADO: return this.perteneceListaDocumentos(tipoDoc);
      case ConstantesSocios.PERSONA_JURICIDA_DOMICILIADO: return tipoDoc === ConstantesDocumentos.RUC;
      case ConstantesSocios.PERSONA_NATURAL_NO_DOMICILIADO: return this.perteneceListaDocumentos(tipoDoc);
      case ConstantesSocios.PERSONA_JURICIDA_NO_DOMICILIADO: return tipoDoc === ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS;
      case ConstantesSocios.CONSOLIDADO: return tipoDoc === ConstantesDocumentos.CONSOLIDADO;
    }
  }

  private validarNumeroDocumento(tipDoc: any, numDoc: any): boolean {
    if (tipDoc === ConstantesDocumentos.DNI) {
      return numDoc.length === 8 && !!numDoc.match(/^[0-9]*$/);
    } else if (tipDoc === ConstantesDocumentos.RUC) {
      return numDoc.length === 11 && ValidacionService.valruc(numDoc);
    } else if (tipDoc === ConstantesDocumentos.CARNET_DE_EXTRANJERIA ||
      tipDoc === ConstantesDocumentos.PASAPORTE ||
      tipDoc === ConstantesDocumentos.PTP ||
      tipDoc === ConstantesDocumentos.CARNET_IDENTIDAD ||
      tipDoc === ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS) {
      return numDoc.length <= 15 && !!numDoc.match(/^[a-zA-Z0-9Ññ]*$/);
    } else {
      return numDoc === '0';
    }
  }

  private validarRazonSocial(socio: any, nombre: string): boolean {
    if (socio !== ConstantesSocios.CONSOLIDADO) {
      return !!nombre.match(/^[ a-zA-Z0-9ñÑ]*$/);
    } else {
      return nombre.toUpperCase().split(' ').join('') === 'CONSOLIDADOOTROSSOCIOS';
    }
  }

  private validarFechaNac(socio: any, fecha: any): boolean {
    switch (socio) {
      case ConstantesSocios.PERSONA_NATURAL_DOMICILIADO: return !!fecha;
      case ConstantesSocios.PERSONA_JURICIDA_DOMICILIADO: return !!!fecha;
      case ConstantesSocios.PERSONA_NATURAL_NO_DOMICILIADO: return !!fecha;
      case ConstantesSocios.PERSONA_JURICIDA_NO_DOMICILIADO: return !!!fecha;
      case ConstantesSocios.CONSOLIDADO: return !!fecha;
    }
  }

  private validarPais(socio: any, pais: any): boolean {
    switch (socio) {
      case ConstantesSocios.PERSONA_NATURAL_DOMICILIADO: return !!!pais;
      case ConstantesSocios.PERSONA_JURICIDA_DOMICILIADO: return !!!pais;
      case ConstantesSocios.PERSONA_NATURAL_NO_DOMICILIADO: return !!pais;
      case ConstantesSocios.PERSONA_JURICIDA_NO_DOMICILIADO: return !!pais;
      case ConstantesSocios.CONSOLIDADO: return !!!pais;
    }
  }

  private validarFechas(socio: any, fecha: any): boolean {
    if (typeof fecha === 'string') {
      fecha = this.apiDate.transform(this.trasformarFecha(fecha), 'dd/MM/yyyy');
    } else {
      fecha = this.apiDate.transform(new Date((fecha - (25567 + 1)) * 86400 * 1000), 'dd/MM/yyyy');
    }
    const fechaActual = this.apiDate.transform(new Date(), 'dd/MM/yyyy');
    if (socio !== ConstantesSocios.CONSOLIDADO) {
      return this.transformaraDias(fecha) <= this.transformaraDias(fechaActual);
    } else {
      return fecha === '01/01/' + this.anio;
    }
  }

  private trasformarFecha(fecha: string): string {
    return `${fecha.split('/')[1]}/${fecha.split('/')[0]}/${fecha.split('/')[2]}`;
  }

  private verificarPais(paises: any): boolean {
    const pais = this.listaPaises.filter(x => x.val === paises);
    return pais.length !== 0;
  }

  private validarPorcentaje(porcentaje): boolean {
    return this.funcionesGenerales.isNumber(porcentaje);
  }

  private validarPorcentajeTotal(socio: any, porcentaje: any): boolean {
    porcentaje = Number(porcentaje);
    if (socio !== ConstantesSocios.CONSOLIDADO) {
      return porcentaje <= 100;
    } else {
      return porcentaje < 100;
    }
  }

  private validarDiferenciaFechas(fechaNac: any, fechaConst: any): boolean {
    if (typeof fechaNac === 'string') {
      fechaNac = this.apiDate.transform(this.trasformarFecha(fechaNac), 'dd/MM/yyyy');
    } else {
      fechaNac = this.apiDate.transform(new Date((fechaNac - (25567 + 1)) * 86400 * 1000), 'dd/MM/yyyy');
    }
    if (typeof fechaConst === 'string') {
      fechaConst = this.apiDate.transform(this.trasformarFecha(fechaConst), 'dd/MM/yyyy');
    } else {
      fechaConst = this.apiDate.transform(new Date((fechaConst - (25567 + 1)) * 86400 * 1000), 'dd/MM/yyyy');
    }
    return this.transformaraDias(fechaNac) <= this.transformaraDias(fechaConst);
  }

  private validarFormatoFechas(fecha: any) {
    if (typeof fecha === 'string') {
      return !!fecha.match(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/);
    } else {
      return fecha > 0;
    }
  }

  private transformaraDias(fecha: string): number {
    const dia = fecha.split('/')[0];
    const mes = fecha.split('/')[1];
    const anio = fecha.split('/')[2];

    const meses = Number(mes) + (Number(anio) * 12);
    const dias = Number(dia) + (meses * 30);

    return dias;
  }

  private perteneceListaDocumentos(tipoDoc): boolean {
    return tipoDoc === ConstantesDocumentos.DNI
      || tipoDoc === ConstantesDocumentos.RUC
      || tipoDoc === ConstantesDocumentos.CARNET_DE_EXTRANJERIA
      || tipoDoc === ConstantesDocumentos.PASAPORTE
      || tipoDoc === ConstantesDocumentos.PTP
      || tipoDoc === ConstantesDocumentos.CARNET_IDENTIDAD
      || tipoDoc === ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS
      || tipoDoc === ConstantesDocumentos.CONSOLIDADO;
  }

  private obtenerPorcentaje(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: 8, useGrouping: false });
  }
}
