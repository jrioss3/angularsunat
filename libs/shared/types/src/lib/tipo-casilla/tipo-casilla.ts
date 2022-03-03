export class TipoCasilla {

    codFormulario: string;
    numCasilla: string;
    tipoCasilla: string;

    constructor(objeto: any) {
        this.setCodFormulario(objeto.codParametro);
        this.setNumCasilla(objeto.codParametro);
        this.setTipoCasilla(objeto.desParametro);
    }

    public static newInstance(objeto: any): TipoCasilla {
        return new TipoCasilla(objeto);
    }

    private setCodFormulario(codParametro: string): void {
        this.codFormulario = codParametro.substring(0, 4);
    }

    private setNumCasilla(codParametro: string): void {
        this.numCasilla = codParametro.substring(4, 7);
    }

    private setTipoCasilla(desParametro: string): void {
        this.tipoCasilla = desParametro[9] + desParametro[10];
    }

    public getCodFormulario(): string {
        return this.codFormulario;
    }

    public getNumCasilla(): string {
        return this.numCasilla;
    }

    public getTipoCasilla(): string {
        return this.tipoCasilla;
    }

}
