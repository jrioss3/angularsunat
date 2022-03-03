import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DetCredImpuestoRtaModelCas297, DeudasActivasModel } from '@path/juridico/models/SeccionDeterminativa/detCredImpuestoRtaModel';
import { Subject } from 'rxjs';
import { ConstantesCadenas, dtOptionsCas297, MensajeGenerales } from '@rentas/shared/constantes';
import { RenderizarPaginacion } from '@rentas/shared/utils';
import { Detalle297RegistroComponent } from '../detalle297-registro/detalle297-registro.component';
import { DataTableDirective } from 'angular-datatables';
import { AbrirModalService, ModalConfirmarService } from '@rentas/shared/core';
import { HabilitarCasillas2021Service } from '@path/juridico/services/habilitar-casillas-2021.service';

@Component({
  selector: 'app-detalle297',
  templateUrl: './detalle297.component.html',
  styleUrls: ['./detalle297.component.scss']
})
export class Detalle297Component extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() datosCasilla297 = new EventEmitter<any>();
  @Input() inputDeudas: DetCredImpuestoRtaModelCas297[];

  public dtOptions: DataTables.Settings = dtOptionsCas297;
  public dtTrigger: Subject<any> = new Subject();
  public total: number;
  listDeudas: DeudasActivasModel[] = [];

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  constructor(
    private modalMensejaService: ModalConfirmarService,
    private abrirModalService: AbrirModalService,
    public mostrarCabeceras: HabilitarCasillas2021Service,
    public activeModal: NgbActiveModal) {
    super()
  }

  ngOnInit() {
    this.listDeudas = this.inputDeudas.map((deuda, index) => ({ ...deuda, id: index }));
    this.calcularCasilla297();
    this.sortListaDeuda();
  }

  public ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  public ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public agregar(): void {
    const modalRef = this.abrirModalService.abrirModal(Detalle297RegistroComponent);
    modalRef.componentInstance.inputDeudasRegistrar = this.listDeudas;
    modalRef.componentInstance.listaDeudas.subscribe($e => {
      this.actualizarDeudas($e, null)
    });
  }

  public eliminar(deudaActiva: DeudasActivasModel): void {
    const mensaje = deudaActiva.codOrigen === '0' ? MensajeGenerales.mensajeEliminarPers297 : MensajeGenerales.mensajeEliminar297;
    const index = this.listDeudas.findIndex(deuda => deudaActiva.id == deuda.id);
    this.modalMensejaService.msgConfirmar(mensaje).subscribe($e => {
      if ($e === ConstantesCadenas.RESPUESTA_SI) {
        this.actualizarDeudas(null, index);
      }
    });
  }

  private actualizarDeudas(data: DeudasActivasModel[], index: number): void {
    if (data !== null) { this.listDeudas = data; }
    if (index !== null) {
      if (this.listDeudas[index].codOrigen === '0') {
        this.listDeudas[index].indActivo = '0';
      } else {
        this.listDeudas.splice(index, 1);
      }
    }
    this.sortListaDeuda();
    this.calcularCasilla297();
    this.rerender();
  }

  private calcularCasilla297(): void {
    this.total = this.listDeudas.filter(deuda => deuda.indActivo === '1').reduce((total, monto) => total + monto.mtoImpuesto, 0);
  }

  public guardar(): void {
    this.datosCasilla297.emit({
      casilla297: this.total, listaCas297: this.listDeudas.map(e => {
        delete e.id;
        return e;
      })
    });
    this.activeModal.close();
  }

  public filtrarLista(): DeudasActivasModel[] {
    return this.listDeudas.filter(deuda => deuda.indActivo === '1');
  }

  sortListaDeuda(): void {
    this.listDeudas = JSON.parse(JSON.stringify((!this.listDeudas ? [] : this.listDeudas).sort(this.handlerSort.bind(this))));
  }

  private handlerSort(z: DeudasActivasModel, w: DeudasActivasModel) {
    const periodoA = this.reversePeriodoAnioMes(z.numPerPagoCta);
    const periodoB = this.reversePeriodoAnioMes(w.numPerPagoCta);
    return periodoA - periodoB;
  }

  private reversePeriodoAnioMes(numPerPagoCta: string): number {
    numPerPagoCta = numPerPagoCta ?? '000000';
    return Number(numPerPagoCta);
  }

}
