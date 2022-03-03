import { Component, OnInit } from '@angular/core';
import { EstFinActivoImportarComponent } from '../importar/importar.component';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { AbrirModalService } from '@rentas/shared/core';
import { FormulasService } from '@path/juridico/services/formulas.service';
import { ConstantesIdentificacion } from '@path/juridico/utils/constantesIdentificacion';

@Component({
  selector: 'app-eamain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class EstFinActivoMainComponent implements OnInit {

  public anioEjercicio: string;

  constructor(private abrirModalService: AbrirModalService,
    private preDeclaracionService: PreDeclaracionService,
    public fs: FormulasService) { }

  public ngOnInit(): void {
    this.anioEjercicio = this.preDeclaracionService.obtenerNumeroEjercicio();
    this.fs.validarFormatoCasilla390();

    if (this.validarMontosAnteriores()) {
      this.persistirPreDeclaracion(true);
    }
  }

  private validarMontosAnteriores(): boolean {
    return this.validarMayor0(this.fs.ganancia.mtoCas461) || this.validarMayor0(this.fs.ganancia.mtoCas462)
      || this.validarMayor0(this.fs.ganancia.mtoCas473) || this.validarMayor0(this.fs.ganancia.mtoCas475)
      || this.validarMayor0(this.fs.ganancia.mtoCas477) || this.validarMayor0(this.fs.ganancia.mtoCas433)
      || this.validarMayor0(this.fs.ganancia.mtoCas487) || this.validarMayor0(this.fs.ganancia.mtoCas489);
  }

  private validarMayor0(monto): boolean {
    return !this.fs.funcionesGenerales.isNullNumber(monto) && Number(monto) > 0;
  }

  public importar() {
    const modalRef = this.abrirModalService.abrirModal(EstFinActivoImportarComponent);
    modalRef.componentInstance.outData.subscribe(lista => {
      lista.forEach(e => this.fs.activoEmp[`mtoCas${e.casilla}`] = e.monto);
      this.fs.calcularTotalActivoNeto();
    });
  }

  private persistirPreDeclaracion(recalculoAuto: boolean) {
    if (Number(this.fs.casInformativa.mtoCas217) === Number(ConstantesIdentificacion.INAFECTO_NO)) {
      this.fs.calcularUtilidadAdicionesYDeducciones(recalculoAuto);
    }
  }
}
