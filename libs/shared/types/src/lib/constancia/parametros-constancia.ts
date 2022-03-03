import { TributoDevolucion } from '../devolucion/tributo-devolucion';
import { EstadoFraccionamiento } from '../fraccionamiento/estado-fraccionamiento';

export interface ParametrosConstancia {
    respuesta: any,
    monto: number,
    tieneFrancionamiento: EstadoFraccionamiento,
    devoluciones: Array<TributoDevolucion>
}
