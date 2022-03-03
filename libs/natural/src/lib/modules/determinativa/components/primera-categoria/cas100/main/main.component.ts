import { MostrarMensajeService } from '@path/natural/services/mostrarMensaje.service';
import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ScCas100MantenimientoComponent } from '../cabecera/mantenimiento.component';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { Casilla100Cabecera } from '@path/natural/models/SeccionDeterminativa/DetRentaPrimeraModel';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { ScCas100ImportarComponent } from '../importar/importar.component';
import { ListaParametrosModel } from '@path/natural/models/comboUriModel';
import { ComboService } from '@rentas/shared/core';
import { Observable } from 'rxjs';
import { ConstantesCombos, dtOptionsPN } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class ScCas100Component extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  private preDeclaracionObject: PreDeclaracionModel;
  public listaCasilla100: Casilla100Cabecera[];
  public dtOptions: DataTables.Settings = dtOptionsPN;
  public  dtTrigger: Subject<any> = new Subject();
  @Output() monto = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  public dtElement: DataTableDirective;
  private modalMensajeref: NgbModalRef;
  private funcionesGenerales: FuncionesGenerales;
  private descripcionDocumento: ListaParametrosModel[];
  private readonly mensajeInicio = 'Para continuar con la declaración deberá consignar la información que ' +
  'se solicita de los bienes arrendados. Para cumplir con esta obligación, deberá editar cada una de ' +
  'las líneas que corresponde a cada uno de los inquilinos.';

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private comboService: ComboService,
    private mostrarMensaje: MostrarMensajeService) {
    super();
  }

  ngOnInit(): void {
    this.descripcionDocumento = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
    this.preDeclaracionObject = SessionStorage.getPreDeclaracion();
    this.listaCasilla100 = this.preDeclaracionObject.declaracion.seccDeterminativa.rentaPrimera.casilla100Cabecera.lisCas100Cab;
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    setTimeout(() => this.mostrarMensaje.callModal(this.mensajeInicio) , 200);
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public agreagaroActualizar(casilla?: Casilla100Cabecera, index?: number): void {
    const modalRef = this.modalService.open(ScCas100MantenimientoComponent, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
    modalRef.componentInstance.objetoCasilla = casilla;
    modalRef.componentInstance.index = index;
    modalRef.componentInstance.listaActualizada.subscribe(($e) => {
      this.actualizarPredeclaracionCasilla100($e, null);
      this.rerender();
    });
  }

  public eliminar(indice): void {
    this.quieresEliminar().subscribe(resp => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCasilla100(null, indice);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  public importar(): void {
    this.modalMensajeref.close();
    const modalRef = this.modalService.open(ScCas100ImportarComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.importarListaCasilla100 = this.listaCasilla100;
    modalRef.componentInstance.ListaCasilla100.subscribe(data => {
      this.actualizarPredeclaracionCasilla100(data, null);
      this.rerender();
    });
  }

  private actualizarPredeclaracionCasilla100(data: Casilla100Cabecera[], index: number): void {
    if (data !== null) { this.listaCasilla100 = data; }
    if (index != null) { this.listaCasilla100.splice(index, 1); }
    this.preDeclaracionObject.declaracion.seccDeterminativa.rentaPrimera.casilla100Cabecera.lisCas100Cab = this.listaCasilla100;
    SessionStorage.setPreDeclaracion(this.preDeclaracionObject);
    this.monto.emit(this.obtener100());
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

  private obtener100(): number {
    this.preDeclaracionObject = SessionStorage.getPreDeclaracion();
    this.listaCasilla100 =
      this.preDeclaracionObject.declaracion.seccDeterminativa.rentaPrimera.casilla100Cabecera.lisCas100Cab;
    const montoTotal =
      this.listaCasilla100
        .reduce((total, montos) => total + Number(montos.lisCas100Detalles.filter(x => x.indAceptado === '1')
          .reduce((totalDetalle, montosDetalle) => totalDetalle + Number(montosDetalle.mtoGravado), 0)), 0);
    return Math.round(montoTotal);
  }

  public abrirMensajeImportar(content): void {
    this.modalMensajeref = this.modalService.open(content, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
  }

  public obtenerDocumento(val): string {
    const descripcionDocumento = this.descripcionDocumento.filter(x => x.val === val.toString());
    return descripcionDocumento.length !== 0 ? descripcionDocumento[0].desc : '';
  }

  public obtenerMontoPagSinInt(casilla: Casilla100Cabecera): number {
    return casilla.lisCas100Detalles.filter(x => x.indAceptado === '1')
      .reduce((totalDetalle, montosDetalle) => totalDetalle + Number(montosDetalle.mtoPagSInt), 0);
  }

  public obtenerMontoGravado(casilla: Casilla100Cabecera): number {
    return casilla.lisCas100Detalles.filter(x => x.indAceptado === '1')
      .reduce((totalDetalle, montosDetalle) => totalDetalle + Number(montosDetalle.mtoGravado), 0);
  }

  public exportar(): void {
    const model = Array();
    this.listaCasilla100.forEach(e => {
      e.mtoPagSinInt = e.mtoPagSinInt ? (e.mtoPagSinInt.toString() === '' ? 0 : e.mtoPagSinInt) : null;
      e.mtoGravado = e.mtoGravado ? (e.mtoGravado.toString() === '' ? 0 : e.mtoGravado) : null;
      model.push({
        'Tipo de Documento': this.obtenerDocumento(e.codTipDoc),
        'Nro. Documento': e.numDoc,
        'Partida Registral': e.desPartidaReg,
        'Pago sin interés': this.obtenerMontoPagSinInt(e),
        'Monto Gravado': this.obtenerMontoGravado(e)
      });
    });
    this.funcionesGenerales.exportarExcel(model, 'casilla100');
  }
}
