import { PlataformaPresentacion } from '@rentas/shared/types';
import { PresentacionGeneralUtil } from './presentacion-general-util';
import { PresentacionJuridicoUtil } from './presentacion-juridico-util';
import { PresentacionNaturalUtil } from './presentacion-natural-util';

export class FactoryPresentacionUitl {
  static newInstance(tipo: PlataformaPresentacion): PresentacionGeneralUtil {
    switch (tipo) {
      case PlataformaPresentacion.JURIDICO:
        return new PresentacionJuridicoUtil(tipo);
      case PlataformaPresentacion.NATURAL:
        return new PresentacionNaturalUtil(tipo);
    }
  }
}