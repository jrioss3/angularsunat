import { ComboService } from '@rentas/shared/core';
import { Injectable } from '@angular/core';
import { PreDeclaracionModel } from '../models/preDeclaracionModel';
import { SessionStorage } from '@rentas/shared/utils';
import { InteresMoratorioService } from 'libs/shared/core/src/lib/service/interes-moratorio.service';
import { Observable, of } from 'rxjs';
import { ConstantesTributos } from '@rentas/shared/constantes';



@Injectable({
  providedIn: 'root'
})
export class CalculoRentaTrabajoService {

  preDeclaracion: PreDeclaracionModel;
  valorUIT: number;

  constructor(
    private comboService: ComboService,
    private interesMoratorio: InteresMoratorioService
    ) { }

  calcularCasilla120(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.valorUIT = this.comboService.obtenerUitEjercicioActual();

    const montoCasilla517 = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas517);
    if (montoCasilla517 < 0) {
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas120 = 0;
    } else {
      let resultado: number;
      resultado = 0;
      // TRAMO I
      if ((5 * this.valorUIT) >= montoCasilla517) {
        resultado = (montoCasilla517 * 0.08);
      }
      // TRAMO II
      if (((5 * this.valorUIT) < montoCasilla517) && (montoCasilla517 <= (20 * this.valorUIT))) {
        resultado = ((montoCasilla517 - (5 * this.valorUIT)) * 0.14 + (5 * this.valorUIT) * 0.08);
      }
      // TRAMO III
      if (((20 * this.valorUIT) < montoCasilla517) && (montoCasilla517 <= (35 * this.valorUIT))) {
        resultado = ((montoCasilla517 - (20 * this.valorUIT)) * 0.17 + (15 * this.valorUIT) * 0.14 + (5 * this.valorUIT) * 0.08);
      }
      // TRAMO IV
      if (((35 * this.valorUIT) < montoCasilla517) && (montoCasilla517 <= (45 * this.valorUIT))) {
        resultado = ((montoCasilla517 - (35 * this.valorUIT)) * 0.20 + (15 * this.valorUIT) * 0.17 + (15 * this.valorUIT) * 0.14 +
          (5 * this.valorUIT) * 0.08);
      }
      // TRAMO V
      if ((45 * this.valorUIT) < montoCasilla517) {
        resultado = ((montoCasilla517 - (45 * this.valorUIT)) * 0.30 + (10 * this.valorUIT) * 0.20 + (15 * this.valorUIT) * 0.17 +
          (15 * this.valorUIT) * 0.14 + (5 * this.valorUIT) * 0.08);
      }
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas120 = Math.round(Number(resultado));
    }
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.calcularCasilla158();
  }

  calcularCasilla158(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();

    const resultado = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas120) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas122);

    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas158 = resultado < 0 ? 0 : resultado;

    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.calcularCasilla141y142();
  }

  calcularCasilla141y142(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();

    const resultado = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas120) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas122) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas125) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas127) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas128) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas130) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas131);

    if (resultado < 0) {
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas141 = Math.abs(resultado);
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas142 = 0;
    } else {
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas141 = 0;
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas142 = resultado;
    }

    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.calcularCasilla146();
  }

  calcularCasilla146() {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas145= this.calcularCasilla145();
    const resultado = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas142) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas144) +
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas145);

    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas146 = resultado < 0 ? 0 : resultado;

    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }  
	
  calcularCasilla145(): number {
    if (this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria === '0') {
      this.preDeclaracion = SessionStorage.getPreDeclaracion();
      const { mtoCas142, mtoCas144 } = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo;
      const monto = Number(mtoCas142) - Number(mtoCas144);
      if (monto > 0) {
        //console.log('cas145', this.interesMoratorio.getInteresMoratorioNatural(ConstantesTributos.RENTA_TRABAJO.codigo, monto))
        return this.interesMoratorio.getInteresMoratorioNatural(ConstantesTributos.RENTA_TRABAJO.codigo, monto);
      } else {
        return 0;
      }
    }
  }


}
