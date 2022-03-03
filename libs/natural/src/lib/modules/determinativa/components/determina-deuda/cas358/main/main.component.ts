import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SdCas358MantComponent } from '../mantenimiento/mantenimiento.component';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { Subject, Observable } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DeudaCas358Model, PreDeclaracionModel } from '@path/natural/models';
import * as moment from 'moment';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';
import { dtOptionsPN } from '@rentas/shared/constantes';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class SdCas358Component extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  private preDeclaracion: PreDeclaracionModel;
  public listaCasilla358: DeudaCas358Model[];
  public total: number;
  private funcionesGenerales: FuncionesGenerales;
  public dtTrigger: Subject<any> = new Subject();
  public dtOptions: DataTables.Settings = dtOptionsPN;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = new FuncionesGenerales();
    this.listaCasilla358 = this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda.pagoDirectoIR.lisCas358;
    this.total = FuncionesGenerales.getInstance()
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas358);
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public agregarOactualizar(casilla358?: DeudaCas358Model, index?: number) {
    const modalRef = this.modalService.open(SdCas358MantComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputListaCasilla358 = this.listaCasilla358;
    modalRef.componentInstance.inputCasilla358 = casilla358;
    modalRef.componentInstance.inputIndexCasilla358 = index;
    modalRef.componentInstance.lista358Ready.subscribe(data => {
      this.actualizarPredeclaracionCasilla358(data, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.quieresEliminar().subscribe(resp => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCasilla358(null, index);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla358(data: DeudaCas358Model[], index: number): void {
    if (data !== null) { this.listaCasilla358 = data; }
    if (index !== null) { this.listaCasilla358.splice(index, 1); }
    this.total = this.listaCasilla358.reduce((carry, x) => carry + Number(x.mtoPagSInt), 0);
    this.total = Math.round(this.total);
    this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda.pagoDirectoIR.lisCas358 = this.listaCasilla358;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas358 = this.total;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.total);
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

  public obtenerPeriodo(val: string): string {
    return val.substring(0, 2) + '/' + val.substring(2);
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
    this.listaCasilla358.forEach(e => {
      exportarModel.push({
        'Periodo ': this.obtenerPeriodo(e.perPago),
        'Nro. Formulario': e.numFormulario,
        'Nro. Orden Operación': e.numOrdOpe,
        'Fecha Pago': moment(e.fecPago).format('YYYY-MM-DD'),
        'Monto Pago sin Interes': Number(e.mtoPagSInt)
      });
    });
    this.funcionesGenerales.exportarExcel(exportarModel, 'casilla358');
  }
}
