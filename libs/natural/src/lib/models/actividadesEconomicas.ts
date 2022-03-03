import { AuditoriaModel } from './auditoriaModel';

export interface ActividadesEconomicas {
    id: {
        id: Id;
    };
    numRuc: string;
    codTipact: string;
    numCorrelActeco: string;
    numVerciiu: string;
    codCiiu: string;
    indTiping: string;
    indDel: string;
    codDep: string;
    numIndice: string;
    codUsuregis: string;
    fecRegis: string;
    codUsumodif: string;
    fecModif: string;
    auditoria: {
        auditoria: AuditoriaModel;
    };
}

export interface Id {
    timestamp: number;
    counter: number;
    time: number;
    date: number;
    machineIdentifier: number;
    processIdentifier: number;
    timeSecond: number;
}
