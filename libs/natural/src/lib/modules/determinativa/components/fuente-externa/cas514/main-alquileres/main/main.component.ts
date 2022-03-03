import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, from } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LCas514Detalle, PreDeclaracionModel, ListaParametrosModel, InfAlquileresModel, Casilla514Cabecera } from '@path/natural/models';
import { ParametriaFormulario, PreDeclaracionService } from '@path/natural/services';
import { ComboService } from '@rentas/shared/core';
import { Router } from '@angular/router';
import { Sfec514AlquileresMantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { ConstantesCombos, Rutas, dtOptionsPNComprobantesValidos } from '@rentas/shared/constantes';
import { ConstantesCasilla514 } from '@path/natural/utils/constantesCasilla514';
import { MostrarMensajeService } from '@path/natural/services/mostrarMensaje.service';
import { ConstantesMensajesInformativos } from '@path/natural/utils/constantesMensajesInformativos';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales } from '@rentas/shared/utils';
import { CalcularMontoMaximoDeducir } from '../../utils/calcular-monto-maximo-deducir';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class Sfec514MainAlquileresComponent extends RenderizarPaginacion implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = dtOptionsPNComprobantesValidos;
  public dtTrigger: Subject<any> = new Subject();
  public listaGastosAlquiler: LCas514Detalle[] = [];
  private preDeclaracion: PreDeclaracionModel;
  private alquilerPagado: any;
  public MontoTotalGastoAlquiler = 0;
  private renta: any;
  public readonly porcentaje = '<siempre es 30%>';
  private listaTipoComprobante: ListaParametrosModel[];
  private listaTipoBien: ListaParametrosModel[];
  private listaFormaPago: ListaParametrosModel[];
  private listaTipoVinculo: ListaParametrosModel[];
  private indice: number;
  private funcionesGenerales: FuncionesGenerales;
  public lstParametriaObservaciones;
  public anioEjercicio: string;

  public AlquileresTotalS: number;
  private lista514Cabecera: Casilla514Cabecera[];

  @Output() total = new EventEmitter<number>();
  @Input() cerrarModalPadre: () => {};

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private cus27Service: ParametriaFormulario,
    private modalService: NgbModal,
    private comboService: ComboService,
    private mostrarMensaje: MostrarMensajeService,
    private preDeclaracionservice: PreDeclaracionService
  ) { super(); }

  ngOnInit(): void {
    this.obtenerListas();
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.alquilerPagado = this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas602;
    this.lista514Cabecera = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
    this.indice = this.getIndex();
    this.listaGastosAlquiler = this.getListaGastoAlquiler();
    this.MontoTotalGastoAlquiler = this.getMontoTotalGastoAlquiler();
    this.lstParametriaObservaciones = this.comboService.obtenerComboPorNumero(ConstantesCombos.OBSERVACIONES_GASTOS_DEDUCIBES);
    this.anioEjercicio = this.preDeclaracionservice.obtenerAnioEjercicio();
    //this.calcularMontoDeducir();
  }

  private calcularMontoDeducir(): void {
    this.listaGastosAlquiler.map(e => new CalcularMontoMaximoDeducir(e, Number(this.anioEjercicio)).getMontoDeduccionActualizadoArtesania());
    this.AlquileresTotalS = this.listaGastosAlquiler.filter(x => x.indEstFormVirt === ConstantesCasilla514.regValido).
      reduce((total, Artesanias) => total + Number(Artesanias.mtoDeduccion), 0);
    this.ordenarPorFecha();
    this.lista514Cabecera[this.indice].casilla514Detalle.lisCas514 = this.listaGastosAlquiler;
    this.lista514Cabecera[this.indice].mtoGasto = this.AlquileresTotalS;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.total.emit(this.AlquileresTotalS);
  }

  private ordenarPorFecha(): void {
    this.listaGastosAlquiler.sort((a, b) => {
      if (a.fecComprob > b.fecComprob) {
        return 1;
      }
      if (a.fecComprob < b.fecComprob) {
        return -1;
      }
      return 0;
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  close() {
    this.activeModal.close('Click close');
  }

  public agregarOActualizar(id?: LCas514Detalle, index?: number): void {
    if (Number(this.alquilerPagado) === 0 || this.alquilerPagado === null) {
      this.noDeclaroAlquileres();
    } else {
      this.openMantenimiento(id, index);
    }
  }

  private noDeclaroAlquileres(): void {
    this.mostrarMensaje
      .mensajeEliminar(ConstantesMensajesInformativos.MSJ_NO_HA_PAGADO_ALQUILER)
      .subscribe((response: string) => {
        if (response === 'si') {
          this.activeModal.close();
          this.cerrarModalPadre();
          this.renta = JSON.parse(sessionStorage.getItem('rentas'));
          this.renta.alquiler = true;
          sessionStorage.setItem('rentas', JSON.stringify(this.renta));
          this.router.navigate([Rutas.NATURAL_INFORMATIVA]);
        }
      });
  }

  private openMantenimiento(id?: LCas514Detalle, index?: number): void {
    const modal = {
      titulo: 'Alquiler de bienes inmuebles',
      accion: 'bienes'
    };
    const modalRef = this.modalService.open(Sfec514AlquileresMantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
    modalRef.componentInstance.inputListaBienes = this.listaGastosAlquiler;
    modalRef.componentInstance.inputId = id;
    modalRef.componentInstance.inputIndex = index;
    modalRef.componentInstance.listaBienesReady.subscribe(response => {
      this.listaGastosAlquiler = response;
      this.calcularMontoTotalyActualizarPreDeclaracion();
    });
  }

  public eliminarBienes(index): void {
    this.mostrarMensaje.mensajeEliminar(ConstantesMensajesInformativos.MSJ_DESEA_ELIMINAR_REGISTRO)
      .subscribe((response: string) => {
        if (response === 'si') {
          this.listaGastosAlquiler.splice(index, 1);
          this.calcularMontoTotalyActualizarPreDeclaracion();
          this.mostrarMensaje.callModal(
            ConstantesMensajesInformativos.MSJ_CONFORMIDAD_REGISTRO_ELIMINADO
          );
        }
      });
  }

  public ObtenerComprobante(val: string): string {
    const descTipoComprobante = this.listaTipoComprobante.filter(x => x.val === val);
    return descTipoComprobante.length !== 0 ? descTipoComprobante[0].desc : '';
  }

  public ObtenerTipBien(val: string): string {
    const descTipoBien = this.listaTipoBien.filter(x => x.val === val);
    return descTipoBien.length !== 0 ? descTipoBien[0].desc : '';
  }

  public ObtenerMedPag(val: string): string {
    const descFormaPago = this.listaFormaPago.filter(x => x.val === val);
    return descFormaPago.length !== 0 ? descFormaPago[0].desc : '';
  }

  public obtenerVinculo(val: string): string {
    if (val) {
      const descTipoVinculo = this.listaTipoVinculo.filter(x => x.val === val);
      return descTipoVinculo.length !== 0 ? descTipoVinculo[0].desc : '';
    }
  }

  private obtenerListaTipoBien(): void {
    this.listaTipoBien = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_BIEN_514_v2);
    this.listaTipoBien.pop();
    //this.listaTipoBien[0].desc = ConstantesCasilla514.DESCRIPCION_BIEN_INMUEBLE;
    this.listaTipoBien.forEach(x => { x.val = '0' + x.val; });
  }

  private obtenerListas(): void {
    this.listaTipoVinculo = this.cus27Service.obtenerTipoVinculo();
    this.listaFormaPago = this.cus27Service.obtenerFormaPago();
    this.obtenerListaTipoBien();
    this.listaTipoComprobante = this.cus27Service.obtenerTipoComprobante_cus27();
  }

  private getIndex(): number {
    return this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera.findIndex(
      (x) => x.indTipoGasto === ConstantesCasilla514.COD_TIPO_GASTO_ALQUILER
    );
  }

  private getListaGastoAlquiler(): LCas514Detalle[] {
    const listasCasilla514 = this.preDeclaracion.declaracion.seccDeterminativa
      .rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
    const listaAlquiler = listasCasilla514.find(
      (lista: Casilla514Cabecera) =>
        lista.indTipoGasto === ConstantesCasilla514.COD_TIPO_GASTO_ALQUILER
    );
    return listaAlquiler.casilla514Detalle.lisCas514;
  }

  private getMontoTotalGastoAlquiler(): number {
    return this.listaGastosAlquiler.filter(x => x.indEstFormVirt === ConstantesCasilla514.IND_EST_FORM_VIRT_REVISADO).
      reduce((total, alquileres) => total + Number(alquileres.mtoDeduccion), 0);
  }

  private actualizarPreDeclaracion(): void {
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice].casilla514Detalle.lisCas514 = this.listaGastosAlquiler;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice].mtoGasto = this.MontoTotalGastoAlquiler;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  private calcularMontoTotalyActualizarPreDeclaracion(): void {
    this.MontoTotalGastoAlquiler = this.getMontoTotalGastoAlquiler();
    this.actualizarPreDeclaracion();
    this.total.emit(this.MontoTotalGastoAlquiler);
    this.rerender();
  }

  public habilitarCasItan(): boolean {
    const anioRenta = this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    return Number(anioRenta) >= 2021;
  }
}
