import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { C128MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { PreDeclaracionModel, DeudaCas128Model } from '@path/natural/models';
import { Observable } from 'rxjs';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';
import { dtOptionsPN } from '@rentas/shared/constantes';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class C128MainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = dtOptionsPN;
  public dtTrigger: Subject<any> = new Subject();
  public totalMontoCasilla128: number;
  private funcionesGenerales: FuncionesGenerales;
  private preDeclaracion: PreDeclaracionModel;
  public listaCasilla128: DeudaCas128Model[];

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.listaCasilla128 = this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.pagoDirectIRQuinta.lisCas128;
    this.totalMontoCasilla128 = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas128);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public agregarOActualizar(casilla128?: DeudaCas128Model, index?: number): void {
    const modalRef = this.modalService.open(C128MantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputLista128 = this.listaCasilla128;
    modalRef.componentInstance.inputCasilla128 = casilla128;
    modalRef.componentInstance.inputIndexCasilla128 = index;
    modalRef.componentInstance.lista128Ready.subscribe(data => {
      this.actualizarPredeclaracionCasilla128(data, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.quieresEliminar().subscribe(resp => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCasilla128(null, index);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla128(data: DeudaCas128Model[], index: number): void {
    if (data !== null) { this.listaCasilla128 = data; }
    if (index !== null) { this.listaCasilla128.splice(index, 1); }
    this.totalMontoCasilla128 = this.listaCasilla128.reduce((carry, x) => carry + Number(x.mtoPagSInt), 0);
    this.totalMontoCasilla128 = Math.round(this.totalMontoCasilla128);
    this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.pagoDirectIRQuinta.lisCas128 = this.listaCasilla128;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas128 = this.totalMontoCasilla128;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.totalMontoCasilla128);
  }

  private quieresEliminar(): Observable<any> {
    const modal = {
      titulo: 'Mensaje',
      mensaje: '¿Desea eliminar el registro?'
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.nameTab = 'determi-deuda-128';
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

  public obtenerPeriodo(val: string): string {
    return val.substring(0, 2) + '/' + val.substring(2);
  }

  public exportar(): void {
    const exportarModel = new Array();
    this.listaCasilla128.forEach(e => {
      exportarModel.push({
        'Periodo ': this.obtenerPeriodo(e.perPago),
        'Nro. Formulario': e.numFormulario,
        'Nro. Orden de Operación': e.numOrdOpe,
        'Fecha de Pago': e.fecPago.substring(0, 10),
        'Monto de Pago sin Interés': Number(e.mtoPagSInt)
      });
    });
    this.funcionesGenerales.exportarExcel(exportarModel, 'casilla128');
  }
}
