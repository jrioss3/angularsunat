import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Sddc131MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ComboService } from '@rentas/shared/core';
// import { FuncionesGenerales } from '@path/natural/utils';
import { ListaParametrosModel, DeudaCas131Model, PreDeclaracionModel } from '@path/natural/models';
import { Observable } from 'rxjs';
import { ConstantesCombos, dtOptionsPN } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class Sddc131MainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public montoRetenido: number;
  public montoDevuelto: number;
  public totalMontoCasilla131: number;
  private ListaTipoDocumento: ListaParametrosModel[];
  public dtOptions: DataTables.Settings = dtOptionsPN;
  private preDeclaracion: PreDeclaracionModel;
  public listaCasilla131: DeudaCas131Model[];
  private funcionesGenerales: FuncionesGenerales;
  public dtTrigger: Subject<any> = new Subject();

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private comboService: ComboService
  ) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.listaCasilla131 = this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.impRetenRentasQnta.lisCas131;
    this.totalMontoCasilla131 = this.funcionesGenerales.opcionalCero(
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo
        .mtoCas131
    );
    this.ListaTipoDocumento = this.comboService.obtenerComboPorNumero(
      ConstantesCombos.TIPO_DOCUMENTO
    );
    this.obtenerMontosRetenidoYDevuelto();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private obtenerMontosRetenidoYDevuelto(): void {
    this.montoRetenido = Math.round(this.listaCasilla131.reduce(
      (carry, x) => carry + Number(x.mtoRetenido),
      0
    ));
    this.montoDevuelto = Math.round(this.listaCasilla131.reduce(
      (carry, x) => carry + Number(x.mtoDevolQuinta),
      0
    ));
  }

  agregarOActualizar(casilla131?: DeudaCas131Model, index?: number): void {
    const modalRef = this.modalService.open(
      Sddc131MantenimientoComponent,
      this.funcionesGenerales.getModalOptions({})
    );
    modalRef.componentInstance.inputLista131 = this.listaCasilla131;
    modalRef.componentInstance.inputCasilla131 = casilla131;
    modalRef.componentInstance.inputIndexCasilla131 = index;
    modalRef.componentInstance.lista131Ready.subscribe((data) => {
      this.actualizarPredeclaracionCasilla131(data, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.quieresEliminar().subscribe((resp) => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCasilla131(null, index);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla131(
    data: DeudaCas131Model[],
    index: number
  ): void {
    if (data !== null) {
      this.listaCasilla131 = data;
    }
    if (index !== null) {
      this.listaCasilla131.splice(index, 1);
    }
    this.totalMontoCasilla131 = this.calculoMontoNetoRetencion();
    this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.impRetenRentasQnta.lisCas131 = this.listaCasilla131;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas131 = this.totalMontoCasilla131;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.totalMontoCasilla131);
  }

  private calculoMontoNetoRetencion(): number {
    this.montoRetenido = Math.round(
      this.listaCasilla131.reduce((carry, x) => carry + Number(x.mtoRetenido), 0)
    );
    this.montoDevuelto = Math.round(
      this.listaCasilla131.reduce((carry, x) => carry + Number(x.mtoDevolQuinta), 0)
    );
    const montoRetencionNeta =
      this.montoRetenido - this.montoDevuelto < 0
        ? 0
        : this.montoRetenido - this.montoDevuelto;
    return montoRetencionNeta;
  }

  private quieresEliminar(): Observable<any> {
    const modal = {
      titulo: 'Mensaje',
      mensaje: '¿Desea eliminar el registro?',
    };
    const modalRef = this.modalService.open(
      UtilsComponent,
      this.funcionesGenerales.getModalOptions({})
    );
    modalRef.componentInstance.nameTab = 'Eliminar-Registro';
    modalRef.componentInstance.modal = modal;
    return modalRef.componentInstance.respuesta;
  }

  public ObtenerDescripcionDocumento(val: string): string {
    const descripcionDocumento = this.ListaTipoDocumento.filter(
      (x) => x.val === val
    );
    return descripcionDocumento.length !== 0 ? descripcionDocumento[0].desc : '';
  }

  private callModal(excepcionName: string): void {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName,
    };
    const modalRef = this.modalService.open(
      UtilsComponent,
      this.funcionesGenerales.getModalOptions({})
    );
    modalRef.componentInstance.modal = modal;
  }

  public obtenerPeriodo(val: string): string {
    return val.substring(0, 2) + '/' + val.substring(2);
  }

  public exportar(): void {
    const exportarModel = new Array();
    this.listaCasilla131.forEach((e) => {
      exportarModel.push({
        'Tipo de Documento': this.ObtenerDescripcionDocumento(e.codTipDoc),
        'Nro. Documento': e.numDoc,
        'Nombre Razon Social': e.desRazSoc,
        'Periodo ': this.obtenerPeriodo(e.perImpReten),
        'Monto Retenido': Number(e.mtoRetenido),
        'Monto Devuelto': Number(e.mtoDevolQuinta),
      });
    });
    this.funcionesGenerales.exportarExcel(exportarModel, 'casilla131');
  }
}
