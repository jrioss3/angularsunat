import { CasillaFormulario, FormularioPresentacion, TributoPagado, TipoFormulario, TipoPagoPresentacion } from '@rentas/shared/types';
import { SessionStorage } from '../session-storage/session-storage';
import { PresentacionGeneralUtil } from './presentacion-general-util';
import { ConstantesParametros, ConstantesTributos } from '@rentas/shared/constantes';
import * as moment from 'moment';
import { FactoryFormularioUitl } from './factory-formulario-uitl';

export class PresentacionNaturalUtil extends PresentacionGeneralUtil {

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
      { codTipCam: '01', desValCas: 1, indDel: '0', numCas: 61 },
      { codTipCam: '00', desValCas: this.getValuecasilla901(), indDel: '0', numCas: 901 }
    );

    // en el formulario Virtual se tiene que poner 0 a los mostos, si su tipo es 5.
    // es por regla de negocio
    casillas = casillas.map(cs => {
      if (cs.codTipCam === '05')
        cs.desValCas = 0;
      return cs;
    });

    return casillas.concat(casillasPordefecto);
  }

  obtenerCasillasBoleta(monto?: number, tributo?: string): CasillaFormulario[] {
    return Array.of<CasillaFormulario>(
      { numCas: 2, codTipCam: '10', desValCas: SessionStorage.getnumRuc(), indDel: '0' },
      { numCas: 7, codTipCam: '10', desValCas: SessionStorage.getPerTri(), indDel: '0' },
      { numCas: 13, codTipCam: '11', desValCas: moment().format('DD/MM/YYYY'), indDel: '0' },
      { numCas: 58, codTipCam: '01', desValCas: moment().format('HH:mm:ss'), indDel: '0' },
      { numCas: 600, codTipCam: '01', desValCas: tributo, indDel: '0' },
      { numCas: 651, codTipCam: '05', desValCas: monto, indDel: '0' }
    );
  }

  obtenerTributoPagado(): TributoPagado[] {
    const casilla = this.getPredeclaracion().declaracion.seccInformativa.casillaInformativa;
    const tributos: Array<TributoPagado> = [];

    if (Number(casilla.mtoCas523) === 1 /*&& this.importePagar().casilla166 > 0*/) { // primera
      tributos.push({
        codTri: ConstantesTributos.RENTA_CAPITAL.codigo,
        indDel: '0', // 0 FIJO
        indVig: '1', // 1 FIJO
        mtoBasImp: 0, // -> no sabemos
        mtoImpres: 0, // -> no sabemos
        mtoPagTot: this.importePagar().casilla166, // Importe a pagar
        mtoResPag: 0, // 0 FIJO
        mtoTotDeu: this.importeDeuda().mtoCas164, // lo que debemos, en la casilla de deuda.
        perTri: Number(SessionStorage.getPerTri())
      });
    }

    if (Number(casilla.mtoCas524) === 1 /*&& this.importePagar().casilla366 > 0*/) {// segunda
      tributos.push({
        codTri: ConstantesTributos.RENTA_2DA_CATEGORIA.codigo,
        indDel: '0', // 0 FIJO
        indVig: '1', // 1 FIJO
        mtoBasImp: 0, // -> no sabemos
        mtoImpres: 0, // -> no sabemos
        mtoPagTot: this.importePagar().casilla366, // Importe a pagar
        mtoResPag: 0, // 0 FIJO
        mtoTotDeu: this.importeDeuda().mtoCas365, // lo que debemos, en la casilla de deuda.
        perTri: Number(SessionStorage.getPerTri())
      });
    }

    if (Number(casilla.mtoCas525) === 1  /*&& this.importePagar().casilla168 > 0*/) { // trabajo
      tributos.push({
        codTri: ConstantesTributos.RENTA_TRABAJO.codigo,
        indDel: '0', // 0 FIJO
        indVig: '1', // 1 FIJO
        mtoBasImp: 0, // -> no sabemos
        mtoImpres: 0, // -> no sabemos
        mtoPagTot: this.importePagar().casilla168, // Importe a pagar
        mtoResPag: 0, // 0 FIJO
        mtoTotDeu: this.importeDeuda().mtoCas146, // lo que debemos, en la casilla de deuda.
        perTri: Number(SessionStorage.getPerTri())
      });
    }

    return tributos;
  }

  obtenerFormularios(): FormularioPresentacion[] {
    let formularios: Array<FormularioPresentacion> = [];
    
    const formulario = FactoryFormularioUitl.newInstance(TipoFormulario.FORMULARIO);
    formulario.setCodFor(ConstantesParametros.COD_FORMULARIO_PPNN)
      .setDesFor(SessionStorage.getFormulario<any>().descripcion)
      .setListTributosPagados(this.obtenerTributoPagado())
      .setListCasillas(this.obtenerCasillasForm())
      .setMtoPag(this.obtenerMontoTotal());

    formularios.push(formulario);

    if (this.tipoPago !== TipoPagoPresentacion.NPS && this.tipoPago !== TipoPagoPresentacion.PAGOCERO) {
      formularios = formularios.concat(this.obtenerBoletas());
    }
    
    return formularios;
  }

  obtenerMontoTotal(): number {
    return this.importePagar().casilla166 +
      this.importePagar().casilla366 +
      this.importePagar().casilla168;
  }

  private obtenerBoletas() {
    const formularios: Array<FormularioPresentacion> = [];
    const casilla = this.getPredeclaracion().declaracion.seccInformativa.casillaInformativa;
    const tributos = this.obtenerTributoPagado();

    if (Number(casilla.mtoCas523) === 1) {

      const monto = this.importePagar().casilla166;
      const codTributo = ConstantesTributos.RENTA_CAPITAL.codigo;
      const tributosPagdos = tributos.filter(e => e.codTri === codTributo);

      const formulario = FactoryFormularioUitl.newInstance(TipoFormulario.BOLETA);
      formulario.setCodFor(ConstantesParametros.COD_FORMULARIO_BOLETA)
        .setListCasillas(this.obtenerCasillasBoleta(monto, codTributo))
        .setDesFor(ConstantesParametros.DES_FORMULARIO_BOLETA)
        .setListTributosPagados(tributosPagdos)
        .setMtoPag(monto);
      formularios.push(formulario);
    }

    if (Number(casilla.mtoCas524) === 1) {

      const monto = this.importePagar().casilla366;
      const codTributo = ConstantesTributos.RENTA_2DA_CATEGORIA.codigo;
      const tributosPagdos = tributos.filter(e => e.codTri === codTributo);

      const formulario = FactoryFormularioUitl.newInstance(TipoFormulario.BOLETA);
      formulario.setCodFor(ConstantesParametros.COD_FORMULARIO_BOLETA)
        .setListCasillas(this.obtenerCasillasBoleta(monto, codTributo))
        .setDesFor(ConstantesParametros.DES_FORMULARIO_BOLETA)
        .setListTributosPagados(tributosPagdos)
        .setMtoPag(monto);
      formularios.push(formulario);
    }

    if (Number(casilla.mtoCas525) === 1) {

      const monto = this.importePagar().casilla168;
      const codTributo = ConstantesTributos.RENTA_TRABAJO.codigo;
      const tributosPagdos = tributos.filter(e => e.codTri === codTributo);

      const formulario = FactoryFormularioUitl.newInstance(TipoFormulario.BOLETA);
      formulario.setCodFor(ConstantesParametros.COD_FORMULARIO_BOLETA)
        .setListCasillas(this.obtenerCasillasBoleta(monto, codTributo))
        .setDesFor(ConstantesParametros.DES_FORMULARIO_BOLETA)
        .setListTributosPagados(tributosPagdos)
        .setMtoPag(monto);
      formularios.push(formulario);
    }

    return formularios;
  }

  setPredeclaracionCasTipCam5(): void {
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166 = 0;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366 = 0;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168 = 0;
  }

  private importePagar(): { casilla166: number; casilla366: number, casilla168: number } {
    const predeclaracion = this.getPredeclaracion();
    let casilla166: number = predeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166;
    let casilla366: number = predeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366;
    let casilla168: number = predeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168;

    casilla166 = Number(casilla166 ?? 0);
    casilla366 = Number(casilla366 ?? 0);
    casilla168 = Number(casilla168 ?? 0);

    return { casilla166, casilla366, casilla168 };
  }

  private importeDeuda(): { mtoCas164: number; mtoCas365: number, mtoCas146: number } {

    const casilla = this.getPredeclaracion().declaracion.seccDeterminativa;

    const mtoCas164: number = casilla.rentaPrimera.resumenPrimera.mtoCas164 ?? 0;
    const mtoCas365: number = casilla.rentaSegunda.resumenSegunda.mtoCas365 ?? 0;
    const mtoCas146: number = casilla.rentaTrabajo.resumenTrabajo.mtoCas146 ?? 0;

    return { mtoCas164, mtoCas365, mtoCas146 };
  }

  private findTipoCasilla(numcas: string) {
    const tipoCasillas = SessionStorage.getTipoCasillas();
    const tipo = tipoCasillas.find(tc =>
      tc.codFormulario === ConstantesParametros.COD_FORMULARIO_PPNN &&
      tc.numCasilla === numcas
    )?.tipoCasilla ?? '01';

    return tipo;
  }

  private getValuecasilla901(): number {
    const cas = this.getPredeclaracion().declaracion
      .seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas140;
    switch (cas) {
      case 0: return 2;
      case 1: return 1;
      case 2: return 2;
      default: return 2;
    }
  }
}