import { Boleta } from './boleta';
import { DetalleTributo } from './detalle-tributo';
import { PagoPendiente } from './pago-pendiente';

export interface Constancia {
    identificadorFormulario: string;
    codigoFormulario:        string;
    descripcionFormulario:   string;
    numeroOrden:             string;
    fechaProcesoOrden:       string;
    periodoTributario:       number;
    descripcionTributo:      string;
    montoPago:               number;
    semana:                  string;
    formaPago:               null;
    rectificatoria:          string;
    detalleTributos:         DetalleTributo[];
    pagoPendientes:          PagoPendiente[];
    boletas:                 Boleta[];
    documento:               string;
    flagPDT:                 number;
    numTrabajador:           string;
    numPensionista:          string;
    numCuartaCategoria:      string;
    numNorEspecial:          string;
    numModFormativa:         string;
    numTercero:              string;
    codTriAlt:               string;
    codTriBaj:               string;
    numIdReporte:            number;
}