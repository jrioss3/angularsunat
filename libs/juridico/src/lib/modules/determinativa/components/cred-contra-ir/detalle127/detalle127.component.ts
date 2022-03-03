import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { Detalle297Component } from '../../detalle297/detalle297.component';
import { MensajeGenerales } from '@rentas/shared/constantes';
import { CasillasUtil, SessionStorage } from '@rentas/shared/utils';
import { AbrirModalService, CasillaService, ModalConfirmarService } from '@rentas/shared/core';
import { DetCredImpuestoRtaModelCas297 } from '@path/juridico/models/SeccionDeterminativa/detCredImpuestoRtaModel';
import { FormulasService } from '@path/juridico/services/formulas.service';
import { PreDeclaracionModel } from '@path/juridico/models';

@Component({
  selector: 'app-detalle127',
  templateUrl: './detalle127.component.html',
  styleUrls: ['./detalle127.component.css'],
})
export class Detalle127Component extends CasillasUtil implements OnInit {

  @Input() inputDataCasilla: any;
  @Output() datosCasilla = new EventEmitter<any>();
  public casilla202: number;
  public casilla203: number;
  public casilla204: number;
  public casilla127: number;
  public casilla297: number;
  private deudas: DetCredImpuestoRtaModelCas297[];
  public anio: number;
  public casillaCalculada = this.CODIGO_TIPO_CASILLA_CALCULADA;
  public casillaAsistente = this.CODIGO_TIPO_CASILLA_CON_ASISTENTE;
  public codigoCasilla202 = 202;
  public codigoCasilla203 = 203;
  public codigoCasilla204 = 204;
  public codigoCasilla297 = 297;
  public codigoCasilla127 = 127;
  public filaAsistente: any;

  constructor(
    public activeModal: NgbActiveModal,
    private preDeclaracionservice: PreDeclaracionService,
    private abrirModalService: AbrirModalService,
    private casillaService: CasillaService,
    private modalMensejaService: ModalConfirmarService) {
    super();
  }

  public ngOnInit(): void {
    this.anio = Number(this.preDeclaracionservice.obtenerNumeroEjercicio());
    const predDeclaracion =  SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.seccDeterminativa;
    this.filaAsistente = this.inputDataCasilla?.filasAsistente || [];
    this.casilla202 = predDeclaracion.credImpuestoRta.credImprenta.mtoCas202;
    this.casilla203 = predDeclaracion.credImpuestoRta.credImprenta.mtoCas203;
    this.casilla204 = predDeclaracion.credImpuestoRta.credImprenta.mtoCas204;
    this.casilla297 = predDeclaracion.credImpuestoRta.credImprenta.mtoCas297;
    this.deudas = predDeclaracion.credImpuestoRta.casilla297.lisCasilla297;
    this.calculo127();
  }

  public calculo127(): void {
    this.casilla127 = Number(this.casilla202) - (Number(this.casilla203) + Number(this.casilla204) + Number(this.casilla297));
  }

  public asistenteCasilla297() {
    const modal = this.abrirModalService.abrirModal(Detalle297Component, { size: 'lg', windowClass: 'custom-class' });
    modal.componentInstance.inputDeudas = this.deudas;
    modal.componentInstance.datosCasilla297.subscribe($e => {
      this.casilla297 = $e.casilla297;
      this.deudas = $e.listaCas297;
      this.calculo127();
    });
  }

  public guardar127(): void {
    if (this.casilla127 >= 0) {
      this.datosCasilla.emit({
        casilla202: this.casilla202,
        casilla203: this.casilla203,
        casilla204: this.casilla204,
        total: this.casilla127,
        casilla297: this.casilla297,
        listaDeudas: this.deudas
      });
      this.activeModal.close();
    } else {
      this.modalMensejaService.msgValidaciones(this.getDescripcionFilaAsistente(297) ? MensajeGenerales.CUS13_EX01 + ' + casilla 297' : MensajeGenerales.CUS13_EX01, 'Mensaje');
    }
  }

  public getDescripcionFilaAsistente(codigo: number): string {
    const descripcion = this.casillaService.filtrarFilaAsistentePorCodigoFila(String(codigo), this.filaAsistente);
    return descripcion
      .replace('AAAA-1', String(Number(this.anio) - 1))
      .replace('AAAA+1', String(Number(this.anio) + 1))
      .replace('AAAA', String(this.anio));
  }

  public existeCodFilaAsistente(codigo: number): boolean {
    const data = this.filaAsistente.find((item) => item.codFila === String(codigo));
    return data?.codFila ? true : false;
  }
}
