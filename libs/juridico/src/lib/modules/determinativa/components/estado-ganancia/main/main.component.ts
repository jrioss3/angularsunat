import { Component, OnInit } from '@angular/core';
import { EegImportarComponent } from '../importar/importar.component';
import { EegDetalleComponent } from '../detalle/detalle.component';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { MensajeGenerales } from '@rentas/shared/constantes';
import { AbrirModalService, ModalConfirmarService } from '@rentas/shared/core';
import { FormulasService } from '@path/juridico/services/formulas.service';

@Component({
  selector: 'app-eegmain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class EstFinEstadoGananciaMainComponent implements OnInit {

  public anioEjercicio: string;

  constructor(
    private abrirModalService: AbrirModalService,
    private preDeclaracionService: PreDeclaracionService,
    private modalMensejaService: ModalConfirmarService,
    public fs: FormulasService) { }

  public ngOnInit(): void {
    this.anioEjercicio = this.preDeclaracionService.obtenerNumeroEjercicio();

    if (this.fs.lista108.lisCasilla108.length !== 0) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.mensajeCasilla108Edit, 'Mensaje');
    }
  }

  public importar(): void {
    const modalRef = this.abrirModalService.abrirModal(EegImportarComponent);
    modalRef.componentInstance.outData.subscribe(lista => {
      lista.forEach(e => {
        this.fs.ganancia[`mtoCas${e.casilla}`] = e.monto;
      });
      this.fs.ganancia.mtoCas473 = this.fs.formulaCasilla473();
      this.fs.ganancia.mtoCas477 = this.fs.formulaCasilla477();
      this.fs.calcularVentasNetas();
    });
  }

  public asistenteCasillas(casilla: number): void {
    const params = this.generarDataCasillaAsistente(casilla);
    const modalRef = this.abrirModalService.abrirModal(EegDetalleComponent);
    modalRef.componentInstance.casilla = params;
    modalRef.componentInstance.inputMonto1 = (casilla === 473) ? this.fs.ganancia.mtoCas650 : this.fs.ganancia.mtoCas432;
    modalRef.componentInstance.inputMonto2 = (casilla === 473) ? this.fs.ganancia.mtoCas651 : this.fs.ganancia.mtoCas433;
    modalRef.componentInstance.respuestaAsistente.subscribe(($e) => {
      if ((casilla === 473)) {
        this.fs.ganancia.mtoCas473 = Number($e.resultado);
        this.fs.ganancia.mtoCas650 = Number($e.montoA);
        this.fs.ganancia.mtoCas651 = Number($e.montoB);
      } else if (casilla === 477) {
        this.fs.ganancia.mtoCas477 = Number($e.resultado);
        this.fs.ganancia.mtoCas432 = Number($e.montoA);
        this.fs.ganancia.mtoCas433 = Number($e.montoB);
      }
      this.fs.calcularVentasNetas();
    });
  }

  private generarDataCasillaAsistente(casilla: number) {
    return {
      titulo: (casilla === 473) ? this.fs.casilla473.descripcion : this.fs.casilla477.descripcion,
      dataCasilla: this.getDataCasillaAsistente(casilla),
      numero1: (casilla === 473) ? '650' : '432',
      numero2: (casilla === 473) ? '651' : '433'
    };
  }

  private getDataCasillaAsistente(casilla) {
    switch (String(casilla)) {
      case this.fs.casilla473?.numCas: return this.fs.casilla473;
      case this.fs.casilla477?.numCas: return this.fs.casilla477;
    }
  }
}
