import { ResumenSegunda } from '@path/natural/models';
import { ConstantesSeccionDeterminativa } from '@path/natural/utils';

export class CalcularMontosCasillaRentaSegunda {
    private resumenSegunda: ResumenSegunda;

    constructor(resumenSegunda: ResumenSegunda) {
        this.resumenSegunda = resumenSegunda;
    }

    public static newInstance(resumenSegunda: ResumenSegunda): CalcularMontosCasillaRentaSegunda {
        return new CalcularMontosCasillaRentaSegunda(resumenSegunda);
    }

    getMontosCalculados(): ResumenSegunda {
        this.resumenSegunda.mtoCas353 = this.calculoMontoCas353();
        this.resumenSegunda.mtoCas354 = this.calculoMontoCas354();
        this.resumenSegunda.mtoCas356 = this.calculoMontoCas356();
        return this.resumenSegunda;
    }

    private calculoMontoCas353(): number {
        return Math.round(ConstantesSeccionDeterminativa.VEINTE_PORCIENTO * Number(this.resumenSegunda.mtoCas350));
    }

    private calculoMontoCas354(): number {
        return Number(this.resumenSegunda.mtoCas350) - this.calculoMontoCas353();
    }

    private calculoMontoCas356(): number {
        const resultado = this.calculoMontoCas354() - Number(this.resumenSegunda.mtoCas355) + Number(this.resumenSegunda.mtoCas385);
        return resultado < 0 ? 0 : resultado;
    }
}