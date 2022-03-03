import { FraccionamientoGeneral } from './fraccionamiento-general';
import { EstadoFraccionamiento, TipoFrac, TipoPlataformaFrac } from '@rentas/shared/types';

export class FraccionamientoJuridico extends FraccionamientoGeneral {

  tieneFraccionamiento(valorUIT?: number): EstadoFraccionamiento {
    const preDeclaracion = this.getPredeclaracion();

    let importePagar = 0;
    let importeDeuda = 0;

    // const valorUIT = this.comboService.obtenerUit(this.obtenerNumeroEjercicio());
    let respuesta: boolean;
    respuesta = false;
    let mensaje = '¿Desea solicitar Fraccionamiento por las deudas que se generen en esta declaración anual?';
    let tipoFrac: TipoFrac;

    // (Casilla 461 – Casilla 462) + Casilla  473 + Casilla 475 + (Casilla 477 – Casilla 433) + Casilla 481
    let monto461 = 0;
    let monto462 = 0;
    let monto473 = 0;
    let monto475 = 0;
    let monto477 = 0;
    let monto433 = 0;

    let noInafecta = true;

    // lógica

    let mtoCas217;

    // ES INAFECTO ???  1 ==>SI, 0 ==>NO
    mtoCas217 = preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas217 ?
      preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas217 : '0';

    if (Number(mtoCas217) === 0) { // NO
      importeDeuda = preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas146 ?
        preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas146 : 0;
      importePagar = preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180 ?
        preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180 : 0;
      noInafecta = true;
    }

    // casilla devolucion ITAN 
    let valor783 = preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta.mtoCas783;
    let valor279 = preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta.mtoCas279;

    if (noInafecta) {
      if ((importeDeuda - importePagar) >= (valorUIT * 0.10)) {
        // 1.- (Casilla 146 – Casilla 180)  > = 10 % UIT
        if (String(preDeclaracion.declaracion.generales.cabecera.indRectificatoria) === '0') { // 0 es original
          // 2.- Si la declaración corresponde a una ddjj original
          monto461 = Number(preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas461);
          monto462 = Number(preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas462);
          monto473 = Number(preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas473);
          monto475 = Number(preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas475);
          monto477 = Number(preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas477);
          monto433 = Number(preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas433);
          // monto481 = Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas481);
          if (((monto461 - monto462) + monto473 + monto475 + (monto477 - monto433)) <= (150 * valorUIT)) {
            // 3.- Si los ingresos anuales consignados en la declaración presentada son menores o iguales a 150 UIT.
            // Se considera como ingresos anuales lo siguiente para el FV 710:
            // (Casilla 461 – Casilla 462) + Casilla  473 + Casilla 475 + (Casilla 477 – Casilla 433) + Casilla 481
            respuesta = true;
            tipoFrac = TipoFrac.MAYOR_10_PORCIENTO_UIT;
          } else {
            // aqui se usa el mensaje para mostrar si supero 150 uit
            respuesta = false;
            mensaje = 'Sus ingresos anuales superan las 150 UIT por lo que podrá solicitar un fraccionamiento recién a partir del primer día hábil del mes de mayo, siempre que hayan transcurrido cinco (5) días hábiles a partir de la fecha de presentación y cumpla con los requisitos exigidos';
            tipoFrac = TipoFrac.MAYOR_150_UIT;
          }
        }
      // } else if (Number(valor783) === 1 && Number(valor279) > 0) {
      //   respuesta = false;
      //   mensaje = 'Sr. Contribuyente, usted podrá solicitar la devolución del ITAN no utilizado a partir del 3er día de presentada la DDJJ anual, a través de SUNAT OPERACIONES EN LINEA (SOL) OTRAS DECLARACIONES Y SOLICITUDES/Mis devoluciones/Devoluciones/Registro de Solicitud de Devolución 1649.';
      //   tipoFrac = TipoFrac.MAYOR_150_UIT;
      }
    }

    return {
      tieneFraccionamiento: respuesta,
      mesaje: mensaje,
      tipoPlaforma: TipoPlataformaFrac.JURIDICO,
      tipo: tipoFrac
    };
  }

}
