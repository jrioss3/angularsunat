export interface ValidarPresentacionRespuesta {
    cod:       string;
    msg:       string;
    resultado: ResultadoPresentacion;
}

export interface ResultadoPresentacion {
    identificadorPresentacion: string;
    numeroOperacionSunat:      string;
    cantidadFormularios:       number;
    fechaProcesoPresentacion:  string;
}
