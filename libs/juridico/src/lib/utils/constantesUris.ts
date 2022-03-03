import { environment } from '@rentas/shared/environments';

export class ConstantesUris {
  static URI_EXPORTAR_PPJJ = environment.uri_base + '/generador/ppjj/detallado';

  static URI_BASE = environment.uri_base + '/parametriaformulario/';
  static URI_CONSULTA_PARAMETRIA =
    environment.uri_base + '/parametriaformulario/parametro/';

  static URI_CONSULTA_CONTRIBUYENTE =
    environment.uri_base + '/formularioutil/consulta/contribuyente/';
  static URI_CONSULTA_NATURAL =
    environment.uri_base + '/formularioutil/consulta/persona/';

  public static readonly URI_DESCARGAR_PPJJ_PRELIMINAR_SIMPLE =
    environment.uri_base + '/generador/ppjj/simple?isPreliminar=true';
  public static readonly URI_DESCARGAR_PPJJ_SIMPLE =
    environment.uri_base + '/generador/ppjj/simple';

  public static readonly URI_ENVIAR_PPJJ_PRELIMINAR_SIMPLE =
    environment.uri_base + '/generador/ppjj/simple?isPreliminar=true&correo=true';
  public static readonly URI_ENVIAR_PPJJ_SIMPLE =
    environment.uri_base + '/generador/ppjj/simple?correo=true';

  static URI_BASE_PD = environment.uri_base + '/predeclaracion';

  static URI_VALIDAR = environment.uri_base + '/personajuridica'; // - /validaDJ?numSec=

  public static readonly URI_PROXYPAGO_REGISTRO_REALIZARPAGO =
    environment.uri_base + '/orquestacionproxypago/registro/realizarPago';
  public static readonly URI_PARAMETRIA_PASARELA_VISA_RESPONSE =
    environment.uri_base + '/orquestacionproxypago/registro/consultarPago/';
  public static readonly URI_PARAMETRIA_PASARELA_VISA =
    environment.uri_base + '/orquestacionproxypago/transaccionvisa';

  public static readonly URI_PARAMETRIA_PASARELA =
    environment.uri_base +
    '/parametriapasarela/pasarela/' +
    environment.numero_pasarela;

  public static readonly URI_PASARELA_PRESENTE_PAGE =
    environment.uri_base + '/orquestacionpresentacion/procesarPresentarPagar';
  public static readonly URI_VALIDAR_PRESENTACION =
    environment.uri_base + '/orquestacionpresentacion/validarPresentacion';

  public static readonly URI_PASARELA_VALIDAR_FRACCIONAMIENTO =
    environment.uri_base + '/fraccionamiento/validarFraccionamiento';

  public static readonly URI_LINK_DEVOLUCION =
    environment.uri_base + '/personajuridica/devolucion';

  /**
   * Parametros: RUC, PERIODO, FORMULARIO, TIPO: => 01(PPJJ), 02(PPNN), 03(DESKTOP)
   */
  public static readonly URI_VISORCONSTANCIA =
    environment.uri_base + '/visorconstancia';

  /**
   * Para consultar la lista de representantes legales.
   */
  public static readonly URI_REPRESENTANTES_LEGALES =
    environment.uri_base + '/formularioutil/consulta/representantes';

  /**
   * Para consultar tipo de casillas.
   */
  public static readonly URI_TIPO_CASILLAS =
    environment.uri_base + '/formularioutil/consulta/parametrot01/140';

  /**
   * Para consultar ANEXO 5
   */
  public static readonly URI_ANEXO_5 =
    environment.uri_base + '/consultalegacy/declaracion/obtenerIndicadorAfectoMYPE';

  /**
   * Registro del Pedido de Fraccionamiento en Solicitudes
   */
  public static readonly URI_FRACCIONAMIENTO_REGISTRO_SOLICITUDES =
    environment.uri_base + '/fraccionamiento/pedido';

  /**
   * velidar fecha de vencimiento
   */
  public static readonly URI_VALIDAR_FECHA_VENCIMIENTO =
    environment.uri_base + '/formularioutil/consulta/ves/vencimiento';

  /**
   * Datos del contador del Ejercicio Anterior
   */
  public static readonly URI_CONSULTA_DATOS_CONTADOR =
    environment.uri_base + '/predeclaracion/byEjercicio';

  public static readonly CODTRIBUTO = '030801';
  static GENERAL_FORMULARIO = 'formulario';
  static FORMULARIO_ERROR = 'error';
  static FORMULARIO_CASILLA = 'casilla';
  static FORMULARIO_COMBOS = 'parametro';

  /**
   * Descargar PDF
   */
  public static readonly URI_DESCARGAR_PDF =
    environment.uri_base + '/generador/ppjj/detallado/descarga';

  /**
   * Obtener pagos.
   * se consulta si el contribuyente ya realizo un pago.
   */
  public static readonly URI_OBTENER_PAGOS =
    environment.uri_base + '/orquestacionpresentacion/consulta/obtenerPagos';

  /**
   * este enpoint es para el cierre de session
   */
  public static readonly URI_CERRAR_SESION =
    '/loader/recaudaciontributaria/declaracionpago/clientessol/oauth2/logout';

  public static readonly URI_OBTENER_ERRORES = environment.uri_base +
    '/parametriaformulario/web/{ejercicio}/formulario/0710/error';
  /**
   * endpoint para la consulta de socios de ficha ruc
   */
  public static readonly URI_CONSULTA_FICHA_RUC =
    environment.uri_base + '/formularioutil/consulta/socio';
}
