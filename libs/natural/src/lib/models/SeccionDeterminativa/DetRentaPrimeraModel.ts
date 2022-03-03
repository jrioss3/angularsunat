export interface ResumenPrimera {
    refTabla: string;
    mtoCas100: number;
    mtoCas557: number;
    mtoCas558: number;
    mtoCas102: number;
    mtoCas501: number;
    mtoCas502: number;
    mtoCas515: number;
    mtoCas153: number;
    mtoCas367: number;
    mtoCas368: number;
    mtoCas369: number;
    mtoCas370: number;
    mtoCas156: number;
    mtoCas133: number;
    mtoCas159: number;
    mtoCas161: number;
    mtoCas162: number;
    mtoCas163: number;
    mtoCas164: number;
    mtoCas166: number;
    mtoCas160: number;
}

export interface Casilla100Cabecera {
    codTipDoc: string;
    numDoc: string;
    desPartidaReg: string;
    numArrend: string;
    codUbigeo2: string;
    mtoPagSinInt: number;
    mtoGravado: number;
    codTipBien: string;
    codBien: string;
    desBien: string;
    codTipVia: string;
    desVia: string;
    codTipZona: string;
    desZona: string;
    numNro: string;
    numKilometro: string;
    numManzana: string;
    numInterior: string;
    numDpto: string;
    numLote: string;
    desReferenc: string;
    numSumLuz: string;
    numSumAgua: string;
    indArchPers: string;
    desRazSoc: string;
    lisCas100Detalles: LCas100Detalles[];
}

export interface LCas100Detalles {
    refTabla: string;
    perPago: string;
    numFormulario: string;
    numOrdOpe: string;
    fecPago: any;
    mtoPagSInt: number;
    mtoGravado: number;
    indAceptado: string;
    indArchPers: string;
}
