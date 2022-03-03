import { GeneralesCabeceraModel } from './Generales/generalesCabeceraModel';
import { GeneralesSolicitudFraccionaModel } from './Generales/generalesSolicitudFraccionaModel';
import { GeneralesSolicitudDevolucModel } from './Generales/generalesSolicitudDevolucModel';
import { InfAlquileresModel } from './SeccionInformativa/infAlquileresModel';
import { InfCasInformativaModel } from './SeccionInformativa/infCasInformativaModel';
import { InfPrinAccionistasModel } from './SeccionInformativa/infPrinAccionistasModel';
import { Inft8999DonacionModel } from './SeccionInformativa/inft8999DonacionModel';
import {
    DetCredImpuestoRtaModel, DetCredImpuestoRtaModelCas126, DetCredImpuestoRtaModelCas128,
    DetCredImpuestoRtaModelCas131, DetCredImpuestoRtaModelCas130, DetCredImpuestoRtaModelCas297
} from './SeccionDeterminativa/detCredImpuestoRtaModel';
import { ImpRtaEmpresaModel } from './SeccionDeterminativa/impRtaEmpresaModel';
import { ImpRtaEmpresaModelCas108 } from './SeccionDeterminativa/impRtaEmpresaModelCas108';
import { DetDeterminacionDeudaModel, DeudaPagosPreviosModel } from './SeccionDeterminativa/detDeterminacionDeudaModel';
import { Ganancia, PasivoPatrEmp, ActivoEmp } from './SeccionDeterminativa/detEstFinancierosModel';

export interface DeclaracionModel {

    generales: {
        codTipoDeclara: string;
        cabecera: GeneralesCabeceraModel;
        solicitudFracciona: GeneralesSolicitudFraccionaModel;
        solicitudDevoluc: GeneralesSolicitudDevolucModel;
    };
    seccInformativa: {
        alquileres: {
            refTabla: string;
            lisAlquileres: InfAlquileresModel[];
        };
        casInformativa: InfCasInformativaModel;
        prinAccionistas: {
            refTabla: string;
            lisPrinAccionistas: InfPrinAccionistasModel[];
        }
        t8999donacion: {
            refTabla: string;
            lisT8999donacion: Inft8999DonacionModel[];
        }
    };
    seccDeterminativa: {
        impuestoRta: {
            impuestoRtaEmpresa: ImpRtaEmpresaModel;
            casilla108: {
                refTabla: string;
                lisCasilla108: ImpRtaEmpresaModelCas108[];
            }
        }
        credImpuestoRta: {
            credImprenta: DetCredImpuestoRtaModel;
            casilla126: {
                refTabla: string;
                lisCasilla126: DetCredImpuestoRtaModelCas126[];
            }
            casilla128: {
                refTabla: string;
                lisCasilla128: DetCredImpuestoRtaModelCas128[];
            }
            casilla130: {
                refTabla: string;
                lisCasilla130: DetCredImpuestoRtaModelCas130[];
            }
            casilla131: {
                refTabla: string;
                lisCasilla131: DetCredImpuestoRtaModelCas131[];
            }
            casilla297: {
                refTabla: string;
                lisCasilla297: DetCredImpuestoRtaModelCas297[];
            }
        }
        estFinancieros: {
            activoEmp: ActivoEmp;
            pasivoPatrEmp: PasivoPatrEmp;
            ganancia: Ganancia;
        }
    };
    determinacionDeuda: {
        casDetDeudaPJ: DetDeterminacionDeudaModel;
        pagosPrevios: {
            lisPagosPrevios : DeudaPagosPreviosModel[];
        }
    };
}
