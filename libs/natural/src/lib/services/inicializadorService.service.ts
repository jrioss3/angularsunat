import { Injectable } from '@angular/core';
import { PreDeclaracionModel } from '../models/preDeclaracionModel';
import { Subscription } from 'rxjs';
import { SessionStorage } from '@rentas/shared/utils';

@Injectable()
export class InicializadorService {
    unSubAutoguardado: Subscription;
    constructor() { }
    preDeclaracion: PreDeclaracionModel;

    inicializarInformativa() {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        if (!this.preDeclaracion.declaracion.seccInformativa) {
            this.preDeclaracion.declaracion.seccInformativa = {
                casillaInformativa: {
                    refTabla: 't9025casinformativ',
                    mtoCas235: null,
                    mtoCas236: null,
                    mtoCas700: null,
                    mtoCas200: null,
                    mtoCas201: null,
                    mtoCas203: null,
                    mtoCas518: null,
                    mtoCas552: null,
                    mtoCas601: null,
                    mtoCas559: null,
                    mtoCas602: null,
                    mtoCas560: null,
                    mtoCas561: null,
                    mtoCas998: null,
                    mtoCas999: null,
                    mtoCas516: null,
                    mtoCas523: null,
                    mtoCas524: null,
                    mtoCas525: null
                },
                condominos: {
                    refTabla: 't5848cond',
                    lisCondomino: [],
                },
                alquileres: {
                    refTabla: 't6474alquiler',
                    lisAlquileres: []
                },
                atribucionesGastos: {
                    refTabla: 't9879atribgasto',
                    lisAtribGastos: []
                },
                exoneradaInafecta: {
                    refTabla: 't5383rtasexoninaf',
                    lisExonInaf: []
                },
                dividendPercibidos: {
                    refTabla: 't7994divperci',
                    lisDividPercib: []
                },
                fuenteExtranjera: {
                    refTabla: 't7996fuenextra',
                    lisFuenteEst: []
                }
            };
        }

        if (!this.preDeclaracion.declaracion.seccInformativa.casillaInformativa) {
            this.preDeclaracion.declaracion.seccInformativa.casillaInformativa = {
                refTabla: 't9025casinformativ',
                mtoCas235: null,
                mtoCas236: null,
                mtoCas700: null,
                mtoCas200: null,
                mtoCas201: null,
                mtoCas203: null,
                mtoCas518: null,
                mtoCas552: null,
                mtoCas601: null,
                mtoCas559: null,
                mtoCas602: null,
                mtoCas560: null,
                mtoCas561: null,
                mtoCas998: null,
                mtoCas999: null,
                mtoCas516: null,
                mtoCas523: null,
                mtoCas524: null,
                mtoCas525: null
            };
        }

        if (!this.preDeclaracion.declaracion.seccInformativa.condominos) {
            this.preDeclaracion.declaracion.seccInformativa.condominos = {
                refTabla: 't5848cond',
                lisCondomino: [],
            };
        }

        if (!this.preDeclaracion.declaracion.seccInformativa.alquileres) {
            this.preDeclaracion.declaracion.seccInformativa.alquileres = {
                refTabla: 't6474alquiler',
                lisAlquileres: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccInformativa.atribucionesGastos) {
            this.preDeclaracion.declaracion.seccInformativa.atribucionesGastos = {
                refTabla: 't9879atribgasto',
                lisAtribGastos: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccInformativa.exoneradaInafecta) {
            this.preDeclaracion.declaracion.seccInformativa.exoneradaInafecta = {
                refTabla: 't5383rtasexoninaf',
                lisExonInaf: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccInformativa.dividendPercibidos) {
            this.preDeclaracion.declaracion.seccInformativa.dividendPercibidos = {
                refTabla: 't7994divperci',
                lisDividPercib: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccInformativa.fuenteExtranjera) {
            this.preDeclaracion.declaracion.seccInformativa.fuenteExtranjera = {
                refTabla: 't7996fuenextra',
                lisFuenteEst: []
            };
        }
        SessionStorage.setPreDeclaracion(this.preDeclaracion);
    }

    inicializarDeterminativa() {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        // Inicialización del Objeto predeclaración Sección Determinativa
        // matriz
        if (!this.preDeclaracion.declaracion.seccDeterminativa) {
            this.preDeclaracion.declaracion.seccDeterminativa = {
                rentaPrimera: {
                    resumenPrimera: {
                        refTabla: 't5385casprimera',
                        mtoCas100: null,
                        mtoCas557: null,
                        mtoCas558: null,
                        mtoCas102: null,
                        mtoCas501: null,
                        mtoCas502: null,
                        mtoCas515: null,
                        mtoCas153: null,
                        mtoCas367: null,
                        mtoCas368: null,
                        mtoCas369: null,
                        mtoCas370: null,
                        mtoCas156: null,
                        mtoCas133: null,
                        mtoCas159: null,
                        mtoCas161: null,
                        mtoCas162: null,
                        mtoCas163: null,
                        mtoCas164: null,
                        mtoCas166: null,
                        mtoCas160: null
                    },
                    casilla100Cabecera: {
                        refTabla: 'casilla100Cabecera',
                        lisCas100Cab: []
                    }
                },
                rentaSegunda: {
                    resumenSegunda: {
                        refTabla: 't5386cassegunda',
                        mtoCas350: null,
                        mtoCas353: null,
                        mtoCas354: null,
                        mtoCas355: null,
                        mtoCas385: null,
                        mtoCas356: null,
                        mtoCas357: null,
                        mtoCas388: null,
                        mtoCas358: null,
                        mtoCas359: null,
                        mtoCas360: null,
                        mtoCas362: null,
                        mtoCas363: null,
                        mtoCas364: null,
                        mtoCas365: null,
                        mtoCas366: null,
                        mtoCas361: null
                    },
                    casilla350: {
                        refTabla: 'casilla350',
                        lisCas350: []
                    },
                    casilla355: {
                        refTabla: 'casilla355',
                        lisCas355: []
                    },
                    casilla385: {
                        refTabla: 'casilla385',
                        lisCas385: []
                    }
                },
                rentaTrabajo: {
                    resumenTrabajo: {
                        refTabla: 't9030cascuarta',
                        mtoCas107: null,
                        mtoCas507: null,
                        mtoCas508: null,
                        mtoCas108: null,
                        mtoCas509: null,
                        mtoCas111: null,
                        mtoCas510: null,
                        mtoCas511: null,
                        mtoCas514: null,
                        mtoCas512: null,
                        mtoCas522: null,
                        mtoCas519: null,
                        mtoCas513: null,
                        mtoCas116: null,
                        mtoCas517: null,
                        mtoCas120: null,
                        mtoCas122: null,
                        mtoCas158: null,
                        mtoCas167: null,
                        mtoCas563: null,
                        mtoCas564: null,
                        mtoCas565: null,
                        mtoCas125: null,
                        mtoCas127: null,
                        mtoCas128: null,
                        mtoCas130: null,
                        mtoCas131: null,
                        mtoCas141: null,
                        mtoCas142: null,
                        mtoCas144: null,
                        mtoCas145: null,
                        mtoCas146: null,
                        mtoCas168: null,
                        mtoCas140: null,
                    },
                    casilla107: {
                        refTabla: 'casilla107',
                        lisCas107: []
                    },
                    casilla108: {
                        refTabla: 'casilla108',
                        lisCas108: []
                    },
                    casilla111: {
                        refTabla: 'casilla111',
                        lisCas111: []
                    },
                    casilla514Cabecera: {
                        refTabla: 'casilla514Cabecera',
                        lisCas514Cabecera: [
                            {
                                indTipoGasto: '01',
                                mtoGasto: 0,
                                casilla514Detalle: {
                                    refTabla: '',
                                    lisCas514: []
                                }

                            },
                            {
                                indTipoGasto: '03',
                                mtoGasto: 0,
                                casilla514Detalle: {
                                    refTabla: '',
                                    lisCas514: []
                                }
                            },
                            {
                                indTipoGasto: '04',
                                mtoGasto: 0,
                                casilla514Detalle: {
                                    refTabla: '',
                                    lisCas514: []
                                }
                            },
                            {
                                indTipoGasto: '05',
                                mtoGasto: 0,
                                casilla514Detalle: {
                                    refTabla: '',
                                    lisCas514: []
                                }
                            }

                        ]
                    },
                    replicaCasilla514: {
                        refTabla: 'casilla514',
                        lisCas514: []
                    },
                    casilla522: {
                        refTabla: 'casilla522',
                        lisCas522: []
                    },
                    casilla519: {
                        refTabla: 'casilla519',
                        lisCas519: []
                    },
                    casilla116: {
                        refTabla: 'casilla116',
                        lisCas116: []
                    }
                }
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera = {
                resumenPrimera: {
                    refTabla: 't5385casprimera',
                    mtoCas100: null,
                    mtoCas557: null,
                    mtoCas558: null,
                    mtoCas102: null,
                    mtoCas501: null,
                    mtoCas502: null,
                    mtoCas515: null,
                    mtoCas153: null,
                    mtoCas367: null,
                    mtoCas368: null,
                    mtoCas369: null,
                    mtoCas370: null,
                    mtoCas156: null,
                    mtoCas133: null,
                    mtoCas159: null,
                    mtoCas161: null,
                    mtoCas162: null,
                    mtoCas163: null,
                    mtoCas164: null,
                    mtoCas166: null,
                    mtoCas160: null
                },
                casilla100Cabecera: {
                    refTabla: 'casilla100Cabecera',
                    lisCas100Cab: []
                }
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.casilla100Cabecera) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.casilla100Cabecera = {
                refTabla: 'casilla100Cabecera',
                lisCas100Cab: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera = {
                refTabla: 't5385casprimera',
                mtoCas100: null,
                mtoCas557: null,
                mtoCas558: null,
                mtoCas102: null,
                mtoCas501: null,
                mtoCas502: null,
                mtoCas515: null,
                mtoCas153: null,
                mtoCas367: null,
                mtoCas368: null,
                mtoCas369: null,
                mtoCas370: null,
                mtoCas156: null,
                mtoCas133: null,
                mtoCas159: null,
                mtoCas161: null,
                mtoCas162: null,
                mtoCas163: null,
                mtoCas164: null,
                mtoCas166: null,
                mtoCas160: null
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda = {
                resumenSegunda: {
                    refTabla: 't5386cassegunda',
                    mtoCas350: null,
                    mtoCas353: null,
                    mtoCas354: null,
                    mtoCas355: null,
                    mtoCas385: null,
                    mtoCas356: null,
                    mtoCas357: null,
                    mtoCas388: null,
                    mtoCas358: null,
                    mtoCas359: null,
                    mtoCas360: null,
                    mtoCas362: null,
                    mtoCas363: null,
                    mtoCas364: null,
                    mtoCas365: null,
                    mtoCas366: null,
                    mtoCas361: null
                },
                casilla350: {
                    refTabla: 'casilla350',
                    lisCas350: []
                },
                casilla355: {
                    refTabla: 'casilla355',
                    lisCas355: []
                },
                casilla385: {
                    refTabla: 'casilla385',
                    lisCas385: []
                }
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda = {
                refTabla: 't5386cassegunda',
                mtoCas350: null,
                mtoCas353: null,
                mtoCas354: null,
                mtoCas355: null,
                mtoCas385: null,
                mtoCas356: null,
                mtoCas357: null,
                mtoCas388: null,
                mtoCas358: null,
                mtoCas359: null,
                mtoCas360: null,
                mtoCas362: null,
                mtoCas363: null,
                mtoCas364: null,
                mtoCas365: null,
                mtoCas366: null,
                mtoCas361: null
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla350) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla350 = {
                refTabla: 'casilla350',
                lisCas350: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla355) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla355 = {
                refTabla: 'casilla355',
                lisCas355: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla385) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla385 = {
                refTabla: 'casilla385',
                lisCas385: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo = {
                resumenTrabajo: {
                    refTabla: 't9030cascuarta',
                    mtoCas107: null,
                    mtoCas507: null,
                    mtoCas508: null,
                    mtoCas108: null,
                    mtoCas509: null,
                    mtoCas111: null,
                    mtoCas510: null,
                    mtoCas511: null,
                    mtoCas514: null,
                    mtoCas512: null,
                    mtoCas522: null,
                    mtoCas519: null,
                    mtoCas513: null,
                    mtoCas116: null,
                    mtoCas517: null,
                    mtoCas120: null,
                    mtoCas122: null,
                    mtoCas158: null,
                    mtoCas167: null,
                    mtoCas563: null,
                    mtoCas564: null,
                    mtoCas565: null,
                    mtoCas125: null,
                    mtoCas127: null,
                    mtoCas128: null,
                    mtoCas130: null,
                    mtoCas131: null,
                    mtoCas141: null,
                    mtoCas142: null,
                    mtoCas144: null,
                    mtoCas145: null,
                    mtoCas146: null,
                    mtoCas168: null,
                    mtoCas140: null
                },
                casilla107: {
                    refTabla: 'casilla107',
                    lisCas107: []
                },
                casilla108: {
                    refTabla: 'casilla108',
                    lisCas108: []
                },
                casilla111: {
                    refTabla: 'casilla111',
                    lisCas111: []
                },
                casilla514Cabecera: {
                    refTabla: 'casilla514Cabecera',
                    lisCas514Cabecera: [
                        {
                            indTipoGasto: '01',
                            mtoGasto: 0,
                            casilla514Detalle: {
                                refTabla: '',
                                lisCas514: []
                            }

                        },
                        {
                            indTipoGasto: '03',
                            mtoGasto: 0,
                            casilla514Detalle: {
                                refTabla: '',
                                lisCas514: []
                            }
                        },
                        {
                            indTipoGasto: '04',
                            mtoGasto: 0,
                            casilla514Detalle: {
                                refTabla: '',
                                lisCas514: []
                            }
                        },
                        {
                            indTipoGasto: '05',
                            mtoGasto: 0,
                            casilla514Detalle: {
                                refTabla: '',
                                lisCas514: []
                            }
                        }

                    ]
                },
                replicaCasilla514: {
                    refTabla: 'casilla514',
                    lisCas514: []
                },
                casilla522: {
                    refTabla: 'casilla522',
                    lisCas522: []
                },
                casilla519: {
                    refTabla: 'casilla519',
                    lisCas519: []
                },
                casilla116: {
                    refTabla: 'casilla116',
                    lisCas116: []
                }
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo = {
                refTabla: 't9030cascuarta',
                mtoCas107: null,
                mtoCas507: null,
                mtoCas508: null,
                mtoCas108: null,
                mtoCas509: null,
                mtoCas111: null,
                mtoCas510: null,
                mtoCas511: null,
                mtoCas514: null,
                mtoCas512: null,
                mtoCas522: null,
                mtoCas519: null,
                mtoCas513: null,
                mtoCas116: null,
                mtoCas517: null,
                mtoCas120: null,
                mtoCas122: null,
                mtoCas158: null,
                mtoCas167: null,
                mtoCas563: null,
                mtoCas564: null,
                mtoCas565: null,
                mtoCas125: null,
                mtoCas127: null,
                mtoCas128: null,
                mtoCas130: null,
                mtoCas131: null,
                mtoCas141: null,
                mtoCas142: null,
                mtoCas144: null,
                mtoCas145: null,
                mtoCas146: null,
                mtoCas168: null,
                mtoCas140: null
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla107) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla107 = {
                refTabla: 'casilla107',
                lisCas107: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla108) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla108 = {
                refTabla: 'casilla108',
                lisCas108: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla111) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla111 = {
                refTabla: 'casilla111',
                lisCas111: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla116) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla116 = {
                refTabla: 'casilla116',
                lisCas116: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla519) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla519 = {
                refTabla: 'casilla519',
                lisCas519: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla522) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla522 = {
                refTabla: 'casilla522',
                lisCas522: []
            };
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera = {
                lisCas514Cabecera: [],
                refTabla: ''
            };
        }

        if (this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera.length === 0) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera =
                [
                    {
                        indTipoGasto: '01',
                        mtoGasto: 0,
                        casilla514Detalle: {
                            refTabla: '',
                            lisCas514: []
                        }

                    },
                    {
                        indTipoGasto: '03',
                        mtoGasto: 0,
                        casilla514Detalle: {
                            refTabla: '',
                            lisCas514: []
                        }
                    },
                    {
                        indTipoGasto: '04',
                        mtoGasto: 0,
                        casilla514Detalle: {
                            refTabla: '',
                            lisCas514: []
                        }
                    },
                    {
                        indTipoGasto: '05',
                        mtoGasto: 0,
                        casilla514Detalle: {
                            refTabla: '',
                            lisCas514: []
                        }
                    }

                ];
        }

        if (!this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.replicaCasilla514) {
            this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.replicaCasilla514 = {
                refTabla: 'casilla514',
                lisCas514: []
            };
        }
        // Determinación deuda
        if (!this.preDeclaracion.declaracion.determinacionDeuda) {
            this.preDeclaracion.declaracion.determinacionDeuda = {
                rentaSegunda: {
                    pagoDirectoIR: {
                        refTabla: 't5413cas358',
                        lisCas358: []
                    },
                    impRetenidoRentas: {
                        refTabla: 't5414cas359',
                        lisCas359: []
                    }
                },
                rentaTrabajo: {
                    credIRFuenteExtran: {
                        refTabla: 't5849cas122',
                        lisCas122: []
                    },
                    pagoDirectoIR: {
                        refTabla: 't5409cas127',
                        lisCas127: []
                    },
                    pagoDirectIRQuinta: {
                        refTabla: 't5410cas128',
                        lisCas128: []
                    },
                    impRetenidoRentas: {
                        refTabla: 't5411cas130',
                        lisCas130: []
                    },
                    impRetenRentasQnta: {
                        refTabla: 't9880cas131',
                        lisCas131: []
                    }
                },
                pagosPrevios: {
                    lisPagosPrevios: []
                }
            };
        }

        if (!this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo) {
            this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo = {
                credIRFuenteExtran: {
                    refTabla: 't5849cas122',
                    lisCas122: []
                },
                pagoDirectoIR: {
                    refTabla: 't5409cas127',
                    lisCas127: []
                },
                pagoDirectIRQuinta: {
                    refTabla: 't5410cas128',
                    lisCas128: []
                },
                impRetenidoRentas: {
                    refTabla: 't5411cas130',
                    lisCas130: []
                },
                impRetenRentasQnta: {
                    refTabla: 't9880cas131',
                    lisCas131: []
                }
            };
        }

        if (!this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.credIRFuenteExtran) {
            this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.credIRFuenteExtran = {
                refTabla: 't5849cas122',
                lisCas122: []
            };
        }

        if (!this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.impRetenRentasQnta) {
            this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.impRetenRentasQnta = {
                refTabla: 't9880cas131',
                lisCas131: []
            };
        }

        if (!this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.impRetenidoRentas) {
            this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.impRetenidoRentas = {
                refTabla: 't5411cas130',
                lisCas130: []
            };
        }

        if (!this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.pagoDirectIRQuinta) {
            this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.pagoDirectIRQuinta = {
                refTabla: 't5410cas128',
                lisCas128: []
            };
        }

        if (!this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.pagoDirectoIR) {
            this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.pagoDirectoIR = {
                refTabla: 't5409cas127',
                lisCas127: []
            };
        }

        if (!this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda) {
            this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda = {
                pagoDirectoIR: {
                    refTabla: 't5413cas358',
                    lisCas358: []
                },
                impRetenidoRentas: {
                    refTabla: 't5414cas359',
                    lisCas359: []
                }
            };
        }

        if (!this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda.pagoDirectoIR) {
            this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda.pagoDirectoIR = {
                refTabla: 't5413cas358',
                lisCas358: []
            };
        }

        if (!this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda.impRetenidoRentas) {
            this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda.impRetenidoRentas = {
                refTabla: 't5414cas359',
                lisCas359: []
            };
        }

        if (!this.preDeclaracion.declaracion.determinacionDeuda.pagosPrevios) {
            this.preDeclaracion.declaracion.determinacionDeuda.pagosPrevios = {
               lisPagosPrevios: []
            };
        }

        SessionStorage.setPreDeclaracion(this.preDeclaracion);
    }
}
