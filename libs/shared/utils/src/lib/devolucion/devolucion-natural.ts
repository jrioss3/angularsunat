import { TributoDevolucion } from '@rentas/shared/types';
import { DevolucionGeneral } from './devolucion-general';
import { SessionStorage } from '../session-storage/session-storage';
import { ConstantesTributos } from '@rentas/shared/constantes';

export class DevolucionNatural extends DevolucionGeneral {

  getDevolucionPorTributo(): TributoDevolucion[] {
    const preDeclaracion = this.getPredeclaracion()
    let respuesta: Array<any>;
    respuesta = [];

    // 1 => Declaro, 0 => No Declaro
    const declaroPrimera = Number(preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523);
    const declaroSegunda = Number(preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524);
    const declaroTrabajo = Number(preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525);

    // Declaración de Objetos a retornar
    const devolucionPrimera = {
      tipo: 'primera',
      cumple: false,
      link: 'Solicitud de Devolución - 1RA Categoría',
      codTributo: ConstantesTributos.RENTA_CAPITAL.codigo,
      mtoTributo: 0,
      descripcionTributo: ConstantesTributos.RENTA_CAPITAL.descripcion
    };

    const devolucionSegunda = {
      tipo: 'segunda',
      cumple: false,
      link: 'Solicitud de Devolución - 2DA Categoría',
      codTributo: ConstantesTributos.RENTA_2DA_CATEGORIA.codigo,
      mtoTributo: 0,
      descripcionTributo: ConstantesTributos.RENTA_2DA_CATEGORIA.descripcion
    };

    const devolucionTrabajo = {
      tipo: 'trabajo',
      cumple: false,
      link: 'Solicitud de Devolución - Rentas del Trabajo',
      codTributo: ConstantesTributos.RENTA_TRABAJO.codigo,
      mtoTributo: 0,
      descripcionTributo: ConstantesTributos.RENTA_TRABAJO.descripcion
    };

    /*
    Rentas de Capital Primera Categoría
    •       Persona natural cuya clasificación es ddp_tpoemp “01”, “02”, 03 y 04  . (verificar campo de ddp: ddp_tpoemp)
    •       La casilla 160 debe ser igual a “1”, indicador de que solicita la devolución.
    •       El monto de la casilla 159 debe ser mayor a cero.
    */
    if (declaroPrimera === 1) {
      if (this.cumpleReglasDevolucion()) {

        if (Number(preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas160) === 1 &&
          Number(preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas159) > 0) {

          const monto = Number(preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas159);
          devolucionPrimera.cumple = true;
          devolucionPrimera.mtoTributo = monto;
        }
      }
    }

    /*
    Rentas de Capital Segunda Categoría
    •       Persona natural cuya clasificación es ddp_tpoemp “01”, “02”, 03 y 04 (verificar campo de ddp: ddp_tpoemp)
    •       La casilla 161 debe ser igual a “1”, indicador de que solicita la devolución.
    •       El monto de la casilla 360 debe ser mayor a cero.
    */
    if (declaroSegunda === 1) {
      if (this.cumpleReglasDevolucion()) {

        if (Number(preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas361) === 1 &&
          Number(preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas360) > 0) {

          const monto = Number(preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas360);
          devolucionSegunda.cumple = true;
          devolucionSegunda.mtoTributo = monto;
        }
      }
    }

    /*
    Rentas de Trabajo y/o Fuente Extranjera
    •       Persona natural cuya clasificación es ddp_tpoemp “01”, “02”, 03 y 04  (verificar campo de ddp: ddp_tpoemp)
    •       La casilla 140 debe ser igual a “1”, indicador de que solicita la devolución.
    •       El monto de la casilla 141 debe ser mayor a cero.
    */
    if (declaroTrabajo === 1) {
      if (this.cumpleReglasDevolucion()) {
        if (Number(preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas140) === 1 &&
          Number(preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas141) > 0) {

          const monto = Number(preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas141);
          devolucionTrabajo.cumple = true;
          devolucionTrabajo.mtoTributo = monto;
        }
      }
    }

    respuesta.push(devolucionPrimera);
    respuesta.push(devolucionSegunda);
    respuesta.push(devolucionTrabajo);
    return respuesta;
  }

  private cumpleReglasDevolucion() {
    const userData = SessionStorage.getUserData();
    return userData.map.ddpData.ddp_tpoemp === '01' ||
      userData.map.ddpData.ddp_tpoemp === '02' ||
      userData.map.ddpData.ddp_tpoemp === '03' ||
      userData.map.ddpData.ddp_tpoemp === '04' ||
      userData.map.ddpData.ddp_tpoemp === '05' ||
      userData.map.ddpData.ddp_tpoemp === '06' ||
      this.isDevolucionNidi();
  }

  private isDevolucionNidi(): boolean {
    const ddpData = SessionStorage.getUserData().map.ddpData;
    return ddpData.ddp_estado === '20' &&
      ddpData.ddp_flag22 === '10' && ddpData.ddp_tpoemp === '-';
  }

}