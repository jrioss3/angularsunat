import { ConstantesTributos } from '@rentas/shared/constantes';
import { TributoDevolucion } from '@rentas/shared/types';
import { DevolucionGeneral } from './devolucion-general';


export class DevolucionJuridico extends DevolucionGeneral {

  getDevolucionPorTributo(): TributoDevolucion[] {
    const preDeclaracion = this.getPredeclaracion();
    let valor137;
    let valor138;
    let valor783;
    let valor279;
    let importePagar;
    importePagar = 0;
    let mtoCas217;

    let respuesta: Array<TributoDevolucion>;
    respuesta = [];

    // ES INAFECTO ???  1 ==>SI, 0 ==>NO
    // Cuando es NO muestra determinación de la Deuda
    mtoCas217 = preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas217 ?? '0';

    if (Number(mtoCas217) === 0) { // NO
      // a. La casilla 137 del formulario 710 que se ha presentado, debe ser igual a “1” indicador de que solicita la devolución.
      // b. El monto de la casilla 138 del Formulario Virtual 710 que se ha presentado,
      // debe ser mayor a cero, así sea S/. 1.00 o S/. 2.00 se habilitará el link.
      valor137 = preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas137;
      valor138 = preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas138;

      valor783 = preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta.mtoCas783;
      valor279 = preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta.mtoCas279;

      if (Number(valor137) === 1 && Number(valor138) > 0) {

        respuesta.push({
          tipo: 'juridico',
          cumple: true,
          link: 'Solicitud Devolución - 3RA Categoría',
          codTributo: ConstantesTributos.RENTA_PERS_JUR.codigo,
          mtoTributo: Number(valor138),
          descripcionTributo: ConstantesTributos.RENTA_PERS_JUR.descripcion
        });
      }
      if (Number(valor783) === 1 && Number(valor279) > 0) {

        respuesta.push({
          tipo: 'juridico',
          cumple: true,
          link: 'Solicitud Devolución - ITAN',
          codTributo: ConstantesTributos.ITAN.codigo,
          mtoTributo: Number(valor279),
          descripcionTributo: ConstantesTributos.ITAN.descripcion
        });
      }
    }

    return respuesta;
  }

}
