export class ConstantesDocumentos {
    static SIN_DATOS = '99'; // ANTES 0
    static OTROS_TIPOS_DE_DOCUMENTOS = '00'; // ANTES 1
    static CARNET_DE_EXTRANJERIA = '04'; // ANTES 2
    static LIBRETA_CEDULA_TRIBUTARIA = '05'; // ANTES 3
    static RUC = '06'; // ANTES 4
    static PASAPORTE = '07'; // ANTES 5
    static DOC_PROVISIONAL_DE_IDENTIDAD = '08'; // OK
    static SIN_RUC = '80'; // ANTES 7
    static TRABAJADOR_ESPECIAL_ONP = '100'; // NO FOUND, ANTES 8
    static DNI = '01'; // ANTES 10
    static AUTOGENERADO = '10'; // ANTES 11
    static DOC_EDUCACION_SUPERIOR = '12'; // OK
    static TRABAJADOR_MENOR_DE_EDAD = '13'; // OK
    static CARNET_DE_FUERZAS_POLICIALES = '02'; // ANTES 14
    static CARNET_DE_FUERZAS_ARMADAS = '03'; // ANTES 15
    static DOC_TRIBUTARIO_PAIS_ORIGEN = '21';
    static SIN_RUC_2 = '80';
    static TRABAJADOR_ESPECIAL_ONP_S_VAL = '97';
    static TRABAJADOR_ESPECIAL_ONP_2 = '98';
    static CONSOLIDADO = '99'; // OK
    static CARNET_IDENTIDAD = 'A';
    static PTP = 'F';

    static OTROS_TIPOS_DE_DOCUMENTOS_NATURAL = '0';
    static NIT = '08';

    static TipoDocumento(doc: string) {
        if (doc === 'RUC') { return '6'; }
        if (doc === 'DNI') { return '1'; }
        if (doc === 'CEX') { return '4'; }
        if (doc === 'PAS') { return '7'; }
        if (doc === 'NIT') { return '8'; }
    }
}
