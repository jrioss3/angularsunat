import { Casilla514Cabecera } from '@path/natural/models';

const tipoGasto = {
    ALQUILERES: '01',
    MEDICOS: '03',
    APORTACIONES: '04',
    HOTELES: '05',
    ARTESANOS: '06',
};

export class ValidarDeduccionesGastos {
    private lista514: Casilla514Cabecera[];

    private constructor(lista514: Casilla514Cabecera[]) {
        this.lista514 = lista514;
    }

    public static newInstance(lista514: Casilla514Cabecera[]): ValidarDeduccionesGastos {
        return new ValidarDeduccionesGastos(lista514);
    }

    public completarRubroGasto(): Casilla514Cabecera[] {
        return Object.values(tipoGasto)
            .reduce((carry, tipo) => {
                let gasto = this.lista514.find(e => !!e && e.indTipoGasto === tipo);
                if (!!!gasto) {
                    gasto = this.createGasto(tipo);
                }
                return [...carry, gasto];
            }, []);
    }

    private createGasto(tipo: string): Casilla514Cabecera {
        return {
            indTipoGasto: tipo,
            mtoGasto: 0,
            casilla514Detalle: {
                refTabla: 't9878cas514det',
                lisCas514: []
            }
        };
    }

}