import { TipoPagoPresentacion, CasillaFormulario, FormularioPresentacion, TipoFormulario, TributoPagado } from '@rentas/shared/types';
import { SessionStorage } from '../session-storage/session-storage';
import { PresentacionGeneralUtil } from './presentacion-general-util';
import { ConstantesParametros, ConstantesTributos } from '@rentas/shared/constantes';
import * as moment from 'moment';
import { FactoryFormularioUitl } from './factory-formulario-uitl';
import { FilterCasilla } from './filter-casilla-presentacion';
import { Casilla108 } from '../casillas/casillas-108';


export class PresentacionJuridicoUtil extends PresentacionGeneralUtil {

  obtenerCasillasForm(): CasillaFormulario[] {

    let casillas: CasillaFormulario[] = [];
    const declaracion = this.getPredeclaracion().declaracion;
    const indRectificatoria = this.getPredeclaracion().declaracion.generales.cabecera.indRectificatoria;

    const findCasillas = (objeto) => {

      if (objeto === null || objeto === undefined)
        return;

      const keys = Object.keys(objeto);
      for (const key of keys) {
        if (typeof objeto[key] === 'object') {
          findCasillas(objeto[key]);
        } else if (/^.*mtoCas.*$/.test(key) && (typeof objeto[key] === 'number' || typeof objeto[key] === 'string')) {
          casillas.push({
            numCas: Number(key.substr(6)),
            codTipCam: this.findTipoCasilla(key.substr(6)),
            desValCas: objeto[key],
            indDel: '0'
          });
        }
      }
    }

    findCasillas(declaracion);

    // la casilla '2' se tiene que quitar por regla negocio.
    casillas = casillas.filter(c => c.numCas !== 2);

    // para renta se tiene que agregar estas casillas por defecto
    const casillasPordefecto = Array.of<CasillaFormulario>(
      { codTipCam: '01', desValCas: SessionStorage.getnumRuc(), indDel: '0', numCas: 2 },
      { codTipCam: '01', desValCas: indRectificatoria, indDel: '0', numCas: 5 },
      { codTipCam: '01', desValCas: moment().format('DD/MM/YYYY'), indDel: '0', numCas: 13 },
      { codTipCam: '01', desValCas: moment().format('HH:mm:ss'), indDel: '0', numCas: 58 },
      { codTipCam: '01', desValCas: SessionStorage.getPerTri(), indDel: '0', numCas: 7 },
      { codTipCam: '01', desValCas: indRectificatoria, indDel: '0', numCas: 805 },
      { codTipCam: '01', desValCas: indRectificatoria, indDel: '0', numCas: 871 },
      { codTipCam: '01', desValCas: 1, indDel: '0', numCas: 61 }
    );

    casillas = casillas.concat(this.addCasillasAsociadaAla108());

    // en el formulario Virtual se tiene que poner 0 a los montos, si su tipo es 5.
    // es por regla de negocio
    casillas = casillas.map(cs => {
      if (cs.codTipCam === '05')
        cs.desValCas = 0;
      return cs;
    });

    return FilterCasilla
      .newInstance(casillas.concat(casillasPordefecto)).executeFilter();
  }

  addCasillasAsociadaAla108(): CasillaFormulario[] {
    const lista108 =  this.getPredeclaracion().declaracion.seccDeterminativa.impuestoRta.casilla108.lisCasilla108;
    return lista108.map( item => {
      const numCas = Casilla108.obtenerNumeroCasilla(item.desValLiteral, item.codTipMto);
      return {
        codTipCam:'01', desValCas: item.mtoLiteral, indDel:'0', numCas
      }
    });
  }

  obtenerCasillasBoleta(): CasillaFormulario[] {
    return Array.of<CasillaFormulario>(
      { numCas: 2, codTipCam: '10', desValCas: SessionStorage.getnumRuc(), indDel: '0' },
      { numCas: 7, codTipCam: '10', desValCas: SessionStorage.getPerTri(), indDel: '0' },
      { numCas: 13, codTipCam: '11', desValCas: moment().format('DD/MM/YYYY'), indDel: '0' },
      { numCas: 58, codTipCam: '01', desValCas: moment().format('HH:mm:ss'), indDel: '0' },
      { numCas: 600, codTipCam: '01', desValCas: ConstantesTributos.RENTA_PERS_JUR.codigo, indDel: '0' },
      { numCas: 651, codTipCam: '05', desValCas: this.obtenerMontoTotal(), indDel: '0' }
    );
  }

  obtenerTributoPagado(): TributoPagado[] {
    const mtoCas146 = this.getPredeclaracion().declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas146 ?? 0;
    const mtoCas180 = this.getPredeclaracion().declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180 ?? 0;

    const importeDeuda = this.noEsInafecto() ? mtoCas146 : 0;
    const importePagar = this.noEsInafecto() ? mtoCas180 : 0;

    return Array.of<TributoPagado>({
      codTri: ConstantesTributos.RENTA_PERS_JUR.codigo, // 030801 FIJO EN PPJJ
      indDel: '0', // 0 FIJO
      indVig: '1', // 1 FIJO
      mtoBasImp: 0, // -> no sabemos
      mtoImpres: 0, // -> no sabemos
      mtoPagTot: importePagar, // Importe a pagar
      mtoResPag: 0, // 0 FIJO
      mtoTotDeu: importeDeuda, // lo que debemos, en la casilla de deuda.
      perTri: Number(SessionStorage.getPerTri())
    });
  }

  obtenerFormularios(): FormularioPresentacion[] {
    const formularios: Array<FormularioPresentacion> = [];
    const formulario = FactoryFormularioUitl.newInstance(TipoFormulario.FORMULARIO);
    formulario.setCodFor(ConstantesParametros.COD_FORMULARIO_PPJJ)
      .setDesFor(SessionStorage.getFormulario<any>().descripcion)
      .setListTributosPagados(this.obtenerTributoPagado())
      .setListCasillas(this.obtenerCasillasForm())
      .setMtoPag(this.obtenerMontoTotal());

    formularios.push(formulario);

    if (this.tipoPago !== TipoPagoPresentacion.NPS && this.tipoPago !== TipoPagoPresentacion.PAGOCERO) {

      const forBoleta = FactoryFormularioUitl.newInstance(TipoFormulario.BOLETA);
      forBoleta.setCodFor(ConstantesParametros.COD_FORMULARIO_BOLETA)
        .setDesFor(ConstantesParametros.DES_FORMULARIO_BOLETA)
        .setListTributosPagados(this.obtenerTributoPagado())
        .setListCasillas(this.obtenerCasillasBoleta())
        .setMtoPag(this.obtenerMontoTotal());

      formularios.push(forBoleta);
    }

    return formularios;
  }

  obtenerMontoTotal(): number {
    const monto180 = this.getPredeclaracion().declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180;
    const mtoPag = monto180 ? monto180 : 0;
    return mtoPag;
  }

  setPredeclaracionCasTipCam5(): void {
    this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ.mtoCas180 = 0;
  }

  private noEsInafecto(): boolean {
    // ES INAFECTO ???  1 ==>SI, 0 ==>NO
    let mtoCas217 = this.getPredeclaracion().declaracion.seccInformativa.casInformativa.mtoCas217;
    mtoCas217 = mtoCas217 ? Number(mtoCas217) : 0;
    return mtoCas217 === 0;
  }

  private findTipoCasilla(numcas: string) {
    const tipoCasillas = SessionStorage.getTipoCasillas();
    const tipo = tipoCasillas.find(tc =>
      tc.codFormulario === ConstantesParametros.COD_FORMULARIO_PPJJ &&
      tc.numCasilla === numcas
    )?.tipoCasilla ?? '01';

    return tipo;
  }

}