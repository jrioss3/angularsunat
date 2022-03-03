import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '@path/natural/services/preDeclaracion.service';
import { InfExoneradoInafModel } from '@path/natural/models/SeccionInformativa/InfOtrosIngresosModel';
import { PreDeclaracionModel } from '@path/natural/models';
import { SessionStorage, CasillasUtil } from '@rentas/shared/utils';
import { CasillaService } from '@rentas/shared/core';

@Component({
  selector: 'app-rentas-inafectas',
  templateUrl: './rentas-inafectas.component.html',
  styleUrls: ['./rentas-inafectas.component.css']
})
export class RentasInafectasComponent extends CasillasUtil implements OnInit {

  private listInafecta: InfExoneradoInafModel[];
  private CODIGOTIPORENTA = '2';
  public VALOR_A = 'A';
  public VALOR_B = 'B';
  public VALOR_C = 'C';
  public VALOR_D = 'D';
  public VALOR_E = 'E';
  public VALOR_F = 'F';
  public VALOR_G = 'G';
  public VALOR_H = 'H';
  public VALOR_I = 'i';
  public inafectA: InfExoneradoInafModel;
  public inafectB: InfExoneradoInafModel;
  public inafectC: InfExoneradoInafModel;
  public inafectD: InfExoneradoInafModel;
  public inafectE: InfExoneradoInafModel;
  public inafectF: InfExoneradoInafModel;
  public inafectG: InfExoneradoInafModel;
  public inafectH: InfExoneradoInafModel;
  public sumatotal: number;
  @Input() inputFilasAsistente: any;
  @Output() datosCasilla = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private preDeclaracionService: PreDeclaracionService,
    private casillaService: CasillaService) { 
      super();
    }

  ngOnInit(): void {
    this.listInafecta = SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.seccInformativa.exoneradaInafecta.lisExonInaf;
    const listaInafectas = this.listInafecta.filter(x => (x.codTipRenta === this.CODIGOTIPORENTA));
    if (listaInafectas.length > 0) {
      this.inafectA = listaInafectas.find(x => x.desValLiteral === this.VALOR_A);
      this.inafectB = listaInafectas.find(x => x.desValLiteral === this.VALOR_B);
      this.inafectC = listaInafectas.find(x => x.desValLiteral === this.VALOR_C);
      this.inafectD = listaInafectas.find(x => x.desValLiteral === this.VALOR_D);
      this.inafectE = listaInafectas.find(x => x.desValLiteral === this.VALOR_E);
      this.inafectF = listaInafectas.find(x => x.desValLiteral === this.VALOR_F);
      this.inafectG = listaInafectas.find(x => x.desValLiteral === this.VALOR_G);
      this.inafectH = listaInafectas.find(x => x.desValLiteral === this.VALOR_H);
    } else {
      this.inafectA = {
        codTipRenta: this.CODIGOTIPORENTA,
        desValLiteral: this.VALOR_A,
        mtoRtasExon: null
      };
      this.inafectB = {
        codTipRenta: this.CODIGOTIPORENTA,
        desValLiteral: this.VALOR_B,
        mtoRtasExon: null
      };
      this.inafectC = {
        codTipRenta: this.CODIGOTIPORENTA,
        desValLiteral: this.VALOR_C,
        mtoRtasExon: null
      };
      this.inafectD = {
        codTipRenta: this.CODIGOTIPORENTA,
        desValLiteral: this.VALOR_D,
        mtoRtasExon: null
      };
      this.inafectE = {
        codTipRenta: this.CODIGOTIPORENTA,
        desValLiteral: this.VALOR_E,
        mtoRtasExon: null
      };
      this.inafectF = {
        codTipRenta: this.CODIGOTIPORENTA,
        desValLiteral: this.VALOR_F,
        mtoRtasExon: null
      };
      this.inafectG = {
        codTipRenta: this.CODIGOTIPORENTA,
        desValLiteral: this.VALOR_G,
        mtoRtasExon: null
      };
      this.inafectH = {
        codTipRenta: this.CODIGOTIPORENTA,
        desValLiteral: this.VALOR_H,
        mtoRtasExon: null
      };
      // push
      this.listInafecta.push(this.inafectA);
      this.listInafecta.push(this.inafectB);
      this.listInafecta.push(this.inafectC);
      this.listInafecta.push(this.inafectD);
      this.listInafecta.push(this.inafectE);
      this.listInafecta.push(this.inafectF);
      this.listInafecta.push(this.inafectG);
      this.listInafecta.push(this.inafectH);
    }
    this.sumRentasExoneradas();
  }

  public sumRentasExoneradas(): void {
    this.sumatotal = Number(this.inafectA.mtoRtasExon) + Number(this.inafectB.mtoRtasExon) +
      Number(this.inafectC.mtoRtasExon) + Number(this.inafectD.mtoRtasExon) + Number(this.inafectE.mtoRtasExon) +
      Number(this.inafectF.mtoRtasExon) + Number(this.inafectG.mtoRtasExon) + Number(this.inafectH.mtoRtasExon);
  }

  public guardar(): void {
    this.datosCasilla.emit({ sumaCasilla201: this.sumatotal, listInafecta: this.listInafecta });
    this.activeModal.close();
  }

  public existeCodFilaAsistente(codigo: string): boolean {
    const data = this.inputFilasAsistente.find((item) => item.codFila === codigo);
    return data?.codFila ? true : false;
  }

  public getDescripcionFilaAsistente(codigo: string): string {
    return this.casillaService.filtrarFilaAsistentePorCodigoFila(codigo, this.inputFilasAsistente);
  }
}
