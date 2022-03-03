import { LCas514Detalle } from '@path/natural/models';
import { ConstantesCasilla514 } from '@path/natural/utils';
// import { FuncionesGenerales, ConstantesCasilla514 } from '@path/natural/utils';
import { FuncionesGenerales, UitUtil } from '@rentas/shared/utils'

export class CalcularMontoMaximoDeducir {

    private cas514Detalle: LCas514Detalle;
    private anioEjercicio: number;

    constructor(cas514Detalle: LCas514Detalle, anioEjercicio?: number) {
        this.cas514Detalle = cas514Detalle;
        this.anioEjercicio = anioEjercicio
    }
    getMontoCalculado(): LCas514Detalle {
        this.cas514Detalle.mtoAtribuir = this.cas514Detalle.porAtribucion === 50 ?
           this.calcularMontoPorAtribucion50() : this.calcularMontoPorAtribucionNo50();
        return this.cas514Detalle;
    }

    private calcularMontoPorAtribucion50(): number {
        return this.financial((this.cas514Detalle.mtoComprob * this.cas514Detalle.porDeduccion
            * this.cas514Detalle.porAtribucion) / 10000);
    }

    private calcularMontoPorAtribucionNo50(): number {
        return this.financial((this.cas514Detalle.mtoComprob * this.cas514Detalle.porDeduccion) / 100);
    }

    private financial(numero) {
        return FuncionesGenerales.getInstance().redondearMontos(Number.parseFloat(numero), 2);
    }

    public getMontoDeduccionActualizadoArtesania(): LCas514Detalle {       
        let uit = UitUtil.obtenerUitPorEjercico(this.anioEjercicio);
        let porcentajeLimiteDeduccionUIT = ConstantesCasilla514.PORCENTAJE_DEDUCCION_ARTESANIAS_LIMITE;
        let montoLimiteDeduccion = uit * (porcentajeLimiteDeduccionUIT / 100);
        
        if ( this.cas514Detalle.indEstFormVirt === ConstantesCasilla514.regValido) {
            let porcentajeDeduccionPorTipoComprobante = this.cas514Detalle.codTipComprob === ConstantesCasilla514.COD_TIPO_COMPROB_BOLETA ? ConstantesCasilla514.PORCENTAJE_DEDUCCION_ARTESANIAS_BOLETA : ConstantesCasilla514.PORCENTAJE_DEDUCCION_ARTESANIAS_RHE
            
            this.cas514Detalle.mtoDeduccion = FuncionesGenerales.getInstance().redondearMontos((Number(this.cas514Detalle.mtoComprob) * (porcentajeDeduccionPorTipoComprobante / 100)), 2);
            
            if(this.cas514Detalle.mtoDeduccion > montoLimiteDeduccion){
                this.cas514Detalle.mtoDeduccion = montoLimiteDeduccion;
            }
        }else {
            this.cas514Detalle.mtoDeduccion = 0
        } 

        return this.cas514Detalle;
        
    }

    public getMontoDeduccionActualizadoMedicos(): LCas514Detalle {       
        let uit = UitUtil.obtenerUitPorEjercico(this.anioEjercicio);
        let porcentajeLimiteDeduccionUIT = ConstantesCasilla514.PORCENTAJE_DEDUCCION_ARTESANIAS_LIMITE;
        let montoLimiteDeduccion = uit * (porcentajeLimiteDeduccionUIT / 100);
        
        if ( this.cas514Detalle.indEstFormVirt === ConstantesCasilla514.regValido) {
            let porcentajeDeduccionPorTipoComprobante = ConstantesCasilla514.PORCENTAJE_DEDUCCION_MEDICOS;
            
            this.cas514Detalle.mtoDeduccion = FuncionesGenerales.getInstance().redondearMontos((Number(this.cas514Detalle.mtoComprob) * (porcentajeDeduccionPorTipoComprobante / 100)), 2);
            
            
        }else {
            this.cas514Detalle.mtoDeduccion = 0
        } 

        return this.cas514Detalle;
        
    }


}