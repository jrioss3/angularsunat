import { Boleta, Constancia, ConstanciaRespuesta, MedioPago, NpsRespuesta, RowConstnacia } from '@rentas/shared/types';

export class ConstanciaRespuestaUtil {

  private _constanciaRespuesta: ConstanciaRespuesta = null;
  private _nps: NpsRespuesta = null;
  private _respuesta: any = null;
  constructor(respuesta: any) {

    this._respuesta = respuesta;

    /* se obtiene constancia */
    if (respuesta.constancia) {
      this._constanciaRespuesta = respuesta.constancia;
    } else {
      this._constanciaRespuesta = respuesta;
    }

    /* se obtiene nps */
    if (respuesta.nps) {
      this._nps = {
        numeroNPS: respuesta.numeroNPS,
        fechaVigenciaNPS: respuesta.fechaVigenciaNPS,
        nps: respuesta.nps
      }
    } else {
      this._nps = null;
    }

  }

  get constanciaRespuesta() {
    return this._constanciaRespuesta;
  }

  get npsRespuesta(): NpsRespuesta {
    return this._nps;
  }

  get medioPago(): MedioPago {
    if (this._respuesta.constancia) {
      return this._constanciaRespuesta.resultadoPago.codMedPag as MedioPago;
    }
    return MedioPago.PAGO_CERO;
  }

  get esPagoNps(): boolean {
    return this._nps != null;
  }

  get esPagoBanco(): boolean {
    return this.medioPago === MedioPago.BANCOS ||
      this.medioPago === MedioPago.CUENTA_DETRACCIONES ||
      this.medioPago === MedioPago.VISA;
  }


  getListRowConstancias(): Array<RowConstnacia> {
    return this.constanciaRespuesta.constancias.reduce((_carry, constancia) => {

      const formularios = Array.of<RowConstnacia>({
        codigoFormulario: constancia.codigoFormulario,
        descripcionFormulario: constancia.descripcionFormulario,
        descripcionTributo: constancia.descripcionTributo,
        numeroOrden: Number(constancia.numeroOrden),
        periodoTributario: constancia.periodoTributario,
        codigoTributo: '-',
        esBoleta: false,
        montoPago: 0,
        codFormularioAsociado: '',
        numOrdAsociado: '',
        resultado: this.constanciaRespuesta.resultado,
        resultadoPago: this.constanciaRespuesta.resultadoPago,
        detalleTributos: constancia.detalleTributos,
        pagoPendientes: constancia.pagoPendientes,
        rectificatoria: constancia.rectificatoria,
        esNps: this.esPagoNps
      });

      if (this.esPagoBanco) {
        return formularios.concat(
          constancia.boletas
            .filter(boleta => boleta.montoPago > 0)
            .map(this.parseBoletaRowConstancia.bind(this, constancia))
        )
      }
      return formularios;

    }, []);
  }

  private parseBoletaRowConstancia(constancia: Constancia, boleta: Boleta): RowConstnacia {
    return {
      ...boleta,
      esBoleta: true,
      codFormularioAsociado: constancia.codigoFormulario,
      numOrdAsociado: constancia.numeroOrden,
      resultado: this.constanciaRespuesta.resultado,
      resultadoPago: this.constanciaRespuesta.resultadoPago,
      detalleTributos: [],
      pagoPendientes: [],
      rectificatoria: '',
      esNps: false
    };
  }



}