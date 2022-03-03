export interface Formulario {
    codFormulario: string;
    descripcion: string;
    ejercicio: string;
    estado: string;
    esPresentacion: boolean;
    indAutograbado: boolean;
    numSegAutograbado: string;
    ayudas: Ayuda[];
}

export interface Ayuda {
    codAyuda: string;
    descripcion: string;
    uri: string;
}
