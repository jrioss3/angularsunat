
import { Constancia } from './constancia';
import { Mensaje } from './mensajes';
import { Resultado } from './resultado';
import { ResultadoPago } from './resultado-pago';

export interface ConstanciaRespuesta {
    resultado:     Resultado;
    resultadoPago: ResultadoPago;
    constancias:   Constancia[];
    mensajes:      Mensaje[];
}