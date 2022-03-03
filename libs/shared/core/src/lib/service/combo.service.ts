import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesCombos, ConstantesUris } from '@rentas/shared/constantes';
import { Combo } from '@rentas/shared/types';
import { SessionStorage, UitUtil } from '@rentas/shared/utils';

@Injectable({
    providedIn: 'root'
})
export class ComboService {

    constructor(private http: HttpClient) { }

    obtenerCombos() {
        return this.http.get<Combo[]>(ConstantesUris.URI_BASE + ConstantesUris.FORMULARIO_COMBOS);
    }

    guardarDataCombo(dataCombo) {
        dataCombo = this.parametrosMayuscula(dataCombo);
        SessionStorage.setCombos(dataCombo);
    }

    parametrosMayuscula(dataCombo) {
        const listaAOrdenar = [ConstantesCombos.PAISES, ConstantesCombos.TIPO_DOCUMENTO, ConstantesCombos.TIPO_DONACION];
        dataCombo.map(
            x => {
                x.listaParametro.map(y => {
                    if (y.desc) {
                        y.desc = y.desc.toUpperCase();
                    }
                });
                if (listaAOrdenar.includes(x.codigo)) {
                    x.listaParametro.sort((z, w) => {
                        if (z.desc > w.desc) {
                            return 1;
                        }
                        if (z.desc < w.desc) {
                            return -1;
                        }
                        return 0;
                    });
                }
            }
        );
        return dataCombo;
    }

    obtenerComboPorNumero(id: string, listaParametros?: Array<string>, tipo?: number) {
        return UitUtil.obtenerComboPorNumero(id, listaParametros, tipo);
    }

    obtenerUitEjercicioActual(): number {
        return UitUtil.obtenerUitEjercicioActual();
    }

    obtenerPorcentajeCas610(): number {
        const ejercicio = SessionStorage.getPreDeclaracion<any>().declaracion.generales.cabecera.numEjercicio;
        const Cas610Data = this.obtenerComboPorNumero(ConstantesCombos.PORCENTAJE_CASILLA610);
        const Cas610 = Cas610Data.find(x => x.val === String(ejercicio)).listaParametro.find(x => x.desc.includes('Web'));
        return Number(Cas610.val);
    }

    obtenerCantidadUITs(): number {
        const UITData = this.obtenerComboPorNumero(ConstantesCombos.CANTIDAD_UITS);
        return Number(UITData[0].val);
    }

}
