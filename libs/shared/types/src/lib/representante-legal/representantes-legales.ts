import { AuditoriaModel } from '../auditoria/auditoria';

export interface ListaRepresentantes {
    id: {
        id: Id;
    };
    rsoNumruc: string;
    rsoNrodoc: string;
    rsoNombre: string;
    rsoCargoo: string;
    rsoVdesde: number;
    rsoDocide: string;
    rsoFecnac: string;
    rsoUserna: string;
    rsoFecact: string;
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
