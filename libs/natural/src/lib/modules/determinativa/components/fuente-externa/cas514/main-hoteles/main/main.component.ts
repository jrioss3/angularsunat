import { MostrarMensajeService } from '@path/natural/services/mostrarMensaje.service';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService, ParametriaFormulario } from '@path/natural/services';
import { ComboService } from '@rentas/shared/core';
import { PreDeclaracionModel, Casilla514Cabecera, LCas514Detalle, ListaParametrosModel } from '@path/natural/models';
import { Subject } from 'rxjs';
import { ConstantesCasilla514 } from '@path/natural/utils';
import { Sfec514HotelesMantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { ConstantesCombos, dtOptionsPNComprobantesValidos,dtOptionsCas514Check } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';
import { CalcularMontoMaximoDeducir } from '../../utils/calcular-monto-maximo-deducir';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class Sfec514MainHotelesComponent extends RenderizarPaginacion implements OnInit, OnDestroy, AfterViewInit {

  private preDeclaracion: PreDeclaracionModel;
  public dtOptions: DataTables.Settings = dtOptionsCas514Check;
  private tipoGastoHoteles = '05';
  public hotelesTotalS: number;
  public hoteles514: LCas514Detalle[];
  private listCompHoteles;
  private listaFormaPago: ListaParametrosModel[];
  private porcentajeDeduccion: number;
  private indice: number;
  private readonly mensajeConformidadEliminarRegistro = 'Se eliminó el elemento correctamente.';
  private readonly mensajeEliminar = '¿Desea eliminar el registro?';
  private funcionesGenerales: FuncionesGenerales;
  private lista514Cabecera: Casilla514Cabecera[];
  private anioEjercicio: number;
  public lstParametriaObservaciones;

  @Output() total = new EventEmitter<number>();
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  constructor(
    public activeModal: NgbActiveModal,
    private predeclaracionService: PreDeclaracionService,
    private modalService: NgbModal,
    private comboService: ComboService,
    private cus27Service: ParametriaFormulario,
    private mostrarMensaje: MostrarMensajeService) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.anioEjercicio = Number(this.predeclaracionService.obtenerAnioEjercicio());
    this.lista514Cabecera = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.getPorcentajeDeduccion();
    this.indice = [...this.lista514Cabecera].findIndex(x => x.indTipoGasto === this.tipoGastoHoteles);
    this.obtenerListaYMontoTotalHoteles();
    this.obtenerListasParametria();
    this.calcularMontoDeducir();
    //this.ordenarPorFecha();
    this.lstParametriaObservaciones = this.comboService.obtenerComboPorNumero(ConstantesCombos.OBSERVACIONES_GASTOS_DEDUCIBES);
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void { this.dtTrigger.unsubscribe(); }

  public ObtenerComprobante(val: string): string {
    const descripcionComp = this.listCompHoteles.filter(x => x.val === val);
    return descripcionComp.length !== 0 ? descripcionComp[0].desc : '';
  }

  public ObtenerMedPag(val: string): string {
    const descFormaPago = this.listaFormaPago.filter(x => x.val === val);
    return descFormaPago.length !== 0 ? descFormaPago[0].desc : '';
  }

  public agregarOActualizar(id?: LCas514Detalle[], index?: number): void {
    const modal = {
      titulo: 'Hoteles y restaurantes',
      accion: 'hoteles'
    };
    const modalRef = this.modalService.open(Sfec514HotelesMantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputListaBienes = this.hoteles514;
    modalRef.componentInstance.modal = modal;
    modalRef.componentInstance.inputId = id;
    modalRef.componentInstance.inputIndex = index;
    modalRef.componentInstance.listaBienesReady.subscribe((data) => {
      this.calculoMontoyActualizarPredeclaracion(data, null);
      this.rerender();
    });
  }

  public eliminarHoteles(index: number): void {
    this.mostrarMensaje.mensajeEliminar(this.mensajeEliminar).subscribe($e => {
      if ($e === 'si') {
        this.calculoMontoyActualizarPredeclaracion(null, index);
        this.mostrarMensaje.callModal(this.mensajeConformidadEliminarRegistro);
        this.rerender();
      }
    });
  }

  private calculoMontoyActualizarPredeclaracion(data: LCas514Detalle[], index: number): void {
    if (data !== null) { this.hoteles514 = data; }
    if (index !== null) { this.hoteles514.splice(index, 1); }
    this.hotelesTotalS = this.hoteles514.filter(x => x.indEstFormVirt === ConstantesCasilla514.regValido).
      reduce((total, hoteles) => total + Number(hoteles.mtoDeduccion), 0);
    this.lista514Cabecera[this.indice].casilla514Detalle.lisCas514 = this.hoteles514;
    this.lista514Cabecera[this.indice].mtoGasto = this.hotelesTotalS;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.total.emit(this.hotelesTotalS);
  }

  private calcularMontoDeducir(): void {
    /*this.hoteles514.forEach(x => {
      if (x.indEstFormVirt === ConstantesCasilla514.regValido) {
        x.mtoDeduccion = this.funcionesGenerales.redondearMontos((Number(x.mtoComprob) * (this.porcentajeDeduccion / 100)), 2);
      }
    });*/
    this.hoteles514.map(e => new CalcularMontoMaximoDeducir(e, this.anioEjercicio).getMontoDeduccionActualizadoArtesania());
    this.hotelesTotalS = this.hoteles514.filter(x => x.indEstFormVirt === ConstantesCasilla514.regValido).
      reduce((total, hoteles) => total + Number(hoteles.mtoDeduccion), 0);
    this.ordenarPorFecha();  
    this.lista514Cabecera[this.indice].casilla514Detalle.lisCas514 = this.hoteles514;
    this.lista514Cabecera[this.indice].mtoGasto = this.hotelesTotalS;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.total.emit(this.hotelesTotalS);
  }

  private obtenerListaYMontoTotalHoteles(): void {
    this.lista514Cabecera.map(x => {
      switch (x.indTipoGasto) {
        case this.tipoGastoHoteles: {
          this.hoteles514 = x.casilla514Detalle.lisCas514;
          this.hotelesTotalS = x.mtoGasto;
          break;
        }
      }
    });
  }

  private obtenerListasParametria(): void {
    this.listCompHoteles = this.cus27Service.obtenerTipoComprobante_cus32_Hoteles();
    this.listCompHoteles = this.listCompHoteles.filter(x => x.val === ConstantesCasilla514.codBoleta);
    this.listaFormaPago = this.cus27Service.obtenerFormaPago();
  }

  private getPorcentajeDeduccion(): void {
    const listaPorcentajesDeduccion = this.comboService.obtenerComboPorNumero(ConstantesCombos.PORCENTAJE_DEDUCIR);
    this.porcentajeDeduccion = Number(listaPorcentajesDeduccion.find(item => item.desc == this.anioEjercicio.toString()).val);
  }

  private ordenarPorFecha(): void {
    this.hoteles514.sort((a, b) => {
      if (a.fecComprob > b.fecComprob) {
        return 1;
      }
      if (a.fecComprob < b.fecComprob) {
        return -1;
      }
      return 0;
    });
  }

  public habilitarCasItan(): boolean {
    const anioRenta = this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    return Number(anioRenta) >= 2020;
  }
}
