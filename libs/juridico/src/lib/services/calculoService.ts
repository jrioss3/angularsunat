import { ConstantesIdentificacion } from './../utils/constantesIdentificacion';
import { Injectable } from '@angular/core';
import { PreDeclaracionModel } from '../models';
import { FuncionesGenerales, SessionStorage } from '@rentas/shared/utils';
import { ComboService } from '@rentas/shared/core';
import { HabilitarCasillas2021Service } from './habilitar-casillas-2021.service';

@Injectable()
export class CalculoService {

  preDeclaracion: PreDeclaracionModel;

  constructor(
    private comboService: ComboService,
    private habilitarItan: HabilitarCasillas2021Service) { }

  calcularImpuestoRenta(recalculoAuto?: boolean): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    const ganancia = this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia;
    const impuestoRtaEmpresa = this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa;
    const casInformativa = this.preDeclaracion.declaracion.seccInformativa.casInformativa;

    // calcular casilla 100 y 101
    const resultado100 = Number(ganancia.mtoCas487) - Number(ganancia.mtoCas489);
    resultado100 >= 0 ? impuestoRtaEmpresa.mtoCas100 = resultado100 : impuestoRtaEmpresa.mtoCas100 = null;
    resultado100 <= 0 ? impuestoRtaEmpresa.mtoCas101 = Math.abs(resultado100) : impuestoRtaEmpresa.mtoCas101 = null;

    // calcular casilla 106 y 107
    const resultado106 = Number(impuestoRtaEmpresa.mtoCas100) + Number(impuestoRtaEmpresa.mtoCas103) -
      Number(impuestoRtaEmpresa.mtoCas101) - Number(impuestoRtaEmpresa.mtoCas105);

    // valor para saber si solo se recalculo la casilla 107
    let recalculo107 = false;
    if (impuestoRtaEmpresa.mtoCas107 != null && resultado106 < 0) {
      recalculo107 = true;
    }

    // setear valor a la casilla correspondiente
    resultado106 < 0 ? impuestoRtaEmpresa.mtoCas106 = null : impuestoRtaEmpresa.mtoCas106 = resultado106;
    resultado106 > 0 ? impuestoRtaEmpresa.mtoCas107 = null : impuestoRtaEmpresa.mtoCas107 = Math.abs(resultado106);

    // validar si la lista ya fue elimina con anterioridad 
    let eliminadoAntes = false;
    const lista108 = this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108.lisCasilla108;

    // eliminar data casilla 108
    if (!recalculoAuto) {
      this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108.lisCasilla108 = [];
    }

    if (lista108.length === this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108.lisCasilla108.length) {
      eliminadoAntes = true;
    }

    // recalcular casilla 880
    if (recalculo107) {
      if (this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108.lisCasilla108.length !== 0) {
        impuestoRtaEmpresa.mtoCas880 = null;
      } else if (this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108.lisCasilla108.length === 0 && !recalculoAuto && !eliminadoAntes) {
        impuestoRtaEmpresa.mtoCas880 = 0;
      } else {
        impuestoRtaEmpresa.mtoCas880 = impuestoRtaEmpresa.mtoCas880;
      }
    } else if (resultado106 < 0) {
      impuestoRtaEmpresa.mtoCas880 = 0;
    } else if (resultado106 >= 0) {
      impuestoRtaEmpresa.mtoCas880 = null;
    }

    // recalcular casilla 108
    if (Math.abs(Number(impuestoRtaEmpresa.mtoCas107)) > 0 || (Number(impuestoRtaEmpresa.mtoCas107) === 0 && Number(impuestoRtaEmpresa.mtoCas106) === 0)) {
      this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108.lisCasilla108
        .filter(x => x.codTipMto === '2')
        .forEach(x => x.mtoLiteral = 0);
      impuestoRtaEmpresa.mtoCas108 =
        this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108.lisCasilla108
          .filter(x => x.codTipMto === '1').reduce((total, montos) => total + Number(montos.mtoLiteral), 0);
    } else {
      impuestoRtaEmpresa.mtoCas108 =
        this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108.lisCasilla108
          .filter(x => x.codTipMto === '2').reduce((total, montos) => total + Number(montos.mtoLiteral), 0);
    }

    // calcular casilla 110
    const resultado110 = Number(impuestoRtaEmpresa.mtoCas106) - Number(impuestoRtaEmpresa.mtoCas108);
    resultado110 < 0 ? impuestoRtaEmpresa.mtoCas110 = null : impuestoRtaEmpresa.mtoCas110 = resultado110;

    // calcular casilla 111
    const totalPerdidasAAAA =
      this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108.lisCasilla108
        .filter(x => x.codTipMto === '1').reduce((total, montos) => total + Number(montos.mtoLiteral), 0);

    const perdidaNeta = Number(impuestoRtaEmpresa.mtoCas108) - Number(impuestoRtaEmpresa.mtoCas106);
    const alternativa = Number(totalPerdidasAAAA) - Number(impuestoRtaEmpresa.mtoCas108);
    if (perdidaNeta >= 0) {
      if (Number(impuestoRtaEmpresa.mtoCas106) > 0) {
        impuestoRtaEmpresa.mtoCas111 = alternativa;
      } else if (Number(impuestoRtaEmpresa.mtoCas107) > 0) {
        impuestoRtaEmpresa.mtoCas111 = (Number(impuestoRtaEmpresa.mtoCas108) + Number(impuestoRtaEmpresa.mtoCas107) - Number(impuestoRtaEmpresa.mtoCas120));
      } else if (Number(impuestoRtaEmpresa.mtoCas106) === 0 &&
        Number(impuestoRtaEmpresa.mtoCas107) === 0) {
        impuestoRtaEmpresa.mtoCas111 = Math.abs(Number(impuestoRtaEmpresa.mtoCas108));
      }
    } else {
      impuestoRtaEmpresa.mtoCas111 = Number(alternativa);
    }

    // calcular casilla 113
    const valorUIT = this.comboService.obtenerUitEjercicioActual();
    const valorPorcentaje = this.comboService.obtenerPorcentajeCas610();
    const UIT = valorUIT * 15;
    if (Number(casInformativa.mtoCas803) === Number(ConstantesIdentificacion.EXONERADO_NO)) {
      if (Number(casInformativa.mtoCas213) === Number(ConstantesIdentificacion.REGIMEN_GENERAL)) {
        impuestoRtaEmpresa.mtoCas113 = Math.round(Number(impuestoRtaEmpresa.mtoCas110) * 0.295);
      } else if (Number(casInformativa.mtoCas213) === Number(ConstantesIdentificacion.REGIMEN_MYPE) && Number(impuestoRtaEmpresa.mtoCas110) <= UIT) {
        impuestoRtaEmpresa.mtoCas113 = Math.round(Number(impuestoRtaEmpresa.mtoCas110) * 0.10);
      } else if (Number(casInformativa.mtoCas213) === Number(ConstantesIdentificacion.REGIMEN_MYPE) && Number(impuestoRtaEmpresa.mtoCas110) > UIT) {
        const valor = Math.round((Number(impuestoRtaEmpresa.mtoCas110) - UIT) * 0.295 + UIT * 0.10);
        valor > 0 ? impuestoRtaEmpresa.mtoCas113 = valor : impuestoRtaEmpresa.mtoCas113 = null;
      }
    } else {
      impuestoRtaEmpresa.mtoCas113 = 0;
    }

    // calcular casilla 686
    const divisor = (Number(ganancia.mtoCas461) - Number(ganancia.mtoCas462)) +
      Number(ganancia.mtoCas473) + Number(ganancia.mtoCas475) + (Number(ganancia.mtoCas477) -
        Number(ganancia.mtoCas433)) + Number(ganancia.mtoCas481);
    const resultado = (Number(impuestoRtaEmpresa.mtoCas113)) / divisor;
    if (Number(casInformativa.mtoCas803) === 1) {
      impuestoRtaEmpresa.mtoCas686 = 0;
    } else if (Number(impuestoRtaEmpresa.mtoCas113) === 0 || divisor === 0) {
      impuestoRtaEmpresa.mtoCas686 = 0;
    } else {
      impuestoRtaEmpresa.mtoCas686 = FuncionesGenerales.getInstance().redondeo(4, resultado);
    }

    // calcular casilla 610
    const resultado610 =
      Math.max(Number(impuestoRtaEmpresa.mtoCas686), valorPorcentaje);
    if (Number(casInformativa.mtoCas803) === 1) {
      impuestoRtaEmpresa.mtoCas610 = 0;
    } else {
      impuestoRtaEmpresa.mtoCas610 = FuncionesGenerales.getInstance().redondeo(2, (resultado610 * 100));
    }

    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.calcularCredContraImpRenta();
  }

  calcularCredContraImpRenta(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    const impuestoRtaEmpresa = this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa;
    const credImprenta = this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta;

    // calcular casilla 504
    const resultado = Number(impuestoRtaEmpresa.mtoCas113) - (Number(credImprenta.mtoCas123) +
      Number(credImprenta.mtoCas134) + Number(credImprenta.mtoCas136) +
      Number(credImprenta.mtoCas125) + Number(credImprenta.mtoCas126));
    resultado < 0 ? credImprenta.mtoCas504 = null : credImprenta.mtoCas504 = resultado;

    // calcular casilla 506
    credImprenta.mtoCas506 = Number(credImprenta.mtoCas504) - (Number(credImprenta.mtoCas127) +
      Number(credImprenta.mtoCas128) + Number(credImprenta.mtoCas130) + Number(credImprenta.mtoCas129));

    // calcular casilla 279
    if (this.habilitarItan.habilitarCasillasITAN()) {
      let valorCasilla = 0;
      if (credImprenta.mtoCas506 <= 0) {
        valorCasilla = credImprenta.mtoCas131;
      } else if (credImprenta.mtoCas506 >= credImprenta.mtoCas131) {
        valorCasilla = 0;
      } else if (credImprenta.mtoCas506 < credImprenta.mtoCas131) {
        valorCasilla = Math.abs(credImprenta.mtoCas506 - credImprenta.mtoCas131);
      }
      credImprenta.mtoCas279 = valorCasilla;
      if (credImprenta.mtoCas279 <= 0) {
        credImprenta.mtoCas783 = null;
      }
    }

    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.calcularDeterDeuda();
  }

  calcularDeterDeuda(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    const casDetDeudaPJ = this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ;
    const credImprenta = this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta;

    const monto138 = Number(casDetDeudaPJ.mtoCas138);
    // calcular casilla 138 y 139
    const resultadoDevolucion = Number(credImprenta.mtoCas506) - Math.abs(Number(credImprenta.mtoCas131));
    const resultadoAplicacion = Number(credImprenta.mtoCas506);
    const saldoAFavor = Number(credImprenta.mtoCas506) - Math.abs(Number(credImprenta.mtoCas131));

    if (Number(casDetDeudaPJ.mtoCas137) === 1) {
      casDetDeudaPJ.mtoCas138 = Math.abs(resultadoDevolucion);
    } else if (Number(casDetDeudaPJ.mtoCas137) === 2) {
      if (Number(credImprenta.mtoCas506) < 0) {
        casDetDeudaPJ.mtoCas138 = Math.abs(resultadoAplicacion);
      } else if (Number(credImprenta.mtoCas506) >= 0) {
        casDetDeudaPJ.mtoCas138 = 0;
      }
    } else {
      if (saldoAFavor >= 0) {
        casDetDeudaPJ.mtoCas138 = 0;
        casDetDeudaPJ.mtoCas139 = saldoAFavor;
      } else if (saldoAFavor < 0) {
        casDetDeudaPJ.mtoCas138 = Math.abs(saldoAFavor);
        casDetDeudaPJ.mtoCas139 = 0;
        casDetDeudaPJ.mtoCas141 = null;
        casDetDeudaPJ.mtoCas145 = null;
      }
    }

    if (monto138 !== casDetDeudaPJ.mtoCas138) {
      casDetDeudaPJ.mtoCas137 = 0;
    }

    // calcular casilla 505
    const resultado505 = Number(casDetDeudaPJ.mtoCas139) + Number(casDetDeudaPJ.mtoCas142) - Number(casDetDeudaPJ.mtoCas138);
    resultado505 >= 0 ? casDetDeudaPJ.mtoCas505 = resultado505 : casDetDeudaPJ.mtoCas505 = 0;

    // calcular casilla 145
    if (this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria === '0') {
      const tributoResultante = casDetDeudaPJ.mtoCas505 - casDetDeudaPJ.mtoCas141 - casDetDeudaPJ.mtoCas144;
      const factor = SessionStorage.getFactorInteresMoratorio();
      const total = Math.round(tributoResultante * factor);
      if (tributoResultante < 0) {
        casDetDeudaPJ.mtoCas145 = 0;
      } else {
        casDetDeudaPJ.mtoCas145 = total;
      }
    }

    // calcular casilla 146
    const resultado146 = Number(casDetDeudaPJ.mtoCas505) - Number(casDetDeudaPJ.mtoCas141) -
      Number(casDetDeudaPJ.mtoCas144) + Number(casDetDeudaPJ.mtoCas145);
    resultado146 >= 0 ? casDetDeudaPJ.mtoCas146 = resultado146 : casDetDeudaPJ.mtoCas146 = 0;

    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }
}
