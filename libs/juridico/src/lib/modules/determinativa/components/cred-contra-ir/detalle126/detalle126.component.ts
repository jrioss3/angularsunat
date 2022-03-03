import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { DetCredImpuestoRtaModelCas126 } from '@path/juridico/models/SeccionDeterminativa/detCredImpuestoRtaModel';
import { ConstantesParametros } from '@rentas/shared/constantes';
import { CasillasUtil , SessionStorage } from '@rentas/shared/utils';
import { PreDeclaracionModel } from '@path/juridico/models';
import { Casilla, FilasAsistente } from '@rentas/shared/types';

@Component({
  selector: 'app-detalle126',
  templateUrl: './detalle126.component.html',
  styleUrls: ['./detalle126.component.css']
})
export class Detalle126Component extends CasillasUtil implements OnInit {

  @Output() datosCasilla = new EventEmitter<any>();
  @Input() inputDataCasilla: Casilla;
  public inputListaMontos126: DetCredImpuestoRtaModelCas126[];
  public resultado126: number;
  private anio: number;
  public maximo = 12;
  public minimo = 0;
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
    this.inputListaMontos126 = SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.seccDeterminativa.credImpuestoRta.casilla126.lisCasilla126;
    if(this.inputListaMontos126.length === 0 || this.inputListaMontos126.length < this.filaAsistente.length) {
     this.inputListaMontos126 = this.filaAsistente.map( item => {
      const cas = item.descripcion.replace('-','');
      const valor = this.inputListaMontos126.find( x => x.desValLiteral === cas)?.mtoLiteral;
       return {
        numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
        desValLiteral: cas,
        mtoLiteral: valor ?? null
       }
     });
    }
    this.filtrarLista();
    this.inputListaMontos126 = this.eliminarCasillasDuplicadas(this.inputListaMontos126);
    this.calculo126();
  }

  private filtrarLista(): void {
    const primerosPeriodos = this.inputListaMontos126.filter(x => x.desValLiteral.substring(2) === String(this.anio));
    const ultimosPeriodos = this.inputListaMontos126.filter(x => x.desValLiteral.substring(2) === String(this.anio + 1));
    primerosPeriodos.sort(this.orderListaCasilla);
    ultimosPeriodos.sort(this.orderListaCasilla);
    this.inputListaMontos126 = primerosPeriodos.concat(ultimosPeriodos);
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

  private eliminarCasillasDuplicadas(listaCasillas: Array<DetCredImpuestoRtaModelCas126>):
    Array<DetCredImpuestoRtaModelCas126> {
    const listaFiltrada = Array.from(new Set(listaCasillas.map(x => x.desValLiteral)))
      .map(y => listaCasillas.find(x => x.desValLiteral === y));
    return listaFiltrada;
  }

  public calculo126(): void {
    this.resultado126 = this.inputListaMontos126.reduce((carry, item) => {
      return carry + Number(item.mtoLiteral ?? 0);
    }, 0);
  }

  public guardar126(): void {
    this.datosCasilla.emit({ lista: this.inputListaMontos126, total: this.resultado126 });
    this.activeModal.close();
  }

}
