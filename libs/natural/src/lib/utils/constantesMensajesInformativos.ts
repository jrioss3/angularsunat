export class ConstantesMensajesInformativos {
    
    static readonly MSJ_GRABADO_DATOS_EXITOSO = 'Se grabaron los datos exitosamente';
    
    static readonly MSJ_GRABADO_AUTOMATICO = 'La información ingresada se está grabando de manera automática.'

    static readonly MSJ_INFORMACION_REFERENCIAL_RENTAS = 'La información referencial de sus rentas, retenciones y pagos ' +
        'directos se ha incorporado de manera automática a la presente declaración. Usted deberá verificar ' +
        'dicha información y de ser el caso, completarla o modificarla antes de presentar la declaración. '

    static readonly MSJ_DECLARACIONES_INCONSISTENTE_PARRAFO_1 = '"Estimado contribuyente, a continuación, se muestra lo declarado por usted, su empleador y/o terceros ' +
        'durante el ejercicio {year}. Por favor, verifique y, de ser el caso, complete o modifique antes de presentar su declaración.'

    static readonly MSJ_DECLARACIONES_INCONSISTENTE_PARRAFO_2 = 'IMPORTANTE: En caso solicite devolución, considere que la información declarada por su empleador podría' +
        ' presentar inconsistencias, por lo que será verificada antes de su devolución."'

    static readonly MSJ_BIRTA_PERSONALIZADO = 'La información referencial de sus rentas, retenciones y pagos directos se ha incorporado de manera ' +
        'automática a la presente declaración. Usted deberá verificar dicha información y de ser el caso, completarla o modificarla ' +
        'antes de presentar la declaración.'
    
    static readonly MSJ_BIRTA_NO_PERSONALIZADO = 'Señor Contribuyente, no contamos con información referencial de sus rentas, retenciones y pagos ' +
        'directos. En caso tenga información por declarar, efectúe el registro de sus ingresos o rentas obtenidas durante el {year} ' +
        'de manera directa. Se le recuerda que la información referencial se elabora en base a las declaraciones juradas del ejercicio {year} ' +
        'efectuadas por usted o por terceros relacionados como agentes de retención o su empleador.';

    static readonly MSJ_SOCIEDAD_CONYUGAL = 'Recuerde que como Sociedad Conyugal la “Renta de trabajo y/o Fuente Extranjera” solo corresponde a las Rentas de Fuente Extranjera';

    static readonly MSJ_RTA_PRIMERA_INCLUYE_SOCIEDAD_CONYUGAL = 'Recuerde que esta opción considera que la declaración de sus rentas ' +
        'de primera categoría equivale al 50% del monto total generado por dichas rentas' +
        ', correspondiendo a su cónyuge la declaración y pago del 50% restante. Caso contrario' +
        ' debe marcar la opción “Sociedad Conyugal que ha ejercido la opción prevista en el Art. 16”';

    static readonly MSJ_RECIBO_DENTRO_PERIODO_DECLARAR = 'El Recibo debe corresponder al periodo a declarar y debe haber sido cancelado';

    static readonly MSJ_INGRESAR_MONTO_TIPO_COMPROB_FACTURA = 'Si la factura ha sido modificada por una nota de crédito o débito ingrese solo el importe neto';

    static readonly MSJ_RECUERDO_GASTOS_REGISTRAR_CAS_514_ALQUILERES = 'Recuerde que el gasto que va registrar debe ser realizado utilizando medios ' +
        'de pago establecidos en el artículo 5° de la Ley 28194 – Ley para la Lucha contra la Evasión y para la Formalización de la Economía.'

    static readonly MSJ_INGRESAR_INTERES_MORATORIO = 'Ingrese el interés moratorio siempre que exista saldo a favor del fisco.';

    static readonly MSJ_EJERCICIO_SELECCIONADO_NO_VIGENTE = 'Sr. Contribuyente, usted ha seleccionado el ejercicio AAAA (periodo vencido) ¿Desea rectificar su declaración presentada en la fecha?';

    static readonly MSJ_FORMULARIO_SOLO_PERSONA_NATURAL = 'El siguiente formulario está dirigido solo a Personas Naturales - Otras Rentas.'

    static readonly MSJ_NO_HA_PAGADO_ALQUILER = 'En la parte INFORMATIVA usted ha declarado que NO ha' +
    ' pagado alquiler por algún bien mueble o inmueble durante el ejercicio. Por favor' +
    ' revisar a fin de continuar con su Declaración Anual.';

    static readonly MSJ_DESEA_ELIMINAR_REGISTRO = '¿Desea eliminar el registro?';

    static readonly MSJ_CONFORMIDAD_REGISTRO_ELIMINADO = 'Se eliminó el elemento correctamente.';

    // Mensajes de la casilla 514
    static readonly MSJ_NO_CUMPLE_VALIDACION_CIIU = 'CIIU del emisor no corresponde a servicios de Hoteles y Restaurantes.';

    //static readonly MSJ_NO_CUMPLE_VALIDACION_CIIU_ARTESANIAS = 'CIIU del emisor no corresponde a servicios de Artesanía y Turismo.';

    static readonly MSJ_NO_CUMPLE_VALIDACION_CIIU_ARTESANIAS = 'RUC del emisor no corresponde al servicio de Turismo y/o Artesanía (RNA)';

    static readonly MSJ_NO_CUMPLE_FECHAS_ARTESANIAS = 'mensaje ruc';
    
    static readonly MSJ_SI_BVE_FUE_MODIFICADA = 'Recuerde que si el comprobante ha sido modificado por una nota de crédito o débito' +
    ' debe ingresar solo los importes netos del comprobante.'

    static readonly MSJ_NO_HAY_REGISTROS_EXPORTAR = 'Sr. Contribuyente no cuenta con información en esta casilla'

    static readonly MSJ_NO_HAY_REGISTROS_ARCHIVO_PERSONALIZADO = 'Sr. Contribuyente, no cuenta con información del Archivo Personalizado'
}