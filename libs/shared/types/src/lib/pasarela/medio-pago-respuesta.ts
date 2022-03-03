import { EntidadFinancieraRespuesta } from './entidad-financiera-respuesta';

export interface MediosPagoRespuesta {
    codMedPag:            number;
    nomMedPag:            string;
    desMedPag:            string;
    indCargaPasarelaPago: string;
    entidadFinanciera:    EntidadFinancieraRespuesta[];
    numMedPagPas:         string;
}