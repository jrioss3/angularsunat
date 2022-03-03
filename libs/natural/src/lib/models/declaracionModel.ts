import { GeneralesCabeceraModel } from './Generales/generalesCabeceraModel';
import { GeneralesIndicadorRentaModel } from './Generales/generalesIndicadorRentaModel';
import { GeneralesSolicitudFraccionaModel } from './Generales/generalesSolicitudFraccionaModel';
import { GeneralesSolicitudDevolucModel } from './Generales/generalesSolicitudDevolucModel';
import { CasillaInformativaModel } from './SeccionInformativa/casillaInformativaModel';
import { InfCondominoModel } from './SeccionInformativa/InfCondominoModel';
import { InfAlquileresModel } from './SeccionInformativa/InfAlquileresModel';
import { InfAtribucionGastosModel } from './SeccionInformativa/InfAtribucionGastosModel';
import { InfDividPercibModel } from './SeccionInformativa/InfDividPercibModel';
import { InfFuenteEstModel } from './SeccionInformativa/InfFuenteEstModel';
import { ResumenPrimera, Casilla100Cabecera } from './SeccionDeterminativa/DetRentaPrimeraModel';
import { ResumenSegunda, Casilla350, Casilla355, Casilla385 } from './SeccionDeterminativa/DetRentaSegundaModel';
import {
    ResumenTrabajo, Casilla107, Casilla108, Casilla111, Casilla514Cabecera, ReplicaCasilla514, Casilla522, Casilla519, Casilla116
} from './SeccionDeterminativa/DetRentaTrabajoModel';
import { DeudaCas358Model } from './Deuda/deudaCas358Model';
import { DeudaCas359Model } from './Deuda/deudaCas359Model';
import { DeudaCas122Model } from './Deuda/deudaCas122Model';
import { DeudaCas127Model } from './Deuda/deudaCas127Model';
import { DeudaCas128Model } from './Deuda/deudaCas128Model';
import { DeudaCas130Model } from './Deuda/deudaCas130Model';
import { DeudaCas131Model } from './Deuda/deudaCas131Model';
import { InfExoneradoInafModel } from './SeccionInformativa/InfOtrosIngresosModel';
import { DeudaPagosPreviosModel } from './Deuda/deudaPagosPreviosModel';

export interface DeclaracionModel {

    generales: {
        codTipoDeclara: string;
        cabecera: GeneralesCabeceraModel;
        indicadorRenta: GeneralesIndicadorRentaModel;
        solicitudFracciona: GeneralesSolicitudFraccionaModel;
        solicitudDevoluc: GeneralesSolicitudDevolucModel;
    };
    seccInformativa: {
        casillaInformativa: CasillaInformativaModel;
        condominos: {
            refTabla: string;
            lisCondomino: InfCondominoModel[];
        };
        alquileres: {
            refTabla: string;
            lisAlquileres: InfAlquileresModel[];
        };
        atribucionesGastos: {
            refTabla: string;
            lisAtribGastos: InfAtribucionGastosModel[];
        };
        exoneradaInafecta: {
            refTabla: string;
            lisExonInaf: InfExoneradoInafModel[];
        };
        dividendPercibidos: {
            refTabla: string;
            lisDividPercib: InfDividPercibModel[];
        };
        fuenteExtranjera: {
            refTabla: string;
            lisFuenteEst: InfFuenteEstModel[];
        };
    };
    seccDeterminativa: {
        rentaPrimera: {
            resumenPrimera: ResumenPrimera;
            casilla100Cabecera: {
                refTabla: string;
                lisCas100Cab: Casilla100Cabecera[];
            }
        };
        rentaSegunda: {
            resumenSegunda: ResumenSegunda;
            casilla350: {
                refTabla: string;
                lisCas350: Casilla350[];
            }
            casilla355: {
                refTabla: string;
                lisCas355: Casilla355[];
            }
            casilla385: {
                refTabla: string;
                lisCas385: Casilla385[];
            }
        };
        rentaTrabajo: {
            resumenTrabajo: ResumenTrabajo,
            casilla107: {
                refTabla: string;
                lisCas107: Casilla107[];
            }
            casilla108: {
                refTabla: string;
                lisCas108: Casilla108[];
            }
            casilla111: {
                refTabla: string;
                lisCas111: Casilla111[];
            }
            casilla514Cabecera: {
                refTabla: string;
                lisCas514Cabecera: Casilla514Cabecera[];
            }
            replicaCasilla514: {
                refTabla: string;
                lisCas514: ReplicaCasilla514[];
            }
            casilla522: {
                refTabla: string;
                lisCas522: Casilla522[];
            }
            casilla519: {
                refTabla: string;
                lisCas519: Casilla519[];
            }
            casilla116: {
                refTabla: string;
                lisCas116: Casilla116[];
            }
        };
    };
    determinacionDeuda: {
        rentaSegunda: {
            pagoDirectoIR: {
                refTabla: string;
                lisCas358: DeudaCas358Model[];
            };
            impRetenidoRentas: {
                refTabla: string;
                lisCas359: DeudaCas359Model[];
            }
        };
        rentaTrabajo: {
            credIRFuenteExtran: {
                refTabla: string;
                lisCas122: DeudaCas122Model[];
            };
            pagoDirectoIR: {
                refTabla: string;
                lisCas127: DeudaCas127Model[];
            };
            pagoDirectIRQuinta: {
                refTabla: string;
                lisCas128: DeudaCas128Model[];
            };
            impRetenidoRentas: {
                refTabla: string;
                lisCas130: DeudaCas130Model[];
            };
            impRetenRentasQnta: {
                refTabla: string;
                lisCas131: DeudaCas131Model[];
            };
        };
        pagosPrevios: {
            lisPagosPrevios: DeudaPagosPreviosModel[];
        }
    };
}
