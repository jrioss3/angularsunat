import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { C999MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { InfFuenteEstModel } from '@path/natural/models/SeccionInformativa/InfFuenteEstModel';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';
import { dtOptionsPN } from '@rentas/shared/constantes';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class C999MainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit {

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public listaExtranjera: InfFuenteEstModel[];
  private preDeclaracion: PreDeclaracionModel;
  private funcionesGenerales: FuncionesGenerales;
  public total: number;
  public dtTrigger: Subject<any> = new Subject();
  public dtOptions: DataTables.Settings = dtOptionsPN;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.listaExtranjera = this.preDeclaracion.declaracion.seccInformativa.fuenteExtranjera.lisFuenteEst;
    this.total = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas999);
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  public agregaroActualizar(tiprenta?: InfFuenteEstModel, id?: number): void {
    const modalRef = this.modalService.open(C999MantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputListaExtranjera = this.listaExtranjera;
    modalRef.componentInstance.inputRenta = tiprenta;
    modalRef.componentInstance.inputId = id;
    modalRef.componentInstance.listaExtranjera.subscribe(($e) => {
      this.actualizarPredeclaracionCasilla999($e, null);
      this.rerender();
    });
  }

  public Eliminar(id: number): void {
    const modal = {
      titulo: 'Mensaje',
      mensaje: '¿Desea eliminar el registro?'
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.nameTab = 'Eliminar-Registro';
    modalRef.componentInstance.modal = modal;
    modalRef.componentInstance.respuesta.subscribe(($e) => {
      if ($e === 'si') {
        this.actualizarPredeclaracionCasilla999(null, id);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla999(data: InfFuenteEstModel[], index: number): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    if (data !== null) { this.listaExtranjera = data; }
    if (index !== null) { this.listaExtranjera.splice(index, 1); }
    this.total = this.listaExtranjera.reduce((carry, x) => carry + Number(x.mtoImpuesto), 0);
    this.total = Math.round(this.total);
    this.preDeclaracion.declaracion.seccInformativa.fuenteExtranjera.lisFuenteEst = this.listaExtranjera;
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas999 = this.total;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.total);
  }

  private callModal(excepcionName: string): void {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
  }
}
