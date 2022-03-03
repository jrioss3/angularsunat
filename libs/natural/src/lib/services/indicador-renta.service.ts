import { Injectable } from '@angular/core';
import { GeneralesIndicadorRentaModel } from '../models/Generales/generalesIndicadorRentaModel';
import { PreDeclaracionModel } from '../models/preDeclaracionModel';
import { SessionStorage } from '@rentas/shared/utils';

@Injectable({
    providedIn: 'root',
})
export class IndicadorRentaService {

    constructor() { }

    generalesIndicadorRentaModel: GeneralesIndicadorRentaModel;
    preDeclaracionObjeto: PreDeclaracionModel;

    obtenerIndicadorRentaModel(): void {
        this.preDeclaracionObjeto = SessionStorage.getPreDeclaracion();

        this.generalesIndicadorRentaModel = {
            refTabla: 't9029indrenta',
            indCas100: this.obtenerIndCas100(),
            indCas350: this.obtenerIndCas350(),
            indCas107: this.obtenerIndCas107(),
            indCas108: this.obtenerIndCas108(),
            indCas111: this.obtenerIndCas111(),
            indCas130: this.obtenerIndCas130(),
            indCas131: this.obtenerIndCas131(),
            indCas514: this.obtenerIndCas514()
        };

        this.preDeclaracionObjeto.declaracion.generales.indicadorRenta = this.generalesIndicadorRentaModel;
        SessionStorage.setPreDeclaracion(this.preDeclaracionObjeto);
    }

    obtenerIndCas100(): number {
        // Number(0) lisCas100Cab  si tiene al menos un item en la indCas100 se pone 1  si no 0
        const lisCas100Cab = this.preDeclaracionObjeto.declaracion.seccDeterminativa.rentaPrimera.casilla100Cabecera.lisCas100Cab.length;
        return lisCas100Cab !== 0 ? Number(1) : Number(0);
    }

    obtenerIndCas350(): number {
        // Number(0) lisCas350 si tiene al menos un item en la indCas350 se pone 1 si no 0
        const lisCas350 = this.preDeclaracionObjeto.declaracion.seccDeterminativa.rentaSegunda.casilla350.lisCas350.length;
        return lisCas350 !== 0 ? Number(1) : Number(0);
    }

    obtenerIndCas107(): number {
        // Number(0) lisCas107 si tiene al menos un item en la indCas107 se pone 1 si no 0
        const lisCas107 = this.preDeclaracionObjeto.declaracion.seccDeterminativa.rentaTrabajo.casilla107.lisCas107.length;
        return lisCas107 !== 0 ? Number(1) : Number(0);
    }

    obtenerIndCas108(): number {
        // Number(0) lisCas108 si tiene al menos un item en la indCas108 se pone 1  si no 0
        const lisCas108 = this.preDeclaracionObjeto.declaracion.seccDeterminativa.rentaTrabajo.casilla108.lisCas108.length;
        return lisCas108 !== 0 ? Number(1) : Number(0);
    }

    obtenerIndCas111(): number {
        // Number(0) lisCas111 si tiene al menos un item en la indCas111 se pone 1 si no 0
        const lisCas111 = this.preDeclaracionObjeto.declaracion.seccDeterminativa.rentaTrabajo.casilla111.lisCas111.length;
        return lisCas111 !== 0 ? Number(1) : Number(0);
    }

    obtenerIndCas130(): number {
        // Number(0) lisCas130 si tiene al menos un item en la indCas130 se pone 1 si no 0
        const lisCas130 = this.preDeclaracionObjeto.declaracion.determinacionDeuda.rentaTrabajo.impRetenidoRentas.lisCas130.length;
        return lisCas130 !== 0 ? Number(1) : Number(0);
    }

    obtenerIndCas131(): number {
        // Number(0) lisCas131 si tiene al menos un item en la indCas131 se pone 1 si no 0
        const lisCas131 = this.preDeclaracionObjeto.declaracion.determinacionDeuda.rentaTrabajo.impRetenRentasQnta.lisCas131.length;
        return lisCas131 !== 0 ? Number(1) : Number(0);
    }

    obtenerIndCas514(): number {
        // Number(0) declaraciones.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[4].
        // casilla514Detalle.lisCas514[] almenos un item se pone 1 si no 0
        const lisCas514 = this.preDeclaracionObjeto.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
        let tieneItem = 0;
        lisCas514.forEach(liCas514Detalle => {
            if (liCas514Detalle.casilla514Detalle.lisCas514.length !== 0) {
                tieneItem = 1;
            }
        });
        return tieneItem !== 0 ? Number(1) : Number(0);
    }

}
