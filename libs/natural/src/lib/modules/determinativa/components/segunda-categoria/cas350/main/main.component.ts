import { IndicadorRentaService } from './../../../../../../services/indicador-renta.service';
import { Component, OnInit, EventEmitter, Output, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, } from '@ng-bootstrap/ng-bootstrap';
import { C350MantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { Subject, Observable } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { PreDeclaracionModel, ListaParametrosModel, Casilla350 } from '@path/natural/models';
import { ParametriaFormulario } from '@path/natural/services';
import { ComboService } from '@rentas/shared/core';
import { ConstantesCombos, dtOptionsPN} from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';

@Component({
    selector: 'app-c350main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class C350MainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

    public dtOptions: DataTables.Settings = dtOptionsPN;
    private preDeclaracion: PreDeclaracionModel;
    public listacasilla350: Casilla350[];
    private funcionesGenerales: FuncionesGenerales;
    public totalMontoCasilla350: number;
    private listaFuenteRenta: any[];
    private listaTipoDocumento: ListaParametrosModel[];

    @Output() montoReturn = new EventEmitter<number>();
    dtTrigger: Subject<any> = new Subject();
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    constructor(
        private modalService: NgbModal,
        public activeModal: NgbActiveModal,
        private cus10Service: ParametriaFormulario,
        private comboService: ComboService,
        private indiRenta: IndicadorRentaService) {
        super();
    }

    ngOnInit(): void {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        this.funcionesGenerales = FuncionesGenerales.getInstance();
        this.listacasilla350 = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla350.lisCas350;
        this.totalMontoCasilla350 = this.funcionesGenerales
            .opcionalCero(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas350);
        this.listaFuenteRenta = this.cus10Service.obtenerfuenteperdida();
        this.listaTipoDocumento = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
    }

    ngAfterViewInit(): void { this.dtTrigger.next(); }

    ngOnDestroy(): void { this.dtTrigger.unsubscribe(); }

    public registrarOActualizar(casilla?: Casilla350, index?: number): void {
        const modalRef = this.modalService.open(C350MantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
        modalRef.componentInstance.inputListaCasilla350 = this.listacasilla350;
        modalRef.componentInstance.inputCasilla350 = casilla;
        modalRef.componentInstance.inputIndexCasilla350 = index;
        modalRef.componentInstance.lista350Ready.subscribe(data => {
            this.actualizarPredeclaracionCasilla350(data, null);
            this.rerender();
        });
    }

    public eliminar(index: number): void {
        this.quieresEliminar().subscribe(resp => {
            if (resp === 'si') {
                this.actualizarPredeclaracionCasilla350(null, index);
                this.callModal('Se eliminó el elemento correctamente.');
                this.rerender();
            }
        });
    }

    private actualizarPredeclaracionCasilla350(data: Casilla350[], index: number): void {
        if (data !== null) { this.listacasilla350 = data; }
        if (index !== null) { this.listacasilla350.splice(index, 1); }
        this.totalMontoCasilla350 = this.listacasilla350.reduce((carry, x) => carry + Number(x.mtoGanancia), 0);
        this.totalMontoCasilla350 = Math.round(this.totalMontoCasilla350);
        this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla350.lisCas350 = this.listacasilla350;
        this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas350 = this.totalMontoCasilla350;
        SessionStorage.setPreDeclaracion(this.preDeclaracion);
        this.indiRenta.obtenerIndicadorRentaModel();
        this.montoReturn.emit(this.totalMontoCasilla350);
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

    public ObtenerDescripcionFuenteRenta(val: string): string {
        const descripcionFuenteRenta = this.listaFuenteRenta.filter(x => x.val === val);
        return descripcionFuenteRenta.length !== 0 ? descripcionFuenteRenta[0].desc : '';
    }

    public ObtenerDecripcionDocumento(val: string): string {
        const descripcionDocumento = this.listaTipoDocumento.filter(x => x.val === val);
        return descripcionDocumento.length !== 0 ? descripcionDocumento[0].desc : '';
    }

    public obtenerPeriodo(val: string): string {
        return val.substring(0, 2) + '/' + val.substring(2);
    }

    public exportar(): void {
        const exportarModel = new Array();
        this.listacasilla350.forEach(e => {
            exportarModel.push({
                'Fuente de Renta': this.ObtenerDescripcionFuenteRenta(e.codTipFteRta),
                'Tipo de Documento': this.ObtenerDecripcionDocumento(e.codTipDoc),
                'Nro. Documento': e.numDoc,
                'Nombre Razón Social': e.desRazSoc.trim(),
                'Periodo ': e.perRta,
                'Precio Venta': Number(e.mtoPrecVenta),
                'Costo Computable': Number(e.mtoCostoComp),
                'Monto Ganancia': Number(e.mtoGanancia),
                'Cantidad de Valores': e.cntVal,
                'RUC Emisor': e.numRucEmi,
                'Razón Social Emisor': e.desRazSocEmi
            });
        });
        this.funcionesGenerales.exportarExcel(exportarModel, 'casilla350');
    }
}
