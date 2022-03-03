import { Indicador } from './indicador';

export interface Formulario {
    codigo: string;
    nombre: string;
    fechaIniVigenciaConsulta: Date;
    fechaIniVigenciaPresentacion: Date;
    fechaCreacion: Date;
    version: string;
    estado: string;
    indicadores: Indicador[];
    textoAyudaInformativa: string;
    textoAyudaDeterminativa: string;
    entidadesPropietarias: string;
    codigoCuentaDebito: string;
}
