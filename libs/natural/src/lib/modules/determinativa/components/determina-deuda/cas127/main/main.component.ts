import { Component, OnInit, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { C127MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { PreDeclaracionModel, DeudaCas127Model } from '@path/natural/models';
import * as moment from 'moment';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';
import { dtOptionsPN } from '@rentas/shared/constantes';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class C127MainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = dtOptionsPN;
  public dtTrigger: Subject<any> = new Subject();
  private funcionesGenerales: FuncionesGenerales;
  private preDeclaracion: PreDeclaracionModel;
  public listaCasilla127: DeudaCas127Model[];
  public totalMontoCasilla127: number;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.listaCasilla127 = this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.pagoDirectoIR.lisCas127;
    this.totalMontoCasilla127 = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas127);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public agregarOActualizar(casilla127?: DeudaCas127Model, index?: number): void {
    const modalRef = this.modalService.open(C127MantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputLista127 = this.listaCasilla127;
    modalRef.componentInstance.inputCasilla127 = casilla127;
    modalRef.componentInstance.inputIndexCailla127 = index;
    modalRef.componentInstance.lista127Ready.subscribe(data => {
      this.actualizarPredeclaracionCasilla127(data, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.quieresEliminar().subscribe(resp => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCasilla127(null, index);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla127(data: DeudaCas127Model[], index: number): void {
    if (data !== null) { this.listaCasilla127 = data; }
    if (index !== null) { this.listaCasilla127.splice(index, 1); }
    this.totalMontoCasilla127 = this.listaCasilla127.reduce((carry, x) =>
      carry + Number(x.mtoSalfav) + Number(x.mtoSalfavExp) + Number(x.mtoOtrCre) + Number(x.mtoPagsInt), 0);
    this.totalMontoCasilla127 = Math.round(this.totalMontoCasilla127);
    this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.pagoDirectoIR.lisCas127 = this.listaCasilla127;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas127 = this.totalMontoCasilla127;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.totalMontoCasilla127);
  }

  public obtenerPeriodo(val: string): string {
    return val.substring(0, 2) + '/' + val.substring(2);
  }

  private quieresEliminar(): Observable<any> {
    const modal = {
      titulo: 'Mensaje',
      mensaje: '¿Desea eliminar el registro?'
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.nameTab = 'determi-deuda-127';
    modalRef.componentInstance.modal = modal;
    return modalRef.componentInstance.respuesta;
  }

  private callModal(excepcionName: string): void {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
  }

  public exportar(): void {
    const exportarModel = new Array();
    this.listaCasilla127.forEach(e => {
      exportarModel.push({
        'Periodo ': this.obtenerPeriodo(e.perPago),
        'Nro. Formulario': e.numFormulario,
        'Nro. Orden de Operación': e.numOrdOpe,
        'Fecha de Pago': moment(e.fecPago.substring(0, 10)).format('DD/MM/YYYY'),
        'Saldo a favor aplicado': Number(e.mtoSalfav),
        'Saldo a favor exportador': Number(e.mtoSalfavExp),
        'Otros créditos aplicados': Number(e.mtoOtrCre),
        'Monto Pago sin Intereses': Number(e.mtoPagsInt),
      });
    });
    this.funcionesGenerales.exportarExcel(exportarModel, 'casilla127');
  }
}
