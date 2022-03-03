export class Rutas {

    public static NATURAL =  'personas';
    public static JURIDICO = 'empresas';
    public static BIENVENIDA = 'bienvenida';
    public static CONSULTAS = 'consultas';

    public static FORMULRIO710 = 'formulario710';
    public static FORMULRIO709 = 'formulario709';

    public static SEC_INFORMATIVA = 'seccion-informativa';
    public static SEC_DETERMINATIVA = 'seccion-determinativa';

    public static PAGO = 'pago';

    public static CONSTANCIA = 'constancia';
    public static PASARELA = 'pasarela';

    public static NATURAL_FORMULRIO709 = `${Rutas.NATURAL}/${Rutas.FORMULRIO709}`;
    public static JURIDICO_FORMULRIO710 = `${Rutas.JURIDICO}/${Rutas.FORMULRIO710}`;

    public static NATURAL_INFORMATIVA = `${Rutas.NATURAL}/${Rutas.SEC_INFORMATIVA}`;
    public static JURIDICO_INFORMATIVA = `${Rutas.JURIDICO}/${Rutas.SEC_INFORMATIVA}`;
    
    public static NATURAL_DETERMINATIVA = `${Rutas.NATURAL}/${Rutas.SEC_DETERMINATIVA}`;
    public static JURIDICO_DETERMINATIVA = `${Rutas.JURIDICO}/${Rutas.SEC_DETERMINATIVA}`;

    public static NATURAL_PAGO_CONSTANCIA = `${Rutas.NATURAL}/${Rutas.PAGO}/${Rutas.CONSTANCIA}`;
    public static JURIDICO_PAGO_CONSTANCIA = `${Rutas.JURIDICO}/${Rutas.PAGO}/${Rutas.CONSTANCIA}`;

    public static NATURAL_PAGO_PASARELA = `${Rutas.NATURAL}/${Rutas.PAGO}/${Rutas.PASARELA}`;
    public static JURIDICO_PAGO_PASARELA = `${Rutas.JURIDICO}/${Rutas.PAGO}/${Rutas.PASARELA}`;

}