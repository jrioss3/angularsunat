import { NgModel } from '@angular/forms';
import { DetalleCas108, ImpRtaEmpresaModelCas108 } from '@path/juridico/models/SeccionDeterminativa/impRtaEmpresaModelCas108';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { PreDeclaracionModel } from '@path/juridico/models';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { Subject } from 'rxjs';
import { ConstantesCadenas, ConstantesCasillas, dtOptionsCas108, MensajeGenerales } from '@rentas/shared/constantes';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Detalle108RegistroComponent } from '../detalle108-registro/detalle108-registro.component';
import { RenderizarPaginacion, SessionStorage } from '@rentas/shared/utils';
import { RepresentasLegalesService } from '@path/juridico/services/representantesLegalService.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbrirModalService, ModalConfirmarService } from '@rentas/shared/core';
import { ConstantesCas108 } from '@path/juridico/utils/constantesCas108';

@Component({
  selector: 'app-detalle108',
  templateUrl: './detalle108.component.html',
  styleUrls: ['./detalle108.component.css']
})
export class Detalle108Component extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  @Output() datosCasilla = new EventEmitter<ImpRtaEmpresaModelCas108[]>();

  private preDeclaracion: PreDeclaracionModel;
  public dtOptions: DataTables.Settings = dtOptionsCas108;
  public dtTrigger: Subject<any> = new Subject();
  public saldos: DetalleCas108[] = [];
  public rdtArrastrePeriodoAnterior: string;
  public casillaSP: number;
  public exedeRegistros = false;
  public casillaCP: number;
  public anio: number;
  private casilla106: number;
  private cantidadMaxima: number;
  private listaPerdidas: ImpRtaEmpresaModelCas108[];
  private listaCompensacion: ImpRtaEmpresaModelCas108[];
  public arrastreA = ConstantesCas108.ARRASTRE_A;
  public arrastreB = ConstantesCas108.ARRASTRE_B;
  public casillaCalculada = ConstantesCasillas.CODIGO_TIPO_CASILLA_CALCULADA;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  constructor(
    private preDeclaracionService: PreDeclaracionService,
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private modalMensejaService: ModalConfirmarService,
    private abrirModalService: AbrirModalService,
    private representantesLegales: RepresentasLegalesService) {
    super();
  }

  async ngOnInit() {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.anio = Number(this.preDeclaracionService.obtenerNumeroEjercicio());
    this.cantidadMaxima = await this.obtenerAniosArrastre();
    this.casilla106 = this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa.mtoCas106;
    let lista = this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108.lisCasilla108;
    lista = this.filtrarLista(lista);

    this.listaPerdidas = lista.filter(x => x.codTipMto === '1');
    this.listaCompensacion = lista.filter(x => x.codTipMto === '2');

    for (let i = 0; i < this.listaPerdidas.length; i++) {
      const objetoLista = {
        casillaPerdidas: this.listaPerdidas[i],
        casillaCompensacion: this.listaCompensacion[i],
      };
      this.saldos.push(objetoLista);
    }
    this.calcularMontos();
    if (this.saldos.length === 0) {
      this.rdtArrastrePeriodoAnterior = String(Number(SessionStorage.getEjercicioAnterior().arrastre));
    } else {
      this.rdtArrastrePeriodoAnterior = this.saldos[0].casillaPerdidas.indArr;
    }
  }

  public ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  public ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private filtrarLista(lista: ImpRtaEmpresaModelCas108[]): ImpRtaEmpresaModelCas108[] {
    return lista.sort(this.orderListaCasilla);
  }

  async obtenerAniosArrastre() {
    if (this.anio === 2025) {
      if (SessionStorage.getCasilla107()?.consulto && SessionStorage.getCasilla107()?.casilla107 > 0) {
        return 5;
      } else if (!SessionStorage.getCasilla107()?.consulto) {
        this.spinner.show();
        const data = await this.representantesLegales.obtenerCasilla107(SessionStorage.getUserData().numRUC, '2020').toPromise();
        SessionStorage.setCasilla107(data);
        this.spinner.hide();
        if (data.casilla107 > 0) {
          return 5;
        } else {
          return 4;
        }
      } else {
        return 4;
      }
    } else {
      return 4;
    }
  }

  private orderListaCasilla(x: ImpRtaEmpresaModelCas108, y: ImpRtaEmpresaModelCas108): number {
    if (x.desValLiteral > y.desValLiteral) {
      return 1;
    }
    if (x.desValLiteral < y.desValLiteral) {
      return -1;
    }
    return 0;
  }

  public cambiarArrastre(ngModelDir: NgModel) {
    ngModelDir.control.markAsTouched();
    if (this.eligeMismoEjercicio()) {
      this.saldos = [];
      this.exedeRegistros = false;
      this.calcularMontos();
      this.rerender();
    } else {
      const mensaje = MensajeGenerales.mensajeCasilla108Arrastre.replace('ARRASTRE', (this.rdtArrastrePeriodoAnterior === this.arrastreA ? 'B' : 'A'));
      this.modalMensejaService.msgConfirmar(mensaje).subscribe(($e) => {
        if ($e === ConstantesCadenas.RESPUESTA_SI) {
          this.saldos = [];
          this.exedeRegistros = false;
          this.calcularMontos();
          this.rerender();
        } else {
          this.rdtArrastrePeriodoAnterior === this.arrastreA ?
            this.rdtArrastrePeriodoAnterior = this.arrastreB :
            this.rdtArrastrePeriodoAnterior = this.arrastreA;
        }
      });
    }
  }

  private eligeMismoEjercicio(): boolean {
    if (this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria === '0' && SessionStorage.getEjercicioAnterior().arrastre !== null) {
      return Number(SessionStorage.getEjercicioAnterior().arrastre) === Number(this.rdtArrastrePeriodoAnterior) &&
        String(this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria) === '0';
    }
    return true;
  }

  public agregaroEditar(saldo?: ImpRtaEmpresaModelCas108, index?: number): void {
    const modalRef = this.abrirModalService.abrirModal(Detalle108RegistroComponent);
    modalRef.componentInstance.saldos = this.saldos;
    modalRef.componentInstance.tipoArrastre = this.rdtArrastrePeriodoAnterior;
    modalRef.componentInstance.cantidadRegistros = this.cantidadMaxima;
    modalRef.componentInstance.indice = index;
    modalRef.componentInstance.saldo = saldo;
    modalRef.componentInstance.listaDetalle108.subscribe($e => {
      this.actualizarDetalle108($e, null);
      this.exedeRegistros = this.saldos.length >= this.obtenerCantidadRegistrosMax();
    });
  }

  public eliminar(indice: number): void {
    this.exedeRegistros = false;
    this.actualizarDetalle108(null, indice);
  }

  private actualizarDetalle108(data: DetalleCas108[], index: number) {
    data !== null ? this.saldos = data : this.saldos.splice(index, 1);
    this.calcularMontos();
    this.rerender();
  }

  private obtenerCantidadRegistrosMax(): number {
    if (this.rdtArrastrePeriodoAnterior === this.arrastreB) {
      return Number(this.anio) - 2002;
    } else {
      return this.cantidadMaxima;
    }
  }

  private permiteRegistrar(): boolean {
    return this.rdtArrastrePeriodoAnterior === this.arrastreA && Number(this.casilla106) > 0 &&
      Number(this.casillaCP) > Number(this.casilla106)
      ||
      this.rdtArrastrePeriodoAnterior === this.arrastreB && Number(this.casilla106) > 0 &&
      Number(this.casillaCP) > Number(0.5 * Number(this.casilla106));
  }

  public calcularMontos(): void {
    this.casillaSP = this.saldos.reduce((total, montos) => total + Number(montos.casillaPerdidas.mtoLiteral), 0);
    this.casillaCP = this.saldos.reduce((total, montos) => total + Number(montos.casillaCompensacion.mtoLiteral), 0);
  }

  public grabar(): void {
    if (this.permiteRegistrar() && this.rdtArrastrePeriodoAnterior === this.arrastreA) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS22_EX04, 'Mensaje');
    } else if (this.permiteRegistrar() && this.rdtArrastrePeriodoAnterior === this.arrastreB) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS22_EX05, 'Mensaje');
    } else {
      const listaCasilla108: ImpRtaEmpresaModelCas108[] = [];
      this.saldos.forEach(x => {
        listaCasilla108.push(x.casillaPerdidas);
        listaCasilla108.push(x.casillaCompensacion);
      });
      this.datosCasilla.emit(listaCasilla108);
      this.activeModal.close();
    }
  }

}
