export interface Casilla {
    numCas:              string;
    descripcion:         string;
    indObligatorio:      boolean;
    indEditable:         boolean;
    codTipCtrl:          string;
    seccion?:            Seccion;
    subseccion?:         Subseccion;
    codParam?:           CodParam;
    codTipCas?:          string;
    longMinima?:         number;
    longMaxima?:         number;
    cantidadDecimal?:    number;
    indFormatoNegativo?: boolean; // si es true tiene parentesis
    filasAsistente?:     FilasAsistente[];
    descAyuda?:          string;
    imagenAyuda?:        string;
}

export enum CodParam {
    Rxxx = "RXXX",
}

export interface FilasAsistente {
    codFila:     string;
    descripcion: string;
    valor?: number;
}

export enum Seccion {
    TabDeterminativa = "tabDeterminativa",
    TabInformativa = "tabInformativa",
}

export enum Subseccion {
    TabAlquileresPagados = "tabAlquileresPagados",
    TabCondominios = "tabCondominios",
    TabDeterminacion = "tabDeterminacion",
    TabFuenteExtranjera = "tabFuenteExtranjera",
    TabOtrosIngresos = "tabOtrosIngresos",
    TabRentaPrimeraCategoria = "tabRentaPrimeraCategoria",
    TabRentaSegundaCategoria = "tabRentaSegundaCategoria",
    TabTipoDeclaracion = "tabTipoDeclaracion",
}