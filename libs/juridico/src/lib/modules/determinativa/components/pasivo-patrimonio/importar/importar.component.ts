import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { MensajeGenerales } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils';
import { ModalConfirmarService } from '@rentas/shared/core';

@Component({
  selector: 'app-epimportar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})
export class EstFinPasivoImportarComponent implements OnInit {

  public labelArchivo = MensajeGenerales.TEXTO_SELECCIONAR_ARCHIVO;
  private data: Array<Array<any>>;
  private event: any;
  private anioEjercicio: string;
  private numRuc: string;
  private funcionesGenerales: FuncionesGenerales;
  @Output() outData = new EventEmitter<Array<ModelFileExcel>>();

  constructor(
    public activeModal: NgbActiveModal,
    private modalConfirmarService: ModalConfirmarService,
    private preDeclaracionService: PreDeclaracionService) { }

  public ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.anioEjercicio = this.preDeclaracionService.obtenerNumeroEjercicio();
    this.numRuc = this.preDeclaracionService.obtenerRucPredeclaracion();
  }

  public adjuntarArchivo($event: any): void {
    this.event = $event;
    if (this.funcionesGenerales.siAdjuntoArchivo($event)) {
      if (this.funcionesGenerales.cargoArchivoCorrecto($event)) {
        this.funcionesGenerales.leerArchivoExcel($event)
          .then(data => this.data = this.obtenerDatosFiltrados(data));
        this.labelArchivo = (this.funcionesGenerales.getNameArchivo($event));
      } else {
        this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_EXTENSION_INCORRECTA, 'Mensaje');
        this.activeModal.close('Close click');
      }
    } else {
      this.data = null;
      this.labelArchivo = MensajeGenerales.TEXTO_SELECCIONAR_ARCHIVO;
    }
  }

  private obtenerDatosFiltrados(data: any): Array<Array<any>> {
    let datosFiltrados = data.map(fila => fila.splice(0, 3));
    datosFiltrados = datosFiltrados.splice(0, 28);
    return datosFiltrados;
  }

  public guardarArchivo(): void {
    try {
      if (this.siNoSeleccionaArchivo()) {
        this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_NO_HAY_ARCHIVO_EXCEL, 'Mensaje');
        this.activeModal.close('Close click');
      } else if (this.elArchivoNotieneElnombreEstablecido() || !this.siNoCumpleConElContenidoDelArchivo()) {
        this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_CONTENIDO_INCORRECTO, 'Mensaje');
        this.activeModal.close('Close click');
      } else {
        let monto416; let monto417; let monto421; let monto422; let monto423; let monto424;
        let lista = this.data
          .filter(fila => fila.length === 3)
          .filter(fila => fila[0].toString().trim().length === 3 && (this.validarCasilla(fila[0], fila[2])))
          // tslint:disable-next-line: no-use-before-declare
          .map(e => new ModelFileExcel(e[0], e[1], e[2]));
        lista.forEach(x => {
          switch (x.casilla) {
            case '416': return monto416 = this.validarMonto(x.monto);
            case '417': return monto417 = this.validarMonto(x.monto);
            case '421': return monto421 = this.validarMonto(x.monto);
            case '422': return monto422 = this.validarMonto(x.monto);
            case '423': return monto423 = this.validarMonto(x.monto);
            case '424': return monto424 = this.validarMonto(x.monto);
          }
        });
        if (monto416 != null && monto417 != null || monto416 == null && monto417 == null) {
          lista = lista.filter(x => x.casilla !== '416' && x.casilla !== '417');
        }
        if (monto421 != null && monto422 != null || monto421 == null && monto422 == null) {
          lista = lista.filter(x => x.casilla !== '421' && x.casilla !== '422');
        }
        if (monto423 != null && monto424 != null || monto423 == null && monto424 == null) {
          lista = lista.filter(x => x.casilla !== '423' && x.casilla !== '424');
        }
        this.outData.emit(lista);
        if (lista.length === 0) {
          this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_VALIDACIONES, 'Mensaje');
          this.activeModal.close('Close click');
        } else {
          this.modalConfirmarService.msgValidaciones('Se cargó la información correctamente', 'Mensaje');
          this.activeModal.close('Close click');
        }
      }
    } catch (error) { }
  }

  private siNoCumpleConElContenidoDelArchivo(): boolean {
    return this.tieneTitulo() && this.tieneCabeceras() && this.existenCasillas();
  }

  private tieneCabeceras(): boolean {
    let cabeceras1 = this.data.filter((x, i) => i === 2)[0];
    let cabeceras2 = this.data.filter((x, i) => i === 16)[0];
    cabeceras1 = cabeceras1.map(e => e.toUpperCase());
    cabeceras2 = cabeceras2.map(e => e.toUpperCase());
    return 'CASILLA' === cabeceras1[0] && 'CONCEPTO' === cabeceras1[1] && 'MONTO' === cabeceras1[2] &&
      'CASILLA' === cabeceras2[0] && 'CONCEPTO' === cabeceras2[1] && 'MONTO' === cabeceras2[2];
  }

  private tieneTitulo(): boolean {
    const titulo1 = this.data.filter((x, i) => i === 1)[0];
    const titulo2 = this.data.filter((x, i) => i === 15)[0];
    return ['PASIVO'].includes(titulo1[1]) && ['PATRIMONIO'].includes(titulo2[0]);
  }

  private existenCasillas(): boolean {
    const listaCasillasPasivo: any = [401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411];
    const listaCasillasPatrimonio: any = [414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424];
    const listaCasillasObtenidasPasivo = [...this.data].splice(3, 11).map(fila => {
      return fila[0];
    });
    const listaCasillasObtenidasPatrimonio = [...this.data].splice(17, 28).map(fila => {
      return fila[0];
    });
    return this.equals(listaCasillasObtenidasPasivo, listaCasillasPasivo) &&
      this.equals(listaCasillasObtenidasPatrimonio, listaCasillasPatrimonio);
  }

  private equals(listaObtenenida: Array<any>, listaCasillas: Array<any>): boolean {
    return listaObtenenida.every((x, i) => {
      return x === listaCasillas[i];
    });
  }

  private validarMonto(valor: number): number {
    return valor ? (this.validarCasillas(valor) ? valor : null) : null;
  }

  private validarCasillas(valor: number): boolean {
    return this.funcionesGenerales.isNumber(valor) && valor >= 0 && valor.toString().length <= 15;
  }

  private validarCasilla(tipo: number, value: number): boolean {
    switch (tipo) {
      case 401: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 402: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 403: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 404: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 405: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 406: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 407: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 408: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 409: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 410: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 411: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 414: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 415: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 418: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 419: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 420: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 412: return false;
      default: return true;
    }
  }

  private siNoSeleccionaArchivo(): boolean {
    return !!!this.data;
  }

  private elArchivoNotieneElnombreEstablecido(): boolean {
    const regexpNombre = new RegExp(`^0710+${this.anioEjercicio}+${this.numRuc}+PASIVO$`);
    return !this.funcionesGenerales.elNombreCumpleCon(regexpNombre, this.event);
  }
}

class ModelFileExcel {
  public casilla: string;
  public concepto: string;
  public monto: number;
  constructor(casilla: string, concepto: string, monto: number) {
    this.casilla = String(casilla);
    this.concepto = String(concepto);
    this.monto = monto ? Number(monto) : null;
  }
}
