import { Rutas } from './rutas';

export class MensajeGeneralesObj {
    static CUS4_EX01 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabInformacionGeneral',
            mensaje: 'Sección Informativa - Información General - El documento ingresado no es válido'
        };
    static CUS8_EX01 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabInformacionGeneral',
            mensaje: 'Favor de ingresar los datos en la Pestaña Información Complementaria-Información General'
        };
    static CUS8_EX02 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabAlquileresPagados',
            mensaje: 'Sección Informativa - Alquileres Pagados - Usted, debe registrar al menos un alquiler'
        };
    static CUS8_EX03 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabPrincipalesSocios',
            mensaje: 'Sección Informativa - 100 Principales Socios, asociados y otros - Debe consignar ' +
                'información de los principales socios, asociados, participacionistas  y otros'
        };
    static CUS8_EX04 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabIdentificacion',
            mensaje: 'Sección Informativa - Donaciones - Usted, debe registrar al menos una donación'
        };
    static CUS8_EX05 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabAlquileresPagados',
            mensaje: 'Sección Informativa - Alquileres Pagados - Usted deberá registrar monto de alquiler anual válido'
        };
    static CUS8_EX06 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabPrincipalesSocios',
            mensaje: 'Sección Informativa - 100 Principales Socios, asociados y otros - Sírvase revisar la información registrada, según el tipo de contribuyente, deberá registrar como mínimo dos (2) socios'
        };
    static CUS13_EX20 =
        {
            url: Rutas.JURIDICO + '/seccion-determinativa',
            redirectParentTabId: 'tabDeterminativa',
            redirectTabId: 'tabCContraImpRenta',
            mensaje: 'Sección Determinativa - Cred. Contra Imp. Renta - Cuenta con Saldo a Favor de ITAN, indique si solicitará la Devolución'
        };
    static CUS14_EX01 =
        {
            url: Rutas.JURIDICO + '/seccion-determinativa',
            redirectParentTabId: 'tabDeterminativa',
            redirectTabId: 'tabDeterminacionDeuda',
            mensaje: 'Sección Determinativa - Determinación de la Deuda - Tiene saldo a favor, indique la opción en la casilla 137'
        };
    static CUS14_EX03 =
        {
            url: Rutas.JURIDICO + '/seccion-determinativa',
            redirectParentTabId: 'tabDeterminativa',
            redirectTabId: 'tabDeterminacionDeuda',
            mensaje: 'Sección Determinativa - Determinación de la Deuda - Casilla 137 - Valor excedió el valor máximo'
        };
    // SECCION DETERMINATIVA
    static mensajeValidaciones1 =
        {
            url: Rutas.JURIDICO + '/seccion-determinativa',
            redirectParentTabId: 'tabDeterminativa',
            redirectTabId: 'tabDeterminacionDeuda',
            mensaje: 'Sección Determinativa - Determinación de la Deuda - El importe a pagar (casilla 180),' +
                ' no puede ser mayor al saldo de la deuda tributaria (casilla 146)'
        };
    static mensajeValidaciones2 =
        {
            url: Rutas.JURIDICO + '/seccion-determinativa',
            redirectParentTabId: 'tabDeterminativa',
            redirectTabId: 'tabEstadosFinancieros',
            mensaje: 'Sección Determinativa - Usted no puede presentar el Formulario Virtual 710 simplificado' +
                ' porque sus ingresos superan las 1700 UIT, deberá efectuar su presentación por medio del Formulario Virtual 710 completo'
        };
    static mensajeValidaciones3 =
        {
            url: Rutas.JURIDICO + '/seccion-determinativa',
            redirectParentTabId: 'tabDeterminativa',
            redirectTabId: 'tabDeterminacionDeuda',
            mensaje: 'Sección Determinativa - Determinación de la Deuda - Ingrese el importe a pagar (casilla 180)'
        };
    static mensajeValidaciones4 =
        {
            url: Rutas.JURIDICO + '/seccion-determinativa',
            redirectParentTabId: 'tabDeterminativa',
            redirectTabId: 'tabDeterminacionDeuda',
            mensaje: 'Sección Determinativa - Determinación de la Deuda - Tiene saldo a favor, indique la opción en la casilla 137'
        };
    static mensajeValidaciones5 =
        {
            url: Rutas.JURIDICO + '/seccion-determinativa',
            redirectParentTabId: 'tabDeterminativa',
            redirectTabId: 'tabEstadosFinancieros',
            mensaje: 'Sección Determinativa - Estados Financieros - El Total Activo debe ser igual a Total Pasivo + Patrimonio (Histórico).'
        };

    // SECCION INFORMATIVA
    static mensajeValidaciones6 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabIdentificacion',
            mensaje: 'Sección Informativa - Identificación - Debe seleccionar el Tipo de Regimen.'
        };
    static mensajeValidaciones7 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabIdentificacion',
            mensaje: 'Sección Informativa - Identificación - Debe seleccionar una Base Legal'
        };
    static mensajeValidaciones8 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabIdentificacion',
            mensaje: 'Sección Informativa - Identificación - Debe especificar la Base Legal'
        };
    static mensajeValidaciones9 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabInformacionGeneral',
            mensaje: 'Sección Informativa - Información General - Debe ingresar el número del documento del Representante Legal'
        };
    static mensajeValidaciones10 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabInformacionGeneral',
            mensaje: 'Debe ingresar un correo electrónico del contador'
        };
    static mensajeValidaciones11 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabInformacionGeneral',
            mensaje: 'Sección Informativa - Información General - Inconsistencias en el correo electrónico'
        };
    static mensajeValidaciones12 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabInformacionGeneral',
            mensaje: 'Sección Informativa - Información General - Debe ingresar el nombre del Representante Legal'
        };
    static mensajeValidaciones13 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabInformacionGeneral',
            mensaje: 'Sección Informativa - Información General - El número de C.P.C ingresado no es válido'
        };
    static mensajeValidaciones14 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabInformacionGeneral',
            mensaje: 'Sección Informativa - Información General - El número de celular ingresado no es válido'
        };
    static mensajeValidaciones15 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabInformacionGeneral',
            mensaje: 'Sección Informativa - Información General - El número de teléfono ingresado no es válido'
        };
    static mensajeValidaciones16 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabEmpresasConstructoras',
            mensaje: 'Sección Informativa - Empresas Constructoras-Art.63-Impuesto a la Renta' +
                ' - Debe seleccionar un Método de la Determinación de la Renta Bruta'
        };

    static mensajeValidaciones17 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabInformacionGeneral',
            mensaje: 'Sección Informativa - Información General - Debe ingresar los datos del Representante Legal'
        };

    static mensajeValidaciones18 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabPrincipalesSocios',
            mensaje: 'Sección Informativa - 100 Principales Socios, asociados y otros - Sírvase revisar, la sumatoria del porcentaje de participación de los socios debe ser exactamente el 100%'
        };

    static mensajeValidaciones19 =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabInformacionGeneral',
            mensaje: 'Sección Informativa - Información General - Sr. Contribuyente, confirme los datos de representante legal para continuar'
        };

    // validaciones
    static validacionLisPrinAccionistas =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabPrincipalesSocios',
            mensaje: 'Sección Informativa - 100 Principales Socios, asociados y otros - Inconsistencias en los registros'
        };
    static validacionLisPrinAccionistasFichaRuc =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabPrincipalesSocios',
            mensaje: 'Sección Informativa - 100 Principales Socios, asociados y otros - Complete la información faltante en socios'
        };
    static validacionLisAlquileres =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabComplementaria.tabAlquileresPagados',
            mensaje: 'Sección Informativa - Alquileres Pagados - Inconsistencias en los registros'
        };
    static validacionLisT8999donacion =
        {
            url: Rutas.JURIDICO + '/seccion-informativa',
            redirectParentTabId: 'tabInformativa',
            redirectTabId: 'tabIdentificacion',
            mensaje: 'Sección Informativa - Donaciones - Inconsistencias en los registros'
        };
}
