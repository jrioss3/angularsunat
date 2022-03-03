import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { MensajeGenerales } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils';
import { ModalConfirmarService } from '@rentas/shared/core';

@Component({
  selector: 'app-cciimportar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})

export class CredContraImpRentaImportarComponent implements OnInit {

  private periodo: string;
  private ruc: string;
  private event: any;
  public labelArchivo = MensajeGenerales.TEXTO_SELECCIONAR_ARCHIVO;
  private data: Array<Array<any>>;
  private funcionesGenerales: FuncionesGenerales;
  @Input() casilla: any;
  @Output() outData = new EventEmitter<Array<ModelFileExcel>>();
  @Output() outDataC130 = new EventEmitter<Array<ModelFileExcelC130>>();
  @Input() importar: any;

  constructor(
    public activeModal: NgbActiveModal,
    private modalConfirmarService: ModalConfirmarService,
    private preDeclaracionService: PreDeclaracionService) { }

  public ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.periodo = this.preDeclaracionService.obtenerNumeroEjercicio();
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

  public importarArchivo(): void {
    if (this.siNoSeleccionaArchivo()) {
      this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_NO_HAY_ARCHIVO_EXCEL, 'Mensaje');
      this.activeModal.close('Close click');
    } else if (this.elArchivoNotieneElnombreEstablecido() || !this.siNoCumpleConElContenidoDelArchivo()) {
      this.modalConfirmarService.msgValidaciones(MensajeGenerales.ERROR_CONTENIDO_INCORRECTO, 'Mensaje');
      this.activeModal.close('Close click');
    } else {
      if (this.casilla === '128') {
        const lista = [...this.data]
          .splice(3, 19)
          // tslint:disable-next-line: no-use-before-declare
          .map(e => new ModelFileExcel(e[1], e[2], e[3], e[4], e[5]));
        this.outData.emit(lista);
      } else if (this.casilla === '130') {
        const lista = [...this.data]
          .splice(3, 19)
          // tslint:disable-next-line: no-use-before-declare
          .map(e => new ModelFileExcelC130(e[1]));
        this.outDataC130.emit(lista);
      }
      this.activeModal.close('Close click');
    }
  }

  private siNoSeleccionaArchivo(): boolean {
    return !!!this.data;
  }

  private elArchivoNotieneElnombreEstablecido(): boolean {
    if (this.casilla === '128') {
      const regexpNombre = new RegExp(`^0710+${this.periodo}+${this.ruc}128$`);
      return !this.funcionesGenerales.elNombreCumpleCon(regexpNombre, this.event);
    } else if (this.casilla === '130') {
      const regexpNombre = new RegExp(`^0710+${this.periodo}+${this.ruc}130$`);
      return !this.funcionesGenerales.elNombreCumpleCon(regexpNombre, this.event);
    }
  }

  private siNoCumpleConElContenidoDelArchivo(): boolean {
    return this.tieneTitulo() && this.tieneCabeceras();
  }

  private tieneCabeceras(): boolean {
    if (this.casilla === '128') {
      let cabeceras = this.data.filter((x, i) => i === 2)[0];
      cabeceras = cabeceras.map(e => e.toUpperCase());
      return 'MES EN QUE EFECTUÓ EL PAGO' === cabeceras[0] &&
        'UTILIZACIÓN DEL SALDO A FAVOR' === cabeceras[1] &&
        'COMPENSACIÓN DEL SFMB' === cabeceras[2] &&
        'COMPENSACIÓN DEL ITAN' === cabeceras[3] &&
        'OTROS CRÉDITOS' === cabeceras[4] &&
        'MONTO PAGADO' === cabeceras[5];
    } else if (this.casilla === '130') {
      let cabeceras = this.data.filter((x, i) => i === 2)[0];
      cabeceras = cabeceras.map(e => e.toUpperCase());
      return 'MESENQUEEFECTUOLARETENCIÓN' === cabeceras[0].replace('\n', '').split(' ').join('') &&
        'MONTO DE LA RETENCIÓN' === cabeceras[1];
    }
  }

  private tieneTitulo(): boolean {
    if (this.casilla === '128') {
      const titulo = this.data.filter((x, i) => i === 0)[0];
      return ['Casilla 128 - PAGOS A CUENTA MENSUALES DEL EJERCICIO'].includes(titulo[0]);
    } else if (this.casilla === '130') {
      const titulo = this.data.filter((x, i) => i === 0)[0];
      return ['DETALLE DE LA CASILLA 130 - RETENCIONES DE 3RA CAT.'].includes(titulo[0]);
    }
  }

  private obtenerDatosFiltrados(data: any): Array<Array<any>> {
    let datosFiltrados;
    if (this.casilla === '130') {
      datosFiltrados = data.map(fila => fila.splice(0, 2));
      datosFiltrados = datosFiltrados.splice(0, 19);
    } else if (this.casilla === '128') {
      datosFiltrados = data.map(fila => fila.splice(0, 6));
      datosFiltrados = datosFiltrados.splice(0, 19);
    }
    return datosFiltrados;
  }
}

class ModelFileExcel {
  public utilizacionSaldoAFavor: number;
  public compensacionSFMB: number;
  public compensacionITAN: number;
  public otrosCreditos: number;
  public montoPagado: number;
  constructor(
    utilizacionSaldoAFavor: number,
    compensacionSFMB: number,
    compensacionITAN: number,
    otrosCreditos: number,
    montoPagado: number,
  ) {
    this.utilizacionSaldoAFavor = utilizacionSaldoAFavor;
    this.compensacionSFMB = compensacionSFMB;
    this.compensacionITAN = compensacionITAN;
    this.otrosCreditos = otrosCreditos;
    this.montoPagado = montoPagado;
  }
}

class ModelFileExcelC130 {
  public montoRetencion: number;
  constructor(montoRetencion: number) {
    this.montoRetencion = montoRetencion;
  }
}
