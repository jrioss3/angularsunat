import { Casilla350 } from '@path/natural/models';
import { ConstantesDocumentos } from '@rentas/shared/constantes';

export class CorregirDataPersonalizadoCas350 {
    private lista350: Casilla350[];

    private constructor(lista350: Casilla350[]) {
        this.lista350 = lista350;
    }

    public static newInstance(lista350: Casilla350[]): CorregirDataPersonalizadoCas350 {
        return new CorregirDataPersonalizadoCas350(lista350);
    }

    public corregirData(): Casilla350[] {
        this.lista350.filter(x => Number(x.codTipFteRta) === 1 || Number(x.codTipFteRta) === 2).
            forEach(y => {
                y.cntVal = y.cntVal || 0;
                if (Number(y.codTipFteRta) === 2 && y.codTipDoc !== ConstantesDocumentos.SIN_RUC) {
                    y.numDoc = this.ultimoNroDocSinRUC();
                    y.codTipDoc = ConstantesDocumentos.SIN_RUC;
                }
            });
        return this.lista350;
    }

    private ultimoNroDocSinRUC(): string {
        const listaSinRuc = this.lista350.filter(x => Number(x.codTipFteRta) === 2 && x.codTipDoc === ConstantesDocumentos.SIN_RUC);
        listaSinRuc.sort((x, y) => {
            if (Number(x.numDoc) > Number(y.numDoc)) {
                return 1;
            }
            if (Number(x.numDoc) < Number(y.numDoc)) {
                return -1;
            }
            return 0;
        });
        const correlativo = listaSinRuc.length !== 0 ? Number([...listaSinRuc].pop().numDoc) + 1 : 1;
        return String(correlativo).padStart(11, '0');
    }
}