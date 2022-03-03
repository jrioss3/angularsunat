import { ResumenTrabajo } from '@path/natural/models';
import { ConstantesSeccionDeterminativa } from '@path/natural/utils';
import { ConstantesStores } from '@rentas/shared/constantes';
import { UitUtil } from '@rentas/shared/utils';

export class CalcularMontosCasillaRentaTrabajo {
    private resumenTrabajo: ResumenTrabajo;
    private valorUIT: number;

    constructor(resumenTrabajo: ResumenTrabajo) {
        this.resumenTrabajo = resumenTrabajo;
        this.valorUIT = UitUtil.obtenerUitEjercicioActual();
    }

    public static newInstance(resumenTrabajo: ResumenTrabajo): CalcularMontosCasillaRentaTrabajo {
        return new CalcularMontosCasillaRentaTrabajo(resumenTrabajo);
    }

    getMontosCalculados(): ResumenTrabajo {
        this.resumenTrabajo.mtoCas507 = this.calculoMontoCas507();
        this.resumenTrabajo.mtoCas508 = this.calculoMontoCas508();
        this.resumenTrabajo.mtoCas509 = this.calculoMontoCas509();
        this.resumenTrabajo.mtoCas510 = this.calculoMontoCas510();
        this.resumenTrabajo.mtoCas511 = this.calculoMontoCas511();
        this.resumenTrabajo.mtoCas512 = this.calculoMontoCas512();
        this.resumenTrabajo.mtoCas513 = this.calculoMontoCas513();
        this.resumenTrabajo.mtoCas517 = this.calculoMontoCas517();
        return this.resumenTrabajo;
    }

    private calculoMontoCas507(): number {
        const montocas507 = Math.round(ConstantesSeccionDeterminativa.VEINTE_PORCIENTO * Number(this.resumenTrabajo.mtoCas107));
        const maxUIT = ConstantesSeccionDeterminativa.CANTIDAD_UIT_VEINTICUATRO * this.valorUIT;
        return Math.min(montocas507, maxUIT);
    }

    private calculoMontoCas508(): number {
        return Number(this.resumenTrabajo.mtoCas107) - this.calculoMontoCas507();
    }

    private calculoMontoCas509(): number {
        return this.calculoMontoCas508() + Number(this.resumenTrabajo.mtoCas108);
    }

    private calculoMontoCas510(): number {
        return this.calculoMontoCas509() + Number(this.resumenTrabajo.mtoCas111);
    }

    private calculoMontoCas511(): number {
        const max7UIT = ConstantesSeccionDeterminativa.CANTIDAD_UIT_CASILLA511 * this.valorUIT;
        return Math.min(this.calculoMontoCas510(), max7UIT);
    }

    private calculoMontoCas512(): number {
        const resultado = this.calculoMontoCas510() - this.calculoMontoCas511() - Number(this.resumenTrabajo.mtoCas514);
        return resultado < 0 ? 0 : resultado;
    }

    private calculoMontoCas513(): number {
        let resultado = 0;
        if (Number(this.resumenTrabajo.mtoCas522) > Number(this.resumenTrabajo.mtoCas509)) {
            if (Number(this.resumenTrabajo.mtoCas509) === 0) {
                resultado = Number(this.resumenTrabajo.mtoCas512) - Number(this.resumenTrabajo.mtoCas519);
            } else if (Number(this.resumenTrabajo.mtoCas509) > 0) {
                resultado = Number(this.resumenTrabajo.mtoCas512) -
                    (Number(this.resumenTrabajo.mtoCas509) + Number(this.resumenTrabajo.mtoCas519));
            }
        } else {
            resultado = this.calculoMontoCas512() - (Number(this.resumenTrabajo.mtoCas522) + Number(this.resumenTrabajo.mtoCas519));
        }

        return resultado < 0 ? 0 : resultado;
    }

    private calculoMontoCas517(): number {
        return this.calculoMontoCas513() + Number(this.resumenTrabajo.mtoCas116);
    }
}