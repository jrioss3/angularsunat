import { Component, OnInit, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, } from '@ng-bootstrap/ng-bootstrap';
import { C385MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { Casilla385 } from '@path/natural/models/SeccionDeterminativa/DetRentaSegundaModel';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { Subject, Observable } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';
import { dtOptionsPN } from '@rentas/shared/constantes';

@Component({
  selector: 'app-c385main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class C385MainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = dtOptionsPN;
  public dtTrigger: Subject<any> = new Subject();
  private preDeclaracion: PreDeclaracionModel;
  public lista385: Casilla385[];
  private funcionesGenerales: FuncionesGenerales;
  public total385: number;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.lista385 = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla385.lisCas385;
    this.total385 = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas385);
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void { this.dtTrigger.unsubscribe(); }

  public agregaroActualizar(objetoCasilla385?: Casilla385, id?: number): void {
    const modalRef = this.modalService.open(C385MantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputLista385 = this.lista385;
    modalRef.componentInstance.inputid = id;
    modalRef.componentInstance.casilla385 = objetoCasilla385;
    modalRef.componentInstance.lista385Ready.subscribe(($e) => {
      this.actualizarPredeclaracionCasilla385($e, null);
      this.rerender();
    });
  }

  public Eliminar(id): void {
    this.quieresEliminar().subscribe(($e) => {
      if ($e === 'si') {
        this.actualizarPredeclaracionCasilla385(null, id);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla385(data: Casilla385[], index: number): void {
    if (data !== null) { this.lista385 = data; }
    if (index != null) { this.lista385.splice(index, 1); }
    this.total385 = this.lista385.reduce((carry, x) => carry + Number(x.mtoImpuesto), 0);
    this.total385 = Math.round(this.total385);
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla385.lisCas385 = this.lista385;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas385 = this.total385;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.total385);
  }

  private quieresEliminar(): Observable<any> {
    const modal = {
      titulo: 'Mensaje',
      mensaje: '¿Desea eliminar el registro?'
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.nameTab = 'Eliminar-Registro';
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
    const model = new Array();
    this.lista385.forEach(e => {
      model.push({
        'Fuente de Renta': e.desTipRenta,
        'País ': e.desPais,
        'Monto neto': Number(e.mtoImpuesto)
      });
    });
    this.funcionesGenerales.exportarExcel(model, 'casilla385');
  }
}
