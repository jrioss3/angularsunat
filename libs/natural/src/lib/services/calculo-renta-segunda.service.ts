import { Injectable } from '@angular/core';
import { PreDeclaracionModel } from '../models/preDeclaracionModel';
import { ConstantesSeccionDeterminativa } from '../utils/constanteSeccionDeterminativa';
import { SessionStorage } from '@rentas/shared/utils';
import { Observable, of } from 'rxjs';
import { ConstantesTributos } from '@rentas/shared/constantes';
import { InteresMoratorioService } from 'libs/shared/core/src/lib/service/interes-moratorio.service';


@Injectable({
  providedIn: 'root'
})
export class CalculoRentaSegundaService {

  preDeclaracion: PreDeclaracionModel;

  constructor(
    private interesMoratorio: InteresMoratorioService
  ) { }

  calcularCasilla357(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();

    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas357 =
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas356) === 0 ? 0 :
        Math.round(Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas356) *
          ConstantesSeccionDeterminativa.CASILLA153_CONSTANTE);

    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.calcularCasilla360y362();
  }

  calcularCasilla360y362(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();

    const operacion = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas357) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas388) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas358) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas359);

    if (operacion < 0) {
      this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas360 = Math.abs(operacion);
      this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas362 = 0;
    } else {
      this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas360 = 0;
      this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas362 = operacion;
    }

    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.calcularCasilla365();
  }

  calcularCasilla365(){
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas364= this.calcularCasilla364();
    const resultado = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas362) -
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas363) +
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas364);

    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas365 = resultado < 0 ? 0 : resultado;

    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }
  calcularCasilla364(): number {
    if (this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria === '0') {
      this.preDeclaracion = SessionStorage.getPreDeclaracion();
      const { mtoCas362, mtoCas363 } = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda;
      const monto = Number(mtoCas362) - Number(mtoCas363);
      if (monto > 0) {
        return this.interesMoratorio.getInteresMoratorioNatural(ConstantesTributos.RENTA_2DA_CATEGORIA.codigo, monto)
      }
      else {
        return 0;
      }
    }
  }

}
