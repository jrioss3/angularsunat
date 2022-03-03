import { ConstantesExcepciones } from '@path/natural/utils';
import { Component, OnInit, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cas122MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { DeudaCas122Model } from '@path/natural/models/Deuda/deudaCas122Model';
import { Subject } from 'rxjs';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { DataTableDirective } from 'angular-datatables';
import { Observable } from 'rxjs';
import { RenderizarPaginacion, SessionStorage ,FuncionesGenerales} from '@rentas/shared/utils';
import { dtOptionsPN } from '@rentas/shared/constantes';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class SddCas122MainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() montoReturn = new EventEmitter<number>();

  public dtOptions: DataTables.Settings = dtOptionsPN;
  public dtTrigger: Subject<any> = new Subject();
  private funcionesGenerales: FuncionesGenerales;
  private preDeclaracion: PreDeclaracionModel;
  public listaCasilla122: DeudaCas122Model[];
  public totalMontoCasilla122: number;
  // Referencias
  private casilla116: number;
  private casilla120: number;
  private casilla512: number;
  private casilla511: number;
  private casilla514: number;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal) {
    super();
  }

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = new FuncionesGenerales();
    this.listaCasilla122 = this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.credIRFuenteExtran.lisCas122;
    this.totalMontoCasilla122 = FuncionesGenerales.getInstance()
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas122);
    this.obtenerMontosDeCasillasReferentes();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private obtenerMontosDeCasillasReferentes(): void {
    this.casilla116 = FuncionesGenerales.getInstance()
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas116);
    this.casilla120 = FuncionesGenerales.getInstance()
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas120);
    this.casilla512 = FuncionesGenerales.getInstance()
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas512);
    this.casilla511 = FuncionesGenerales.getInstance()
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas511);
    this.casilla514 = FuncionesGenerales.getInstance()
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas514);
  }

  public agregarOActualizar(casilla122?: DeudaCas122Model, index?: number): void {
    const modalRef = this.modalService.open(Cas122MantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputLista122 = this.listaCasilla122;
    modalRef.componentInstance.inputCasilla122 = casilla122;
    modalRef.componentInstance.inputIndexCasilla122 = index;
    modalRef.componentInstance.lista122Ready.subscribe(data => {
      this.actualizarPredeclaracionCasilla122(data, null);
      this.rerender();
    });
  }

  public eliminar(index): void {
    this.quieresEliminar().subscribe(resp => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCasilla122(null, index);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla122(data: DeudaCas122Model[], index: number): void {
    if (data !== null) { this.listaCasilla122 = data; }
    if (index !== null) { this.listaCasilla122.splice(index, 1); }
    this.totalMontoCasilla122 = this.listaCasilla122.reduce((carry, x) => carry + Number(x.mtoImpuesto), 0);
    this.validacionDelLimite(this.totalMontoCasilla122);
    this.totalMontoCasilla122 = Math.round(this.totalMontoCasilla122);
    this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.credIRFuenteExtran.lisCas122 = this.listaCasilla122;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas122 = this.totalMontoCasilla122;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.totalMontoCasilla122);
  }

  private validacionDelLimite(monto122: number): void {
    let tasaMedia;
    tasaMedia = (this.casilla120) / (this.casilla512 + this.casilla116 + this.casilla511 + this.casilla514);
    tasaMedia = Number(Math.round(tasaMedia * Math.pow(10, 4)) / Math.pow(10, 4)); // redondeo a 2 decimales
    if (monto122 > Math.round(this.casilla116 * tasaMedia)) {
      this.callModal(ConstantesExcepciones.CUS24_EX05 + Math.round(this.casilla116 * tasaMedia));
    }
  }

  private quieresEliminar(): Observable<any> {
    const modal = {
      titulo: 'Mensaje',
      mensaje: '¿Desea eliminar el registro?'
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.nameTab = 'determi-deuda-122';
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
    this.listaCasilla122.forEach(e => {
      exportarModel.push({
        'Tipo Renta': e.desTipRenta,
        País: e.desPais,
        'Monto Impuesto': Number(e.mtoImpuesto)
      });
    });
    this.funcionesGenerales.exportarExcel(exportarModel, 'casilla122');
  }
}
