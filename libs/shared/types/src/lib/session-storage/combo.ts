export interface Combo {
    codigo:         string;
    nombre:         string;
    listaParametro: ListaParametro[];
}

export interface ListaParametro {
    val:             string;
    desc:            string;
    listaParametro?: ListaParametro[];
}
