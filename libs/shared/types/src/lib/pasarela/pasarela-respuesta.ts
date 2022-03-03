import { MediosPagoRespuesta } from './medio-pago-respuesta';

export interface PasarelaRespuesta {
    numPas:               string;
    nomPas:               string;
    desPas:               string;
    msjCabPas:            string;
    msjPiePas:            string;
    urlAplicacionCliente: string;
    mediosPago:           MediosPagoRespuesta[];
}