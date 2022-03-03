export interface Error422 {
    cod:    number;
    msg:    string;
    errors: Error[];
}

export interface Error {
    cod: number;
    msg: string;
}

export interface ErrorMensajes {
    id:                  string;
    url:                 string;
    redirectParentTabId: string;
    redirectTabId:       string;
    codCusExcepcion:     string;
    descripcion:         string;
}
