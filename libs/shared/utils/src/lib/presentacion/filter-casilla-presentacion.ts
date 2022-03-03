import { CasillaFormulario } from '@rentas/shared/types';
import { ConstantesFormulario } from '@rentas/shared/constantes';
import { SessionStorage } from '../session-storage/session-storage';

export abstract class FilterCasilla {

    public static newInstance(casillas: CasillaFormulario[]): FilterCasilla {
        const {numEjercicio, numFormulario} = SessionStorage.getPreDeclaracion<any>().declaracion.generales.cabecera;
        if(numFormulario === ConstantesFormulario.JURIDICO && numEjercicio === '2019') {
            return new FilterJuridico2019(casillas);
        } else {
            return new FilterJuridico2020(casillas);
        }
        
    }

    abstract executeFilter(): CasillaFormulario[];
}

class FilterJuridico2019 extends FilterCasilla {

    excludeCasillas = ['297'];

    constructor(private casillas: CasillaFormulario[]) {
        super();
    }

    executeFilter(): CasillaFormulario[] {
        return this.casillas
            .filter( e => !this.excludeCasillas.includes(e.numCas.toString()))
    }

}

class FilterJuridico2020 extends FilterCasilla {
    excludeCasillas = [];
    constructor(private casillas: CasillaFormulario[]) {
        super();
    }

    executeFilter(): CasillaFormulario[] {
        return this.casillas;
    }
    
}