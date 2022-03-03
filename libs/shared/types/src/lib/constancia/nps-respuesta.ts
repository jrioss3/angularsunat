export interface NpsRespuesta {
    numeroNPS:        string;
    fechaVigenciaNPS: string;
    nps:              Nps;
}

export interface Nps {
    nro:            string;
    indProceso:     string;
    fechaVigencia:  string;
    monto:          number;
    diasVigente:    number;
    pagoProyectado: PagoProyectado[];
}

export interface PagoProyectado {
    codTributo:     string;
    nomTributo:     string;
    codTributoAsoc: string;
    numDoc:         string;
    periodo:        string;
    monto:          number;
    interes:        Interes[];
}

export interface Interes {
    dia:   number;
    fecha: string;
    monto: number;
}
