import { ConstantesCombos } from '@rentas/shared/constantes';
import { SessionStorage } from '../session-storage/session-storage';


export class UitUtil {

  static obtenerUitEjercicioActual(): number {
    const ejercicio = SessionStorage.getPreDeclaracion<any>().
      declaracion.generales.cabecera.numEjercicio;
    return UitUtil.obtenerUitPorEjercico(Number(ejercicio));
  }

  public static obtenerUitPorEjercico(anioEjercicio): number {
    const UITData = this.obtenerComboPorNumero(ConstantesCombos.UIT);
    const UIT = UITData.find(x => x.desc === (String(anioEjercicio) + '0101'));
    return Number(UIT?.val ?? '');
  }

  public static obtenerComboPorNumero(id: string, listaParametros?: Array<string>, tipo?: number) {
    const combos = SessionStorage.getCombos() ?? [];
    if (id !== '') {
      let combo = combos.find(item => item.codigo === id)?.listaParametro ?? [];
      if (listaParametros) {
        if (!!!tipo) {
          combo = combo.filter(x => listaParametros.includes(x.val));
        } else {
          combo = combo.filter(x => !listaParametros.includes(x.val));
        }
      }
      return combo ? combo : [];
    }
    return [];
  }

}