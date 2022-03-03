import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScCas108MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { Subject, Observable } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
// import { FuncionesGenerales } from '@path/natural/utils';
import {
  ListaParametrosModel,
  Casilla108,
  PreDeclaracionModel,
} from '@path/natural/models';
import { ComboService } from '@rentas/shared/core';
import { ConstantesCombos, dtOptionsPN } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class ScCas108Component extends RenderizarPaginacion implements OnInit, OnDestroy {

  private preDeclaracion: PreDeclaracionModel;
  public lista108: Casilla108[];
  public total108: number;
  public dtTrigger: Subject<any> = new Subject();
  private funcionesGenerales: FuncionesGenerales;
  private descripcion: ListaParametrosModel[];
  public documentosMap: Map<string, number> = new Map<string, number>();

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = dtOptionsPN;

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
    this.lista108 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla108.lisCas108;
    this.total108 = this.funcionesGenerales.opcionalCero(
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo
        .mtoCas108
    );
    this.descripcion = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
    this.obtenerNumeroDocumentos();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public agregarOActualizar(id?: Casilla108, index?: number): void {
    const modalRef = this.modalService.open(
      ScCas108MantenimientoComponent,
      this.funcionesGenerales.getModalOptions({})
    );
    modalRef.componentInstance.inputLista108 = this.lista108;
    modalRef.componentInstance.inputid = id;
    modalRef.componentInstance.inputidIndex = index;
    modalRef.componentInstance.lista108Ready.subscribe((data) => {
      this.calculoMontoyActualizarPredeclaracion(data, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.quieresEliminar().subscribe(($e) => {
      if ($e === 'si') {
        this.calculoMontoyActualizarPredeclaracion(null, index);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
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

  private calculoMontoyActualizarPredeclaracion(
    data: Casilla108[],
    index: number
  ): void {
    if (data !== null) {
      this.lista108 = data;
    }
    if (index !== null) {
      this.lista108.splice(index, 1);
    }
    this.total108 = this.lista108.reduce(
      (carry, x) => carry + Number(x.mtoAtribuido),
      0
    );
    this.total108 = Math.round(this.total108);
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla108.lisCas108 = this.lista108;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.total108);
    this.obtenerNumeroDocumentos();
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

  public ObtenerDescripcion(val: string): string {
    const descripcion = this.descripcion.filter((x) => x.val === val);
    return descripcion.length !== 0 ? descripcion[0].desc : '';
  }

  public obtenerPeriodo(val: string): string {
    return val.substring(0, 2) + '/' + val.substring(2);
  }

  public exportar(): void {
    const model = new Array();
    this.lista108.forEach((e) => {
      model.push({
        'Tipo de Documento': this.ObtenerDescripcion(e.tipDoc),
        'Nro. Documento': e.numDoc,
        'Nombre Razon Social': e.desRazSoc,
        Periodo: this.obtenerPeriodo(e.perServicio.substring(0, 7)),
        'Ingreso atribuido': Number(e.mtoAtribuido),
      });
    });
    this.funcionesGenerales.exportarExcel(model, 'casilla108');
  }

  private obtenerNumeroDocumentos() {
    this.documentosMap = new Map<string, number>();
    const listaRucs = this.lista108.reduce((pV, cV) => [...pV, cV.numDoc], []);
    const unicos = [...new Set(listaRucs)];
    unicos.forEach((item) => {
      const rucDuplicado = listaRucs.filter((x) => x === item);
      this.documentosMap.set(item, rucDuplicado.length);
    });
  }
}
