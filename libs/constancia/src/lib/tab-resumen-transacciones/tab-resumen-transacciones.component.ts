import { Component, OnInit } from '@angular/core';
import { ConstanciaService } from '../core/constancia.service';
import { ConstanciaRespuesta, MedioPago, TipoReporte } from '@rentas/shared/types';
import { Nidi, SessionStorage } from '@rentas/shared/utils';
import { RowConstnacia } from '@rentas/shared/types';
import { VerConstanciaService, ReporteSimpleService } from '@rentas/shared/core';
import { ConstantesFormulario } from '@rentas/shared/constantes';


@Component({
  selector: 'rentas-tab-resumen-transacciones',
  templateUrl: './tab-resumen-transacciones.component.html',
  styleUrls: ['./tab-resumen-transacciones.component.css']
})
export class TabResumenTransaccionesComponent extends Nidi implements OnInit {

  constanciaRespuesta: ConstanciaRespuesta = null;
  medioPago: MedioPago = null;
  listConstancias: Array<RowConstnacia> = [];


  constructor(
    private constanciaService: ConstanciaService,
    private verConstanciaService: VerConstanciaService,
    private reporteSimpleService: ReporteSimpleService
  ) {
    super();
    this.constanciaRespuesta = this.constanciaService.getConstanciaRespuesta();
    this.medioPago = this.constanciaService.getMedioPago();
    this.listConstancias = this.constanciaService.getListRowConstancias();
  }

  ngOnInit(): void {
  }

  get esPagoBanco(): boolean {
    return this.medioPago === MedioPago.BANCOS ||
      this.medioPago === MedioPago.CUENTA_DETRACCIONES ||
      this.medioPago === MedioPago.VISA;
  }

  get rasonSocial() {
    return this.constanciaRespuesta.resultado.razonSocial;
  }

  get fechaProcesoPresentacion() {
    return this.constanciaRespuesta.resultado.fechaProcesoPresentacion;
  }

  get numeroOperacion() {
    return this.constanciaService.getNumeroOperacion();
  }

  get totalMontoPagado(): number {
    return this.listConstancias.reduce((carry, item) => carry + item.montoPago, 0);
  }

  public verDetalle(rowConstnacia: RowConstnacia): void {
    
    const codForm = SessionStorage.getCodFormulario();
    const preDeclaracion = SessionStorage.getPreDeclaracion<any>();
    const razonSocial = SessionStorage.getrazonSocial();
    const tipoReporte = TipoReporte.DEFINITIVO;

    const fechaPresentacion = this.constanciaRespuesta.constancias[0].fechaProcesoOrden;
    const numOrden = rowConstnacia.numeroOrden.toString();

    if (ConstantesFormulario.JURIDICO === codForm) {
      this.reporteSimpleService.mostrarReporteJuridico({
        preDeclaracion, tipoReporte, razonSocial, fechaPresentacion, numOrden
      });
    } else if (ConstantesFormulario.NATURAL === codForm) {
      this.reporteSimpleService.mostrarReporteNatural({
        preDeclaracion, tipoReporte, razonSocial, fechaPresentacion, numOrden
      });
    }

  }

  public verConstancia(rowConstnacia: RowConstnacia): void {
    this.verConstanciaService.mostrarVerConstancia(rowConstnacia);
  }

  public verTodasLasConstancias(): void {
    this.verConstanciaService.mostrarTodoConstancias(this.listConstancias);
  }

}
