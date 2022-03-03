export interface ImpRtaEmpresaModelCas108 {
    numFormul: string;
    indArr: string;
    codTipMto: string;
    desValLiteral: string;
    mtoLiteral: number;

}

export class ImpRtaEmpresaModelCas108Impl implements ImpRtaEmpresaModelCas108 {
    constructor(
        public numFormul: string, public indArr: string,
        public codTipMto: string, public desValLiteral: string,
        public mtoLiteral: number) { }
}

export interface DetalleCas108 {
    casillaPerdidas: ImpRtaEmpresaModelCas108,
    casillaCompensacion: ImpRtaEmpresaModelCas108,
}
