import { ConstantesIdentificacion } from './../utils/constantesIdentificacion';
import { Injectable } from '@angular/core';
import { PreDeclaracionModel } from '../models/preDeclaracionModel';
import { ChatErrorService } from '@rentas/shared/core';
import { PrincipalesSociosService } from './principales-socios.service';
import { ConstantesDocumentos, MensajeGeneralesObj } from '@rentas/shared/constantes';
import { ComboService, ValidacionService, ErroresService } from '@rentas/shared/core';
import { SessionStorage } from '@rentas/shared/utils';
import { ListaParametro, UserData } from '@rentas/shared/types';
import { HabilitarCasillas2021Service } from './habilitar-casillas-2021.service';

@Injectable()
export class ValidacionesService {

  public errorsArrayObjInfo: any[] = [];
  public errorsArrayObjDet: any[] = [];
  private preDeclaracion: PreDeclaracionModel;
  private userData: UserData;
  private valorUIT: number;
  private cantidadUITS: number;
  private rucPN20: ListaParametro[];

  constructor(
    private comboService: ComboService,
    private errorChat: ChatErrorService,
    private principalesSociosService: PrincipalesSociosService,
    private habilitarItan: HabilitarCasillas2021Service,
    private erroresService: ErroresService) { }

  public validarInformativa(): void {
    this.userData = SessionStorage.getUserData();
    this.errorsArrayObjInfo = [];
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    this.rucPN20 = this.comboService.obtenerComboPorNumero('R06').filter(x => x.val === this.preDeclaracion.numRuc);
    this.excepcion_1();
    this.excepcion_2();
    this.excepcion_3();
    this.excepcion_4();
    this.excepcion_5();
    this.excepcion_6();
    this.excepcion_7();
    this.excepcion_8();
    this.excepcion_9();
    this.excepcion_10();
    this.excepcion_11();
    this.excepcion_12();
    this.excepcion_13();
    this.excepcion_14();
    this.excepcion_15();
    this.excepcion_16();
    this.excepcion_17();
    if (this.errorsArrayObjInfo.length !== 0) {
      this.showErrorsArray();
    } else {
      this.errorChat.enviarMensaje([''], false);
    }
  }

  public validarTipoRegimen(): boolean {
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas213 == null) {
      this.erroresService.mostrarModalError([MensajeGeneralesObj.mensajeValidaciones6]);
      return false;
    } else {
      return true;
    }
  }

  private excepcion_1(): void {
    if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas213 == null) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones6);
    }
  }

  private excepcion_2(): void {
    if (Number(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas803) ===
      Number(ConstantesIdentificacion.EXONERADO_SI) &&
      this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas210 == null) {
      MensajeGeneralesObj.mensajeValidaciones7.mensaje = MensajeGeneralesObj.mensajeValidaciones7.mensaje + ' de la Exoneración.';
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones7);

    } else if (Number(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas210) ===
      Number(ConstantesIdentificacion.OTROS_EXONERADO) &&
      this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas216 == null) {
      MensajeGeneralesObj.mensajeValidaciones8.mensaje = MensajeGeneralesObj.mensajeValidaciones8.mensaje + ' de la Exoneración.';
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones8);
    }
  }

  private excepcion_3(): void {
    if (Number(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas217) === Number(ConstantesIdentificacion.INAFECTO_SI) &&
      this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas221 == null) {
      MensajeGeneralesObj.mensajeValidaciones7.mensaje = MensajeGeneralesObj.mensajeValidaciones7.mensaje + ' de la Inafectación.';
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones7);
    } else if (Number(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas221) ===
      Number(ConstantesIdentificacion.OTROS_INAFECTO) &&
      this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas222 == null) {
      MensajeGeneralesObj.mensajeValidaciones8.mensaje = MensajeGeneralesObj.mensajeValidaciones8.mensaje + ' de la Inafectación.';
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones8);
    }
  }

  private excepcion_4(): void {
    if (this.faltaTipoSocio()) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.validacionLisPrinAccionistasFichaRuc);
    } else if (this.existeInconsistencias()) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.validacionLisPrinAccionistas);
    }
  }

  private faltaTipoSocio(): boolean {
    return this.preDeclaracion.declaracion.seccInformativa.prinAccionistas.lisPrinAccionistas.some(x => {
      return x.codTipDocSocio == null;
    });
  }

  private existeInconsistencias(): boolean {
    return this.preDeclaracion.declaracion.seccInformativa.prinAccionistas.lisPrinAccionistas.some(x => {
      return (x.numFormul == null || x.numFormul === '')
        || (x.codTipDocSocio == null || x.codTipDocSocio === '')
        || (x.codTipDocPrincipal == null || x.codTipDocPrincipal === '')
        || (x.numDocPrincipal == null || x.numDocPrincipal === '')
        || (x.desDocPrincipal == null || x.desDocPrincipal === '')
        || (x.porParticipacion == null || (Number(x.porParticipacion) <= 0 || Number(x.porParticipacion) > 100))
        || ((x.codTipDocSocio === '03' || x.codTipDocSocio === '04') && (x.codPais == null || x.codPais === ''))
        || ((x.codTipDocSocio === '01' || x.codTipDocSocio === '03' || x.codTipDocSocio === '05')
          && (x.fecNacPrincipal == null || x.fecNacPrincipal === ''))
        || (x.fecConstitucion == null || x.fecConstitucion === '')
        || (x.codTipDocPrincipal === ConstantesDocumentos.DNI
          && (x.numDocPrincipal.length !== 8 || !x.numDocPrincipal.match(/^[0-9]*$/)))
        || (x.codTipDocPrincipal === ConstantesDocumentos.RUC
          && (x.numDocPrincipal.length !== 11 || !ValidacionService.valruc(x.numDocPrincipal)));
    })
  }

  private excepcion_5(): void {
    if (this.preDeclaracion.declaracion.seccInformativa.alquileres.lisAlquileres.some(x => {
      return (x.numCorrPredio == null)
        || (x.codDocIdeDec == null || x.codDocIdeDec === '')
        || (x.numDocIdeDec == null || x.numDocIdeDec === '')
        || (x.mtoAlquiler == null)
        || (x.codTipBien == null || x.codTipBien === '')
        || ((x.codTipBien === '01' || x.codTipBien === '03')
          && (x.codSubTipBien == null || x.codSubTipBien === ''))
        || ((x.codTipBien === '01' || x.codTipBien === '03')
          && (x.desBienAlq == null || x.desBienAlq === ''))
        || (x.codDocIdeDec === ConstantesDocumentos.DNI
          && (x.numDocIdeDec.length !== 8 || !x.numDocIdeDec.match(/^[0-9]*$/)))
        || (x.codDocIdeDec === ConstantesDocumentos.RUC
          && (x.numDocIdeDec.length !== 11 || !ValidacionService.valruc(x.numDocIdeDec)));
    })) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.validacionLisAlquileres);
    }
  }

  private excepcion_6(): void {
    if (this.preDeclaracion.declaracion.seccInformativa.t8999donacion.lisT8999donacion.some(x => {
      return (x.numDonacion == null)
        || (x.codTipDonacion == null || x.codTipDonacion === '')
        || (x.codModDonacion == null || x.codModDonacion === '')
        || (x.codTipDocDonat == null || x.codTipDocDonat === '')
        || (x.numDocDonat == null || x.numDocDonat === '')
        || (x.desDocDonat == null || x.desDocDonat === '')
        || (x.fecDonacion == null || x.fecDonacion === '')
        || (x.mtoDonacion == null || x.mtoDonacion <= 0)
        || (x.codTipDocDonat === ConstantesDocumentos.DNI
          && (x.numDocDonat.length !== 8 || !x.numDocDonat.match(/^[0-9]*$/)))
        || (x.codTipDocDonat === ConstantesDocumentos.RUC
          && (x.numDocDonat.length !== 11 || !ValidacionService.valruc(x.numDocDonat)));
    })) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.validacionLisT8999donacion);
    }
  }

  private excepcion_7(): void {
    if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas687 == null) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.CUS8_EX01);
    } else if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas687 === ConstantesDocumentos.DNI) {
      if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas207 == null) {
      } else if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas207.length !== 8 ||
        !this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas207.match(/^[0-9]*$/)) {
        this.errorsArrayObjInfo.push(MensajeGeneralesObj.CUS8_EX01);
      }
    } else if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas687 === ConstantesDocumentos.RUC) {
      if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas208 == null) {
        this.errorsArrayObjInfo.push(MensajeGeneralesObj.CUS8_EX01);
      } else if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas208.length !== 11 ||
        !ValidacionService.valruc(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas208)) {
        this.errorsArrayObjInfo.push(MensajeGeneralesObj.CUS8_EX01);
      }
    }
  }

  private excepcion_8(): void {
    if (Number(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas829) === 1 &&
      this.preDeclaracion.declaracion.seccInformativa.alquileres.lisAlquileres.length === 0) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.CUS8_EX02);
    }
  }

  private excepcion_9(): void {
    const empresasSAC = ["26", "38", "39"];
    if (empresasSAC.includes(this.userData.map.ddpData.ddp_tpoemp) && this.preDeclaracion.declaracion.seccInformativa.prinAccionistas.lisPrinAccionistas.length < 2) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.CUS8_EX06);
    } else if (this.preDeclaracion.numRuc.substring(0, 2) === '20' && this.rucPN20.length === 0 && this.principalesSociosService.valorPreguntaSocios &&
      this.preDeclaracion.declaracion.seccInformativa.prinAccionistas.lisPrinAccionistas.length === 0) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.CUS8_EX03);
    }
  }

  private excepcion_10(): void {
    if (Number(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas829) === 1 &&
      this.preDeclaracion.declaracion.seccInformativa.alquileres.lisAlquileres.length !== 0 && this.valido()) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.CUS8_EX05);
    }
  }

  private excepcion_11(): void {
    if (Number(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas819) === 1 &&
      this.preDeclaracion.declaracion.seccInformativa.t8999donacion.lisT8999donacion.length === 0) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.CUS8_EX04);
    }
  }

  private excepcion_12(): void {
    const { mtoCas225, mtoCas226, mtoCas817, mtoCas782 } = this.preDeclaracion.declaracion.seccInformativa.casInformativa
    if (this.preDeclaracion.numRuc.substring(0, 2) === '20' && this.rucPN20.length === 0 && mtoCas225 == null) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones17);
    } else if (mtoCas225 != null && mtoCas226 == null) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones9);
    } else if ((mtoCas225 === ConstantesDocumentos.PASAPORTE || mtoCas225 === ConstantesDocumentos.CARNET_DE_EXTRANJERIA
      || mtoCas225 === ConstantesDocumentos.PTP || mtoCas225 === ConstantesDocumentos.CARNET_IDENTIDAD) && mtoCas817 == null) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones12);
    } else if (mtoCas225 === ConstantesDocumentos.DNI && mtoCas226.length !== 8) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.CUS4_EX01);
    } else if ((mtoCas225 === ConstantesDocumentos.RUC && mtoCas226.length !== 11)) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.CUS4_EX01);
    } else if (mtoCas225 != null && Number(mtoCas782) === 0) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones19);
    }
  }

  private excepcion_13(): void {
    const valor252 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas252;
    const valor253 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas253;
    const valor254 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas254;
    const valor255 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas255;
    const valor256 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas256;
    const valor257 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas257;
    const valor258 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas258;
    const valor259 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas259;
    const valor260 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas260;
    const valor261 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas261;
    const valor262 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas262;
    const valor263 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas263;

    const correo = (valor252 ? valor252 : '') + (valor253 ? valor253 : '')
      + (valor254 ? valor254 : '') + (valor255 ? valor255 : '')
      + (valor256 ? valor256 : '') + (valor257 ? valor257 : '');
    const correo2 = (valor258 ? valor258 : '') + (valor259 ? valor259 : '')
      + (valor260 ? valor260 : '') + (valor261 ? valor261 : '')
      + (valor262 ? valor262 : '') + (valor263 ? valor263 : '');

    if (valor252 == null &&
      this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas687 !== ConstantesDocumentos.SIN_DATOS) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones10);
    } else if (ValidacionService.ValidarEmail2(correo, correo2) &&
      this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas687 !== ConstantesDocumentos.SIN_DATOS) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones11);
    } else if (valor258 != null) {
      if (ValidacionService.ValidarEmail2(correo, correo2)) {
        this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones11);
      }
    }
  }

  private excepcion_14(): void {
    if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas211 != null) {
      if (!this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas211.match(/^[a-zA-Z0-9]*$/) ||
        this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas211.length > 15) {
        this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones13);
      }
    }
  }

  private excepcion_15(): void {
    if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas251 != null) {
      if (!this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas251.match(/^[0-9]*$/) ||
        this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas251.length !== 9 ||
        this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas251.charAt(0) !== '9') {
        this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones14);
      }
    }
  }

  private excepcion_16(): void {
    if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas250 != null) {
      if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas250.match(/^[0-9]{2,3}(\-)([0-9]*)$/)) {
        if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas250.charAt(0) !== '0') {
          this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones15);
        }
        if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas250.length !== 10) {
          this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones15);
        }
      } else if (!this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas250.match(/^[0-9]*$/)) {
        this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones15);
      } else {
        if ((this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas250.length === 6
          || this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas250.length === 7) &&
          (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas250.substr(0, 1) === '0'
            || this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas250.substr(0, 1) === '9')) {
          this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones15);
        }
        if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas250.length < 6
          || this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas250.length > 7) {
          this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones15);
        }
      }
    }
  }

  private excepcion_17(): void {
    const porcentajeTotal = Number(this.preDeclaracion.declaracion.seccInformativa.prinAccionistas.lisPrinAccionistas.reduce((total, socio) => total + Number(socio.porParticipacion), 0).toFixed(8));
    if (this.preDeclaracion.declaracion.seccInformativa.prinAccionistas.lisPrinAccionistas.length !== 0 && porcentajeTotal !== 100 && this.preDeclaracion.numRuc.substring(0, 2) === '20' && this.rucPN20.length === 0) {
      this.errorsArrayObjInfo.push(MensajeGeneralesObj.mensajeValidaciones18);
    }
  }

  private valido(): boolean {
    return this.preDeclaracion.declaracion.seccInformativa.alquileres.lisAlquileres.some(x => {
      return Number(x.mtoAlquiler) === 0;
    });
  }

  public validarEstadosFinancieros(): boolean {
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    this.valorUIT = this.comboService.obtenerUitEjercicioActual();
    this.cantidadUITS = this.comboService.obtenerCantidadUITs();
    const UIT = this.valorUIT * this.cantidadUITS;
    const ingresos = this.calcularIngresos();
    if (ingresos > UIT) {
      this.erroresService.mostrarModalError([MensajeGeneralesObj.mensajeValidaciones2]);
      return false;
    }
    return true;
  }

  private calcularIngresos(): number {
    return (Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas461)
      - Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas462))
      + (Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas473))
      + Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas475)
      + (Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia.mtoCas477));
  }

  public validarDeterminativa(tab: string): void {
    this.errorsArrayObjDet = [];
    this.errorsArrayObjInfo = [];
    this.userData = SessionStorage.getUserData();
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    this.rucPN20 = this.comboService.obtenerComboPorNumero('R06').filter(x => x.val === this.preDeclaracion.numRuc);
    this.excepcion_2_det();
    if (tab !== '') {
      this.excepcion_3_det();
      this.excepcion_4_det();
      this.excepcion_5_det();
      this.excepcion_6_det();
    }
    this.excepcion_1();
    this.excepcion_2();
    this.excepcion_3();
    this.excepcion_4();
    this.excepcion_5();
    this.excepcion_6();
    this.excepcion_7();
    this.excepcion_8();
    this.excepcion_9();
    this.excepcion_10();
    this.excepcion_11();
    this.excepcion_12();
    this.excepcion_13();
    this.excepcion_14();
    this.excepcion_15();
    this.excepcion_16();
    this.excepcion_17();
    if (this.errorsArrayObjDet.length !== 0 || this.errorsArrayObjInfo.length !== 0) {
      this.showErrorsArray();
    } else {
      this.errorChat.enviarMensaje([''], false);
    }
  }

  private excepcion_2_det(): void {
    const activo = Math.abs(Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.activoEmp.mtoCas390));
    const pasivo = Math.abs(Number(this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.pasivoPatrEmp.mtoCas426));
    if (activo !== pasivo) {
      this.errorsArrayObjDet.push(MensajeGeneralesObj.mensajeValidaciones5);
    }
  }

  private excepcion_3_det(): void {
    if (Number(this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180) >
      Number(this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas146)) {
      this.errorsArrayObjDet.push(MensajeGeneralesObj.mensajeValidaciones1);
    }
  }

  private excepcion_4_det(): void {
    if (this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180 == null
      || String(this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180) === '') {
      this.errorsArrayObjDet.push(MensajeGeneralesObj.mensajeValidaciones3);
    }
  }

  private excepcion_5_det(): void {
    if (Math.abs(Number(this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas138)) > 0 &&
      Number(this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas137) === 0) {
      this.errorsArrayObjDet.push(MensajeGeneralesObj.CUS14_EX01);

    } else if (Number(this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas137) > 2) {
      this.errorsArrayObjDet.push(MensajeGeneralesObj.CUS14_EX03);
    }
  }

  private excepcion_6_det(): void {
    const { mtoCas783, mtoCas279 } = this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta;
    if (this.habilitarItan.habilitarCasillasITAN() && Math.abs(mtoCas279) > 0 && mtoCas783 === null) {
      this.errorsArrayObjDet.push(MensajeGeneralesObj.CUS13_EX20);
    }
  }

  private showErrorsArray(): void {
    let arregloErrores = [];
    arregloErrores = arregloErrores.concat(this.errorsArrayObjInfo);
    arregloErrores = arregloErrores.concat(this.errorsArrayObjDet);

    const arregloErroresBackend = SessionStorage.getErroresBackend();

    if (arregloErroresBackend != null && arregloErroresBackend !== undefined) {
      arregloErrores = arregloErrores.concat(arregloErroresBackend)
    }

    if (arregloErrores.length !== 0) {
      this.erroresService.mostrarModalError(arregloErrores);
      this.errorChat.enviarMensaje(arregloErrores, true);
    } else {
      this.errorChat.enviarMensaje([], false);
    }
  }
}
