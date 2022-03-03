import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { DetCredImpuestoRtaModelCas130 } from '@path/juridico/models/SeccionDeterminativa/detCredImpuestoRtaModel';
import { ConstantesParametros } from '@rentas/shared/constantes';
import { FuncionesGenerales, CasillasUtil, SessionStorage } from '@rentas/shared/utils';
import { PreDeclaracionModel } from '@path/juridico/models';
import { Casilla, FilasAsistente } from '@rentas/shared/types';
import { CredContraImpRentaImportarComponent } from '../importar/importar.component';
import { AbrirModalService } from '@rentas/shared/core';

@Component({
  selector: 'app-detalle130',
  templateUrl: './detalle130.component.html',
  styleUrls: ['./detalle130.component.css']
})
export class Detalle130Component extends CasillasUtil implements OnInit {

  @Input() inputDataCasilla: Casilla;
  @Output() datosCasilla = new EventEmitter<any>();
  public inputListaMontos130: DetCredImpuestoRtaModelCas130[];
  private funcionesGenerales = FuncionesGenerales.getInstance();
  public resultado130: number;
  public anio: number;
  public maxvalue = 12;
  public minvalue = 0;
  public casillaCalculada = this.CODIGO_TIPO_CASILLA_CALCULADA;
  private filaAsistente: FilasAsistente[];

  constructor(
    public activeModal: NgbActiveModal,
    private abrirModalService: AbrirModalService,
    private preDeclaracionservice: PreDeclaracionService) {
    super();
  }

  public ngOnInit(): void {
    this.anio = Number(this.preDeclaracionservice.obtenerNumeroEjercicio());
    this.filaAsistente = this.inputDataCasilla?.filasAsistente || [];
    this.inputListaMontos130 = SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.seccDeterminativa.credImpuestoRta.casilla130.lisCasilla130;
    if (this.inputListaMontos130.length === 0 || this.inputListaMontos130.length < this.filaAsistente.length) {
      this.inputListaMontos130 = this.filaAsistente.map(item => {
        const cas = item.descripcion.replace('-', '');
        const valor = this.inputListaMontos130.find(x => x.desValLiteral === cas)?.mtoLiteral;
        return {
          numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
          desValLiteral: cas,
          mtoLiteral: valor ?? null
        }
      });
    }
    this.filtrarLista();
    this.inputListaMontos130 = this.eliminarCasillasDuplicadas(this.inputListaMontos130);
    this.calculo130();
  }

  private filtrarLista(): void {
    const primerosPeriodos = this.inputListaMontos130.filter(x => x.desValLiteral.substring(2) === String(this.anio));
    const ultimosPeriodos = this.inputListaMontos130.filter(x => x.desValLiteral.substring(2) === String(this.anio + 1));
    primerosPeriodos.sort(this.orderListaCasilla);
    ultimosPeriodos.sort(this.orderListaCasilla);
    this.inputListaMontos130 = primerosPeriodos.concat(ultimosPeriodos);
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

  private eliminarCasillasDuplicadas(listaCasillas: Array<DetCredImpuestoRtaModelCas130>):
    Array<DetCredImpuestoRtaModelCas130> {
    const listaFiltrada = Array.from(new Set(listaCasillas.map(x => x.desValLiteral)))
      .map(y => listaCasillas.find(x => x.desValLiteral === y));
    return listaFiltrada;
  }

  public importar130(): void {
    const importar = {
      titulo: 'Importar Detalle de Casilla 130'
    };
    const modalRef = this.abrirModalService.abrirModal(CredContraImpRentaImportarComponent);
    modalRef.componentInstance.casilla = '130';
    modalRef.componentInstance.importar = importar;
    modalRef.componentInstance.outDataC130.subscribe(lista => {
      this.inputListaMontos130.forEach((periodo, i) => {
        periodo.mtoLiteral = this.validarCasillas(lista[i].montoRetencion, periodo.mtoLiteral);
      });
      this.calculo130();
    });
  }

  private validarCasillas(valor: any, valorInicial: number): number {
    return valor ? (this.validarMontos(valor) ? valor : valorInicial) : valorInicial;
  }

  private validarMontos(valor: any): boolean {
    return this.funcionesGenerales.isNumber(valor) && valor.toString().length <= 12 && valor >= 0;
  }

  public calculo130(): void {
    this.resultado130 = this.inputListaMontos130.reduce((carry, item) => {
      return carry + Number(item.mtoLiteral ?? 0);
    }, 0);
  }

  public guardar130(): void {
    this.datosCasilla.emit({ lista: this.inputListaMontos130, total: this.resultado130 });
    this.activeModal.close();
  }
}
