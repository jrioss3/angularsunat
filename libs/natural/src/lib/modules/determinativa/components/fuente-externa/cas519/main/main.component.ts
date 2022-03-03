import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Sfec519MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { Subject, Observable } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ListaParametrosModel, Casilla519, PreDeclaracionModel } from '@path/natural/models';
import { ComboService } from '@rentas/shared/core';
import { ConstantesCombos, dtOptionsPN} from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class Sfec519MainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  private funcionesGenerales: FuncionesGenerales;
  public dtOptions: DataTables.Settings = dtOptionsPN;
  public dtTrigger: Subject<any> = new Subject();
  private preDeclaracion: PreDeclaracionModel;
  private MontoTipo1 = 0;
  private MontoTipo2 = 0;
  public lista519: Casilla519[];
  public total519: number;
  private listTipDoc: ListaParametrosModel[];

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private comboservice: ComboService) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.lista519 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla519.lisCas519;
    this.calcularTipoDonacion();
    this.listTipDoc = this.comboservice.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
  }

  private calcularTipoDonacion(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.lista519 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla519.lisCas519;
    this.MontoTipo1 = this.lista519.filter(x => x.codTipDona === 'A').reduce((total, x) => total + Number(x.mtoDonacion), 0);
    this.MontoTipo2 = this.lista519.filter(x => x.codTipDona !== 'A').reduce((total, x) => total + Number(x.mtoDonacion), 0);
    this.total519 = this.MontoTipo1 + this.MontoTipo2;
    this.total519 = Math.round(this.total519);
  }

  ngOnDestroy(): void { this.dtTrigger.unsubscribe(); }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  public agregarOActualizar(donaciones?: Casilla519, index?: number): void {
    const modalRef = this.modalService.open(Sfec519MantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputLista519 = this.lista519;
    modalRef.componentInstance.inputMonto1 = this.MontoTipo1;
    modalRef.componentInstance.inputMonto2 = this.MontoTipo2;
    modalRef.componentInstance.inputid = donaciones;
    modalRef.componentInstance.inputindex = index;
    modalRef.componentInstance.lista519Ready.subscribe(($e) => {
      this.actualizarPredeclaracionCasilla519($e, null);
      this.rerender();
    });
  }

  public Eliminar(index: number): void {
    this.quieresEliminar().subscribe(($e) => {
      if ($e === 'si') {
        this.actualizarPredeclaracionCasilla519(null, index);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla519(data: Casilla519[], index: number): void {
    if (data !== null) { this.lista519 = data; }
    if (index !== null) { this.lista519.splice(index, 1); }
    this.MontoTipo1 = this.lista519.filter(x => x.codTipDona === 'A').reduce((total, x) => total + Number(x.mtoDonacion), 0);
    this.MontoTipo2 = this.lista519.filter(x => x.codTipDona !== 'A').reduce((total, x) => total + Number(x.mtoDonacion), 0);
    this.total519 = this.MontoTipo1 + this.MontoTipo2;
    this.total519 = Math.round(this.total519);
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla519.lisCas519 = this.lista519;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.total519);
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

  public ObtenerDescripcion(val: string): string {
    const listTipDoc = this.listTipDoc.filter(x => x.val === val);
    return listTipDoc.length !== 0 ? listTipDoc[0].desc : '';
  }

  public exportar(): void {
    const model = new Array();
    this.lista519.forEach(e => {
      model.push({
        'Tipo de Donación': e.desTipDona,
        'Modalidad Donación': e.desModDona,
        'Tipo de Documento Donatario': this.ObtenerDescripcion(e.codTipDoc),
        'Nro. Documento Donatario': e.numDoc,
        'Nombre Razón Social Donatario': e.desRazSoc,
        'Fecha Donación': e.fecDonacion.substring(0, 10),
        'Monto Donación': Number(e.mtoDonacion),
        'Monto Deducción': Number(e.mtoDonacion)
      });
    });
    this.funcionesGenerales.exportarExcel(model, 'casilla519');
  }
}
