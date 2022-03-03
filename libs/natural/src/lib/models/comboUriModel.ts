export interface ComboUri {
    codigo: number;
    nombre: string;
    listaParametro: ListaParametrosModel[];
}

export interface ListaParametrosModel {
    val: string;
    desc: string;
}
