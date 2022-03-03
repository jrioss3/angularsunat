import { Injectable } from '@angular/core';
import { PreDeclaracionModel } from '../models/preDeclaracionModel';
import { ConstantesSeccionDeterminativa } from '../utils/constanteSeccionDeterminativa';
import { SessionStorage } from '@rentas/shared/utils';
import { InteresMoratorioService } from 'libs/shared/core/src/lib/service/interes-moratorio.service';
import { ConstantesTributos } from '@rentas/shared/constantes';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalculoRentaPrimeraService {

  preDeclaracion: PreDeclaracionModel;

  constructor(
    private interesMoratorio: InteresMoratorioService
  ) { }

  calcularCasilla153(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas153 =
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas515) === 0 ? 0 :
        Math.round(Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas515) *
          ConstantesSeccionDeterminativa.CASILLA153_CONSTANTE);
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.calcularCasilla133();
  }
  calcularCasilla133(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas133 = Math.round(
      this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.
        casilla100Cabecera.lisCas100Cab
        .reduce((total, montos) => total + Number(montos.lisCas100Detalles.filter(x => x.indAceptado === '1')
          .reduce((totalDetalle, montosDetalle) => totalDetalle + Number(montosDetalle.mtoPagSInt), 0)), 0));
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.calcularCasilla159y161();
  }

  calcularCasilla159y161(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    const resultado = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas153) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas156) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas133);
    if (resultado < 0) {
      this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas159 = Math.abs(resultado);
      this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas161 = 0;
    } else {
      this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas159 = 0;
      this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas161 = resultado;
    }
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.calcularCasilla164();
  }

  calcularCasilla164() {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();    
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas163= this.calcularCasilla163();
    const resultado = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas161) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas162) +
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas163);
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas164 = resultado < 0 ? 0 : resultado;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }
  calcularCasilla163(): number {
    if (this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria === '0') {
      this.preDeclaracion = SessionStorage.getPreDeclaracion();
      const { mtoCas161, mtoCas162 } = this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera;
      const monto = Number(mtoCas161) - Number(mtoCas162);
      if (monto > 0) {
        return this.interesMoratorio.getInteresMoratorioNatural(ConstantesTributos.RENTA_CAPITAL.codigo, monto)
      } else {
        return 0;
      }
    }
  }
}
