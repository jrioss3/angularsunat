export class ConstantesListas {
  static COLUMNAS_GRID_UNIDAD_DESPACHO =
    ['numUnidadDespacho', 'descripcion', 'regimenes', 'indSorteoZona', 'fecInicioVigencia', 'fecFinVigencia'];
  static COLUMNAS_GRID_REGIMENES = ['select', 'cod_datacat', 'des_corta'];
  static NOMBRE_DE_MESES =
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  static LISTA_MENSAJES_CONFIRMACION = ['42206', '42207', '42208', '42209'];
  static COLUMNAS_GRID_ZONA = ['numZona', 'nombre', 'descripcion', 'indSusceptible', 'fecInicioVigencia', 'fecFinVigencia'];
  static COLUMNAS_GRID_TURNOS = ['numTurno', 'nombre', 'hraInicio', 'hraFin', 'hraCorte', 'zonas', 'fecInicioVigencia', 'fecFinVigencia'];
  static COLUMNAS_GRID_ZONAS_DE_TURNOS = ['select', 'descripcion', 'fecInicioVigencia', 'fecFinVigencia'];
  static COLUMNAS_GRID_CRITERIOS = ['tipoCriterio.desDatacat', 'cntPeso'];
  static COLUMNAS_GRID_CRITERIOS_PONDERADO = ['criterio.desDatacat', 'porCriterio', 'verHistorial'];
  static COLUMNAS_GRID_HISTORICO_PONDERACION_CRITERIOS = ['cntPeso', 'codUsuarioModifica', 'porCriterio', 'fechaModifica'];
  static COLUMNAS_GRID_GRUPO_ALMACENES =
    ['ruc', 'codLocalAnexo', 'codOperador', 'nombre', 'razonSocial', 'direccion', 'codUbigeo', 'zonas'];
  static COLUMNAS_GRID_FUNCIONARIO = ['seleccion', 'codPers', 'apPate', 'apMate', 'nombres'];
  static COLUMNAS_GRID_FUNCIONARIO_RESUMEN =
    ['codigo', 'fecInicio', 'fecFin', 'apellidoPaterno', 'apellidoMaterno', 'nombres',
      'columnaRetirar', 'columnaModificarVigencia', 'columnaNuevaVigencia'];
  static COLUMNAS_GRID_FUNCIONARIO_REGISTRADO = ['codPers', 'nombres', 'columnaRetirar'];
  static COLUMNAS_GRID_FUNCIONARIO_DISPONIBLE = ['codPers', 'nombres', 'columnaRetirar'];
  static COLUMNAS_GRID_ASIGNACION_FUNCIONARIO_DISPONIBLE = ['codPers', 'apPate', 'apMate', 'nombres'];
  static COLUMNAS_GRID_ASIGNACION_ZONA_DISPONIBLE = ['nombre', 'cantidadFuncionarios'];
  static COLUMNAS_GRID_ZONA_ASIGNADA = ['zona', 'cantidad', 'funcionarios'];
  static COLUMNAS_GRID_SORTEOS_CONSULTA =
    ['unidadDespacho', 'descripcion', 'turno', 'fecInicioVigencia', 'fecFinVigencia', 'cargaMaxima', 'tipoSorteo'];
  static COLUMNAS_GRID_SORTEOS_EDICION =
    ['unidadDespacho', 'descripcion', 'turno', 'fecInicioVigencia', 'fecFinVigencia', 'cargaMaxima', 'ver'];
  static COLUMNAS_GRID_DECLARACIONES =
    ['select', 'cabDeclara.numDeclaracion', 'numeroCargaLaboral',
      'cabDeclara.rsocialAlmacenAduanero', 'cabDeclara.dirAlmacenAduanero',
      'desImpoFrecuente', 'cabDeclara.desGarantia160'];
  static COLUMNAS_GRID_DECLARACIONES_REASIGNACION =
    ['cabDeclara.numDeclaracion', 'numeroCargaLaboral', 'cabDeclara.rsocialAlmacenAduanero',
      'cabDeclara.dirAlmacenAduanero', 'desImpoFrecuente', 'cabDeclara.desGarantia160'];
  static COLUMNAS_GRID_DECLARACIONES_DETALLE_PAQUETE =
    ['numDUA', 'cabDeclara.numDeclaracion', 'numeroCargaLaboral', 'cabDeclara.rsocialAlmacenAduanero',
      'cabDeclara.dirAlmacenAduanero', 'desImpoFrecuente', 'cabDeclara.desGarantia160'];
  static COLUMNAS_GRID_DECLARACION = ['declaracion', 'cargaLaboral', 'almacenAduanero', 'direccion', 'importadorOEA', 'garantia160'];
  static COLUMNAS_GRID_CONSULTAS_FUNCIONARIO_RESUMEN =
    ['codigo', 'fecInicio', 'fecFin', 'apellidoPaterno', 'apellidoMaterno', 'nombres', 'vermotivo'];
  static COLUMNAS_GRID_CONSULTAS_FUNCIONARIO_RESUMEN_ASIGNACIONES =
    ['fecInicio', 'fecFin', 'unidadesDespacho', 'grupoFuncionarios', 'turno', 'vermotivo'];
  static COLUMNAS_GRID_HORARIOS = ['horaCorte', 'horaSorteo'];
}
