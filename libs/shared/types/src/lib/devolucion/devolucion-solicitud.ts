import { DevolucionTributoRespuesta } from './devolucion-tributo';

export interface DevolucionSolicitud {
    listTributo:     DevolucionTributoRespuesta[];
    numOrden:        string;
    razonSocial:     string;
    nombres:         string;
    numeroTelefono:  string;
    codFormulario:   string;
    montoDevolucion: number;
    periodo:         string;
    usuSol:          string;
    fechaActual:     Date;
}


