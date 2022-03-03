import { TipoFormulario } from '@rentas/shared/types';
import { FormularioGeneralUtil } from './formulario-general-util';
import { FormularioPresentacion } from './formulario-presentacion-uitl';
import { FormularioBoleta } from './formulario-boleta-utils';

export class FactoryFormularioUitl {
  static newInstance(tipo: TipoFormulario): FormularioGeneralUtil {
    switch (tipo) {
      case TipoFormulario.FORMULARIO:
        return new FormularioPresentacion();
      case TipoFormulario.BOLETA:
        return new FormularioBoleta();
    }
  }
}