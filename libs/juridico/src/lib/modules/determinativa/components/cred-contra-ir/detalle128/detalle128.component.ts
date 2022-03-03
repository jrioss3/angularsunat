import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { DetCredImpuestoRtaModelCas128 } from '@path/juridico/models/SeccionDeterminativa/detCredImpuestoRtaModel';
import { CredContraImpRentaImportarComponent } from '../importar/importar.component';
import { ConstantesParametros } from '@rentas/shared/constantes';
import { FuncionesGenerales, CasillasUtil, SessionStorage } from '@rentas/shared/utils';
import { PreDeclaracionModel } from '@path/juridico/models';
import { Casilla, FilasAsistente } from '@rentas/shared/types';
import { AbrirModalService } from '@rentas/shared/core';

@Component({
  selector: 'app-detalle128',
  templateUrl: './detalle128.component.html',
  styleUrls: ['./detalle128.component.css']
})
export class Detalle128Component extends CasillasUtil implements OnInit {

  @Input() inputDataCasilla: Casilla;
  @Output() datosCasilla = new EventEmitter<any>();
  private inputListaMontos128: DetCredImpuestoRtaModelCas128[];
  public listaCasilla128: any[];
  private funcionesGenerales: FuncionesGenerales;
  private anio: number;
  public casilla128: number;
  public maximo = 12;
  public minimo = 0;
  public casillaCalculada = this.CODIGO_TIPO_CASILLA_CALCULADA;
  private filaAsistente: FilasAsistente[];

  constructor(
    public activeModal: NgbActiveModal,
    private preDeclaracionservice: PreDeclaracionService,
    private abrirModalService: AbrirModalService) {
    super();
  }

  public ngOnInit(): void {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.anio = Number(this.preDeclaracionservice.obtenerNumeroEjercicio());
    this.filaAsistente = this.inputDataCasilla?.filasAsistente || [];
    this.inputListaMontos128 = SessionStorage.getPreDeclaracion<PreDeclaracionModel>()
      .declaracion.seccDeterminativa.credImpuestoRta.casilla128.lisCasilla128;
    this.listaCasilla128 = this.filaAsistente.map(item => {
      const cas = item.descripcion.replace('-', '');
      const hijos = this.crearHijos(cas);
      return {
        numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
        desValLiteral: cas,
        totalPadre: hijos.reduce((suma, total) => suma + Number(total.mtoLiteral), 0),
        listaTipos: hijos
      }
    });
    this.filtrarLista();
    this.calculo128();
  }

  private crearHijos(cas): any[] {
    const listaHijos = [];
    for (let index = 1; index < 6; index++) {
      const valor = this.inputListaMontos128.find(x => x.desValLiteral === cas && x.codTipMto === String(index))?.mtoLiteral;
      const obj = {
        codTipMto: String(index),
        mtoLiteral: valor ?? null
      }
      listaHijos.push(obj);
    }
    return listaHijos;
  }

  private filtrarLista(): void {
    let primerosPeriodos = this.inputListaMontos128.filter(x => x.desValLiteral.substring(2) === String(this.anio));
    let ultimosPeriodos = this.inputListaMontos128.filter(x => x.desValLiteral.substring(2) === String(this.anio + 1));
    primerosPeriodos.sort(this.orderListaCasilla);
    ultimosPeriodos.sort(this.orderListaCasilla);
    primerosPeriodos = Array.from(new Set(primerosPeriodos.map(x => Number(x.desValLiteral) + Number(x.codTipMto))))
      .map(y => primerosPeriodos.find(x => Number(x.desValLiteral) + Number(x.codTipMto) === y));
    ultimosPeriodos = Array.from(new Set(ultimosPeriodos.map(x => Number(x.desValLiteral) + Number(x.codTipMto))))
      .map(y => ultimosPeriodos.find(x => Number(x.desValLiteral) + Number(x.codTipMto) === y));
    this.inputListaMontos128 = primerosPeriodos.concat(ultimosPeriodos);
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

  public importar128(): void {
    const importar = {
      titulo: 'Importar Detalle de Casilla 128'
    };
    const modalRef = this.abrirModalService.abrirModal(CredContraImpRentaImportarComponent);
    modalRef.componentInstance.casilla = '128';
    modalRef.componentInstance.importar = importar;
    modalRef.componentInstance.outData.subscribe(lista => {
      this.listaCasilla128.forEach((elemento, i) => {
        elemento.listaTipos[0].mtoLiteral = this.validarCasillas(lista[i].utilizacionSaldoAFavor, elemento.listaTipos[0].mtoLiteral);
        elemento.listaTipos[1].mtoLiteral = this.validarCasillas(lista[i].compensacionSFMB, elemento.listaTipos[1].mtoLiteral);
        elemento.listaTipos[2].mtoLiteral = this.validarCasillas(lista[i].compensacionITAN, elemento.listaTipos[2].mtoLiteral);
        elemento.listaTipos[3].mtoLiteral = this.validarCasillas(lista[i].otrosCreditos, elemento.listaTipos[3].mtoLiteral);
        elemento.listaTipos[4].mtoLiteral = this.validarCasillas(lista[i].montoPagado, elemento.listaTipos[4].mtoLiteral);
      })
      this.calculo128();
    });
  }

  private validarMonto(valor: any): boolean {
    return this.funcionesGenerales.isNumber(valor) && valor.toString().length <= 12 && valor >= 0;
  }

  private validarCasillas(valor: any, montoOriginal: number): number {
    return valor ? (this.validarMonto(valor) ? valor : montoOriginal) : montoOriginal;
  }

  public calcularPadre(padre): void {
    padre.totalPadre = padre.listaTipos.reduce((suma, elemento) => suma + Number(elemento.mtoLiteral), 0);
    this.calculo128();
  }

  private calculo128() {
    this.casilla128 = this.listaCasilla128.reduce((suma, elemento) => suma + Number(elemento.totalPadre), 0)
  }

  public guardar128(): void {
    this.inputListaMontos128 = this.listaCasilla128.flatMap(elemento => elemento.listaTipos.map(ele => ({ ...ele, numFormul: elemento.numFormul, desValLiteral: elemento.desValLiteral })))
    this.datosCasilla.emit({ lista: this.inputListaMontos128, total: this.casilla128 });
    this.activeModal.close();
  }
}
