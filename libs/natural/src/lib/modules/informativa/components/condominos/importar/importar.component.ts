import { ConstantesExcepciones } from '@path/natural/utils';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '@path/natural/services';
import { InfCondominoModel } from '@path/natural/models';
import { UtilsComponent, ErrorListComponent, ValidationService } from '@path/natural/components';
import { ConstantesPlaceHolder } from '@path/natural/utils';
import { Observable, from, of } from 'rxjs';
import { flatMap, map, catchError, reduce, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsultaPersona } from '@rentas/shared/core';
import { ConstantesDocumentos } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils'

@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})

export class ScImportarComponent implements OnInit {

  private datos: Array<Array<any>>;
  private modalMensajeref: NgbModalRef;
  public labelArchivo = ConstantesPlaceHolder.TEXTO_SELECCIONAR_ARCHIVO;
  private funcionesGenerales: FuncionesGenerales;
  private file: any;
  @Input() inputListaCondominios: InfCondominoModel[];
  @Output() listaCondominios = new EventEmitter<InfCondominoModel[]>();
  private anio;
  private ruc;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private preDeclaracionService: PreDeclaracionService,
    private consultaPersona: ConsultaPersona,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.anio = this.preDeclaracionService.obtenerAnioEjercicio();
    this.ruc = this.preDeclaracionService.obtenerRucPredeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.inputListaCondominios = [];
  }

  public setFileUpload(event: any): void {
    this.file = event;
    if (this.funcionesGenerales.siAdjuntoArchivo(event)) {
      if (this.funcionesGenerales.cargoArchivoCorrecto(event)) {
        this.funcionesGenerales.readExcel(event).then(datos => this.datos = this.obtenerDatosFiltrados(datos));
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

  public importarExcel(content): void {
    if (this.noASelecionadoArchivo()) {
      this.callModal(ConstantesPlaceHolder.ERROR_NO_HAY_ARCHIVO_EXCEL)
        .pipe(tap(() => this.activeModal.close('Close click')))
        .subscribe();
    } else {
      this.abrirMensajeImportar(content);
    }
  }

  private abrirMensajeImportar(content) {
    this.modalMensajeref = this.modalService.open(content, this.funcionesGenerales.getModalOptions({}));
  }

  public validarExcel(): void {
    this.modalMensajeref.close();
    if (this.noCumpleNombreEstablecido()) {
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
    const regexpNombre = new RegExp(`^0709+${this.anio}+${this.ruc}+CON$`);
    return !this.funcionesGenerales.elNombreCumpleCon(regexpNombre, this.file);
  }

  private obtenerDatosFiltrados(data: any): Array<Array<any>> {
    let datosFiltrados = data.map(fila => fila.splice(0, 5));
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
              map(() => {
                return ({ ...item, documentoCorrecto: true });
              }),
              catchError(() => {
                return of({ ...item, documentoCorrecto: false });
              })
            );
        } else if (!!item[0] && !!item[1] && item[0].substring(0, 2).trim() === ConstantesDocumentos.RUC) {
          return this.consultaPersona.obtenerContribuyente(item[1])
            .pipe(
              map(() => {
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

  private validarDatos(): void {
    this.spinner.show();
    this.datos = this.datos.map((x, i) => ({ ...x, id: i + 1 }));

    this.validarDocumentos(this.datos)
      .subscribe(datos => {
        this.validaExcel(datos);
        this.spinner.hide();
      });

  }

  private validaExcel(lista: Array<Array<any>>): void {
    const errorsArrayObj = [];
    lista.forEach(element => {
      if (!!!element[0] || !this.validarTipDoc(element[0].substring(0, 2).replace('0', '').trim().toString())) {
        errorsArrayObj.push(`${ConstantesExcepciones.CUS03_EX11} Fila ${Object(element).id}`);
        return false;
      }

      if (!!element[1]) {
        if (element[0].substring(0, 2).replace('0', '').trim().toString() === ConstantesDocumentos.RUC.substring(1, 2)) {
          if (!this.funcionesGenerales.isNumber(element[1])) {
            errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX12}`);
            return false;
          } else if (String(element[1]).length !== 11) {
            errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX12} `);
            return false;
          } else if (!ValidationService.valruc(element[1])) {
            errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX12} `);
            return false;
          } else if (!Object(element).documentoCorrecto) {
            errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX12} `);
            return false;
          }
        } else if (element[0].substring(0, 2).replace('0', '').trim().toString() === ConstantesDocumentos.DNI.substring(1, 2)) {
          if (!this.funcionesGenerales.isNumber(element[1])) {
            errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX12} `);
            return false;
          } else if (String(element[1]).length !== 8) {
            errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX12} `);
            return false;
          } else if (!Object(element).documentoCorrecto) {
            errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX12} `);
            return false;
          }
        } else if (!this.validarRestoDocumento(element[0], element[1])) {
          errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX13} `);
          return false;
        }
      } else {
        errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX14} `);
        return false;
      }
      if (!this.validarPorcentaje(element[2])) {
        errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX15} `);
        this.activeModal.close();
        return false;
      }
      if (!this.validarPartida(element[3])) {
        errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX16} `);
        this.activeModal.close();
        return false;
      }
      if (element[4] === undefined) {
        errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX01}. `);
        this.activeModal.close();
        return false;
      }
      if (!this.validarAutovaluo(element[4])) {
        errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX01}. `);
        this.activeModal.close();
        return false;
      }
      if (Number(element[4]) < 1) {
        errorsArrayObj.push(`Fila ${Object(element).id} : ${ConstantesExcepciones.CUS03_EX04.replace('AAAA', this.anio)}. `);
        this.activeModal.close();
        return false;
      }
      const condominios = {
        codDocIdeDec: element[0].substring(0, 2).replace('0', '').trim().toString(),
        numdocIdeDec: String(element[1]).toUpperCase(),
        desRazSoc: null,
        porParticipa: element[2],
        desPartidaReg: element[3] ? String(element[3]).toUpperCase() : null,
        desDireccion: null,
        codUbigeo: null,
        mtoValBien: element[4]
      };
      this.inputListaCondominios.push(condominios);
    });
    if (errorsArrayObj.length !== 0) {
      this.showErrorsArray(errorsArrayObj);
    } else {
      this.listaCondominios.emit(this.inputListaCondominios);
    }
    this.activeModal.close();
  }

  private validarTipDoc(tipDoc: string): boolean {
    return [ConstantesDocumentos.RUC.substring(1, 2),
    ConstantesDocumentos.DNI.substring(1, 2),
    ConstantesDocumentos.PASAPORTE.substring(1, 2),
    ConstantesDocumentos.CARNET_DE_EXTRANJERIA.substring(1, 2),
    ConstantesDocumentos.PTP,
    ConstantesDocumentos.CARNET_IDENTIDAD].includes(tipDoc);
  }

  private validarRestoDocumento(tipoDoc: any, numeroDoc: any): boolean {
    return (tipoDoc.substring(0, 2).replace('0', '').trim() === ConstantesDocumentos.PASAPORTE.substring(1, 2)
      || tipoDoc.substring(0, 2).replace('0', '').trim() === ConstantesDocumentos.PTP
      || tipoDoc.substring(0, 2).replace('0', '').trim() === ConstantesDocumentos.CARNET_IDENTIDAD
      || tipoDoc.substring(0, 2).replace('0', '').trim() === ConstantesDocumentos.CARNET_DE_EXTRANJERIA.substring(1,  2)
      || tipoDoc.substring(0, 2).replace('0', '').trim() === ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS_NATURAL)
      && String(numeroDoc).length < 15 && !!String(numeroDoc).match(/^[a-zA-Z0-9Ññ]*$/);
  }

  private validarPorcentaje(porc: any): boolean {
    if (!String(porc).match(/^([0-9]*|[0-9]*\.{1}[0-9]{1,2})$/)) {
      return false;
    }
    if (!(porc > 0 && porc < 100)) { 
      return false; 
    }
    return true;
  }

  private validarPartida(partida: string): boolean {
    const exp = new RegExp('^[A-Za-z0-9]+$');
    return exp.test(partida);
  }

  private validarAutovaluo(monto: any): boolean {
    if (isNaN(monto)) { return false; }
    const exp = RegExp('^[0-9]{1,10}$');
    return exp.test(monto);
  }

  private showErrorsArray(errorList: string[]): void {
    const modal = {
      titulo: 'Errores',
      errorList: (errorList)
    };
    const modalRef = this.modalService.open(ErrorListComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
  }

  private callModal(message: string): Observable<any> {
    const modal = {
      titulo: 'Mensaje',
      mensaje: message
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
    modalRef.componentInstance.nameTab = 'ImportarArchivoCas100';
    return modalRef.componentInstance.respuesta;
  }
}
