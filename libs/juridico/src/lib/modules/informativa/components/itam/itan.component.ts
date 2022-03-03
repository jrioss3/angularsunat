import { Component, OnInit } from '@angular/core';
import { PreDeclaracionModel } from '@path/juridico/models';
import { DetCredImpuestoRtaModelCas131 } from '@path/juridico/models/SeccionDeterminativa/detCredImpuestoRtaModel';
import { ConstantesCadenas, MensajeGenerales } from '@rentas/shared/constantes';
import { CasillaService, ModalConfirmarService } from '@rentas/shared/core';
import { SessionStorage } from '@rentas/shared/utils';
import { ItanFormService } from './itan-form.service';

@Component({
  selector: 'rentas-itam',
  templateUrl: './itan.component.html',
  styleUrls: ['./itan.component.css'],
  providers: [ItanFormService]
})
export class ItanComponent implements OnInit {

  private preDeclaracion: PreDeclaracionModel;
  private lista131: DetCredImpuestoRtaModelCas131[];
  public casilla824 = this.casillaService.obtenerCasilla('824');

  constructor(public itanForm: ItanFormService,
    private modalMensejaService: ModalConfirmarService,
    private casillaService: CasillaService) { }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    let cas824 = String(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas824);
    this.lista131 = this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla131.lisCasilla131;
    this.itanForm.inicializarFormulario(cas824);
  }

  public seleccionarRespuesta(): void {
    if (this.itanForm.fieldRespuesta.value === '1') {
      this.actualizarPredeclaracion();
    } else {
      if (this.existenMontos131()) {
        this.tieneMontos131();
      } else {
        this.actualizarPredeclaracion();
      }
    }
  }

  private existenMontos131(): boolean {
    return this.lista131.some(x => {
      return x.mtoLiteral > 0;
    });
  }

  private tieneMontos131(): void {
    this.modalMensejaService.msgConfirmar(MensajeGenerales.mensajeItan).subscribe(($e) => {
      if ($e === ConstantesCadenas.RESPUESTA_SI) {
        this.lista131 = [];
        this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla131.lisCasilla131 = this.lista131;
        this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta.mtoCas131 = 0;
        this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta.mtoCas279 = 0;
        this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta.mtoCas783 = null;
        this.actualizarPredeclaracion();
      } else if ($e === ConstantesCadenas.RESPUESTA_NO) {
        this.itanForm.fieldRespuesta.setValue('1');
      }
    });
  }

  private actualizarPredeclaracion(): void {
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas824 = Number(this.itanForm.fieldRespuesta.value);
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

}
