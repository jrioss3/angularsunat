import { Boleta } from './boleta';
import { Resultado } from './resultado';
import { ResultadoPago } from './resultado-pago';
import { DetalleTributo } from './detalle-tributo';
import { PagoPendiente } from './pago-pendiente';

export type RowConstnacia = Boleta & {
    esBoleta: boolean,
    esNps: boolean,
    resultado: Resultado,
    resultadoPago: ResultadoPago,
    codFormularioAsociado: string,
    numOrdAsociado: string
    detalleTributos: Array<DetalleTributo>,
    pagoPendientes: Array<PagoPendiente>
    rectificatoria: string,
};