import { Injectable } from '@angular/core';
import { PreDeclaracionModel } from '../models/preDeclaracionModel';
import { ConstantesParametros } from '@rentas/shared/constantes';
import { SessionStorage } from '@rentas/shared/utils';

@Injectable()
export class InicializadorService {

    preDeclaracion: PreDeclaracionModel;

    constructor() { }

    inicializarInformativa() {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        if (!this.preDeclaracion.declaracion.seccInformativa) {
            this.preDeclaracion.declaracion.seccInformativa = {
                alquileres: {
                    refTabla: 't6731alquiler',
                    lisAlquileres: []
                },
                casInformativa: {
                    refTabla: 't6742casinformativ',
                    numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                    // mtoCas002: null,
                    mtoCas801: null,
                    mtoCas803: null,
                    mtoCas210: null,
                    mtoCas216: null,
                    mtoCas217: null,
                    mtoCas221: null,
                    mtoCas222: null,
                    mtoCas804: null,
                    mtoCas802: null,
                    mtoCas199: null,
                    mtoCas687: null,
                    mtoCas208: null,
                    mtoCas207: null,
                    mtoCas815: null,
                    mtoCas814: null,
                    mtoCas209: null,
                    mtoCas211: null,
                    mtoCas215: null,
                    mtoCas289: null,
                    mtoCas290: null,
                    mtoCas291: null,
                    mtoCas225: null,
                    mtoCas226: null,
                    mtoCas817: null,
                    mtoCas818: null,
                    mtoCas829: 0,
                    mtoCas293: null,
                    mtoCas250: null,
                    mtoCas251: null,
                    mtoCas252: null,
                    mtoCas253: null,
                    mtoCas254: null,
                    mtoCas255: null,
                    mtoCas256: null,
                    mtoCas257: null,
                    mtoCas258: null,
                    mtoCas259: null,
                    mtoCas260: null,
                    mtoCas261: null,
                    mtoCas262: null,
                    mtoCas263: null,
                    mtoCas821: null,
                    mtoCas213: null,
                    mtoCas240: null,
                    mtoCas241: null,
                    mtoCas242: null,
                    mtoCas243: null,
                    mtoCas819: 0,
                    mtoCas227: null,
                    mtoCas502: 0,
                    mtoCas782: 0,
                    mtoCas824: 0
                },
                prinAccionistas: {
                    refTabla: 't6744principal',
                    lisPrinAccionistas: []
                },
                t8999donacion: {
                    refTabla: 't8999donacion',
                    lisT8999donacion: []
                }
            };
        }

        if (!this.preDeclaracion.declaracion.seccInformativa.casInformativa) {
            this.preDeclaracion.declaracion.seccInformativa.casInformativa = {
                refTabla: 't6742casinformativ',
                numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                // mtoCas002: null,
                mtoCas801: null,
                mtoCas803: null,
                mtoCas210: null,
                mtoCas216: null,
                mtoCas217: null,
                mtoCas221: null,
                mtoCas222: null,
                mtoCas804: null,
                mtoCas802: null,
                mtoCas199: null,
                mtoCas687: null,
                mtoCas208: null,
                mtoCas207: null,
                mtoCas815: null,
                mtoCas814: null,
                mtoCas209: null,
                mtoCas211: null,
                mtoCas215: null,
                mtoCas289: null,
                mtoCas290: null,
                mtoCas291: null,
                mtoCas225: null,
                mtoCas226: null,
                mtoCas817: null,
                mtoCas818: null,
                mtoCas829: 0,
                mtoCas293: null,
                mtoCas250: null,
                mtoCas251: null,
                mtoCas252: null,
                mtoCas253: null,
                mtoCas254: null,
                mtoCas255: null,
                mtoCas256: null,
                mtoCas257: null,
                mtoCas258: null,
                mtoCas259: null,
                mtoCas260: null,
                mtoCas261: null,
                mtoCas262: null,
                mtoCas263: null,
                mtoCas821: null,
                mtoCas213: null,
                mtoCas240: null,
                mtoCas241: null,
                mtoCas242: null,
                mtoCas243: null,
                mtoCas819: 0,
                mtoCas227: null,
                mtoCas502: 0,
                mtoCas782: 0,
                mtoCas824: 0
            };
        }

        if (!this.preDeclaracion.declaracion.seccInformativa.alquileres) {
            this.preDeclaracion.declaracion.seccInformativa.alquileres = {
                refTabla: 't6731alquiler',
                lisAlquileres: []
            };
        }
        if (!this.preDeclaracion.declaracion.seccInformativa.prinAccionistas) {
            this.preDeclaracion.declaracion.seccInformativa.prinAccionistas = {
                refTabla: 't6744principal',
                lisPrinAccionistas: []
            };
        }
        if (!this.preDeclaracion.declaracion.seccInformativa.t8999donacion) {
            this.preDeclaracion.declaracion.seccInformativa.t8999donacion = {
                refTabla: 't8999donacion',
                lisT8999donacion: []
            };
        }

        SessionStorage.setPreDeclaracion(this.preDeclaracion);
    }

    inicializarDeterminativa() {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        if (!this.preDeclaracion.declaracion.seccDeterminativa) {
            this.preDeclaracion.declaracion.seccDeterminativa = {
                impuestoRta: {
                    impuestoRtaEmpresa: {
                        refTabla: 't6741casimpuestore',
                        numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                        mtoCas100: null,
                        mtoCas101: null,
                        mtoCas103: null,
                        mtoCas105: null,
                        mtoCas106: null,
                        mtoCas107: null,
                        mtoCas120: null,
                        mtoCas108: null,
                        mtoCas110: null,
                        mtoCas113: null,
                        mtoCas111: null,
                        mtoCas686: null,
                        mtoCas610: null,
                        mtoCas880: null
                    },
                    casilla108: {
                        refTabla: 't6732cas108',
                        lisCasilla108: []
                    }
                },
                credImpuestoRta: {
                    credImprenta: {
                        refTabla: 't6738cascreditoimp',
                        numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                        mtoCas123: null,
                        mtoCas136: null,
                        mtoCas134: null,
                        mtoCas126: null,
                        mtoCas125: null,
                        mtoCas504: null,
                        mtoCas127: null,
                        mtoCas128: null,
                        mtoCas130: null,
                        mtoCas129: null,
                        mtoCas506: null,
                        mtoCas131: null,
                        mtoCas279: null,
                        mtoCas202: null,
                        mtoCas203: null,
                        mtoCas204: null,
                        mtoCas297: null,
                        mtoCas783: null
                    },
                    casilla126: {
                        refTabla: 't6733cas126',
                        lisCasilla126: []
                    },
                    casilla128: {
                        refTabla: 't6734cas128',
                        lisCasilla128: []
                    },
                    casilla130: {
                        refTabla: 't6735cas130',
                        lisCasilla130: []
                    },
                    casilla131: {
                        refTabla: 't6736cas131',
                        lisCasilla131: []
                    },
                    casilla297: {
                        refTabla: 't12386fredetcas297',
                        lisCasilla297: []
                    }
                },
                estFinancieros: {
                    activoEmp: {
                        refTabla: 't6737casactivo',
                        numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                        mtoCas359: null,
                        mtoCas360: null,
                        mtoCas361: null,
                        mtoCas362: null,
                        mtoCas363: null,
                        mtoCas364: null,
                        mtoCas365: null,
                        mtoCas366: null,
                        mtoCas367: null,
                        mtoCas368: null,
                        mtoCas369: null,
                        mtoCas370: null,
                        mtoCas371: null,
                        mtoCas372: null,
                        mtoCas373: null,
                        mtoCas374: null,
                        mtoCas375: null,
                        mtoCas376: null,
                        mtoCas377: null,
                        mtoCas378: null,
                        mtoCas379: null,
                        mtoCas380: null,
                        mtoCas381: null,
                        mtoCas382: null,
                        mtoCas383: null,
                        mtoCas384: null,
                        mtoCas385: null,
                        mtoCas386: null,
                        mtoCas387: null,
                        mtoCas388: null,
                        mtoCas389: null,
                        mtoCas390: null
                    },
                    pasivoPatrEmp: {
                        refTabla: 't6743caspasivopatr',
                        numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                        mtoCas401: null,
                        mtoCas402: null,
                        mtoCas403: null,
                        mtoCas404: null,
                        mtoCas405: null,
                        mtoCas406: null,
                        mtoCas407: null,
                        mtoCas408: null,
                        mtoCas409: null,
                        mtoCas410: null,
                        mtoCas411: null,
                        mtoCas412: null,
                        mtoCas414: null,
                        mtoCas415: null,
                        mtoCas416: null,
                        mtoCas417: null,
                        mtoCas418: null,
                        mtoCas419: null,
                        mtoCas420: null,
                        mtoCas421: null,
                        mtoCas422: null,
                        mtoCas423: null,
                        mtoCas424: null,
                        mtoCas425: null,
                        mtoCas426: null
                    },
                    ganancia: {
                        refTabla: 't6740casganancia',
                        numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                        mtoCas461: null,
                        mtoCas462: null,
                        mtoCas463: null,
                        mtoCas464: null,
                        mtoCas466: null,
                        mtoCas467: null,
                        mtoCas468: null,
                        mtoCas469: null,
                        mtoCas470: null,
                        mtoCas471: null,
                        mtoCas472: null,
                        mtoCas473: null,
                        mtoCas475: null,
                        mtoCas476: null,
                        mtoCas477: null,
                        mtoCas478: null,
                        mtoCas480: null,
                        mtoCas481: null,
                        mtoCas483: null,
                        mtoCas484: null,
                        mtoCas485: null,
                        mtoCas486: null,
                        mtoCas487: null,
                        mtoCas489: null,
                        mtoCas490: null,
                        mtoCas492: null,
                        mtoCas493: null,
                        mtoCas650: null,
                        mtoCas651: null,
                        mtoCas432: null,
                        mtoCas433: null
                    }
                }
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta) {
            this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta = {
                impuestoRtaEmpresa: {
                    refTabla: 't6741casimpuestore',
                    numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                    mtoCas100: null,
                    mtoCas101: null,
                    mtoCas103: null,
                    mtoCas105: null,
                    mtoCas106: null,
                    mtoCas107: null,
                    mtoCas120: null,
                    mtoCas108: null,
                    mtoCas110: null,
                    mtoCas113: null,
                    mtoCas111: null,
                    mtoCas686: null,
                    mtoCas610: null,
                    mtoCas880: null
                },
                casilla108: {
                    refTabla: 't6732cas108',
                    lisCasilla108: []
                }
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa) {
            this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa = {
                refTabla: 't6741casimpuestore',
                numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                mtoCas100: null,
                mtoCas101: null,
                mtoCas103: null,
                mtoCas105: null,
                mtoCas106: null,
                mtoCas107: null,
                mtoCas120: null,
                mtoCas108: null,
                mtoCas110: null,
                mtoCas113: null,
                mtoCas111: null,
                mtoCas686: null,
                mtoCas610: null,
                mtoCas880: null
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108) {
            this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.casilla108 = {
                refTabla: 't6732cas108',
                lisCasilla108: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta) {
            this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta = {
                credImprenta: {
                    refTabla: 't6738cascreditoimp',
                    numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                    mtoCas123: null,
                    mtoCas136: null,
                    mtoCas134: null,
                    mtoCas126: null,
                    mtoCas125: null,
                    mtoCas504: null,
                    mtoCas127: null,
                    mtoCas128: null,
                    mtoCas130: null,
                    mtoCas129: null,
                    mtoCas506: null,
                    mtoCas131: null,
                    mtoCas279: null,
                    mtoCas202: null,
                    mtoCas203: null,
                    mtoCas204: null,
                    mtoCas297: null,
                    mtoCas783: null
                },
                casilla126: {
                    refTabla: 't6733cas126',
                    lisCasilla126: []
                },
                casilla128: {
                    refTabla: 't6734cas128',
                    lisCasilla128: []
                },
                casilla130: {
                    refTabla: 't6735cas130',
                    lisCasilla130: []
                },
                casilla131: {
                    refTabla: 't6736cas131',
                    lisCasilla131: []
                },
                casilla297: {
                    refTabla: 't6737cas297',
                    lisCasilla297: []
                }
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta) {
            this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.credImprenta = {
                refTabla: 't6738cascreditoimp',
                numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                mtoCas123: null,
                mtoCas136: null,
                mtoCas134: null,
                mtoCas126: null,
                mtoCas125: null,
                mtoCas504: null,
                mtoCas127: null,
                mtoCas128: null,
                mtoCas130: null,
                mtoCas129: null,
                mtoCas506: null,
                mtoCas131: null,
                mtoCas279: null,
                mtoCas202: null,
                mtoCas203: null,
                mtoCas204: null,
                mtoCas297: null,
                mtoCas783: null
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla126) {
            this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla126 = {
                refTabla: 't6733cas126',
                lisCasilla126: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla128) {
            this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla128 = {
                refTabla: 't6734cas128',
                lisCasilla128: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla130) {
            this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla130 = {
                refTabla: 't6735cas130',
                lisCasilla130: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla131) {
            this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla131 = {
                refTabla: 't6736cas131',
                lisCasilla131: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla297) {
            this.preDeclaracion.declaracion.seccDeterminativa.credImpuestoRta.casilla297 = {
                refTabla: 't6737cas297',
                lisCasilla297: []
            }
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros) {
            this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros = {
                activoEmp: {
                    refTabla: 't6737casactivo',
                    numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                    mtoCas359: null,
                    mtoCas360: null,
                    mtoCas361: null,
                    mtoCas362: null,
                    mtoCas363: null,
                    mtoCas364: null,
                    mtoCas365: null,
                    mtoCas366: null,
                    mtoCas367: null,
                    mtoCas368: null,
                    mtoCas369: null,
                    mtoCas370: null,
                    mtoCas371: null,
                    mtoCas372: null,
                    mtoCas373: null,
                    mtoCas374: null,
                    mtoCas375: null,
                    mtoCas376: null,
                    mtoCas377: null,
                    mtoCas378: null,
                    mtoCas379: null,
                    mtoCas380: null,
                    mtoCas381: null,
                    mtoCas382: null,
                    mtoCas383: null,
                    mtoCas384: null,
                    mtoCas385: null,
                    mtoCas386: null,
                    mtoCas387: null,
                    mtoCas388: null,
                    mtoCas389: null,
                    mtoCas390: null,
                },
                pasivoPatrEmp: {
                    refTabla: 't6743caspasivopatr',
                    numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                    mtoCas401: null,
                    mtoCas402: null,
                    mtoCas403: null,
                    mtoCas404: null,
                    mtoCas405: null,
                    mtoCas406: null,
                    mtoCas407: null,
                    mtoCas408: null,
                    mtoCas409: null,
                    mtoCas410: null,
                    mtoCas411: null,
                    mtoCas412: null,
                    mtoCas414: null,
                    mtoCas415: null,
                    mtoCas416: null,
                    mtoCas417: null,
                    mtoCas418: null,
                    mtoCas419: null,
                    mtoCas420: null,
                    mtoCas421: null,
                    mtoCas422: null,
                    mtoCas423: null,
                    mtoCas424: null,
                    mtoCas425: null,
                    mtoCas426: null,
                },
                ganancia: {
                    refTabla: 't6740casganancia',
                    numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                    mtoCas461: null,
                    mtoCas462: null,
                    mtoCas463: null,
                    mtoCas464: null,
                    mtoCas466: null,
                    mtoCas467: null,
                    mtoCas468: null,
                    mtoCas469: null,
                    mtoCas470: null,
                    mtoCas471: null,
                    mtoCas472: null,
                    mtoCas473: null,
                    mtoCas475: null,
                    mtoCas476: null,
                    mtoCas477: null,
                    mtoCas478: null,
                    mtoCas480: null,
                    mtoCas481: null,
                    mtoCas483: null,
                    mtoCas484: null,
                    mtoCas485: null,
                    mtoCas486: null,
                    mtoCas487: null,
                    mtoCas489: null,
                    mtoCas490: null,
                    mtoCas492: null,
                    mtoCas493: null,
                    mtoCas650: null,
                    mtoCas651: null,
                    mtoCas432: null,
                    mtoCas433: null,
                }
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia) {
            this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.ganancia = {
                refTabla: 't6740casganancia',
                numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                mtoCas461: null,
                mtoCas462: null,
                mtoCas463: null,
                mtoCas464: null,
                mtoCas466: null,
                mtoCas467: null,
                mtoCas468: null,
                mtoCas469: null,
                mtoCas470: null,
                mtoCas471: null,
                mtoCas472: null,
                mtoCas473: null,
                mtoCas475: null,
                mtoCas476: null,
                mtoCas477: null,
                mtoCas478: null,
                mtoCas480: null,
                mtoCas481: null,
                mtoCas483: null,
                mtoCas484: null,
                mtoCas485: null,
                mtoCas486: null,
                mtoCas487: null,
                mtoCas489: null,
                mtoCas490: null,
                mtoCas492: null,
                mtoCas493: null,
                mtoCas650: null,
                mtoCas651: null,
                mtoCas432: null,
                mtoCas433: null,
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.pasivoPatrEmp) {
            this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.pasivoPatrEmp = {
                refTabla: 't6743caspasivopatr',
                numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                mtoCas401: null,
                mtoCas402: null,
                mtoCas403: null,
                mtoCas404: null,
                mtoCas405: null,
                mtoCas406: null,
                mtoCas407: null,
                mtoCas408: null,
                mtoCas409: null,
                mtoCas410: null,
                mtoCas411: null,
                mtoCas412: null,
                mtoCas414: null,
                mtoCas415: null,
                mtoCas416: null,
                mtoCas417: null,
                mtoCas418: null,
                mtoCas419: null,
                mtoCas420: null,
                mtoCas421: null,
                mtoCas422: null,
                mtoCas423: null,
                mtoCas424: null,
                mtoCas425: null,
                mtoCas426: null,
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.activoEmp) {
            this.preDeclaracion.declaracion.seccDeterminativa.estFinancieros.activoEmp = {
                refTabla: 't6737casactivo',
                numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                mtoCas359: null,
                mtoCas360: null,
                mtoCas361: null,
                mtoCas362: null,
                mtoCas363: null,
                mtoCas364: null,
                mtoCas365: null,
                mtoCas366: null,
                mtoCas367: null,
                mtoCas368: null,
                mtoCas369: null,
                mtoCas370: null,
                mtoCas371: null,
                mtoCas372: null,
                mtoCas373: null,
                mtoCas374: null,
                mtoCas375: null,
                mtoCas376: null,
                mtoCas377: null,
                mtoCas378: null,
                mtoCas379: null,
                mtoCas380: null,
                mtoCas381: null,
                mtoCas382: null,
                mtoCas383: null,
                mtoCas384: null,
                mtoCas385: null,
                mtoCas386: null,
                mtoCas387: null,
                mtoCas388: null,
                mtoCas389: null,
                mtoCas390: null,
            };
        }

        if (!this.preDeclaracion.declaracion.determinacionDeuda) {
            this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ = {
                refTabla: 't6739casdetdeuda',
                numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
                mtoCas137: null,
                mtoCas138: null,
                mtoCas139: null,
                mtoCas142: null,
                mtoCas505: null,
                mtoCas141: null,
                mtoCas144: null,
                mtoCas145: null,
                mtoCas146: null,
                mtoCas180: null
                }

            this.preDeclaracion.declaracion.determinacionDeuda.pagosPrevios = {
                lisPagosPrevios : []
            }
        };

        if (!this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ) {
            this.preDeclaracion.declaracion.determinacionDeuda.casDetDeudaPJ = {
                refTabla: 't6739casdetdeuda',
                numFormul: '0710',
                mtoCas137: null,
                mtoCas138: null,
                mtoCas139: null,
                mtoCas142: null,
                mtoCas505: null,
                mtoCas141: null,
                mtoCas144: null,
                mtoCas145: null,
                mtoCas146: null,
                mtoCas180: null
            };
        }

        if (!this.preDeclaracion.declaracion.determinacionDeuda.pagosPrevios) {
            this.preDeclaracion.declaracion.determinacionDeuda.pagosPrevios = {
                lisPagosPrevios : []
            }
        }
            
        SessionStorage.setPreDeclaracion(this.preDeclaracion);
    }
}
