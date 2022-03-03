export class TributoPagado {

    private static readonly TRIBUTOS  = Array.of(
        {cod: '030703', des: 'RENTA - REGULARIZ. - RENTA DE TRABAJO', codCorto: '3073' },
        {cod: '030702', des: 'RENTA - REGULARIZ. - RENTA DE CAPITAL', codCorto: '3072' },
        {cod: '030704', des: 'RTA.-REGULARIZ.-RTA.2DA.CATEG', codCorto: '3074' }
    );

    public static readonly COD_RENTA_TRABAJO = '3073';
    public static readonly COD_RENTA_CAPITAL = '3072';
    public static readonly COD_RENTA_2DA_CATEG = '3074';

    codTributo: string;
    desTributo: string;
    montoPagado: number;

    constructor(obj: any) {
        const trib = TributoPagado.TRIBUTOS.find(e => e.cod === obj.codTributo);
        this.codTributo = trib.codCorto;
        this.montoPagado = obj.montoPagado;
        this.desTributo  =  trib.des;
    }

}
