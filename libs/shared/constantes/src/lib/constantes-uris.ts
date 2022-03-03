import { environment } from '@rentas/shared/environments';


export class ConstantesUris {
  public static readonly URI_BASE = environment.uri_base + '/parametriaformulario/';
  
  public static readonly URI_BASE_PD = environment.uri_base + '/predeclaracion';

  public static readonly URI_VALIRDAR_REESTABLECER = environment.uri_base + '/predeclaracion/validarpersonalizado?ejercicio={ejercicio}&codFormulario={codFormulario}&numRuc={numRuc}&tipodeclaracion=02';
  
  public static readonly URI_VALIDAR_PPNN = environment.uri_base + '/personanatural';
  public static readonly URI_VALIDAR_PPJJ = environment.uri_base + '/personajuridica';

  public static readonly URI_EXPORTAR_PPNN = environment.uri_base + '/generador/ppnn/detallado';
  public static readonly URI_EXPORTAR_PPJJ = environment.uri_base + '/generador/ppjj/detallado';

  public static readonly URI_CONSULTA_CONTRIBUYENTE = environment.uri_base + '/formularioutil/consulta/contribuyente/';
  public static readonly URI_CONSULTA_NATURAL = environment.uri_base + '/formularioutil/consulta/persona/';

  public static readonly URI_DESCARGAR_PPNN_PRELIMINAR_SIMPLE = environment.uri_base + '/generador/ppnn/simple?isPreliminar=true';
  public static readonly URI_DESCARGAR_PPJJ_PRELIMINAR_SIMPLE = environment.uri_base + '/generador/ppjj/simple?isPreliminar=true';

  public static readonly URI_DESCARGAR_PPNN_SIMPLE = environment.uri_base + '/generador/ppnn/simple';
  public static readonly URI_DESCARGAR_PPJJ_SIMPLE = environment.uri_base + '/generador/ppjj/simple';

  public static readonly URI_ENVIAR_PPNN_PRELIMINAR_SIMPLE = environment.uri_base + '/generador/ppnn/simple?isPreliminar=true&correo=true';
  public static readonly URI_ENVIAR_PPJJ_PRELIMINAR_SIMPLE = environment.uri_base + '/generador/ppjj/simple?isPreliminar=true&correo=true';

  public static readonly URI_ENVIAR_PPNN_SIMPLE = environment.uri_base + '/generador/ppnn/simple?correo=true';
  public static readonly URI_ENVIAR_PPJJ_SIMPLE = environment.uri_base + '/generador/ppjj/simple?correo=true';


  public static readonly URI_PASARELA_PRESENTE_PAGE = environment.uri_base + '/orquestacionpresentacion/procesarPresentarPagar';
  public static readonly URI_PARAMETRIA_PASARELA = environment.uri_base + '/parametriapasarela/pasarela/' + environment.numero_pasarela;
  public static readonly URI_VALIDAR_PRESENTACION = environment.uri_base + '/orquestacionpresentacion/validarPresentacion';
  public static readonly URI_PROXYPAGO_REGISTRO_REALIZARPAGO = environment.uri_base + '/orquestacionproxypago/registro/realizarPago';
  public static readonly URI_PARAMETRIA_PASARELA_VISA = environment.uri_base + '/orquestacionproxypago/transaccionvisa';
  public static readonly URI_PARAMETRIA_PASARELA_VISA_RESPONSE = environment.uri_base + '/orquestacionproxypago/registro/consultarPago/';
  public static readonly URI_OBTENER_PLANILLA = environment.uri_base + '/consultalegacy/declaracion/obtenerPlanilla';
  /**
  * Parametros: RUC, PERIODO, FORMULARIO, TIPO: => 01(PPJJ), 02(PPNN), 03(DESKTOP)
  */

  public static readonly URI_VISORCONSTANCIA_ENVIAR_GENERAL = environment.uri_base + '/visorconstancia';
  public static readonly URI_VISORCONSTANCIA_ENVIAR_MASIVO = environment.uri_base + '/visorconstancia/presentacion/resumen/masivo/enviar';
  public static readonly URI_VISORCONSTANCIA_ENVIAR = environment.uri_base + '/visorconstancia/constancia/enviar';

  public static readonly URI_VISORCONSTANCIA_GUARDAR_GENERAL = environment.uri_base + '/visorconstancia/{numeroOperacionSunat}';
  public static readonly URI_VISORCONSTANCIA_GUARDAR_COMPLETO = environment.uri_base + '/visorconstancia/completo/{numeroOperacionSunat}';
  public static readonly URI_VISORCONSTANCIA_GUARDAR_MASIVO = environment.uri_base + '/visorconstancia/presentacion/resumen/masivo/{numeroOperacionSunat}';
  public static readonly URI_VISORCONSTANCIA_GUARDAR = environment.uri_base + '/visorconstancia/constancia/descargar/{numeroOperacionSunat}/{numeroOrden}';

  public static readonly URI_PASARELA_VALIDAR_FRACCIONAMIENTO = environment.uri_base + '/fraccionamiento/validarFraccionamiento';
  public static readonly URI_LINK_DEVOLUCION_PPNN = environment.uri_base + '/personanatural/devolucion';
  public static readonly URI_LINK_DEVOLUCION_PPJJ = environment.uri_base + '/personajuridica/devolucion';
  public static readonly URI_CONSULTA_LEGACY_BOLETA = environment.uri_base + '/consultalegacy/cpe/boleta';
  public static readonly URI_CONSULTA_LEGACY_RHE = environment.uri_base + '/consultalegacy/cpe/rhe';
  public static readonly GENERAL_FORMULARIO = 'formulario';
  public static readonly FORMULARIO_ERROR = 'error';
  public static readonly FORMULARIO_CASILLA = 'casilla';
  public static readonly FORMULARIO_COMBOS = 'parametro';
  public static readonly URI_CONSULTA_LEGACY_OBTENER_ALQUILER = environment.uri_base + '/consultalegacy/declaracion/obtenerAlquiler';
  public static readonly URI_CONSULTA_LEGACY_OBTENER_TRABAJADOR_HOGAR = environment.uri_base + '/consultalegacy/declaracion/obtenerTrabajadorHogar';
  public static readonly URI_CONSULTA_ACTIVIDAD_ECONOMICA = environment.uri_base + '/formularioutil/consulta/acteco';
  /**
   * Endpoint encargado de traer la data del ejercicio anterior
   */
  public static readonly URI_CONSULTA_IDENTIFICACION_BIEN = environment.uri_base + '/predeclaracion/byEjercicio';
  public static readonly URI_CONSULTA_DATOS_CONTADOR = environment.uri_base + '/predeclaracion/byEjercicio';
  /**
   * Para consultar ANEXO 5
   */
  public static readonly URI_ANEXO_5 = environment.uri_base + '/consultalegacy/declaracion/obtenerIndicadorAfectoMYPE';
  /**
   * Para consultar la lista de representantes legales.
   */
  public static readonly URI_REPRESENTANTES_LEGALES = environment.uri_base + '/formularioutil/consulta/representantes';
  /**
   * Para consultar tipo de casillas.
   */
  public static readonly URI_TIPO_CASILLAS = environment.uri_base + '/formularioutil/consulta/parametrot01/140';
  /**
   * consulta de declaraciones inconsistentes
   */
  public static readonly URI_CONSULTA_BIRTA = environment.uri_base + '/formularioutil/consulta/birta';
  /**
   * Registro del Pedido de Fraccionamiento en Solicitudes
   */
  public static readonly URI_FRACCIONAMIENTO_REGISTRO_SOLICITUDES = environment.uri_base + '/fraccionamiento/pedido';
  /**
   * velidar fecha de vencimiento
   */
  public static readonly URI_VALIDAR_FECHA_VENCIMIENTO = environment.uri_base + '/formularioutil/consulta/ves/vencimiento';
  /**
   * Descargar PDF
   */
  public static readonly URI_DESCARGAR_PDF_PPNN = environment.uri_base + '/generador/ppnn/detallado/descarga';
  public static readonly URI_DESCARGAR_PDF_PPJJ = environment.uri_base + '/generador/ppjj/detallado/descarga';
  /**
   * Obtener pagos.
   * se consulta si el contribuyente ya realizo un pago.
   */
  public static readonly URI_OBTENER_PAGOS = environment.uri_base + '/orquestacionpresentacion/consulta/obtenerPagos';
  /**
   * Obtener pago
   * consulta si el pago que se quiere registrar existe
   */
  public static readonly URI_OBTENER_PAGO = environment.uri_base + '/consultalegacy/consultadep/obtenerPagos';
  /**
   * este enpoint es para el cierre de session
   */
  public static readonly URI_CERRAR_SESION = '/loader/recaudaciontributaria/declaracionpago/clientessol/oauth2/logout';
  public static readonly URI_OBTENER_FECHA_SERVIDOR = environment.uri_base + '/formularioutil/consulta/especifica/obtenerFechaHora';
  /**
   * Obtener consulta declaraciones
   */
  public static readonly URI_CONSULTA_DECLARACIONES = environment.uri_base + '/orquestacionpresentacion/consulta/obtenerDeclaracion?numRuc={numRuc}&indMedPres=1&numEjercicio={ejercicio}&formulario={formulario}';

  public static readonly URI_PARAMELTRIA_FORMULARIO = environment.uri_base + '/parametriaformulario/web/{ejercicio}/formulario/{formulario}';

  public static readonly URI_CONSULTA_DETALLE_FORMULARIO = environment.uri_base + '/orquestacionpresentacion/consulta/obtenerDetalleDeclaracion/{idPresentacion}';

  public static readonly URI_CONSULTA_CONSTANCIA_FORMULARIO = environment.uri_base + '/orquestacionpresentacion/consulta/obtenerConstancia/{idPresentacion}';

  public static readonly URI_OBTENER_ERRORES = environment.uri_base + '/parametriaformulario/web/{ejercicio}/formulario/{codFormulario}/error';
  /**
   * Para consultar los codigo de tributo y Valores
   */
  /**
   * Para consultar tipo de casillas.
   */
  public static readonly URI_T01PARAM = environment.uri_base + '/formularioutil/consulta/parametrot01/{codParametro}';
  /**
   * Obtener Interes Moratorio
   */
  public static readonly URI_OBTENER_INTERES_MORATORIO = environment.uri_base + '/formularioutil/consulta/interes/obtenerfactorinteres';
  /**
   * Para validar si los datos ingresados en la casilla 297 existen en las dependencias correspondientes
   */
  public static readonly URI_CONSULTAR_CAS_297 = environment.uri_base + '/consultalegacy/consultadep/validasaldo';

  public static readonly URI_MENSAJE_INICIO_PARAMETRIA = environment.uri_base + '/parametriaformulario/mensaje/{codFormulario}?codMedio=1';
  
  /**
   * Consulta para validación de RUC en padron de MINCETUR
   */
   public static readonly URI_CONSULTA_ARTESANOS = environment.uri_base + '/formularioutil/consulta/artesano/';

}
