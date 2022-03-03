import { Component, OnInit } from '@angular/core';
import { PreDeclaracionModel } from '@path/juridico/models/preDeclaracionModel';
import { PagosPreviosService, ModalConfirmarService, AbrirModalService } from '@rentas/shared/core';
import { Detalle144Component } from '../detalle144/detalle144.component';
import { DeudaPagosPreviosModel } from '@path/juridico/models/SeccionDeterminativa/detDeterminacionDeudaModel';
import { MensajeGenerales } from '@rentas/shared/constantes';
import { SessionStorage } from '@rentas/shared/utils';
import { ConstantesTributos } from '@rentas/shared/constantes';
import { ListaParametro } from '@rentas/shared/types';
import { FormulasService } from '@path/juridico/services/formulas.service';

@Component({
  selector: 'app-determina-deuda',
  templateUrl: './determina-deuda.component.html',
  styleUrls: ['./determina-deuda.component.css'],
})
export class DeterminaDeudaComponent implements OnInit {

  private preDeclaracion: PreDeclaracionModel;
  public casilla137Readonly = true;
  private listaPagosPrevios: DeudaPagosPreviosModel[];
  public listaOpcionesCas137: ListaParametro[];

  constructor(
    public fs: FormulasService,
    private abrirModalService: AbrirModalService,
    private modalMensejaService: ModalConfirmarService,
    private pagosPreviosService: PagosPreviosService) { }

  public ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    this.listaOpcionesCas137 = this.fs.comboService.obtenerComboPorNumero(this.fs.casilla137?.codParam ?? '');
    this.listaPagosPrevios = this.preDeclaracion.declaracion.determinacionDeuda.pagosPrevios.lisPagosPrevios;
    this.getPagosPrevios();
    this.fs.validarFormato141y145();
  }

  public abrirCasilla144(): void {
    const modalRef = this.abrirModalService.abrirModal(Detalle144Component, { size: 'lg' });
    modalRef.componentInstance.datosCasilla.subscribe(($resultado) => {
      this.fs.casDetDeudaPJ.mtoCas144 = $resultado.monto;
      this.fs.lista144.lisPagosPrevios = $resultado.lista;
      this.fs.calcularInteresMoratorio();
    });
  }

  public guardar137(): void {
    if (Number(this.fs.casDetDeudaPJ.mtoCas137) === 2) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.mensajeCasilla137, 'Mensaje');
    }
    SessionStorage.setPreDeclaracion(this.fs.preDeclaracion);
  }

  private getPagosPrevios(): void {
    this.pagosPreviosService.getPagosPrevios().subscribe(data => {
      this.actualizarPreDeclaracionPagosPrevios(data);
    });
  }

  private actualizarPreDeclaracionPagosPrevios(data): void {
    const pagosPreviosServicio = this.pagosPreviosService.obtenerPagosPreviosPorTributo(data, ConstantesTributos.RENTA_PERS_JUR.codigo);
    this.listaPagosPrevios = this.pagosPreviosService.obtenerListaFinalPagosPreviosPorTributo(this.listaPagosPrevios, ConstantesTributos.RENTA_PERS_JUR.codigo, pagosPreviosServicio);
    this.fs.casDetDeudaPJ.mtoCas144 = this.pagosPreviosService.obtenerMontoPagosPreviosPorTributo(this.listaPagosPrevios);
    this.fs.lista144.lisPagosPrevios = this.listaPagosPrevios;
    this.fs.calcularInteresMoratorio();
  }

  public habilitarCas137(): boolean {
    return Number(this.fs.casDetDeudaPJ.mtoCas138) > 0;
  }
}
