import { Injectable } from '@angular/core';
import { PreDeclaracionModel } from '@path/juridico/models';
import { ConstantesCasillas } from '@rentas/shared/constantes';
import { CasillaService, ComboService } from '@rentas/shared/core';
import { FuncionesGenerales, SessionStorage } from '@rentas/shared/utils';
import { DetCredImpuestoRtaModel, DetCredImpuestoRtaModelCas126, DetCredImpuestoRtaModelCas128, DetCredImpuestoRtaModelCas130, DetCredImpuestoRtaModelCas131, DetCredImpuestoRtaModelCas297 } from '../models/SeccionDeterminativa/detCredImpuestoRtaModel';
import { DetDeterminacionDeudaModel, DeudaPagosPreviosModel } from '../models/SeccionDeterminativa/detDeterminacionDeudaModel';
import { ActivoEmp, Ganancia, PasivoPatrEmp } from '../models/SeccionDeterminativa/detEstFinancierosModel';
import { ImpRtaEmpresaModel } from '../models/SeccionDeterminativa/impRtaEmpresaModel';
import { ImpRtaEmpresaModelCas108 } from '../models/SeccionDeterminativa/impRtaEmpresaModelCas108';
import { InfCasInformativaModel } from '../models/SeccionInformativa/infCasInformativaModel';
import { ConstantesIdentificacion } from '../utils/constantesIdentificacion';
import { HabilitarCasillas2021Service } from './habilitar-casillas-2021.service';
import { InicializarCasillasDeterminativaService } from './inicializar-casillas-determinativa.service';

@Injectable()
export class FormulasService extends InicializarCasillasDeterminativaService {

  public preDeclaracion: PreDeclaracionModel;
  public funcionesGenerales = FuncionesGenerales.getInstance();
  public ganancia: Ganancia;
  public activoEmp: ActivoEmp;
  public pasivoPatrEmp: PasivoPatrEmp;
  public impuestoRtaEmpresa: ImpRtaEmpresaModel;
  public credImprenta: DetCredImpuestoRtaModel;
  public casDetDeudaPJ: DetDeterminacionDeudaModel;
  public casInformativa: InfCasInformativaModel;
  public lista108: { refTabla: string, lisCasilla108: ImpRtaEmpresaModelCas108[] };
  public lista126: { refTabla: string, lisCasilla126: DetCredImpuestoRtaModelCas126[] };
  public lista128: { refTabla: string, lisCasilla128: DetCredImpuestoRtaModelCas128[] };
  public lista130: { refTabla: string, lisCasilla130: DetCredImpuestoRtaModelCas130[] };
  public lista131: { refTabla: string, lisCasilla131: DetCredImpuestoRtaModelCas131[] };
  public lista297: { refTabla: string, lisCasilla297: DetCredImpuestoRtaModelCas297[] };
  public lista144: { lisPagosPrevios: DeudaPagosPreviosModel[] };

  constructor(public casillaService: CasillaService,
    public comboService: ComboService,
    public habilitarItan: HabilitarCasillas2021Service) {
    super(casillaService);
  }

  public inicializarMontos(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.casInformativa = this.preDeclaracion.declaracion.seccInformativa.casInformativa;
    this.ganancia = this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia;
    this.activoEmp = this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.activoEmp;
    this.pasivoPatrEmp = this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.pasivoPatrEmp;
    this.impuestoRtaEmpresa = this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa;
    this.credImprenta = this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta;
    this.casDetDeudaPJ = this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ;
    this.lista108 = this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108;
    this.lista126 = this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla126;
    this.lista128 = this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla128;
    this.lista130 = this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla130;
    this.lista131 = this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla131;
    this.lista297 = this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla297;
    this.lista144 = this.preDeclaracion.declaracion.determinacionDeuda.pagosPrevios;
  }

  // PANTALLA ACTIVOS
  public calcularTotalActivoNeto(): void {
    this.activoEmp.mtoCas390 = Number(this.activoEmp.mtoCas359) + Number(this.activoEmp.mtoCas360) + Number(this.activoEmp.mtoCas361) +
      Number(this.activoEmp.mtoCas362) + Number(this.activoEmp.mtoCas363) + Number(this.activoEmp.mtoCas364) +
      Number(this.activoEmp.mtoCas365) + Number(this.activoEmp.mtoCas366) - Number(this.activoEmp.mtoCas367) +
      Number(this.activoEmp.mtoCas368) + Number(this.activoEmp.mtoCas369) + Number(this.activoEmp.mtoCas370) +
      Number(this.activoEmp.mtoCas371) + Number(this.activoEmp.mtoCas372) + Number(this.activoEmp.mtoCas373) +
      Number(this.activoEmp.mtoCas374) + Number(this.activoEmp.mtoCas375) - Number(this.activoEmp.mtoCas376) +
      Number(this.activoEmp.mtoCas377) + Number(this.activoEmp.mtoCas378) + Number(this.activoEmp.mtoCas379) +
      Number(this.activoEmp.mtoCas380) + Number(this.activoEmp.mtoCas381) + Number(this.activoEmp.mtoCas382) -
      Number(this.activoEmp.mtoCas383) + Number(this.activoEmp.mtoCas384) + Number(this.activoEmp.mtoCas385) -
      Number(this.activoEmp.mtoCas386) - Number(this.activoEmp.mtoCas387) + Number(this.activoEmp.mtoCas388) +
      Number(this.activoEmp.mtoCas389);
    this.validarFormatoCasilla390();
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  public validarFormatoCasilla390(): void {
    if (this.activoEmp.mtoCas390 < 0) {
      this.casilla390.indFormatoNegativo = true;
    } else {
      this.casilla390.indFormatoNegativo = false;
    }
  }

  // PANTALLA PASIVO PATRIMONIO
  public calcularTotalPasivo(): void {
    this.pasivoPatrEmp.mtoCas412 = Number(this.pasivoPatrEmp.mtoCas401) + Number(this.pasivoPatrEmp.mtoCas402) + Number(this.pasivoPatrEmp.mtoCas403) +
      Number(this.pasivoPatrEmp.mtoCas404) + Number(this.pasivoPatrEmp.mtoCas405) + Number(this.pasivoPatrEmp.mtoCas406) +
      Number(this.pasivoPatrEmp.mtoCas407) + Number(this.pasivoPatrEmp.mtoCas408) + Number(this.pasivoPatrEmp.mtoCas409) +
      Number(this.pasivoPatrEmp.mtoCas410) + Number(this.pasivoPatrEmp.mtoCas411);
    this.calcularTotalPatrimonio();

  }

  public calcularTotalPatrimonio(): void {
    this.pasivoPatrEmp.mtoCas425 = Number(this.pasivoPatrEmp.mtoCas414) + Number(this.pasivoPatrEmp.mtoCas415) + Number(this.pasivoPatrEmp.mtoCas416)
      - Number(this.pasivoPatrEmp.mtoCas417) + Number(this.pasivoPatrEmp.mtoCas418) + Number(this.pasivoPatrEmp.mtoCas419) + Number(this.pasivoPatrEmp.mtoCas420)
      + Number(this.pasivoPatrEmp.mtoCas421) - Number(this.pasivoPatrEmp.mtoCas422) + Number(this.pasivoPatrEmp.mtoCas423) - Number(this.pasivoPatrEmp.mtoCas424);
    this.validarFormatoCasilla425();
    this.calcularTotalPasivoPatrominio();
  }

  public calcularTotalPasivoPatrominio(): void {
    this.pasivoPatrEmp.mtoCas426 = Number(this.pasivoPatrEmp.mtoCas412) + Number(this.pasivoPatrEmp.mtoCas425);
    this.validarFormatoCasilla426();
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  public validarFormatoCasilla425(): void {
    if (this.pasivoPatrEmp.mtoCas425 < 0) {
      this.casilla425.indFormatoNegativo = true;
    } else {
      this.casilla425.indFormatoNegativo = false;
    }
  }

  public validarFormatoCasilla426(): void {
    if (this.pasivoPatrEmp.mtoCas426 < 0) {
      this.casilla426.indFormatoNegativo = true;
    } else {
      this.casilla426.indFormatoNegativo = false;
    }
  }

  // PANTALLA ESTADO DE RESULTADOS
  public calcularVentasNetas(): void {
    this.ganancia.mtoCas463 = this.formulaCasilla463();
    this.calcularResultadoBrutoUtilidad();
  }

  public calcularResultadoBrutoUtilidad(): void {
    this.ganancia.mtoCas466 = this.formulaCasilla466();
    this.calcularResultadoBrutoPerdida();
  }

  private calcularResultadoBrutoPerdida(): void {
    this.ganancia.mtoCas467 = this.formulaCasilla467();
    this.calcularResultadoOperUtilidad();
  }

  public calcularResultadoOperUtilidad(): void {
    this.ganancia.mtoCas470 = this.formulaCasilla470();
    this.calcularResultadoOpePerdida();
  }

  private calcularResultadoOpePerdida(): void {
    this.ganancia.mtoCas471 = this.formulaCasilla471();
    this.calcularResultadoAntesParUtilidad();
  }

  public calcularResultadoAntesParUtilidad(): void {
    this.ganancia.mtoCas484 = this.formulaCasilla484();
    this.calcularResultadoAntesParPerdida();
  }

  private calcularResultadoAntesParPerdida(): void {
    this.ganancia.mtoCas485 = this.formulaCasilla485();
    this.calcularResultadoAntesImpUtilidad();
  }

  public calcularResultadoAntesImpUtilidad(): void {
    this.ganancia.mtoCas487 = this.formulaCasilla487();
    this.calcularResultadoAntesImpPerdida();
  }

  private calcularResultadoAntesImpPerdida(): void {
    this.ganancia.mtoCas489 = this.formulaCasilla489();
    this.calcularResultadoEjercicioUtil();
  }

  public calcularResultadoEjercicioUtil(): void {
    this.ganancia.mtoCas492 = this.formulaCasilla492();
    this.calcularResultadoEjercicioPerdida();
  }

  private calcularResultadoEjercicioPerdida(): void {
    this.ganancia.mtoCas493 = this.formulaCasilla493();
    if (Number(this.casInformativa.mtoCas217) === Number(ConstantesIdentificacion.INAFECTO_NO)) {
      this.calcularUtilidadAdicionesYDeducciones();
    } else {
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
    }
  }

  // Formulas de calculo de la pantalla ESTADO DE RESULTADOS
  private formulaCasilla463(): number {
    const resultado = Number(this.ganancia.mtoCas461) - Number(this.ganancia.mtoCas462);
    return resultado < 0 ? 0 : resultado;
  }

  private formulaCasilla466(): number {
    const resultado = this.formula466y467();
    return resultado >= 0 ? resultado : 0;
  }

  private formulaCasilla467(): number {
    const resultado = this.formula466y467();
    return resultado <= 0 ? Math.abs(resultado) : 0;
  }

  private formulaCasilla470(): number {
    const resultado = Number(this.ganancia.mtoCas466) - Number(this.ganancia.mtoCas468) - Number(this.ganancia.mtoCas469);
    return resultado >= 0 ? resultado : 0;
  }

  private formulaCasilla471(): number {
    const resultado = Number(this.ganancia.mtoCas466) - Number(this.ganancia.mtoCas467) - Number(this.ganancia.mtoCas468) - Number(this.ganancia.mtoCas469);
    return resultado <= 0 ? Math.abs(resultado) : 0;
  }

  private formulaCasilla484(): number {
    const resultado = this.formula484y485();
    return resultado >= 0 ? resultado : 0;
  }

  private formulaCasilla485(): number {
    const resultado = this.formula484y485();
    return resultado <= 0 ? Math.abs(resultado) : 0;
  }

  private formulaCasilla487(): number {
    const resultado = this.formula487y489();
    return resultado >= 0 ? resultado : 0;
  }

  private formulaCasilla489(): number {
    const resultado = this.formula487y489();
    return resultado <= 0 ? Math.abs(resultado) : 0;
  }

  private formulaCasilla492(): number {
    const resultado = this.formula492y493();
    return resultado >= 0 ? resultado : 0;
  }

  private formulaCasilla493(): number {
    const resultado = this.formula492y493();
    return resultado <= 0 ? Math.abs(resultado) : 0;
  }

  private formula466y467(): number {
    return Number(this.ganancia.mtoCas463) - Number(this.ganancia.mtoCas464);
  }

  private formula484y485(): number {
    return Number(this.ganancia.mtoCas470) - (Number(this.ganancia.mtoCas471) + Number(this.ganancia.mtoCas472)) +
      Number(this.ganancia.mtoCas473) + Number(this.ganancia.mtoCas475) + Number(this.ganancia.mtoCas476) +
      Number(this.ganancia.mtoCas477) - Number(this.ganancia.mtoCas478) - Number(this.ganancia.mtoCas480);
  }

  private formula487y489(): number {
    return Number(this.ganancia.mtoCas484) - Number(this.ganancia.mtoCas485) - Number(this.ganancia.mtoCas486);
  }

  private formula492y493(): number {
    return Number(this.ganancia.mtoCas487) - Number(this.ganancia.mtoCas489) - Number(this.ganancia.mtoCas490);
  }

  public formulaCasilla473(): number {
    return Number(this.ganancia.mtoCas650) + Number(this.ganancia.mtoCas651);
  }

  public formulaCasilla477(): number {
    return Number(this.ganancia.mtoCas432) + Number(this.ganancia.mtoCas433);
  }

  // PANTALLA IMPUESTO RENTTA
  public calcularUtilidadAdicionesYDeducciones(recalculoAuto?: boolean): void {
    this.impuestoRtaEmpresa.mtoCas100 = this.formulaCasilla100();
    this.calcularPerdidaAdicionesYDeducciones(recalculoAuto);
  }

  private calcularPerdidaAdicionesYDeducciones(recalculoAuto?: boolean): void {
    this.impuestoRtaEmpresa.mtoCas101 = this.formulaCasilla101();
    this.calcularRentaNeta(recalculoAuto);
  }

  public calcularRentaNeta(recalculoAuto?: boolean): void {
    const resultado = this.formula106y107();
    const reculculo107 = this.impuestoRtaEmpresa.mtoCas107 > 0 && resultado < 0;
    let eliminoLista108 = false;

    if (!recalculoAuto) {
      eliminoLista108 = this.lista108.lisCasilla108.length > 0;
      this.lista108.lisCasilla108 = [];
    }

    if (resultado < 0) {
      this.impuestoRtaEmpresa.mtoCas106 = 0;
      this.impuestoRtaEmpresa.mtoCas107 = Math.abs(resultado);
    } else if (resultado >= 0) {
      this.impuestoRtaEmpresa.mtoCas107 = 0;
      this.impuestoRtaEmpresa.mtoCas106 = resultado;
    }
    this.calcular880(reculculo107, resultado, eliminoLista108);
    this.calcular108();
    this.calcularRentaNetaImponible();
  }

  public calcularRentaNetaImponible(): void {
    this.impuestoRtaEmpresa.mtoCas110 = this.formulaCasilla110();
    this.calcularTotalImpuestoRenta();
  }

  private calcularTotalImpuestoRenta(): void {
    const casilla213 = Number(this.casInformativa.mtoCas213);
    const UIT = this.comboService.obtenerUitEjercicioActual() * 15;
    if (Number(this.casInformativa.mtoCas803) === Number(ConstantesIdentificacion.EXONERADO_NO)) {
      if (casilla213 === Number(ConstantesIdentificacion.REGIMEN_GENERAL)) {
        this.impuestoRtaEmpresa.mtoCas113 = Math.round(Number(this.impuestoRtaEmpresa.mtoCas110) * 0.295);
      } else if (casilla213 === Number(ConstantesIdentificacion.REGIMEN_MYPE) && Number(this.impuestoRtaEmpresa.mtoCas110) <= UIT) {
        this.impuestoRtaEmpresa.mtoCas113 = Math.round(Number(this.impuestoRtaEmpresa.mtoCas110) * 0.10);
      } else if (casilla213 === Number(ConstantesIdentificacion.REGIMEN_MYPE) && Number(this.impuestoRtaEmpresa.mtoCas110) > UIT) {
        const valor = Math.round((Number(this.impuestoRtaEmpresa.mtoCas110) - UIT) * 0.295 + UIT * 0.10);
        valor > 0 ? this.impuestoRtaEmpresa.mtoCas113 = valor : this.impuestoRtaEmpresa.mtoCas113 = 0;
      }
    } else {
      this.impuestoRtaEmpresa.mtoCas113 = 0;
    }
    this.calcularSaldoPerdidasNoCompensadas();
  }

  public calcularSaldoPerdidasNoCompensadas(): void {
    const perdidaNeta = Number(this.impuestoRtaEmpresa.mtoCas108) - Number(this.impuestoRtaEmpresa.mtoCas106);
    const alternativa = this.obtenerTotalPerdidasAAAA() - Number(this.impuestoRtaEmpresa.mtoCas108);
    if (perdidaNeta >= 0) {
      if (Number(this.impuestoRtaEmpresa.mtoCas106) > 0) {
        this.impuestoRtaEmpresa.mtoCas111 = Math.abs(alternativa);
      } else if (Number(this.impuestoRtaEmpresa.mtoCas107) > 0) {
        this.impuestoRtaEmpresa.mtoCas111 = Math.abs((Number(this.impuestoRtaEmpresa.mtoCas108) + Number(this.impuestoRtaEmpresa.mtoCas107) - Number(this.impuestoRtaEmpresa.mtoCas120)));
      } else if (Number(this.impuestoRtaEmpresa.mtoCas106) === 0 && Number(this.impuestoRtaEmpresa.mtoCas107) === 0) {
        this.impuestoRtaEmpresa.mtoCas111 = Math.abs(Number(this.impuestoRtaEmpresa.mtoCas108));
      }
    } else {
      this.impuestoRtaEmpresa.mtoCas111 = Math.abs(Number(alternativa));
    }
    this.calcularCoeficiente();
  }

  private calcularCoeficiente(): void {
    const dividendo = (Number(this.ganancia.mtoCas461) - Number(this.ganancia.mtoCas462)) +
      Number(this.ganancia.mtoCas473) + Number(this.ganancia.mtoCas475) + (Number(this.ganancia.mtoCas477) -
        Number(this.ganancia.mtoCas433)) + Number(this.ganancia.mtoCas481);
    const resultado = (Number(this.impuestoRtaEmpresa.mtoCas113)) / dividendo;
    if (Number(this.casInformativa.mtoCas803) === Number(ConstantesIdentificacion.EXONERADO_SI)) {
      this.impuestoRtaEmpresa.mtoCas686 = 0;
    } else if ((Number(this.impuestoRtaEmpresa.mtoCas113)) === 0 || dividendo === 0) {
      this.impuestoRtaEmpresa.mtoCas686 = 0;
    } else {
      this.impuestoRtaEmpresa.mtoCas686 = this.funcionesGenerales.redondeo(4, resultado);
    }
    this.calcularPorcentaje();
  }

  private calcularPorcentaje(): void {
    const resultado = Math.max(Number(this.impuestoRtaEmpresa.mtoCas686), this.comboService.obtenerPorcentajeCas610());
    if (Number(this.casInformativa.mtoCas803) === Number(ConstantesIdentificacion.EXONERADO_SI)) {
      this.impuestoRtaEmpresa.mtoCas610 = 0;
    } else {
      const monto = Number((resultado * 100));
      this.impuestoRtaEmpresa.mtoCas610 = this.funcionesGenerales.redondeo(2, monto);
    }
    this.calcularSUBTOTALCredSinDevolucion();
  }

  private formulaCasilla100(): number {
    const resultado = this.formula100y101();
    return resultado >= 0 ? resultado : 0;
  }

  private formulaCasilla101(): number {
    const resultado = this.formula100y101();
    return resultado <= 0 ? Math.abs(resultado) : 0;
  }

  private formula100y101(): number {
    return Number(this.ganancia.mtoCas487) - Number(this.ganancia.mtoCas489);
  }

  private formula106y107(): number {
    return Number(this.impuestoRtaEmpresa.mtoCas100) + Number(this.impuestoRtaEmpresa.mtoCas103) - Number(this.impuestoRtaEmpresa.mtoCas101) - Number(this.impuestoRtaEmpresa.mtoCas105);
  }

  private calcular880(recalculo107: boolean, resultado: number, eliminoLista108: boolean): void {
    if (recalculo107) {
      if (this.lista108.lisCasilla108.length !== 0) {
        this.impuestoRtaEmpresa.mtoCas880 = null;
      } else if (eliminoLista108) {
        this.impuestoRtaEmpresa.mtoCas880 = 0;
      } else {
        this.impuestoRtaEmpresa.mtoCas880 = this.impuestoRtaEmpresa.mtoCas880;
      }
    } else if (resultado < 0) {
      this.impuestoRtaEmpresa.mtoCas880 = 0;
    } else if (resultado >= 0) {
      this.impuestoRtaEmpresa.mtoCas880 = null;
    }
  }

  public calcular108(): void {
    if (Math.abs(Number(this.impuestoRtaEmpresa.mtoCas107)) > 0 || (Number(this.impuestoRtaEmpresa.mtoCas107) === 0 && Number(this.impuestoRtaEmpresa.mtoCas106) === 0)) {
      this.impuestoRtaEmpresa.mtoCas108 = this.lista108.lisCasilla108.filter(x => x.codTipMto === '1').reduce((total, montos) => total + Number(montos.mtoLiteral), 0);
    } else {
      this.impuestoRtaEmpresa.mtoCas108 = this.lista108.lisCasilla108.filter(x => x.codTipMto === '2').reduce((total, montos) => total + Number(montos.mtoLiteral), 0);
    }
  }

  private formulaCasilla110(): number {
    const resultado = Number(this.impuestoRtaEmpresa.mtoCas106) - Number(this.impuestoRtaEmpresa.mtoCas108);
    return resultado < 0 ? 0 : resultado;
  }

  private obtenerTotalPerdidasAAAA(): number {
    return Number(this.lista108.lisCasilla108.filter(x => x.codTipMto === '1').reduce((total, montos) => total + Number(montos.mtoLiteral), 0));
  }

  // PANTALLA CRED. CONTRA IMP. RENTA
  public calcularSUBTOTALCredSinDevolucion(): void {
    this.credImprenta.mtoCas504 = this.formulaCasilla504();
    this.calcularSUBTOTALCredConDevolucion();
  }

  public calcularSUBTOTALCredConDevolucion(): void {
    this.credImprenta.mtoCas506 = Number(this.credImprenta.mtoCas504) - (Number(this.credImprenta.mtoCas127) + Number(this.credImprenta.mtoCas128) +
      Number(this.credImprenta.mtoCas130) + Number(this.credImprenta.mtoCas129));
    this.validarFormatoCasilla506();
    this.calcularSaldoItan();
  }

  public calcularSaldoItan(): void {
    if (this.habilitarItan.habilitarCasillasITAN()) {
      let valorCasilla = 0;
      if (this.credImprenta.mtoCas506 <= 0) {
        valorCasilla = this.credImprenta.mtoCas131;
      } else if (this.credImprenta.mtoCas506 >= this.credImprenta.mtoCas131) {
        valorCasilla = 0;
      } else if (this.credImprenta.mtoCas506 < this.credImprenta.mtoCas131) {
        valorCasilla = Math.abs(this.credImprenta.mtoCas506 - this.credImprenta.mtoCas131);
      }
      this.credImprenta.mtoCas279 = valorCasilla;
      if (this.credImprenta.mtoCas279 <= 0) {
        this.credImprenta.mtoCas783 = null;
      }
    }
    this.calcularSaldoAfavor();
  }

  private formulaCasilla504(): number {
    const resultado = Number(this.impuestoRtaEmpresa.mtoCas113) - (Number(this.credImprenta.mtoCas123) + Number(this.credImprenta.mtoCas134) +
      Number(this.credImprenta.mtoCas136) + Number(this.credImprenta.mtoCas125) + Number(this.credImprenta.mtoCas126));
    return resultado < 0 ? 0 : resultado;
  }

  public validarFormatoCasilla506(): void {
    if (this.credImprenta.mtoCas506 < 0) {
      this.casilla506.indFormatoNegativo = true;
    } else {
      this.casilla506.indFormatoNegativo = false;
    }
  }

  public validarFormatoCasilla131(): void {
    if (Number(this.casInformativa.mtoCas824) === 0 && this.habilitarItan.habilitarCasillasITAN()) {
      this.casilla131.codTipCas = ConstantesCasillas.CODIGO_TIPO_CASILLA_EDITABLE_FORMATO_NUMERICO;
      this.casilla131.indEditable = false;
    } else {
      this.casilla131.codTipCas = ConstantesCasillas.CODIGO_TIPO_CASILLA_CON_ASISTENTE;
      this.casilla131.indEditable = true;
    }
  }

  // PANTALLA DETERMINACION DE LA DEUDA
  public calcularSaldoAfavor(): void {
    const monto138 = this.casDetDeudaPJ.mtoCas138;
    let valor139 = false;
    if (Number(this.credImprenta.mtoCas506) < 0) {
      this.casDetDeudaPJ.mtoCas138 = Math.abs(Number(this.credImprenta.mtoCas506));
      this.casDetDeudaPJ.mtoCas139 = 0;
      this.deshabilitarCas141y145();
    } else {
      this.casDetDeudaPJ.mtoCas138 = 0;
      this.casDetDeudaPJ.mtoCas139 = this.formulaCasilla139();
      valor139 = true;
      if (this.formulaCasilla139() > 0) {
        this.habilitarCas141y145();
      } else {
        this.deshabilitarCas141y145();
      }
    }

    if (monto138 !== this.casDetDeudaPJ.mtoCas138 || valor139) {
      this.casDetDeudaPJ.mtoCas137 = null;
    }

    this.calcularTotalDeudaTributario();
  }

  private calcularTotalDeudaTributario(): void {
    this.casDetDeudaPJ.mtoCas505 = Number(this.casDetDeudaPJ.mtoCas139);
    this.calcularInteresMoratorio();
  }

  public calcularInteresMoratorio(): void {
    if (this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria === '0') {
      const tributoResultante = this.casDetDeudaPJ.mtoCas505 - this.casDetDeudaPJ.mtoCas141 - this.casDetDeudaPJ.mtoCas144;
      const factor = SessionStorage.getFactorInteresMoratorio();
      const total = Math.round(tributoResultante * factor);
      if (tributoResultante < 0) {
        this.casDetDeudaPJ.mtoCas145 = 0;
      } else {
        this.casDetDeudaPJ.mtoCas145 = total;
      }
    }
    this.calcularSaldoDeuda();
  }

  public calcularSaldoDeuda(): void {
    this.casDetDeudaPJ.mtoCas146 = this.formulaCasilla146();
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  private formulaCasilla139(): number {
    const resultado = Number(this.credImprenta.mtoCas506) - Number(this.credImprenta.mtoCas131);
    return resultado <= 0 ? 0 : resultado;
  }

  private formulaCasilla146(): number {
    const resultado = Number(this.casDetDeudaPJ.mtoCas505) - Number(this.casDetDeudaPJ.mtoCas141) - Number(this.casDetDeudaPJ.mtoCas144) + Number(this.casDetDeudaPJ.mtoCas145);
    return resultado >= 0 ? resultado : 0;
  }

  public validarFormato141y145(): void {
    if (Number(this.credImprenta.mtoCas506) < 0) {
      this.deshabilitarCas141y145();
    } else if (this.formulaCasilla139() > 0) {
      this.habilitarCas141y145();
    } else {
      this.deshabilitarCas141y145();
    }
  }

  private habilitarCas141y145(): void {
    this.casilla141.indEditable = true;
    this.cambiarTipoCas145();
  }

  private deshabilitarCas141y145(): void {
    this.casilla141.indEditable = false;
    this.casilla145.indEditable = false;
    this.casilla145.codTipCas = ConstantesCasillas.CODIGO_TIPO_CASILLA_EDITABLE_FORMATO_NUMERICO;
    this.casDetDeudaPJ.mtoCas141 = null;
    this.casDetDeudaPJ.mtoCas145 = null;
  }

  private cambiarTipoCas145(): void {
    if (this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria === '1') {
      this.casilla145.indEditable = true;
      this.casilla145.codTipCas = ConstantesCasillas.CODIGO_TIPO_CASILLA_EDITABLE_FORMATO_NUMERICO;
    } else {
      this.casilla145.codTipCas = ConstantesCasillas.CODIGO_TIPO_CASILLA_CALCULADA;
    }
  }

}
