import { Component, OnInit, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { C355MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { Casilla355 } from '@path/natural/models/SeccionDeterminativa/DetRentaSegundaModel';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { Subject, Observable } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ComboService } from '@rentas/shared/core';
import { ListaParametrosModel } from '@path/natural/models/comboUriModel';
import { ParametriaFormulario } from '@path/natural/services';
import { ConstantesCombos } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';
import { dtOptionsPN } from '@rentas/shared/constantes';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class C355MainComponent extends RenderizarPaginacion implements OnInit, OnDestroy, AfterViewInit {

  public dtOptions: DataTables.Settings = dtOptionsPN;
  private preDeclaracion: PreDeclaracionModel;
  public listaCasilla355: Casilla355[];
  public totalMontoCasilla355: number;
  public dtTrigger: Subject<any> = new Subject();
  private funcionesGenerales: FuncionesGenerales;
  private descripcionDocumento: ListaParametrosModel[];
  private descripcionRenta: Array<any>;
  @Output() montoReturn = new EventEmitter<number>();

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  constructor(
    private modalService: NgbModal, public activeModal: NgbActiveModal,
    private cus10Service: ParametriaFormulario,
    private comboService: ComboService) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.listaCasilla355 = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla355.lisCas355;
    this.totalMontoCasilla355 = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas355);
    this.descripcionDocumento = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
    this.descripcionRenta = this.cus10Service.obtenerfuenteperdida();
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void { this.dtTrigger.unsubscribe(); }

  public agregaroActualizar(casilla355Obj?: Casilla355, index?: number): void {
    const modalRef = this.modalService.open(C355MantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputLista355 = this.listaCasilla355;
    modalRef.componentInstance.inputCasilla355 = casilla355Obj;
    modalRef.componentInstance.inputIndexCasilla355 = index;
    modalRef.componentInstance.lista355Ready.subscribe(data => {
      this.actualizarPredeclaracionCasilla355(data, null);
      this.rerender();
    });
  }

  public eliminar(index): void {
    this.quieresEliminar().subscribe(resp => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCasilla355(null, index);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla355(data: Casilla355[], index: number): void {
    if (data !== null) { this.listaCasilla355 = data; }
    if (index !== null) { this.listaCasilla355.splice(index, 1); }
    this.totalMontoCasilla355 = this.listaCasilla355.reduce((carry, x) => carry + Number(x.mtoPerdida), 0);
    this.totalMontoCasilla355 = Math.round(this.totalMontoCasilla355);
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla355.lisCas355 = this.listaCasilla355;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas355 = this.totalMontoCasilla355;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.totalMontoCasilla355);
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

  public obtenerRenta(val: string): string {
    const Renta = this.descripcionRenta.filter(x => x.val === val);
    return Renta.length !== 0 ? Renta[0].desc : '';
  }

  public obtenerDocumento(val: string): string {
    const documento = this.descripcionDocumento.filter(x => x.val === val);
    return documento.length !== 0 ? documento[0].desc : '';
  }

  public obtenerPeriodo(val: string): string {
    return val.substring(0, 2) + '/' + val.substring(2);
  }

  public exportar(): void {
    const model = new Array();
    this.listaCasilla355.forEach(e => {
      model.push({
        'Fuente de Pérdida': this.obtenerRenta(e.codTipFteRta),
        'Tipo de Documento': this.obtenerDocumento(e.codTipDoc),
        'Nro. Documento': e.numDoc,
        'Nombre Razón Social': e.desRazSoc,
        'Periodo ': e.perRta,
        'Precio Venta': e.mtoCostoComp ? Number(e.mtoCostoComp) : 0,
        'Costo Computable': e.mtoPrecVenta ? Number(e.mtoPrecVenta) : 0,
        'Monto Ganancia': e.mtoPerdida ? Number(e.mtoPerdida) : 0,
        'Cantidad de Valores': e.cntVal,
        'RUC Emisor': e.numRucEmi,
        'Razón Social Emisor': e.desRazSocEmi,
      });
    });
    this.funcionesGenerales.exportarExcel(model, 'casilla355');
  }
}
