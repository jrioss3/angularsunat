import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { MensajeGenerales } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils';
import { ModalConfirmarService } from '@rentas/shared/core';

@Component({
  selector: 'app-eegimportar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})
export class EegImportarComponent implements OnInit {

  public labelArchivo = MensajeGenerales.TEXTO_SELECCIONAR_ARCHIVO;
  private data: Array<Array<any>>;
  private event: any;
  private anio: any;
  private ruc: any;
  private funcionesGenerales: FuncionesGenerales;
  @Output() outData = new EventEmitter<Array<ModelFileExcel>>();

  constructor(
    public activeModal: NgbActiveModal,
    private modalConfirmarService: ModalConfirmarService,
    private preDeclaracionService: PreDeclaracionService) { }

  public ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.anio = this.preDeclaracionService.obtenerNumeroEjercicio();
    this.ruc = this.preDeclaracionService.obtenerRucPredeclaracion();
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

  public guardarArchivo(): void {
    if (this.siNoSeleccionaArchivo()) {
      this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_NO_HAY_ARCHIVO_EXCEL, 'Mensaje');
      this.activeModal.close('Close click');
    } else if (this.elArchivoNotieneElnombreEstablecido() || !this.siNoCumpleConElContenidoDelArchivo()) {
      this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_CONTENIDO_INCORRECTO, 'Mensaje');
      this.activeModal.close('Close click');
    } else {
      const lista = [...this.data]
        .filter(e => this.validarCasilla(e[0], e[2]))
        // tslint:disable-next-line: no-use-before-declare
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
  }

  private siNoSeleccionaArchivo(): boolean {
    return !!!this.data;
  }

  private elArchivoNotieneElnombreEstablecido(): boolean {
    const regexpNombre = new RegExp(`^0710+${this.anio}+${this.ruc}+EEGGPP$`);
    return !this.funcionesGenerales.elNombreCumpleCon(regexpNombre, this.event);
  }

  private siNoCumpleConElContenidoDelArchivo(): boolean {
    return this.tieneTitulo() && this.tieneCabeceras() && this.existenCasillas();
  }

  private tieneCabeceras(): boolean {
    let cabeceras = this.data.filter((x, i) => i === 1)[0];
    cabeceras = cabeceras.map(e => e.toUpperCase());
    return 'CASILLA' === cabeceras[0] && 'CONCEPTO' === cabeceras[1] && 'MONTO' === cabeceras[2];
  }

  private tieneTitulo(): boolean {
    const titulo = this.data.filter((x, i) => i === 0)[0];
    return ['ESTADO DE RESULTADOS'].includes(titulo[0].toUpperCase());
  }

  private existenCasillas(): boolean {
    const listaCasillas: any = [461, 462, 463, 464, 466, 467, 468, 469, 470, 471, 472, 650, 651,
      473, 475, 476, 432, 433, 477, 478, 480, 481, 483, 484, 485, 486, 487, 489, 490];
    const listaCasillasObtenidas = [...this.data].splice(2, 31).map(fila => {
      return fila[0];
    });
    return this.equals(listaCasillasObtenidas, listaCasillas);
  }

  private equals(listaObtenenida: Array<any>, listaCasillas: Array<any>): boolean {
    return listaObtenenida.every((x, i) => {
      return x === listaCasillas[i];
    });
  }

  private obtenerDatosFiltrados(data: any): Array<Array<any>> {
    let datosFiltrados = data.map(fila => fila.splice(0, 3));
    datosFiltrados = datosFiltrados.splice(0, 31);
    return datosFiltrados;
  }

  private validarCasilla(tipo: number, value: number): boolean {
    switch (tipo) {
      case 461: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 462: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 464: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 468: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 469: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 472: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 650: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 651: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 475: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 476: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 432: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 433: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 478: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 480: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 486: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      case 490: return value ? this.funcionesGenerales.isNumber(value) && value >= 0 && value.toString().length <= 15 : false;
      default: return false;
    }
  }
}

class ModelFileExcel {
  public casilla: string;
  public concepto: string;
  public monto: number;
  constructor(casilla: string, concepto: string, monto: number) {
    this.casilla = casilla;
    this.concepto = concepto;
    this.monto = monto ? Number(monto) : null;
  }
}
