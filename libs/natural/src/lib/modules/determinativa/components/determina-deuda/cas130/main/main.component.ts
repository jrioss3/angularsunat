import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Sddc130MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
// import { FuncionesGenerales } from '@path/natural/utils';
import { ComboService } from '@rentas/shared/core';
import { PreDeclaracionModel, DeudaCas130Model, ListaParametrosModel } from '@path/natural/models';
import { Observable } from 'rxjs';
import { ConstantesCombos, dtOptionsPN } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class Sddc130MainComponent extends RenderizarPaginacion implements OnInit, OnDestroy, AfterViewInit {

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = dtOptionsPN;
  private preDeclaracion: PreDeclaracionModel;
  public listaCasilla130: DeudaCas130Model[];
  private funcionesGenerales: FuncionesGenerales;
  public dtTrigger: Subject<any> = new Subject();
  public totalMontoCasilla130: number;
  private ListaTipoDocumento: ListaParametrosModel[];

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private comboService: ComboService) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.listaCasilla130 = this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.impRetenidoRentas.lisCas130;
    this.totalMontoCasilla130 = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas130);
    this.ListaTipoDocumento = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public agregarOActualizar(casilla130?: DeudaCas130Model, index?: number): void {
    const modalRef = this.modalService.open(Sddc130MantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputLista130 = this.listaCasilla130;
    modalRef.componentInstance.inputCasilla130 = casilla130;
    modalRef.componentInstance.inputIndexCasilla130 = index;
    modalRef.componentInstance.lista130Ready.subscribe(data => {
      this.actualizarPredeclaracionCasilla130(data, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.quieresEliminar().subscribe(resp => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCasilla130(null, index);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla130(data: DeudaCas130Model[], index: number): void {
    if (data !== null) { this.listaCasilla130 = data; }
    if (index !== null) { this.listaCasilla130.splice(index, 1); }
    this.totalMontoCasilla130 = this.listaCasilla130.reduce((carry, x) => carry + Number(x.mtoRetenido), 0);
    this.totalMontoCasilla130 = Math.round(this.totalMontoCasilla130);
    this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.impRetenidoRentas.lisCas130 = this.listaCasilla130;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas130 = this.totalMontoCasilla130;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.totalMontoCasilla130);
  }

  private quieresEliminar(): Observable<any> {
    const modal = {
      titulo: 'Mensaje',
      mensaje: '¿Desea eliminar el registro?'
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.nameTab = 'Eliminar-Registro130';
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

  public ObtenerDescripcionDocumento(val: string): string {
    const descripcionDocumento = this.ListaTipoDocumento.filter(x => x.val === val);
    return descripcionDocumento.length !== 0 ? descripcionDocumento[0].desc : '';
  }

  public obtenerPeriodo(val: string): string {
    return val.substring(0, 2) + '/' + val.substring(2);
  }

  public exportar(): void {
    const exportarModel = new Array();
    this.listaCasilla130.forEach(e => {
      exportarModel.push({
        'Tipo de Documento': this.ObtenerDescripcionDocumento(e.codTipDoc),
        'Nro. Documento': e.numDoc,
        'Nombre Razon Social': e.desRazSoc,
        'Periodo ': this.obtenerPeriodo(e.perImpReten),
        'Monto Retenido': Number(e.mtoRetenido)
      });
    });
    this.funcionesGenerales.exportarExcel(exportarModel, 'casilla130');
  }

  public habilitarCasItan(): boolean {
    const anioRenta = this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    return Number(anioRenta) >= 2021;
  }
}
