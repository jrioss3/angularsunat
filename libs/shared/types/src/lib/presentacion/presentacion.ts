
export enum PlataformaPresentacion { JURIDICO = '02', NATURAL = '01'};
export enum TipoFormulario { FORMULARIO = '01', BOLETA = '02' };
export enum tipoCodOriPres { WEB = '01', DESKTOP = '03' };
export enum TipoPagoPresentacion { PAGOCERO = 0, BANCOS = 1, NPS = 2 };

export interface Presentacion {
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
}

export interface CasillaFormulario {
    codTipCam: string;
    desValCas: number | null | string;
    indDel: string;
    numCas: number | string;
}

export class TributoPagado {
    codTri: string;
    indDel: string;
    indVig: string;
    mtoBasImp: number;
    mtoImpres: number;
    mtoPagTot: number;
    mtoResPag: number;
    mtoTotDeu: number;
    perTri: number;
}

export interface FormularioPresentacion {
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
}