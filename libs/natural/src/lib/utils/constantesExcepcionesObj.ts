import { Rutas } from '@rentas/shared/constantes';

export class ConstantesExcepcionesObj {
    /*INFORMATIVA*/
    /*Tipo de Declaracion*/
    static CUS02_VALIDAR_01: any = {
        url: Rutas.NATURAL+'/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabTipoDeclaracion',
        mensaje: 'Inconsistencia con el tipo de documento del cónyugue'
    };
    static CUS02_VALIDAR_02: any = {
        url: Rutas.NATURAL+'/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabTipoDeclaracion',
        mensaje: 'Inconsistencia con el numero de documento del cónyugue'
    };
    static CUS02_VALIDAR_03: any = {
        url: Rutas.NATURAL+'/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabTipoDeclaracion',
        mensaje: 'El DNI ingresado no es válido'
    };
    static CUS02_VALIDAR_04: any = {
        url: Rutas.NATURAL+'/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabTipoDeclaracion',
        mensaje: 'El RUC ingresado no es válido'
    };
    static CUS02_VALIDAR_06: any = {
        url: Rutas.NATURAL+'/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabTipoDeclaracion',
        mensaje: 'RUC debe corresponder a una Persona Natural'
    };
    static CUS02_VALIDAR_07: any = {
        url: Rutas.NATURAL+'/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabTipoDeclaracion',
        mensaje: 'Debe registrar número de documento'
    };
    static CUS02_VALIDAR_08: any = {
        url: Rutas.NATURAL+'/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabTipoDeclaracion',
        mensaje: 'El valor especificado no es válido'
    };
    /*Condóminos*/
    static CUS03_VALIDAR: any = {
        url: Rutas.NATURAL+'/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabCondominios',
        mensaje: 'Tiene que responder la pregunta en la parte de condóminos de la seccion informativa'
    };
    static CUS03_VALIDAR_2: any = {
        url: Rutas.NATURAL+'/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabCondominios',
        mensaje: 'Se debe registrar por lo menos el detalle de un condómino.'
    };
    /*Alquileres Pagados*/
    static CUS04_VALIDAR: any = {
        url: Rutas.NATURAL+'/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabAlquileresPagados',
        mensaje: 'Tiene que responder la pregunta en la parte de Alquileres Pagados de la seccion informativa'
    };
    static CUS04_VALIDAR_2: any = {
        url: Rutas.NATURAL+'/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabAlquileresPagados',
        mensaje: 'Usted debe registrar al menos un arrendador en Alquileres Pagados'
    };
    /*Atribuciones de gastos*/
    static CUS34_VALIDAR_1: any = {
        url: Rutas.NATURAL+'/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabAtribucionGastos',
        mensaje: 'Usted tiene más de una atribución recibida por Sociedad Conyugal, por favor revisar'
    };
    /*DETERMINATIVA*/
    /*PRIMERA*/
    static CUS17_EX_PRIMERA_1: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion',
        mensaje: 'El Importe a pagar en Rentas de Primera Categoría (casilla 166)' +
            ' no puede ser mayor al saldo de la deuda tributaria (casilla 164) (casillas ubicadas en el rubro Determinación de la deuda).'
    };
    static CUS17_EX_PRIMERA_2: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion',
        mensaje: 'Seleccione Indicador de Utilización de Saldo a Favor de Rentas de' +
            ' Primera Categoría casilla 160 (casilla ubicada en el rubro Determinación de la deuda)'
    };
    static CUS17_EX_PRIMERA_3: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion',
        mensaje: 'Determinación de la Deuda – Renta de Primera Categoría: Ingrese el importe a pagar (casilla 166).'
    };
    /*SEGUNDA*/
    static CUS17_EX_SEGUNDA_1: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion',
        mensaje: 'El Importe a pagar en Rentas de Segunda Categoría (casilla 366)' +
            ' no puede ser mayor al saldo de la deuda tributaria (casilla 365) (casillas ubicadas en el rubro Determinación de la deuda).'
    };
    static CUS17_EX_SEGUNDA_2: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion',
        mensaje: 'Seleccione Indicador de Utilización de Saldo a Favor de Rentas de' +
            ' Segunda Categoría casilla 361 (casilla ubicada en el rubro Determinación de la deuda)'
    };
    static CUS17_EX_SEGUNDA_3: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabRentaSegundaCategoria',
        mensaje: 'Ingrese información en la casilla 350 o en la casilla 355 o en la' +
            ' casilla 358 (casillas ubicadas en el rubro Rentas de Capital Segunda Categoría)'
    };
    static CUS17_EX_SEGUNDA_4: any = {
        url: Rutas.NATURAL+ '/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion',
        mensaje: 'Determinación de la Deuda – Renta de Segunda Categoría: Ingrese el importe a pagar (casilla 366).'
    };
    /*TRABAJO*/
    static CUS17_EX_TRABAJO_1: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion', mensaje: 'El Importe a pagar en Rentas de' +
            ' Trabajo (casilla 168) no puede ser mayor al saldo de la deuda tributaria (casilla 146)' +
            ' (casillas ubicadas en el rubro Determinación de deuda).'
    };
    static CUS17_EX_TRABAJO_3: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabFuenteExtranjera',
        mensaje: 'Sus donaciones por Mecenazgo Deportivo superan el 10% de su renta neta,' +
            ' por lo que solo se está considerando como valor el gasto deducible máximo.' +
            ' La diferencia puede ser considerada dentro de la Donación a la que hace referencia' +
            ' el numeral 5.2 del artículo 5 del DS 217-2017-EF.'
    };
    static CUS17_EX_TRABAJO_4: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabFuenteExtranjera',
        mensaje: 'La suma de sus donaciones por Art.49 de la LIR y Desastres Naturales superan el' +
            ' 10% de su renta neta, por lo que solo se está considerando como valor el gasto deducible máximo.'
    };
    static CUS17_EX_TRABAJO_5: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion',
        mensaje: 'Seleccione Indicador de Utilización de Saldo a Favor de Rentas de' +
            ' Trabajo casilla 140 (casilla ubicada en el rubro Determinación de la deuda)'
    };
    static CUS17_EX_TRABAJO_6: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabFuenteExtranjera',
        mensaje: 'La información en la casilla 111 no puede estar vacía' +
            ' (casilla ubicada en el rubro Rentas de Trabajo y/o Fuente Extranjera)'
    };
    static CUS17_EX_TRABAJO_7: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabFuenteExtranjera',
        mensaje: 'La información en las casillas 107 o 108 no pueden estar vacías' +
            ' (casillas ubicadas en el rubro Rentas de Trabajo y/o Fuente Extranjera)'
    };

    static CUS17_EX_TRABAJO_8: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion',
        mensaje: 'La información de la casilla 122 no puede ser mayor a COMPARABLE'
      };

    static CUS17_EX_TRABAJO_9: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabFuenteExtranjera',
        mensaje: 'Usted tiene más de una atribución recibida por concepto de Sociedad Conyugal, por favor revisar.'
    };
    static CUS17_EX_TRABAJO_10: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabFuenteExtranjera',
        mensaje: 'No ha registrado información de sus rentas, por favor revise'
    };
    static CUS17_EX_TRABAJO_12: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion',
        mensaje: 'Determinación de la Deuda – Renta de Trabajo: Ingrese el importe a pagar (casilla 168)'
    };
    static CUS18_EX02: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion',
        mensaje: 'Importe a pagar no puede ser mayor al Total de la deuda.'
    };
    static CUS20_EX01: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion',
        mensaje: 'Importe a pagar no puede ser mayor al Total de la deuda.'
    };
    static CUS23_EX01: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion',
        mensaje: 'El saldo a favor del ejercicio anterior no puede ser menor a cero'
    };
    static CUS23_EX02: any = {
        url: Rutas.NATURAL+'/seccion-determinativa',
        redirectParentTabId: 'tabDeterminativa',
        redirectTabId: 'tabDeterminacion',
        mensaje: 'Importe a pagar no puede ser mayor al Total de la deuda'
    };
}
