export interface ResumenTrabajo {
    refTabla: string;
    mtoCas107: number;
    mtoCas507: number;
    mtoCas508: number;
    mtoCas108: number;
    mtoCas509: number;
    mtoCas111: number;
    mtoCas510: number;
    mtoCas511: number;
    mtoCas514: number;
    mtoCas512: number;
    mtoCas522: number;
    mtoCas519: number;
    mtoCas513: number;
    mtoCas116: number;
    mtoCas517: number;
    mtoCas120: number;
    mtoCas122: number;
    mtoCas158: number;
    mtoCas167: number;
    mtoCas563: number;
    mtoCas564: number;
    mtoCas565: number;
    mtoCas125: number;
    mtoCas127: number;
    mtoCas128: number;
    mtoCas130: number;
    mtoCas131: number;
    mtoCas141: number;
    mtoCas142: number;
    mtoCas144: number;
    mtoCas145: number;
    mtoCas146: number;
    mtoCas168: number;
    mtoCas140: number;
}

export interface Casilla107 {
    tipDoc: string;
    numDoc: string;
    desRazSoc: string;
    perServicio: string;
    codTipComp: string;
    numSerie: string;
    numComp: string;
    fecEmi: any;
    mtoAtribuido: number;
}

export interface Casilla108 {
    tipDoc: string;
    numDoc: string;
    desRazSoc: string;
    perServicio: string;
    mtoAtribuido: number;
}

export interface Casilla111 {
    codTipDoc: string;
    //tipDoc: string;
    numDoc: string;
    desRazSoc: string;
    perServicio: string;
    mtoPercibido: number;
}

export interface Casilla514Cabecera {
    indTipoGasto: string;
    mtoGasto: number;
    casilla514Detalle: {
        refTabla: string;
        lisCas514: LCas514Detalle[];
    };
}

export interface LCas514Detalle {
    numEjercicio: string;
    numFormulario: string;
    numRuc: string;
    periodo?: string;
    indTipGasto: string;
    codDocEmisor: string;
    numDocEmisor: string;
    desNomEmisor: string;
    codTipComprob: string;
    numSerie: string;
    numComprob: string;
    fecComprob: any;
    mtoComprob: number;
    mtoDeduccion: number;
    numPrestamo: string;
    fecFesembolso: any;
    numPartidaReg: string;
    mtoInteres: number;
    fecPago: any;
    codMedPago: string;
    codFor: string;
    numFor: string;
    indEstArchPers: string;
    indEstFormVirt: string;
    indArchPers: string;
    mtoOriginal: number;
    codForPago: string;
    porDeduccion: number;
    porAtribucion: number;
    mtoAtribuir: number;
    codTipVinc: string;
    numRucTit: string;
    desNomTit: string;
    codTipBien: string;
    indTipoAtrib: string;
    indInconsistencia: string;
    desInconsistencia: string;
}
export interface ReplicaCasilla514 {
    numEjercicio: string;
    numFormul: string;
    numRucTitular: string;
    numRucAtrib: string;
    indTipGasto: string;
    codDocEmisor: string;
    numDocEmisor: string;
    desNomEmisor: string;
    codTipComprob: string;
    numSerie: string;
    numComprob: string;
    fecComprob: Date;
    mtoComprob: number;
    mtoDeduccion: number;
    numPrestamo: string;
    fecFesembolso: Date;
    numPartidaReg: string;
    mtoInteres: number;
    fecPago: Date;
    codMedPago: string;
    indEstArchPers: string;
    indEstFormVirt: string;
    indArchPers: string;
    mtoOriginal: number;
    codForPago: string;
    porDeduccion: number;
    porAtribucion: number;
    mtoAtribuir: number;
    codTipVinc: string;
    desNomTit: string;
    codTipBien: string;
}

export interface Casilla522 {
    codTipDoc: string;
    numDoc: string;
    desRazSoc: string;
    mtoRetenido: number;
}

export interface Casilla519 {
    codTipDona: string;
    desTipDona: string;
    codModDona: string;
    desModDona: string;
    codTipDoc: string;
    numDoc: string;
    desRazSoc: string;
    fecDonacion: any;
    mtoDonacion: number;
}

export interface Casilla116 {
    codPais: string;
    desPais: string;
    codTipRenta: string;
    desTipRenta: string;
    codTipRentaRtfi: string;
    codBenef: string;
    codCdi: string;
    desPagador: string;
    codTipDocPagador: string;
    numDocPagador: string;
    mtoImpuesto: number;
}
