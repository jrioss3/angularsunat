import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantesTributos } from '../../../../../../utils/constantesTributos';
import { PreDeclaracionModel, DeudaPagosPreviosModel } from '@path/natural/models';
import { ConstantesSeccionDeterminativa } from '../../../../../../utils/constanteSeccionDeterminativa';
import { PagosPreviosService } from '@rentas/shared/core';
import { RenderizarPaginacion, SessionStorage } from '@rentas/shared/utils';
import { dtOptionsPN } from '@rentas/shared/constantes';

import { AbrirModalService } from '@rentas/shared/core';
import { C144RegistroComponent } from '../registro/registro.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class C144MainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() montoReturn = new EventEmitter<number>();
  @Input() pagosPreviosRentaTrabajo: any; // detalle pagos previos servicio
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  
  public dtOptions: DataTables.Settings = dtOptionsPN;
  public dtTrigger: Subject<any> = new Subject();
  public listaCasilla144: DeudaPagosPreviosModel[];
  public codigoTributo: string;
  public descripcionTributo: string;
  private predeclaracion: PreDeclaracionModel;
  private listaPagosPrevios: any;
  public montoFinalPagosPrevios = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private pagosPreviosService: PagosPreviosService,
    private abrirModalService: AbrirModalService
  ) {
    super();
  }

  ngOnInit() {
    this.codigoTributo = ConstantesTributos.RENTA_TRABAJO.codigo;
    this.descripcionTributo = ConstantesTributos.RENTA_TRABAJO.descripcion;
    this.predeclaracion = SessionStorage.getPreDeclaracion();
    this.listaPagosPrevios = this.predeclaracion.declaracion.determinacionDeuda.pagosPrevios.lisPagosPrevios;
    this.listaCasilla144 = this.pagosPreviosService.obtenerPagosPreviosPorTributo(
      this.listaPagosPrevios,
      this.codigoTributo
    );
    this.ordenarTabla();
    this.montoFinalPagosPrevios = Number(this.predeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas144);
  }

  private ordenarTabla(): void {
    this.listaCasilla144.sort((z, w) => {
      const formatoZ = this.formatearFecha(z.fecPres);
      const formatoW = this.formatearFecha(w.fecPres);
      if (new Date(formatoZ) < new Date(formatoW)) {
        return -1;
      }
      if (new Date(formatoZ) > new Date(formatoW)) {
        return 1;
      }
      return 0;
    });
  }

  private formatearFecha(fecha: string): string {
    const dia = fecha.split('/')[0];
    const mes = fecha.split('/')[1];
    const anioHora = fecha.split('/')[2];
    return mes + '/' + dia + '/' + anioHora;
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public changeCheck(checkPagoPrevio, indice): void {
    const estadoCheck = checkPagoPrevio.currentTarget.checked;
    this.listaCasilla144[indice].indSel = estadoCheck
      ? ConstantesSeccionDeterminativa.COD_SELECCIONADO_PAGO_PREVIO
      : ConstantesSeccionDeterminativa.COD_NO_SELECCIONADO_PAGO_PREVIO;
    this.montoFinalPagosPrevios = this.pagosPreviosService.obtenerMontoPagosPreviosPorTributo(this.listaCasilla144);
  }

  public agregarPago(): void {
    const modalRef = this.abrirModalService.abrirModal(C144RegistroComponent);
    modalRef.componentInstance.listaPagosPrevios = this.listaCasilla144;
    modalRef.componentInstance.listaPagosPreviosResponse.subscribe($e => {
      this.listaCasilla144 = $e;
      this.montoFinalPagosPrevios = this.pagosPreviosService.obtenerMontoPagosPreviosPorTributo(this.listaCasilla144);
      this.rerender();
    });
  }

  public aceptar(): void {
    this.actualizarListaPagosPreviosPreDeclaracion();
    this.montoReturn.emit(this.montoFinalPagosPrevios);
    this.activeModal.close();
  }

  private actualizarListaPagosPreviosPreDeclaracion(): void {
    this.listaPagosPrevios = this.pagosPreviosService.obtenerListaPagosPrevios(
      this.listaPagosPrevios,
      this.listaCasilla144,
      this.codigoTributo
    );
    this.predeclaracion.declaracion.determinacionDeuda.pagosPrevios.lisPagosPrevios = this.listaPagosPrevios;
    this.predeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas144 = this.montoFinalPagosPrevios;
    SessionStorage.setPreDeclaracion(this.predeclaracion);
  }
}
