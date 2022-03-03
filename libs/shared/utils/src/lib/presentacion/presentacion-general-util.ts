import { Presentacion, FormularioPresentacion, PlataformaPresentacion, TipoPagoPresentacion, TributoPagado } from '@rentas/shared/types';
import { DispositivoUtil } from '../dispositivo/dispositivo-util';
import { SessionStorage } from '../session-storage/session-storage';
import { CasillaFormulario } from '@rentas/shared/types';


export abstract class PresentacionGeneralUtil implements Presentacion {
  tipoPago: TipoPagoPresentacion;
  codTipoDeclara: PlataformaPresentacion;
  identificadorPresentacion: string;
  versionBrowser: string;
  versionSO: string;
  direccionIP: string;
  cantidadFormularios: number;
  montoTotalPagar: number;
  fechaEnvio: string;
  ruc: string;
  numMacAdr: string;
  codigoMedioPresentacion: string;
  razonSocial: string;
  formularios: FormularioPresentacion[];
  preDeclaracion: any;

  constructor(tipo: PlataformaPresentacion) {
    this.codTipoDeclara = tipo;
  }

  abstract obtenerFormularios(): Array<FormularioPresentacion>;
  abstract obtenerMontoTotal(): number;
  abstract obtenerTributoPagado(): Array<TributoPagado>;
  abstract obtenerCasillasForm(): Array<CasillaFormulario>;
  abstract obtenerCasillasBoleta(monto?: number, tributo?: string): Array<CasillaFormulario>;
  abstract setPredeclaracionCasTipCam5(): void;

  setTrubutosDefault(): PresentacionGeneralUtil {
    this.identificadorPresentacion = DispositivoUtil.generateUuid();
    this.versionBrowser = DispositivoUtil.getNavegador();
    this.versionSO = DispositivoUtil.getSO();
    this.fechaEnvio = '';
    this.ruc = SessionStorage.getnumRuc();
    this.razonSocial = SessionStorage.getrazonSocial();
    this.numMacAdr = '';
    this.codigoMedioPresentacion = '01';
    this.preDeclaracion = this.getPredeclaracion();
    // this.setPredeclaracionCasTipCam5();
    this.montoTotalPagar = this.obtenerMontoTotal();
    this.formularios = this.obtenerFormularios();
    this.cantidadFormularios = this.formularios.length;
    return this;
  }

  setTipoPago(tipoPago: TipoPagoPresentacion): PresentacionGeneralUtil {
    this.tipoPago = tipoPago;
    return this;
  }

  setDireccionIP(direccionIP: string): PresentacionGeneralUtil {
    this.direccionIP = direccionIP;
    return this;
  }

  buildRequest(): Presentacion {
    this.setTrubutosDefault();
    return JSON.parse(JSON.stringify(this));
  }

  protected getPredeclaracion() {
    return SessionStorage.getPreDeclaracion<any>();
  }

}