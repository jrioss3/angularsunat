import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SdCas359MantComponent } from '../mantenimiento/mantenimiento.component';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { Subject, Observable } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { PreDeclaracionModel, ListaParametrosModel, DeudaCas359Model } from '@path/natural/models';
import { ComboService } from '@rentas/shared/core';
import { ConstantesCombos, dtOptionsPN } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class SdCas359Component extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = dtOptionsPN;
  private preDeclaracion: PreDeclaracionModel;
  private funcionesGenerales: FuncionesGenerales;
  public listaCasilla359: DeudaCas359Model[];
  private ListaTipoDocumento: ListaParametrosModel[];
  public totalMontoCasilla359: number;
  public dtTrigger: Subject<any> = new Subject();

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private comboService: ComboService) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.listaCasilla359 = this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda.impRetenidoRentas.lisCas359;
    this.totalMontoCasilla359 = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas359);
    this.ListaTipoDocumento = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void { this.dtTrigger.unsubscribe(); }

  public agregarOActualizar(casilla359?: DeudaCas359Model, index?: number): void {
    const modalRef = this.modalService.open(SdCas359MantComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputLista359 = this.listaCasilla359;
    modalRef.componentInstance.inputCasilla359 = casilla359;
    modalRef.componentInstance.inputIndexCasilla359 = index;
    modalRef.componentInstance.lista359Ready.subscribe(data => {
      this.actualizarPredeclaracionCasilla359(data, null);
      this.rerender();
    });
  }

  public eliminar(index): void {
    this.quieresEliminar().subscribe(resp => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCasilla359(null, index);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla359(data: DeudaCas359Model[], index: number): void {
    if (data !== null) { this.listaCasilla359 = data; }
    if (index !== null) { this.listaCasilla359.splice(index, 1); }
    this.totalMontoCasilla359 = this.listaCasilla359.reduce((carry, x) => carry + Number(x.mtoRetenido), 0);
    this.totalMontoCasilla359 = Math.round(this.totalMontoCasilla359);
    this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda.impRetenidoRentas.lisCas359 = this.listaCasilla359;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas359 = this.totalMontoCasilla359;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.totalMontoCasilla359);
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

  public ObtenerDecripcionDocumento(val: string): string {
    const descripcionDocumento = this.ListaTipoDocumento.filter(x => x.val === val);
    return descripcionDocumento.length !== 0 ? descripcionDocumento[0].desc : '';
  }

  public obtenerPeriodo(val: string): string {
    return val.substring(0, 2) + '/' + val.substring(2);
  }

  public exportar(): void {
    const exportarModel = new Array();
    this.listaCasilla359.forEach(e => {
      exportarModel.push({
        'Tipo de Documento': this.ObtenerDecripcionDocumento(e.codTipDoc),
        'Nro. Documento': e.numDoc,
        'Nombre Razón Social': e.desRazSoc,
        'Periodo ': this.obtenerPeriodo(e.perImpReten),
        'Monto Retenido': Number(e.mtoRetenido),
      });
    });
    this.funcionesGenerales.exportarExcel(exportarModel, 'casilla359');
  }
}
