import { environment } from '@rentas/shared/environments';


export class ConstantesUris {
  public static readonly URI_BASE = environment.uri_base + '/parametriaformulario/';
  public static readonly URI_BASE_PD = environment.uri_base + '/predeclaracion';
  // public static readonly URI_VALIDAR = environment.uri_base + '/personanatural/validaDJ?numSec=';
  public static readonly URI_VALIDAR = environment.uri_base + '/personanatural';
  public static readonly URI_EXPORTAR_PPNN =
    environment.uri_base + '/generador/ppnn/detallado';

  public static readonly URI_CONSULTA_CONTRIBUYENTE =
    environment.uri_base + '/formularioutil/consulta/contribuyente/';
  public static readonly URI_CONSULTA_NATURAL =
    environment.uri_base + '/formularioutil/consulta/persona/';

  public static readonly URI_DESCARGAR_PPNN_PRELIMINAR_SIMPLE =
    environment.uri_base + '/generador/ppnn/simple?isPreliminar=true';

  public static readonly URI_DESCARGAR_PPNN_SIMPLE =
    environment.uri_base + '/generador/ppnn/simple';

  public static readonly URI_ENVIAR_PPNN_PRELIMINAR_SIMPLE =
    environment.uri_base + '/generador/ppnn/simple?isPreliminar=true&correo=true';

  public static readonly URI_ENVIAR_PPNN_SIMPLE =
    environment.uri_base + '/generador/ppnn/simple?correo=true';

  public static readonly URI_PASARELA_PRESENTE_PAGE =
    environment.uri_base + '/orquestacionpresentacion/procesarPresentarPagar';
  public static readonly URI_PARAMETRIA_PASARELA =
    environment.uri_base +
    '/parametriapasarela/pasarela/' +
    environment.numero_pasarela;

  public static readonly URI_VALIDAR_PRESENTACION =
    environment.uri_base + '/orquestacionpresentacion/validarPresentacion';

  public static readonly URI_PROXYPAGO_REGISTRO_REALIZARPAGO =
    environment.uri_base + '/orquestacionproxypago/registro/realizarPago';

  public static readonly URI_PARAMETRIA_PASARELA_VISA =
    environment.uri_base + '/orquestacionproxypago/transaccionvisa';

  public static readonly URI_PARAMETRIA_PASARELA_VISA_RESPONSE =
    environment.uri_base + '/orquestacionproxypago/registro/consultarPago/';
  // public static readonly URI_realizarPago

  // {codFormulario}/{numRuc}/{periodo}
  // public static readonly URI_OBTENER_DECLARACION = environment.uri_base + '/consultalegacy/declaracion/obtenerDeclaracion';
  public static readonly URI_OBTENER_PLANILLA =
    environment.uri_base + '/consultalegacy/declaracion/obtenerPlanilla';

  /**
   * Parametros: RUC, PERIODO, FORMULARIO, TIPO: => 01(PPJJ), 02(PPNN), 03(DESKTOP)
   */
  public static readonly URI_VISORCONSTANCIA =
    environment.uri_base + '/visorconstancia';

  public static readonly URI_PASARELA_VALIDAR_FRACCIONAMIENTO =
    environment.uri_base + '/fraccionamiento/validarFraccionamiento';

  public static readonly URI_LINK_DEVOLUCION =
    environment.uri_base + '/personanatural/devolucion';

  public static readonly URI_CONSULTA_LEGACY_BOLETA =
    environment.uri_base + '/consultalegacy/cpe/boleta';
  public static readonly URI_CONSULTA_LEGACY_RHE =
    environment.uri_base + '/consultalegacy/cpe/rhe';

  public static readonly GENERAL_FORMULARIO = 'formulario';
  public static readonly FORMULARIO_ERROR = 'error';
  public static readonly FORMULARIO_CASILLA = 'casilla';
  public static readonly FORMULARIO_COMBOS = 'parametro';

  public static readonly URI_CONSULTA_LEGACY_OBTENER_ALQUILER =
    environment.uri_base + '/consultalegacy/declaracion/obtenerAlquiler';
  public static readonly URI_CONSULTA_LEGACY_OBTENER_TRABAJADOR_HOGAR =
    environment.uri_base + '/consultalegacy/declaracion/obtenerTrabajadorHogar';

  public static readonly URI_CONSULTA_ACTIVIDAD_ECONOMICA =
    environment.uri_base + '/formularioutil/consulta/acteco';

  /**
   * Endpoint encargado de traer la data de Identificacion del Bien del ejercio anterior de la casilla 100
   */
  public static readonly URI_CONSULTA_IDENTIFICACION_BIEN =
    environment.uri_base + '/predeclaracion/byEjercicio';

  /**
   * Para consultar tipo de casillas.
   */
  public static readonly URI_TIPO_CASILLAS =
    environment.uri_base + '/formularioutil/consulta/parametrot01/140';

  /**
   * consulta de declaraciones inconsistentes
   */

  public static readonly URI_CONSULTA_BIRTA =
    environment.uri_base + '/formularioutil/consulta/birta';

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
   * Descargar PDF
   */
  public static readonly URI_DESCARGAR_PDF =
    environment.uri_base + '/generador/ppnn/detallado/descarga';

  /**
   * Obtener pagos.
   * se consulta si el contribuyente ya realizo un pago.
   */
  public static readonly URI_OBTENER_PAGOS =
    environment.uri_base + '/orquestacionpresentacion/consulta/obtenerPagos';

  // https://e-renta.sunat.gob.pe/loader/recaudaciontributaria/declaracionpago/clientessol/oauth2/logout

  /**
   * este enpoint es para el cierre de session
   */
  public static readonly URI_CERRAR_SESION =
    '/loader/recaudaciontributaria/declaracionpago/clientessol/oauth2/logout';

  public static readonly URI_OBTENER_FECHA_SERVIDOR = environment.uri_base + '/formularioutil/consulta/especifica/obtenerFechaHora';
  // https://e-renta.sunat.gob.pe/v1/recaudacion/declaracionespago/renta/formularioutil/consulta/especifica/obtenerFechaHora

  public static readonly URI_OBTENER_ERRORES = environment.uri_base +
  '/parametriaformulario/web/{ejercicio}/formulario/0709/error';

  public static readonly URI_DESCARGA_PERSONALIZADO =
  environment.uri_base + '/generador/personalizado/ppnn/detallado/descarga';

}
