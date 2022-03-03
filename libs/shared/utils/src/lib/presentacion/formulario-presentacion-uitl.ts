import { TipoFormulario } from '@rentas/shared/types';
import { FormularioGeneralUtil } from './formulario-general-util';

export class FormularioPresentacion extends FormularioGeneralUtil {
    constructor() {
        super();
        this.codTipoFormulario = TipoFormulario.FORMULARIO;
    }
}