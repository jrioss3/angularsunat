import { DevolucionTributoRespuesta } from './devolucion-tributo';
export interface TributoURI {
    tributo: DevolucionTributoRespuesta;
    data:    string;
}
export interface DevolucionRespuesta {
    listaTributoUri: TributoURI[];
}

