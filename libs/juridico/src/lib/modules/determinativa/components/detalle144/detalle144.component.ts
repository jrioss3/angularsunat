import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionModel } from '@path/juridico/models';
import { DeudaPagosPreviosModel } from '@path/juridico/models/SeccionDeterminativa/detDeterminacionDeudaModel';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ConstantesTributos, dtOptionsCas144 } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage } from '@rentas/shared/utils';
import { AbrirModalService } from '@rentas/shared/core';
import { Detalle144RegistroComponent } from '../detalle144-registro/detalle144-registro.component';

@Component({
  selector: 'app-detalle144',
  templateUrl: './detalle144.component.html',
  styleUrls: ['./detalle144.component.scss']
})
export class Detalle144Component extends RenderizarPaginacion implements OnInit {

  @Output() datosCasilla = new EventEmitter<{ monto: number, lista: DeudaPagosPreviosModel[] }>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = dtOptionsCas144;
  public dtTrigger: Subject<any> = new Subject();
  public deudas: DeudaPagosPreviosModel[];
  private predeclaracion: PreDeclaracionModel;
  private montoFinalPagosPrevios = 0;
  public codigoTributoSimplificado = ConstantesTributos.RENTA_PERS_JUR.codigoSimplificado;
  public descripcionTributo = ConstantesTributos.RENTA_PERS_JUR.descripcion;

  constructor(public activeModal: NgbActiveModal,
    private abrirModalService: AbrirModalService) {
    super();
  }

  public ngOnInit(): void {
    this.predeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    this.deudas = this.predeclaracion.declaracion.determinacionDeuda.pagosPrevios.lisPagosPrevios;
    this.ordenarTabla();
    this.montoFinalPagosPrevios = this.predeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas144;
  }

  private ordenarTabla(): void {
    this.deudas.sort((z, w) => {

      const formatoZ = this.formatearFecha(z.fecPres);
      const formatoW = this.formatearFecha(w.fecPres);

      if (new Date(formatoZ) < new Date(formatoW)) {
        return -1;
      }
      if (new Date(formatoZ) > new Date(formatoW)) {
        return 1;
      }
      return 0;
    });
  }

  private formatearFecha(fecha: string): string {
    const dia = fecha.split('/')[0];
    const mes = fecha.split('/')[1];
    const anioHora = fecha.split('/')[2];

    return mes + '/' + dia + '/' + anioHora;
  }

  public ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  public ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public changeCheck(checkPagoPrevio, indice): void {
    const estadoCheck = checkPagoPrevio.currentTarget.checked;
    this.deudas[indice].indSel = estadoCheck ? '1' : '0';
    this.calcularMonto();
  }

  public agregarPago(): void {
    const modalRef = this.abrirModalService.abrirModal(Detalle144RegistroComponent);
    modalRef.componentInstance.listaPagosPrevios = this.deudas;
    modalRef.componentInstance.listaPagosPreviosResponse.subscribe($e => {
      this.deudas = $e;
      this.calcularMonto();
      this.ordenarTabla();
      this.rerender();
    });
  }

  private calcularMonto(): void {
    this.montoFinalPagosPrevios = this.deudas.filter(x => x.indSel == '1').reduce((total, dueda) => total + Number(dueda.mtoPag), 0);
  }

  public grabar(): void {
    this.datosCasilla.emit({ monto: this.montoFinalPagosPrevios, lista: this.deudas });
    this.activeModal.close();
  }

}
