import { AuditoriaModel } from '@rentas/shared/types';
import { DeclaracionModel } from './declaracionModel';

export interface PreDeclaracionModel {
    perTri: number;
    numRuc: string;
    indProc: string;
    indDel: string;
    valHash: string;
    indEjeAntAct: string;
    indActWeb: string;
    declaracion: DeclaracionModel;
    auditoria: {
        properties: AuditoriaModel;
    };
}
