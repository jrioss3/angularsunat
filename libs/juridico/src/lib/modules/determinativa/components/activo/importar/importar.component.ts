import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { MensajeGenerales } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils';
import { ModalConfirmarService } from '@rentas/shared/core';

@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})
export class EstFinActivoImportarComponent implements OnInit {

  public labelArchivo = MensajeGenerales.TEXTO_SELECCIONAR_ARCHIVO;
  private event: any;
  private anioEjercicio: string;
  private numRuc: string;
  private funcionesGenerales: FuncionesGenerales;
  private data: Array<Array<any>>;
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
        this.labelArchivo = this.funcionesGenerales.getNameArchivo($event);
      } else {
        this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_EXTENSION_INCORRECTA, 'Mensaje');
        this.activeModal.close('Close click');
      }
    } else {
      this.data = null;
      this.labelArchivo = MensajeGenerales.TEXTO_SELECCIONAR_ARCHIVO;
    }
  }

  public cargarArchivo(): void {
    try {
      if (this.siNoSeleccionaArchivo()) {
        this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_NO_HAY_ARCHIVO_EXCEL, 'Mensaje');
        this.activeModal.close('Close click');
      } else if (this.elArchivoNotieneElnombreEstablecido() || !this.siNoCumpleConElContenidoDelArchivo()) {
        this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_CONTENIDO_INCORRECTO, 'Mensaje');
        this.activeModal.close('Close click');
      } else {
        const lista = this.data
          .filter((e, i) => i >= 3 && this.validarCasilla(e[1], e[2]))
          .sort((a, b) => a[0] - b[0])
          .map(e => new ModelFileExcel(e[0], e[1], e[2]));
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

  private validarCasilla(tipo: number, value: number): boolean {
    switch (tipo) {
      case 359: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 360: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 361: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 362: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 363: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 364: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 365: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 366: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 367: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 368: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 369: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 370: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 371: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 372: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 373: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 374: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 375: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 376: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 377: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 378: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 379: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 380: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 381: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 382: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 383: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 384: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 385: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 386: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 387: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 388: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 389: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      default: return false;
    }
  }

  private obtenerDatosFiltrados(data: any): Array<Array<any>> {
    let datosFiltrados = data.map(fila => fila.splice(0, 3));
    datosFiltrados = datosFiltrados.splice(0, 34);
    return datosFiltrados;
  }

  private elArchivoNotieneElnombreEstablecido(): boolean {
    const regexpNombre = new RegExp(`^0710+${this.anioEjercicio}+${this.numRuc}+ACTIVO$`);
    return !this.funcionesGenerales.elNombreCumpleCon(regexpNombre, this.event);
  }

  private siNoSeleccionaArchivo(): boolean {
    return !!!this.data;
  }

  private siNoCumpleConElContenidoDelArchivo(): boolean {
    return this.tieneTitulo() && this.tieneCabeceras() && this.existenCasillas();
  }

  private tieneCabeceras(): boolean {
    let cabeceras = this.data.filter((x, i) => i === 2)[0];
    cabeceras = cabeceras.map(e => e.toUpperCase());
    return 'CONCEPTO' === cabeceras[0] && 'CASILLA' === cabeceras[1] && 'MONTO' === cabeceras[2];
  }

  private tieneTitulo(): boolean {
    const titulo = this.data.filter((x, i) => i === 0)[0];
    return ['ACTIVO - DETALLE'].includes(titulo[0]);
  }

  private existenCasillas(): boolean {
    const listaCasillas: any = [359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375,
      376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389];
    let listaCasillasObtenidas = [...this.data];
    listaCasillasObtenidas = listaCasillasObtenidas.splice(3, 34).map(fila => {
      return fila[1];
    });
    return this.equals(listaCasillasObtenidas, listaCasillas);
  }

  private equals(listaObtenenida: Array<any>, listaCasillas: Array<any>): boolean {
    return listaObtenenida.every((x, i) => {
      return x === listaCasillas[i];
    });
  }
}

class ModelFileExcel {
  public concepto: string;
  public casilla: string;
  public monto: number;
  constructor(concepto: string, casilla: string, monto: number) {
    this.concepto = concepto;
    this.casilla = casilla;
    this.monto = monto;
  }
}
