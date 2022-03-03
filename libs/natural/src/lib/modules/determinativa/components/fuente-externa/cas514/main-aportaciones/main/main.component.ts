import { Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable } from 'rxjs';
import { LCas514Detalle, PreDeclaracionModel, Casilla514Cabecera, ListaParametrosModel } from '@path/natural/models';
import { ComboService } from '@rentas/shared/core';
import { UtilsComponent } from '@path/natural/components';
import { Sfec514AportacionesMantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { ConstantesCombos, dtOptionsPN } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class Sfec514MainAportacionesComponent extends RenderizarPaginacion implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = dtOptionsPN;
  public dtTrigger: Subject<any> = new Subject();
  public aportacion514: LCas514Detalle[];
  private lista514: Casilla514Cabecera[];
  private preDeclaracion: PreDeclaracionModel;
  public aportacionTotalS: number;
  private TipoGastoAportaciones = '04';
  private listaTipoDocumento: ListaParametrosModel[];
  private indice: number;
  private funcionesGenerales: FuncionesGenerales;

  @Output() total = new EventEmitter<number>();


  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private comboService: ComboService
  ) { super(); }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.indice = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera.
      findIndex(x => x.indTipoGasto === '04');
    this.lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
    this.lista514.map(x => {
      switch (x.indTipoGasto) {
        case this.TipoGastoAportaciones: {          
          this.aportacion514 = x.casilla514Detalle.lisCas514;         
          let mtoGastoAportaciones_2 = x.casilla514Detalle.lisCas514.filter(y => y.indEstFormVirt === '1').reduce((total, aportaciones_2) => total + aportaciones_2.mtoDeduccion, 0);
          mtoGastoAportaciones_2 = Number(mtoGastoAportaciones_2.toFixed(2));//PMGC-537
          this.aportacionTotalS = mtoGastoAportaciones_2; //x.mtoGasto;
          //this.aportacionTotalS = 3;
          break;
        }
      }
    });
    this.listaTipoDocumento = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
    this.funcionesGenerales = FuncionesGenerales.getInstance();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public close() {
    this.activeModal.close('Click close');
  }

  public nuevoAportes(): void {
    const modal = {
      titulo: 'Aportaciones a EsSalud de Trabajadores del Hogar',
      accion: 'aportes'
    };
    const modalRef = this.modalService.open(Sfec514AportacionesMantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
    modalRef.componentInstance.inputListaBienes = this.aportacion514;   
    modalRef.componentInstance.listaBienesReady.subscribe(($e) => {    
      this.aportacion514 = $e;
      this.aportacionTotalS = 0;
      this.aportacionTotalS = this.aportacion514.reduce((total, alquileres) => total + alquileres.mtoDeduccion, 0);
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice].mtoGasto
        = this.aportacionTotalS;
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice]
        .casilla514Detalle.lisCas514
        = this.aportacion514;
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
      this.total.emit(this.aportacionTotalS);
      this.rerender();
    });
  }

  public actualizarAportes(id: LCas514Detalle, index: number): void {
    const modal = {
      titulo: 'Aportaciones a EsSalud de Trabajadores del Hogar',
      accion: 'aportes'
    };
    const modalRef = this.modalService.open(Sfec514AportacionesMantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
    modalRef.componentInstance.inputListaBienes = this.aportacion514;
    modalRef.componentInstance.inputId = id;
    modalRef.componentInstance.inputIndex = index;
    modalRef.componentInstance.listaBienesReady.subscribe(($e) => {
      this.aportacion514 = $e;
      this.aportacionTotalS = 0;
      this.aportacionTotalS = this.aportacion514.reduce((total, alquileres) => total + alquileres.mtoDeduccion, 0);
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice].mtoGasto
        = this.aportacionTotalS;
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice]
        .casilla514Detalle.lisCas514
        = this.aportacion514;
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
      this.total.emit(this.aportacionTotalS);
      this.rerender();
    });
  }

  public eliminarAportes(index: number): void {   
    this.quieresEliminar().subscribe($e => {
      if ($e === 'si') {       
        this.aportacionTotalS = 0;
        this.aportacion514.splice(index, 1);
        this.aportacionTotalS = this.aportacion514.reduce((total, alquileres) => total + alquileres.mtoDeduccion, 0);
        this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice]
          .casilla514Detalle.lisCas514
          = this.aportacion514;
        this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice].mtoGasto
          = this.aportacionTotalS;
        SessionStorage.setPreDeclaracion(this.preDeclaracion);
        this.callModal('Se eliminó el elemento correctamente.');
        this.total.emit(this.aportacionTotalS);
        this.rerender();
      }
    });
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

  private callModal(excepcionName: string) {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
  }

  public ObtenerDecripcionDocumento(val: string): string {
    const descripcionDocumento = this.listaTipoDocumento.filter(x => x.val === val);
    return descripcionDocumento.length !== 0 ? descripcionDocumento[0].desc : '';
  }
}
