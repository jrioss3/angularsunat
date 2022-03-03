import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InfExoneradoInafModel } from '@path/natural/models/SeccionInformativa/InfOtrosIngresosModel';
import { PreDeclaracionModel } from '@path/natural/models';
import { SessionStorage, CasillasUtil } from '@rentas/shared/utils';
import { PreDeclaracionService } from '@path/natural/services';
import { CasillaService } from '@rentas/shared/core';

@Component({
  selector: 'app-rentas-exoneradas',
  templateUrl: './rentas-exoneradas.component.html',
  styleUrls: ['./rentas-exoneradas.component.css']
})
export class RentasExoneradasComponent extends CasillasUtil implements OnInit {
  @Input() inputFilasAsistente: any;
  @Output() datosCasilla = new EventEmitter<any>();
  private listExonerada: InfExoneradoInafModel[];
  private CODIGOTIPORENTA = '1';
  public VALOR_A = 'A';
  public VALOR_B = 'B';
  public VALOR_C = 'C';
  public VALOR_D = 'D';
  public VALOR_E = 'e';
  public inafectA: InfExoneradoInafModel;
  public inafectB: InfExoneradoInafModel;
  public inafectC: InfExoneradoInafModel;
  public inafectD: InfExoneradoInafModel;
  public sumatotal: number;

  constructor(
    public activeModal: NgbActiveModal,
    private preDeclaracionService: PreDeclaracionService,
    private casillaService: CasillaService) { 
      super();
    }

  ngOnInit(): void {
    this.listExonerada = SessionStorage.getPreDeclaracion<PreDeclaracionModel>().declaracion.seccInformativa.exoneradaInafecta.lisExonInaf;
    const listaExoneradas = this.listExonerada.filter(x => (x.codTipRenta === this.CODIGOTIPORENTA));
    if (listaExoneradas.length > 0) {
      this.inafectA = listaExoneradas.find(x => x.desValLiteral === this.VALOR_A);
      this.inafectB = listaExoneradas.find(x => x.desValLiteral === this.VALOR_B);
      this.inafectC = listaExoneradas.find(x => x.desValLiteral === this.VALOR_C);
      this.inafectD = listaExoneradas.find(x => x.desValLiteral === this.VALOR_D);
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
      this.listExonerada.push(this.inafectA);
      this.listExonerada.push(this.inafectB);
      this.listExonerada.push(this.inafectC);
      this.listExonerada.push(this.inafectD);
    }
    this.sumRentasExoneradas();
  }

  public sumRentasExoneradas(): void {
    this.sumatotal = Number(this.inafectA.mtoRtasExon) + Number(this.inafectB.mtoRtasExon) +
      Number(this.inafectC.mtoRtasExon) + Number(this.inafectD.mtoRtasExon);
  }

  public guardar(): void {
    this.datosCasilla.emit({ sumaCasilla200: this.sumatotal, listExonerada: this.listExonerada });
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
