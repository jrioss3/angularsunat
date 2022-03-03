import { DevolucionPlataforma } from '@rentas/shared/types';
import { DevolucionGeneral } from './devolucion-general';
import { DevolucionNatural } from './devolucion-natural';
import { DevolucionJuridico } from './devolucion-juridico';

export class DevolucionFactoryUtil {
  public static newInstancia(tipo: DevolucionPlataforma): DevolucionGeneral {
    switch (tipo) {
      case DevolucionPlataforma.NATURAL: return new DevolucionNatural();
      case DevolucionPlataforma.JURIDICO: return new DevolucionJuridico();
      default: return null;
    }
  }
}