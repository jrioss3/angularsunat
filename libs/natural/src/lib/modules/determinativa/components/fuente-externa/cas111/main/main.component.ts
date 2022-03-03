import { MostrarMensajeService } from './../../../../../../services/mostrarMensaje.service';
import { Component, OnInit, EventEmitter, Output, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cas111MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ComboService } from '@rentas/shared/core';
// import { FuncionesGenerales } from '@path/natural/utils';
import { PreDeclaracionModel, ListaParametrosModel, Casilla111 } from '@path/natural/models';
import { ConstantesCombos, dtOptionsPN } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class SfeC111MainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  private preDeclaracion: PreDeclaracionModel;
  public listaCasilla111: Casilla111[];
  public dtOptions: DataTables.Settings = dtOptionsPN;
  public dtTrigger: Subject<any> = new Subject();
  public total: number;
  private funcionesGenerales: FuncionesGenerales;
  private descripcion: ListaParametrosModel[];
  private readonly mensajeConformidadEliminarRegistro = 'Se eliminó el elemento correctamente.';
  private readonly mensajeEliminar = '¿Desea eliminar el registro?';
  public documentosMap: Map<string, number> = new Map<string, number>();

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private comboService: ComboService,
    private mostrarMensaje: MostrarMensajeService) { super(); }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.listaCasilla111 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla111.lisCas111;
    this.total = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas111);
    this.descripcion = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
    this.obtenerNumeroDocumentos();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  public agregarOActualizar(id?: Casilla111, index?: number): void {
    const modalRef = this.modalService.open(Cas111MantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputListaCasilla111 = this.listaCasilla111;
    modalRef.componentInstance.inputid = id;
    modalRef.componentInstance.inputidIndex = index;
    modalRef.componentInstance.listaCasilla111.subscribe((data) => {
      this.calculoMontoyActualizarPredeclaracion(data, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.mostrarMensaje.mensajeEliminar(this.mensajeEliminar).subscribe((resp: string) => {
      if (resp === 'si') {
        this.calculoMontoyActualizarPredeclaracion(null, index);
        this.mostrarMensaje.callModal(this.mensajeConformidadEliminarRegistro);
        this.rerender();
      }
    });
  }

  private calculoMontoyActualizarPredeclaracion(data: Casilla111[], index: number): void {
    if (data !== null) { this.listaCasilla111 = data; }
    if (index !== null) { this.listaCasilla111.splice(index, 1); }
    this.total = this.listaCasilla111.reduce((carry, x) => carry + Number(x.mtoPercibido), 0);
    this.total = Math.round(this.total);
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla111.lisCas111 = this.listaCasilla111;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.total);
    this.obtenerNumeroDocumentos();
  }

  public ObtenerDoc(val: string): string {
    const descripcion = this.descripcion.filter(x => x.val === val);
    return descripcion.length !== 0 ? descripcion[0].desc : '';
  }

  public obtenerPeriodo(val: string): string {
    return val.substring(0, 2) + '/' + val.substring(2);
  }

  public exportar() {
    const model = new Array();
    this.listaCasilla111.forEach(e => {
      model.push({
        'Tipo de Documento': this.ObtenerDoc(e.codTipDoc),
        'Nro. Documento': e.numDoc,
        'Nombre Razon Social': e.desRazSoc,
        Periodo: this.obtenerPeriodo(e.perServicio),
        'Remuneración Mensual Percibida': Number(e.mtoPercibido),
      });
    });
    this.funcionesGenerales.exportarExcel(model, 'casilla111');
  }

  private obtenerNumeroDocumentos() {
    this.documentosMap = new Map<string, number>();
    const listaRucs = this.listaCasilla111.reduce((pV, cV) => [...pV, cV.numDoc], []);
    const unicos = [...new Set(listaRucs)];
    unicos.forEach((item) => {
      const rucDuplicado = listaRucs.filter((x) => x === item);
      this.documentosMap.set(item, rucDuplicado.length);
    });
  }
}
