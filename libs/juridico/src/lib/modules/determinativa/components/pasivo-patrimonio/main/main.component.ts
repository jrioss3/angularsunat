import { Component, OnInit } from '@angular/core';
import { EstFinPasivoImportarComponent } from '../importar/importar.component';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { ConstantesCadenas, MensajeGenerales } from '@rentas/shared/constantes';
import { AbrirModalService, ModalConfirmarService } from '@rentas/shared/core';
import { FormulasService } from '@path/juridico/services/formulas.service';

@Component({
  selector: 'app-epmain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class EstFinPasivoMainComponent implements OnInit {

  public anioEjercicio: string;

  constructor(
    private abrirModalService: AbrirModalService,
    public fs: FormulasService,
    private modalMensejaService: ModalConfirmarService,
    private preDeclaracionService: PreDeclaracionService) { }

  public ngOnInit(): void {
    this.anioEjercicio = this.preDeclaracionService.obtenerNumeroEjercicio();
    this.fs.validarFormatoCasilla425();
    this.fs.validarFormatoCasilla426();
  }

  public importar(): void {
    const modalRef = this.abrirModalService.abrirModal(EstFinPasivoImportarComponent);
    modalRef.componentInstance.outData.subscribe(lista => {
      lista.forEach(e => this.fs.pasivoPatrEmp[`mtoCas${e.casilla}`] = e.monto);
      this.fs.calcularTotalPasivo();
    });
  }

  public validarCampos416y417(numeroCasilla): void {
    if (this.validarMontosCondicionales(Number(this.fs.pasivoPatrEmp.mtoCas416), Number(this.fs.pasivoPatrEmp.mtoCas417))) {
      this.fs.calcularTotalPatrimonio();
    } else if (Number(this.fs.pasivoPatrEmp.mtoCas416) !== 0 && Number(this.fs.pasivoPatrEmp.mtoCas417) !== 0) {
      const mensajeModal = MensajeGenerales.CUS10_EX01.replace('{{monto1}}', '416').replace('{{monto2}}', '417').replace('{{montoSeleccionado}}', numeroCasilla);
      this.modalMensejaService.msgConfirmar(mensajeModal).subscribe(($e) => {
        if ($e === ConstantesCadenas.RESPUESTA_SI) {
          if ((numeroCasilla === '416')) {
            this.fs.pasivoPatrEmp.mtoCas417 = null;
          } else {
            this.fs.pasivoPatrEmp.mtoCas416 = null;
          }
        } else if ($e === ConstantesCadenas.RESPUESTA_NO) {
          if ((numeroCasilla === '416')) {
            this.fs.pasivoPatrEmp.mtoCas416 = null;
          } else {
            this.fs.pasivoPatrEmp.mtoCas417 = null;
          }
        }
        this.fs.calcularTotalPatrimonio();
      });
    }
  }

  public validarCampos421y422(numeroCasilla): void {
    if (this.validarMontosCondicionales(Number(this.fs.pasivoPatrEmp.mtoCas421), Number(this.fs.pasivoPatrEmp.mtoCas422))) {
      this.fs.calcularTotalPatrimonio();
    } else if (Number(this.fs.pasivoPatrEmp.mtoCas421) !== 0 && Number(this.fs.pasivoPatrEmp.mtoCas422) !== 0) {
      const mensajeModal = MensajeGenerales.CUS10_EX01.replace('{{monto1}}', '421').replace('{{monto2}}', '422').replace('{{montoSeleccionado}}', numeroCasilla);
      this.modalMensejaService.msgConfirmar(mensajeModal).subscribe(($e) => {
        if ($e === ConstantesCadenas.RESPUESTA_SI) {
          if ((numeroCasilla === '421')) {
            this.fs.pasivoPatrEmp.mtoCas422 = null;
          } else {
            this.fs.pasivoPatrEmp.mtoCas421 = null;
          }
        } else if ($e === ConstantesCadenas.RESPUESTA_NO) {
          if ((numeroCasilla === '421')) {
            this.fs.pasivoPatrEmp.mtoCas421 = null;
          } else {
            this.fs.pasivoPatrEmp.mtoCas422 = null;
          }
        }
        this.fs.calcularTotalPatrimonio();
      });
    }
  }

  public validarCampos423y424(numeroCasilla): void {
    if (this.validarMontosCondicionales(Number(this.fs.pasivoPatrEmp.mtoCas423), Number(this.fs.pasivoPatrEmp.mtoCas424))) {
      this.fs.calcularTotalPatrimonio();
    } else if (Number(this.fs.pasivoPatrEmp.mtoCas423) !== 0 && Number(this.fs.pasivoPatrEmp.mtoCas424) !== 0) {
      const mensajeModal = MensajeGenerales.CUS10_EX01.replace('{{monto1}}', '423').replace('{{monto2}}', '424').replace('{{montoSeleccionado}}', numeroCasilla);
      this.modalMensejaService.msgConfirmar(mensajeModal).subscribe(($e) => {
        if ($e === ConstantesCadenas.RESPUESTA_SI) {
          if (numeroCasilla === '423') {
            this.fs.pasivoPatrEmp.mtoCas424 = null;
          } else {
            this.fs.pasivoPatrEmp.mtoCas423 = null;
          }
        } else if ($e === ConstantesCadenas.RESPUESTA_NO) {
          if (numeroCasilla === '423') {
            this.fs.pasivoPatrEmp.mtoCas423 = null;
          } else {
            this.fs.pasivoPatrEmp.mtoCas424 = null;
          }
        }
        this.fs.calcularTotalPatrimonio();
      });
    }
  }

  private validarMontosCondicionales(monto1: number, monto2: number): boolean {
    return (monto1 >= 0 && (monto2 === 0 || monto2 == null)) || (monto2 >= 0 && (monto1 === 0 || monto1 == null))
  }
}
