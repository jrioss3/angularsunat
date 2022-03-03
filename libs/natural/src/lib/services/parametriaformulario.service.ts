import { Injectable } from '@angular/core';

@Injectable()
export class ParametriaFormulario {
    constructor() { }

    obtenerfuenteperdida() {
        return [
            { desc: 'A TRAVÉS DE FONDOS Y FIDEICOMISOS.', val: '01' },
            { desc: 'DIRECTAMENTE A TRAVÉS DE LA BOLSA DE VALORES DE LIMA', val: '02' },
            { desc: 'DIRECTAMENTE FUERA DE LA BOLSA DE VALORES DE LIMA', val: '03' }
        ];
    }

    obtenerTipoComprobante() {
        return [
            { desc: 'RECIBO POR HONORARIOS', val: '02' },
            { desc: 'NOTA DE CRÉDITO', val: '07' }
        ];
    }

    obtenerTipoDonacion() {
        return [
            { desc: 'MECENAZGO DEPORTIVO (LEY 30479)', val: 'A' },
            { desc: 'EXCESO DE MECENAZGO DEPORTIVO - NUMERAL 5.2 DEL ARTÍCULO 5 DEL DS 217-2017-EF', val: 'B' },
            { desc: 'ARTÍCULO 49 INCISO B) DE LA LEY DEL IMPUESTO A LA RENTA', val: 'C' },
            { desc: 'DESASTRES NATURALES (LEY 30498)', val: 'D' }
        ];
    }

    obtenerTipoRenta() {
        return [
            { desc: 'RENTA DE BIENES INMUEBLES', val: '1' },
            { desc: 'DIVIDENDOS', val: '2' },
            { desc: 'INTERESES', val: '3' },
            { desc: 'REGALÍAS', val: '4' },
            { desc: 'GANANCIAS O PÉRDIDA DE CAPITAL DE BIENES MUEBLES E INMUEBLES', val: '5' },
            {
                desc:
                    'GANANCIAS O PÉRDIDA DE CAPITAL POR ENAJENACIÓN DE ACCIONES, PARTICIPACIONES' +
                    ' Y OTROS VALORES MOBILIARIOS FUERA DEL MERCADO INTEGRADO LATINOAMERICANO – MILA',
                val: '6'
            },
            { desc: 'SERVICIOS PERSONALES INDEPENDIENTES', val: '7' },
            { desc: 'SERVICIOS PERSONALES DEPENDIENTES', val: '8' },
            { desc: 'OTRAS RENTAS', val: '9' }
        ];
    }

    obtenerTipoRentaCUS05() {
        return [
            { desc: 'RENTA DE BIENES INMUEBLES', val: '1' },
            { desc: 'DIVIDENDOS', val: '2' },
            { desc: 'INTERESES', val: '3' },
            { desc: 'REGALÍAS', val: '4' },
            { desc: 'GANANCIA DE CAPITAL DE BIENES MUEBLES E INMUEBLES', val: '5' },
            {
                desc:
                    'GANANCIA DE CAPITAL POR ENAJENACIÓN DE ACCIONES, PARTICIPACIONES' +
                    ' Y OTROS VALORES MOBILIARIOS',
                val: '6'
            },
            { desc: 'SERVICIOS PERSONALES INDEPENDIENTES', val: '7' },
            { desc: 'SERVICIOS PERSONALES DEPENDIENTES', val: '8' },
            { desc: 'OTRAS RENTAS', val: '9' }
        ];
    }

    obtenerTipoComprobante_cus27() {
        return [
            { val: '01', desc: 'FACTURA' },
            { val: 'FV', desc: 'FV 1683' },
        ];
    }

    obtenerTipoComprobante_cus32_Medicos() {
        return [
            { val: '01', desc: 'RH ELECTRÓNICO' },
        ];
    }

    obtenerTipoComprobante_cus32_Hoteles() {
        return [
            { val: '03', desc: 'BOLETA DE VENTA' },
            { val: '12', desc: 'TICKET POS' },
            { val: 'xx', desc: 'TICKET MONEDERO ELECTRÓNICO' }
        ];
    }

    obtenerTipoComprobante_cus32_Artesanias() {
        return [
            { val: '03', desc: 'BOLETA DE VENTA' },
            { val: '01', desc: 'RH ELECTRÓNICO' }
            //{ val: '12', desc: 'TICKET POS' },
            //{ val: 'xx', desc: 'TICKET MONEDERO ELECTRÓNICO' }
        ];
    }

    obtenerFormaPagoRHE() {
        return [
            { val: '014', desc: 'PAGO BANCARIZADO' },
            { val: '008', desc: 'EFECTIVO' }
        ];
    }

    obtenerFormaPago() {
        return [
            { val: '01', desc: 'PAGO BANCARIZADO' },
            { val: '02', desc: 'EFECTIVO' }
        ];
    }

    obtenerTipoRentaRTFI() {
        return [
            { desc: 'RENTA NETA SIN RÉGIMEN DE TRANSPARENCIA FISCAL INTERNACIONAL', val: '1' },
            { desc: 'RENTA NETA PROVENIENTE DE TRANSPARENCIA FISCAL INTERNACIONAL', val: '2' }
        ];
    }

    obtenerDobleImposicion() {
        return [
            { desc: 'NO', val: '1' },
            { desc: 'SI', val: '2' }
        ];
    }

    obtenerOpcionCDI() {
        return [
            { desc: 'TRIBUTACIÓN EXCLUSIVA EN RESIDENCIA', val: '1' },
            { desc: 'TRIBUTACIÓN COMPARTIDA', val: '2' }
        ];
    }

    ObtenerTipoFuenteRenta() {
        return [
            { desc: 'BIENES INSCRITOS EN EL REGISTRO PÚBLICO DE MERCADO DE VALORES DEL PERÚ Y ENAJENADOS EN LA BVL.', val: '1' },
            { desc: 'BIENES NEGOCIADOS A TRAVÉS DEL MILA (MERCADO INTEGRADO LATINOAMERICANO).', val: '2' }
        ];
    }

    obtenerTipoVinculo() {
        return [
            { desc: 'CÓNYUGE', val: '02' },
            { desc: 'CONCUBINO', val: '03' },
        ];
    }

    obtenerTipoDocumentoVinculo() {
        return [
            { desc: 'PARTIDA DE MATRIMONIO', val: '01' },
            { desc: 'PARTIDA REGISTRAL – SUNARP', val: '02' },
            { desc: 'REGISTRO RENIEC', val: '03' },
            { desc: 'OTROS', val: '04' }
        ];
    }

    ObtenerTipoGasto() {
        return [
            { desc: 'ALQUILERES', val: '1' }
        ];
    }

    obtenerActiviadesEconomicasPrincipales() {
        return [
            { val: '5510', desc: 'ACTIVIDADES DE ALOJAMIENTO PARA ESTANCIAS CORTAS' },
            { val: '5520', desc: 'ACTIVIDADES DE CAMPAMENTOS, PARQUES DE VEHÍCULOS RECREATIVOS Y PARQUES DE CARAVANAS' },
            { val: '5590', desc: 'OTRAS ACTIVIDADES DE ALOJAMIENTO' },
            { val: '5610', desc: 'ACTIVIDADES DE RESTAURANTES Y DE SERVICIO MÓVIL DE COMIDAS' },
            { val: '5621', desc: 'SUMINISTRO DE COMIDAS POR ENCARGO' },
            { val: '5629', desc: 'OTRAS ACTIVIDADES DE SERVICIO DE COMIDAS' },
            { val: '5630', desc: 'ACTIVIDADES DE SERVICIO DE BEBIDAS' },
        ];
    }

    obtenerActividadesEconomicasPrincipalesTurismo() {
        return [
            { val: '63040', desc: 'AGENCIAS DE VIAJES Y GUIAS TURISTICOS' },
            { val: '7911', desc: 'ACTIVIDADES DE AGENCIAS DE VIAJES' },
            { val: '7912', desc: 'ACTIVIDADES DE OPERADORES TURÍSTICOS' },
            { val: '7990', desc: 'OTROS SERVICIOS DE RESERVAS Y ACTIVIDADES CONEXAS' },
        ];
    }

    obtenerActividadEconomicaPadron() {
        return [
            { val: '55104', desc: 'HOTELES, CAMPAMENTOS Y OTROS' },
            { val: '55205', desc: 'RESTAURANTES, BARES Y CANTINAS' }
        ];
    }


    obtenerOpcionesDeclaracion() {
        return [
            { val: '1', desc: 'Original'},
            { val: '2', desc: 'Sustitutoria/Rectificatoria'}
        ]
    }

    obtenerTiposDeclaracion() {
        return [
            { val: '1', desc: 'Personal'},
            { val: '2', desc: 'Sociedad Conyugal(atribuida a uno de los Cónyuges - Art 16° L IRenta)'}
        ]
    }

    obtenerOpcionesSiNo() {
        return [
            { val: '1', desc: 'Si'},
            { val: '0', desc: 'No'}
        ]
    }

    obtenerOpcionesDevolucionAplicacion() {
        return [
            { val: '1', desc: 'Devolución'},
            { val: '2', desc: 'Aplicación'}
        ]
    }
}
