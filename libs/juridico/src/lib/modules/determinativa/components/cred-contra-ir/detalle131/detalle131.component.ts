import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { DetCredImpuestoRtaModelCas131 } from '@path/juridico/models/SeccionDeterminativa/detCredImpuestoRtaModel';
import { ConstantesParametros } from '@rentas/shared/constantes';
import { CasillasUtil, SessionStorage } from '@rentas/shared/utils';
import { PreDeclaracionModel } from '@path/juridico/models';
import { Casilla, FilasAsistente } from '@rentas/shared/types';

@Component({
  selector: 'app-detalle131',
  templateUrl: './detalle131.component.html',
  styleUrls: ['./detalle131.component.css']
})
export class Detalle131Component extends CasillasUtil implements OnInit {

  @Output() datosCasilla = new EventEmitter<any>();
  @Input() inputDataCasilla: Casilla;
  public inputListaMontos131: DetCredImpuestoRtaModelCas131[];
  public resultado131: number;
  private anio: number;
  public maxvalue = 12;
  public minvalue = 0;
  public casillaCalculada = this.CODIGO_TIPO_CASILLA_CALCULADA;
  private filaAsistente: FilasAsistente[];

  constructor(
    public activeModal: NgbActiveModal,
    private preDeclaracionservice: PreDeclaracionService) { 
      super();
    }

  public ngOnInit(): void {
    this.anio = Number(this.preDeclaracionservice.obtenerNumeroEjercicio());
    this.filaAsistente = this.inputDataCasilla?.filasAsistente || [];
    this.inputListaMontos131 = SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.seccDeterminativa.credImpuestoRta.casilla131.lisCasilla131;
    if(this.inputListaMontos131.length === 0 || this.inputListaMontos131.length < this.filaAsistente.length) {
      this.inputListaMontos131 = this.filaAsistente.map( item => {
       const cas = item.descripcion.replace('-','');
       const valor = this.inputListaMontos131.find( x => x.desValLiteral === cas)?.mtoLiteral;
        return {
         numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
         desValLiteral: cas,
         mtoLiteral: valor ?? null
        }
      });
    }
    this.filtrarLista();
    this.inputListaMontos131 = this.eliminarCasillasDuplicadas(this.inputListaMontos131);
    this.calculo131();
  }

  private filtrarLista(): void {
    const primerosPeriodos = this.inputListaMontos131.filter(x => x.desValLiteral.substring(2) === String(this.anio));
    const ultimosPeriodos = this.inputListaMontos131.filter(x => x.desValLiteral.substring(2) === String(this.anio + 1));
    primerosPeriodos.sort(this.orderListaCasilla);
    ultimosPeriodos.sort(this.orderListaCasilla);
    this.inputListaMontos131 = primerosPeriodos.concat(ultimosPeriodos);
  }

  private orderListaCasilla(x: any, y: any): number {
    if (x.desValLiteral > y.desValLiteral) {
      return 1;
    }
    if (x.desValLiteral < y.desValLiteral) {
      return -1;
    }
    return 0;
  }

  private eliminarCasillasDuplicadas(listaCasillas: Array<DetCredImpuestoRtaModelCas131>):
    Array<DetCredImpuestoRtaModelCas131> {
    const listaFiltrada = Array.from(new Set(listaCasillas.map(x => x.desValLiteral)))
      .map(y => listaCasillas.find(x => x.desValLiteral === y));
    return listaFiltrada;
  }

  public calculo131(): void {
    this.resultado131 = this.inputListaMontos131.reduce((carry, item) => {
      return carry + Number(item.mtoLiteral ?? 0);
    }, 0);
  }

  public guardar131(): void {
    this.datosCasilla.emit({ lista: this.inputListaMontos131, total: this.resultado131 });
    this.activeModal.close();
  }

}
