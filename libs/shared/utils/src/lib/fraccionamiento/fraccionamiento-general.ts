import { EstadoFraccionamiento } from '@rentas/shared/types';
import { SessionStorage } from '../session-storage/session-storage';

export abstract class FraccionamientoGeneral {

    abstract tieneFraccionamiento(valorUIT?: number): EstadoFraccionamiento;

    protected getPredeclaracion():any {
        return SessionStorage.getPreDeclaracion<any>();
    }

}
