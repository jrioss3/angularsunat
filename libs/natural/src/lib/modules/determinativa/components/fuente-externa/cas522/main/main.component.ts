import { MostrarMensajeService } from './../../../../../../services/mostrarMensaje.service';
import { Component, OnInit, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Sfec522MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { PreDeclaracionService } from '@path/natural/services';
import { ComboService } from '@rentas/shared/core';
import { ListaParametrosModel, Casilla522 } from '@path/natural/models';
import { ConstantesCombos, dtOptionsPN } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class C522MainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  private funcionesGenerales: FuncionesGenerales;
  private preDeclaracion: PreDeclaracionModel;
  public lista522: Casilla522[];
  public totalMontoCas522: number;
  public annioEjercicio: number;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  private listaTipoDocumento: ListaParametrosModel[];
  private readonly mensajeConformidadEliminarRegistro = 'Se eliminó el elemento correctamente.';
  private readonly mensajeEliminar = '¿Desea eliminar el registro?';

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private predeclaracionService: PreDeclaracionService,
    private comboService: ComboService,
    private mostrarMensaje: MostrarMensajeService) { super(); }

  ngOnInit(): void {
    this.dtOptions = dtOptionsPN;
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.annioEjercicio = Number(this.predeclaracionService.obtenerAnioEjercicio());
    this.lista522 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla522.lisCas522;
    this.totalMontoCas522 = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas522);
    this.listaTipoDocumento = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public agregarOActualizar(id?: Casilla522, index?: number): void {
    const modalRef = this.modalService.open(Sfec522MantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputLista522 = this.lista522;
    modalRef.componentInstance.inputid = id;
    modalRef.componentInstance.inputidIndex = index;
    modalRef.componentInstance.lista522Ready.subscribe(($e) => {
      this.actualizarPredeclaracionCasilla522($e, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.mostrarMensaje.mensajeEliminar(this.mensajeEliminar).subscribe((resp: string) => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCasilla522(null, index);
        this.mostrarMensaje.callModal(this.mensajeConformidadEliminarRegistro);
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla522(data: Casilla522[], index: number): void {
    if (data !== null) { this.lista522 = data; }
    if (index !== null) { this.lista522.splice(index, 1); }
    this.totalMontoCas522 = this.lista522.reduce((carry, x) => carry + Number(x.mtoRetenido), 0);
    this.totalMontoCas522 = Math.round(this.totalMontoCas522);
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla522.lisCas522 = this.lista522;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.totalMontoCas522);
  }

  private ObtenerTipoDocumento(val: string): string {
    const descDocumento = this.listaTipoDocumento.filter(x => x.val === val);
    return descDocumento.length !== 0 ? descDocumento[0].desc : '';
  }

  public exportar(): void {
    const model = new Array();
    this.lista522.forEach(e => {
      model.push({
        'Tipo de Documento': this.ObtenerTipoDocumento(e.codTipDoc),
        'Nro. Documento': e.numDoc,
        'Nombre Razón Social': e.desRazSoc,
        'Monto Retenido': Number(e.mtoRetenido)
      });
    });
    this.funcionesGenerales.exportarExcel(model, 'casilla522');
  }
}
