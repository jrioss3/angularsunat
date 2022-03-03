import { ListaParametrosModel } from './../../../../../../../models/comboUriModel';
import { Component, OnInit, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionModel, Casilla514Cabecera, LCas514Detalle } from '@path/natural/models';
import { ParametriaFormulario, PreDeclaracionService } from '@path/natural/services';
import { Subject, Observable } from 'rxjs';
import { UtilsComponent } from '@path/natural/components';
import { Sfec514MedicosMantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales } from '@rentas/shared/utils';
import { dtOptionsPN, ConstantesCombos } from '@rentas/shared/constantes';
import { ComboService } from '@rentas/shared/core';
import { CalcularMontoMaximoDeducir } from '../../utils/calcular-monto-maximo-deducir';
import { ConstantesCasilla514 } from '@path/natural/utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class Sfec514MainMedicosComponent extends RenderizarPaginacion implements OnInit, OnDestroy, AfterViewInit {

  @Output() total = new EventEmitter<number>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = dtOptionsPN;
  private tipoGastoMedicos = '03';
  private lista514: Casilla514Cabecera[];
  public medicos514: LCas514Detalle[];
  public medicototalS: number;
  private descripcionPago: ListaParametrosModel[];
  private descripcionComp: ListaParametrosModel[];
  private indice: number;
  private preDeclaracion: PreDeclaracionModel;
  public dtTrigger: Subject<any> = new Subject();
  private funcionesGenerales: FuncionesGenerales;
  public lstParametriaObservaciones;
  private anioEjercicio: number;
  public MedicosTotalS: number;

  constructor(
    public activeModal: NgbActiveModal,
    private predeclaracionService: PreDeclaracionService,
    private modalService: NgbModal,
    private cus27Service: ParametriaFormulario,
    private comboService: ComboService) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.anioEjercicio = Number(this.predeclaracionService.obtenerAnioEjercicio());
    this.lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
    this.indice = [...this.lista514].findIndex(x => x.indTipoGasto === this.tipoGastoMedicos);
    this.funcionesGenerales = FuncionesGenerales.getInstance();
   
    this.lista514.map(x => {
      switch (x.indTipoGasto) {
        case this.tipoGastoMedicos: {
          this.medicos514 = x.casilla514Detalle.lisCas514;         
          let mtoGastoMedicos = x.casilla514Detalle.lisCas514.filter(y => y.indEstFormVirt === '1').reduce((total, medicos) => total + medicos.mtoDeduccion, 0);
          mtoGastoMedicos = Number(mtoGastoMedicos.toFixed(2));//PMGC-537
          this.medicototalS = mtoGastoMedicos; //x.mtoGasto;
         
          break;
        }
      }
    });
    this.descripcionPago = this.cus27Service.obtenerFormaPagoRHE();
    this.descripcionComp = this.cus27Service.obtenerTipoComprobante_cus32_Medicos();
    this.calcularMontoDeducir();
    this.lstParametriaObservaciones = this.comboService.obtenerComboPorNumero(ConstantesCombos.OBSERVACIONES_GASTOS_DEDUCIBES);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private calcularMontoDeducir(): void {
    
    this.medicos514.map(e => new CalcularMontoMaximoDeducir(e, this.anioEjercicio).getMontoDeduccionActualizadoMedicos());
    this.MedicosTotalS = this.medicos514.filter(x => x.indEstFormVirt === ConstantesCasilla514.regValido).
      reduce((total, Artesanias) => total + Number(Artesanias.mtoDeduccion), 0);
    this.ordenarPorFecha();
    this.lista514[this.indice].casilla514Detalle.lisCas514 = this.medicos514;
    this.lista514[this.indice].mtoGasto = this.MedicosTotalS;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.total.emit(this.MedicosTotalS);
  }

  private ordenarPorFecha(): void {
    this.medicos514.sort((a, b) => {
      if (a.fecComprob > b.fecComprob) {
        return 1;
      }
      if (a.fecComprob < b.fecComprob) {
        return -1;
      }
      return 0;
    });
  }

  public obtenerMotivoObservacion(val: string): string {   
    const descripcionPago = this.lstParametriaObservaciones.filter(x => Object(x).val === val);
    return descripcionPago.length !== 0 ? Object(descripcionPago[0]).desc : '';
  }

  public ObtenerMedPag(val: string): string {
    const descripcionPago = this.descripcionPago.filter(x => Object(x).val === val);
    return descripcionPago.length !== 0 ? Object(descripcionPago[0]).desc : '';
  }

  public ObtenerComprobante(val: string): string {
    const descripcionComp = this.descripcionComp.filter(x => Object(x).val === val);
    return descripcionComp.length !== 0 ? Object(descripcionComp[0]).desc : '';
  }

  public nuevoMedicos(): void {
    const modal = {
      titulo: 'Médicos y odontólogos y servicios de profesionales independientes',
      accion: 'medicos'
    };
    const modalRef = this.modalService.open(Sfec514MedicosMantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
    modalRef.componentInstance.inputListaBienes = this.medicos514;
    modalRef.componentInstance.listaBienesReady.subscribe(($e) => {
      this.medicos514 = $e;
      this.medicototalS = 0;
      this.medicototalS = this.medicos514.reduce((total, medicos) => total + medicos.mtoDeduccion, 0);
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice]
        .mtoGasto = this.medicototalS;
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice]
        .casilla514Detalle.lisCas514 = this.medicos514;
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
      this.total.emit(this.medicototalS);
      this.rerender();
    });
  }

  public actualizarMedicos(id: LCas514Detalle, index: number): void {
    const modal = {
      titulo: 'Médicos y odontólogos y servicios de profesionales independientes',
      accion: 'medicos'
    };
    const modalRef = this.modalService.open(Sfec514MedicosMantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
    modalRef.componentInstance.inputListaBienes = this.medicos514;
    modalRef.componentInstance.inputId = id;
    modalRef.componentInstance.inputIndex = index;
    modalRef.componentInstance.listaBienesReady.subscribe(($e) => {
      this.medicos514 = $e;
      this.medicototalS = 0;
      this.medicototalS = this.medicos514.reduce((total, medicos) => total + medicos.mtoDeduccion, 0);
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice]
        .mtoGasto = this.medicototalS;
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice]
        .casilla514Detalle.lisCas514 = this.medicos514;
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
      this.total.emit(this.medicototalS);
      this.rerender();
    });

  }

  public eliminarMedicos(index: number): void {
    this.quieresEliminar().subscribe($e => {
      if ($e === 'si') {
        this.medicototalS = 0;
        this.medicos514.splice(index, 1);
        this.medicototalS = this.medicos514.reduce((total, medicos) => total + medicos.mtoDeduccion, 0);
        this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.
          lisCas514Cabecera[this.indice].casilla514Detalle.lisCas514 = this.medicos514;
        this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice].mtoGasto
          = this.medicototalS;
        SessionStorage.setPreDeclaracion(this.preDeclaracion);
        this.callModal('Se eliminó el elemento correctamente.');
        this.total.emit(this.medicototalS);
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

  private callModal(excepcionName: string): void {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
  }

  public habilitarCasItan(): boolean {
    const anioRenta = this.preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    return Number(anioRenta) >= 2021;
  }
}
