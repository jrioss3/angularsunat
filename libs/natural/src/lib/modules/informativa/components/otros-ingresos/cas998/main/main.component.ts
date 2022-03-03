import { MostrarMensajeService } from './../../../../../../services/mostrarMensaje.service';
import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Sfec998MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { PreDeclaracionModel, InfDividPercibModel } from '@path/natural/models';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
// import { FuncionesGenerales } from '@path/natural/utils';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales } from '@rentas/shared/utils';
import { dtOptionsPN } from '@rentas/shared/constantes';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class Sfec998MainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  private preDeclaracion: PreDeclaracionModel;
  public total: number;
  public listaDividendos: InfDividPercibModel[];
  public dtTrigger: Subject<any> = new Subject();
  public dtOptions: DataTables.Settings = dtOptionsPN;
  private funcionesGenerales: FuncionesGenerales;
  private readonly mensajeConformidadEliminarRegistro = 'Se eliminó el elemento correctamente.';
  private readonly mensajeEliminar = '¿Desea eliminar el registro?';

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private mostrarMensaje: MostrarMensajeService) {
    super();
  }

  ngOnInit(): void {
    this.dtOptions = dtOptionsPN;
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.listaDividendos = this.preDeclaracion.declaracion.seccInformativa.dividendPercibidos.lisDividPercib;
    this.total = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas998);
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void { this.dtTrigger.unsubscribe(); }

  public agregarOactualizar(id?: InfDividPercibModel, index?: number): void {
    const modalRef = this.modalService.open(Sfec998MantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputListaDividendos = this.listaDividendos;
    modalRef.componentInstance.inputid = id;
    modalRef.componentInstance.inputidIndex = index;
    modalRef.componentInstance.listaDividendos.subscribe((data) => {
      this.actualizarPredeclaracionCasilla998(data, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.mostrarMensaje.mensajeEliminar(this.mensajeEliminar).subscribe((resp: string) => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCasilla998(null, index);
        this.mostrarMensaje.callModal(this.mensajeConformidadEliminarRegistro);
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla998(data: InfDividPercibModel[], index: number): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    if (data !== null) { this.listaDividendos = data; }
    if (index !== null) { this.listaDividendos.splice(index, 1); }
    this.total = this.listaDividendos.reduce((carry, x) => carry + Number(x.mtoPerci), 0);
    this.total = Math.round(this.total);
    this.preDeclaracion.declaracion.seccInformativa.dividendPercibidos.lisDividPercib = this.listaDividendos;
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas998 = this.total;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.total);
  }
}
