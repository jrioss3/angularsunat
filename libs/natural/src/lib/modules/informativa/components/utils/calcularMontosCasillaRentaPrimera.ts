import { ConstantesSeccionDeterminativa } from '@path/natural/utils';
import { ResumenPrimera } from '@path/natural/models';

export class CalcularMontosCasillaRentaPrimera {

    private resumenPrimera: ResumenPrimera;

    constructor(resumenPrimera: ResumenPrimera) {
        this.resumenPrimera = resumenPrimera;
    }

    public static newInstance(resumenPrimera: ResumenPrimera): CalcularMontosCasillaRentaPrimera {
        return new CalcularMontosCasillaRentaPrimera(resumenPrimera);
    }

    getMontosCalculados(): ResumenPrimera {
        this.resumenPrimera.mtoCas501 = this.calculoMontoCas501();
        this.resumenPrimera.mtoCas502 = this.calculoMontoCas502();
        this.resumenPrimera.mtoCas515 = this.calculoMontoCas515();
        return this.resumenPrimera;
    }

    private calculoMontoCas501(): number {
        return Number(this.resumenPrimera.mtoCas100) + Number(this.resumenPrimera.mtoCas102);
    }

    private calculoMontoCas502(): number {
        return Math.round(ConstantesSeccionDeterminativa.VEINTE_PORCIENTO * this.calculoMontoCas501());
    }

    private calculoMontoCas515(): number {
        return this.calculoMontoCas501() - this.calculoMontoCas502();
    }
}
