import { TributoDevolucion } from '@rentas/shared/types';
import { SessionStorage } from '../session-storage/session-storage';


export abstract class DevolucionGeneral {

    abstract getDevolucionPorTributo(): Array<TributoDevolucion>;

    protected getPredeclaracion():any {
        return SessionStorage.getPreDeclaracion<any>();
    }
}