import { Component, OnInit, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScCas107MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { Subject, Observable } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ListaParametrosModel, PreDeclaracionModel, Casilla107 } from '@path/natural/models';
// import { FuncionesGenerales } from '@path/natural/utils';
import { ParametriaFormulario } from '@path/natural/services';
import { ComboService } from '@rentas/shared/core';
import * as moment from 'moment';
import { ConstantesCombos, ConstantesDocumentos, dtOptionsPN } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';
import { Documentos } from '@path/natural/models/Generales/documentos-contador';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class ScCas107Component extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() montoReturn = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = dtOptionsPN;
  private preDeclaracion: PreDeclaracionModel;
  public lista107: Casilla107[];
  public dtTrigger: Subject<any> = new Subject();
  private funcionesGenerales: FuncionesGenerales;
  public total107: number;
  private montoHonorarios: number;
  private montoNotCred: number;
  private montoConsolidado: number;
  private listaTipDoc: ListaParametrosModel[];
  private listaComprobante: Array<any>;
  public documentos: Documentos[];

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private comboService: ComboService,
    private cus12Service: ParametriaFormulario) { super(); }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.lista107 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla107.lisCas107;
    this.total107 = this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas107);
    this.listaTipDoc = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
    this.listaComprobante = this.cus12Service.obtenerTipoComprobante();
    this.obtenerNumeroDocumentos();
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public agregarOActualizar(id?: Casilla107, index?: number): void {
    const modalRef = this.modalService.open(ScCas107MantenimientoComponent,
      this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputLista107 = this.lista107;
    modalRef.componentInstance.inputid = id;
    modalRef.componentInstance.inputidIndex = index;
    modalRef.componentInstance.lista107Ready.subscribe(($e) => {
      this.actualizarPredeclaracionCasilla107($e, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.quieresEliminar().subscribe(($e) => {
      if ($e === 'si') {
        this.actualizarPredeclaracionCasilla107(null, index);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla107(data: Casilla107[], index: number): void {
    if (data !== null) { this.lista107 = data; }
    if (index !== null) { this.lista107.splice(index, 1); }
    this.montoHonorarios = this.lista107.filter(x => x.codTipComp === '02').reduce((carry, y) => carry + Number(y.mtoAtribuido), 0);
    this.montoNotCred = this.lista107.filter(x => x.codTipComp === '07').reduce((carry, y) => carry + Number(y.mtoAtribuido), 0);
    this.montoConsolidado = this.lista107.filter(x => x.tipDoc === ConstantesDocumentos.CONSOLIDADO).
      reduce((carry, y) => carry + Number(y.mtoAtribuido), 0);
    this.total107 = Number(this.montoHonorarios) - Number(this.montoNotCred) + Number(this.montoConsolidado);
    this.total107 = Math.round(this.total107) < 0 ? 0 : Math.round(this.total107);
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla107.lisCas107 = this.lista107;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.total107);
    this.obtenerNumeroDocumentos();
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

  private ObtenerDescripcion(val: string): string {
    const descTipDoc = this.listaTipDoc.find(x => x.val === val);
    return descTipDoc ? descTipDoc.desc : '';
  }

  private ObtenerComprobante(val: string): string {
    const descripcionComprobante = this.listaComprobante.filter(x => x.val === val);
    return descripcionComprobante.length !== 0 ? descripcionComprobante[0].desc : '';
  }

  public obtenerPeriodo(val: string): string {
    return val.substring(0, 2) + '/' + val.substring(2);
  }

  public obtenerFecha(tipoSoc: string, val: string): string {
    if (tipoSoc === '99') {
      return null;
    } else {
      return val.substring(0, 10);
    }
  }

  public exportar(): void {
    const model = new Array();
    this.lista107.forEach(e => {
      model.push({
        'Tipo de Documento': this.ObtenerDescripcion(e.tipDoc),
        'Nro. Documento': e.numDoc,
        'Nombre Razon Social': e.desRazSoc,
        Periodo: this.obtenerPeriodo(e.perServicio),
        'Tipo Comprobante': this.ObtenerComprobante(e.codTipComp),
        Serie: e.numSerie,
        'Número Comprobante': e.numComp,
        'Fecha Emisión': !!!e.fecEmi ? '' : moment(e.fecEmi.substring(0, 10)).format('DD/MM/YYYY'),
        'Ingreso Atribuido': Number(e.mtoAtribuido),
      });
    });
    this.funcionesGenerales.exportarExcel(model, 'casilla107');
  }

  
  private obtenerNumeroDocumentos() {  
    this.documentos = [];
    const listaRucs = this.lista107.reduce((pV, cV) => [...pV, { numDoc: cV.numDoc, tipoDoc: cV.tipDoc }], []);
    const unicos = this.eliminaDuplicados(listaRucs);
    
    unicos.forEach((item) => {
      const rucDuplicado = listaRucs.filter((x) => x.numDoc === Object(item).numDoc && x.tipoDoc === Object(item).tipoDoc);
      //this.documentosCount.set(Object(item).numDoc, rucDuplicado.length); 
      console.log("tipo documento",Object(item).tipoDoc);

        const documento = {
          documento: Object(item).numDoc? Object(item).numDoc: "-",
          tipoDoc: Object(item).tipoDoc=='06'? "RUC":this.ObtenerDescripcion(Object(item).tipoDoc),
          cantidad: rucDuplicado.length         
        };

        this.documentos.push(documento);
    });
  }

  private eliminaDuplicados(lista) {
    const arrMap = lista.map(elemento => {
      return [JSON.stringify(elemento), elemento]
    });
    return [...new Map(arrMap).values()];
  }

}
