import { AuditoriaModel } from './auditoriaModel';
import { DeclaracionModel } from './declaracionModel';

export interface PreDeclaracionModel {

    perTri: number;
    numRuc: string;
    indProc: string;
    indDel: string;
    indEjeAntAct: string;
    indActWeb: string;
    valHash: string;
    declaracion: DeclaracionModel;
    auditoria: {
        properties: AuditoriaModel
    };
}
