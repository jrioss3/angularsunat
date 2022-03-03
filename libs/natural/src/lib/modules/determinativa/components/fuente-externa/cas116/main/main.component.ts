import { MostrarMensajeService } from './../../../../../../services/mostrarMensaje.service';
import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cas116MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ParametriaFormulario } from '@path/natural/services';
import { ComboService } from '@rentas/shared/core';
import { ListaParametrosModel, Casilla116, PreDeclaracionModel } from '@path/natural/models';
import { ConstantesCombos, dtOptionsPN } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})

export class SfeCas116MainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() mto116 = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  private funcionesGenerales: FuncionesGenerales;
  public dtOptions: DataTables.Settings = dtOptionsPN;
  private preDeclaracion: PreDeclaracionModel;
  public lista116: Casilla116[];
  public total116: number;
  public dtTrigger: Subject<any> = new Subject();
  private listRTFI: ListaParametrosModel[];
  private listBene: ListaParametrosModel[];
  private listCDI: ListaParametrosModel[];
  private listDoc: ListaParametrosModel[];
  private descripcionRenta: ListaParametrosModel[];
  private readonly mensajeConformidadEliminarRegistro = 'Se eliminó el elemento correctamente.';
  private readonly mensajeEliminar = '¿Desea eliminar el registro?';

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private cus30Service: ParametriaFormulario,
    private comboService: ComboService,
    private mostrarMensaje: MostrarMensajeService) { super(); }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.lista116 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla116.lisCas116;
    this.calcular116();
    this.listRTFI = this.cus30Service.obtenerTipoRentaRTFI();
    this.listBene = this.cus30Service.obtenerDobleImposicion();
    this.listCDI = this.cus30Service.obtenerOpcionCDI();
    this.listDoc = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
    this.descripcionRenta = this.cus30Service.obtenerTipoRenta();
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public agregarOActualizar(tipRenta?: Casilla116, index?: number): void {
    const modalRef = this.modalService.open(Cas116MantenimientoComponent, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class3' }));
    modalRef.componentInstance.inputLista116 = this.lista116;
    modalRef.componentInstance.inputRenta116 = tipRenta;
    modalRef.componentInstance.inputIndex = index;
    modalRef.componentInstance.lista116Ready.subscribe(($e) => {
      this.actualizarPredeclaracionCasilla116($e, null);
      this.rerender();
    });
  }

  public Eliminar(index): void {
    this.mostrarMensaje.mensajeEliminar(this.mensajeEliminar).subscribe((resp: string) => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCasilla116(null, index);
        this.mostrarMensaje.callModal(this.mensajeConformidadEliminarRegistro);
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla116(data: Casilla116[], index: number): void {
    if (data !== null) { this.lista116 = data; }
    if (index !== null) { this.lista116.splice(index, 1); }
    this.calcular116();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla116.lisCas116 = this.lista116;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.mto116.emit(this.total116);
  }

  private calcular116(): void {
    this.total116 = 0;
    this.total116 = this.lista116.reduce((carry, x) => carry + Number(x.mtoImpuesto), 0);
    this.total116 = Math.round(this.total116);
  }

  public obtenerModalidad(value: string): string {
    const listRTFI = this.listRTFI.filter(x => x.val === value);
    return listRTFI.length !== 0 ? listRTFI[0].desc : '';
  }

  public obtenerBeneficios(value: string): string {
    const listBene = this.listBene.filter(x => x.val === value);
    return listBene.length !== 0 ? listBene[0].desc : '';
  }

  public obtenerCDI(value: string): string {
    const listCDI = this.listCDI.filter(x => x.val === value);
    return listCDI.length !== 0 ? listCDI[0].desc : '';
  }

  public obtenerTipoDoc(value: string): string {
    const listDoc = this.listDoc.filter(x => Object(x).val === value);
    return listDoc.length !== 0 ? listDoc[0].desc : '';
  }

  public ObtenerRenta(val: string): string {
    const descripcionRenta = this.descripcionRenta.filter(x => x.val === val);
    return descripcionRenta.length !== 0 ? descripcionRenta[0].desc : '';
  }

  public exportar(): void {
    const model = new Array();
    this.lista116.forEach(e => {
      model.push({
        'Tipo Renta': this.ObtenerRenta(e.codTipRenta),
        'Tipo Renta RTFI': this.obtenerModalidad(e.codTipRentaRtfi),
        'País Fuente': e.desPais,
        'Aplica beneficios para evitar doble Imposicion Opcion': this.obtenerBeneficios(e.codBenef),
        'opcion CDI': this.obtenerCDI(e.codCdi),
        'Nombre Razon Social': e.desPagador,
        'Tipo de Documento': this.obtenerTipoDoc(e.codTipDocPagador),
        'Nro Documento': e.numDocPagador,
        'Renta Neta Percibida': Number(e.mtoImpuesto)
      });
    });
    this.funcionesGenerales.exportarExcel(model, 'casilla116');
  }
}
