import { CasillaFormulario, FormularioPresentacion, tipoCodOriPres, TipoFormulario, TributoPagado } from '@rentas/shared/types';
import { SessionStorage } from '../session-storage/session-storage';

export abstract class FormularioGeneralUtil implements FormularioPresentacion {

  numSec: number;
  codTipoFormulario: TipoFormulario;
  desFor: string;
  numRuc: string;
  fecPres: Date;
  horPres: Date;
  perTri: number;
  semFor: string;
  codIndRec: string;
  codOriPres: tipoCodOriPres;
  codOrifor: string;
  codTipFor: string;
  numValPag: number;
  mtoPag: number;
  codTipdetrac: string;
  codEstado: string;
  codEtapa: string;
  numIdConstancia: number;
  numIdResumen: number;
  numIdReporte: number;
  numNabono: string;
  numResrec: string;
  numPedPro: string;
  numPedAnu: string;
  indForAut: string;
  codEntFin: string;
  numOpebco: number;
  numOrd: number;
  numOrdOri: number;
  codFor: string;
  numVerFor: string;
  indBan: string;
  indDel: string;
  listCasillas: CasillaFormulario[];
  listTributosPagados: TributoPagado[];
  cargaPDT: null;

  constructor() {
    this.numSec = this.getPredeclaracion().declaracion.generales.cabecera.numSec;
    this.fecPres = new Date();
    this.horPres = new Date();
    this.perTri = Number(SessionStorage.getPerTri());
    this.semFor = '0';
    this.codIndRec = this.getPredeclaracion().declaracion.generales.cabecera.indRectificatoria;
    this.codOriPres = tipoCodOriPres.WEB;
    this.codOrifor = '01';
    this.codTipFor = '10';
    this.numValPag = 0;
    this.codTipdetrac = '0';
    this.codEstado = '90';
    this.codEtapa = '00';
    this.numIdConstancia = 0;
    this.numIdResumen = 0;
    this.numIdReporte = 1;
    this.numNabono = '';
    this.numResrec = '';
    this.numPedPro = '';
    this.numPedAnu = '';
    this.indForAut = '0';
    this.codEntFin = '000';
    this.numOpebco = 0;
    this.numOrd = 0;
    this.numOrdOri = 0;
    this.numVerFor = '1.0';
    this.indBan = '0';
    this.indDel = '0';
    this.cargaPDT = null;
    this.numRuc = SessionStorage.getnumRuc();
  }

  protected getPredeclaracion() {
    return SessionStorage.getPreDeclaracion<any>();
  }

  setCodFor(codFor: string): FormularioGeneralUtil {
    this.codFor = codFor;
    return this;
  }

  setDesFor(desFor: string): FormularioGeneralUtil {
    this.desFor = desFor;
    return this;
  }

  setMtoPag(mtoPag: number): FormularioGeneralUtil {
    this.mtoPag = mtoPag;
    return this;
  }

  setListCasillas(listCasillas: CasillaFormulario[]): FormularioGeneralUtil {
    this.listCasillas = listCasillas;
    return this;
  }
  
  setListTributosPagados(listTributosPagados: TributoPagado[]): FormularioGeneralUtil {
    this.listTributosPagados = listTributosPagados;
    return this;
  }

}