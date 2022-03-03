import { FraccionamientoPlataforma } from '@rentas/shared/types';
import { FraccionamientoGeneral } from './fraccionamiento-general';
import { FraccionamientoNatural } from './fraccionamiento-natural';
import { FraccionamientoJuridico } from './fraccionamiento-juridico';

export class FraccionamientoFactoryUtil {
  public static newInstancia(tipo: FraccionamientoPlataforma): FraccionamientoGeneral {
    switch (tipo) {
      case FraccionamientoPlataforma.NATURAL: return new FraccionamientoNatural();
      case FraccionamientoPlataforma.JURIDICO: return new FraccionamientoJuridico();
      default: return null;
    }
  }
}