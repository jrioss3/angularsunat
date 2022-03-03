import { FraccionamientoGeneral } from './fraccionamiento-general';
import { EstadoFraccionamiento, TipoFrac, TipoPlataformaFrac } from '@rentas/shared/types';

export class FraccionamientoNatural extends FraccionamientoGeneral {
  tieneFraccionamiento(valorUIT?: number): EstadoFraccionamiento {
    const preDeclaracion = this.getPredeclaracion();
    const indRectificatoria = preDeclaracion.declaracion.generales.cabecera.indRectificatoria;
    let importePagarA;
    importePagarA = 0;
    let importeDeudaA;
    importeDeudaA = 0;

    let importePagarB;
    importePagarB = 0;
    let importeDeudaB;
    importeDeudaB = 0;

    let importePagarC;
    importePagarC = 0;
    let importeDeudaC;
    importeDeudaC = 0;

    let importePagar;
    importePagar = 0;
    let importeDeuda;
    importeDeuda = 0;

    let resultadoA;
    resultadoA = 0;
    let resultadoB;
    resultadoB = 0;
    let resultadoC;
    resultadoC = 0;

    let tieneDeuda = false;
    let respuesta = false;

    if (Number(preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523) === 1) {
      importePagarA = preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166 ?
        preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166 : 0;
      importeDeudaA = preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas164 ?
        preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas164 : 0;
    }

    if (Number(preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524) === 1) {
      importePagarB = preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366 ?
        preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366 : 0;
      importeDeudaB = preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas365 ?
        preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas365 : 0;
    }

    if (Number(preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525) === 1) {
      importePagarC = preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168 ?
        preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168 : 0;
      importeDeudaC = preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas146 ?
        preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas146 : 0;
    }

    if ((importeDeudaA - importePagarA) > 0) {
      resultadoA = importeDeudaA - importePagarA;
      tieneDeuda = true;
    }

    if ((importeDeudaB - importePagarB) > 0) {
      resultadoB = importeDeudaB - importePagarB;
      tieneDeuda = true;
    }

    if ((importeDeudaC - importePagarC) > 0) {
      resultadoC = importeDeudaC - importePagarC;
      tieneDeuda = true;
    }

    if (tieneDeuda) {
      // (Casilla 164 – Casilla 166) + (Casilla 365 – Casilla 366) + (Casilla 146 – Casilla 168) > = 10 % UIT
      if ((resultadoA + resultadoB + resultadoC) >= valorUIT * 0.10) {
        respuesta = true;
      }
    }

    //return respuesta && indRectificatoria === '0';
    return {
      tieneFraccionamiento: respuesta && indRectificatoria === '0',
      mesaje: '¿Desea solicitar Fraccionamiento por las deudas que se generen en esta declaración anual?',
      tipoPlaforma: TipoPlataformaFrac.NATURAL,
      tipo: TipoFrac.MAYOR_10_PORCIENTO_UIT
    }
  }


}
