export class MensajesCodigoModel {
  /* CUS01 */
  static ERROR_001 = {
    codigo: 422001, mensaje: 'El siguiente formulario est\u00E1 dirigido' +
      ' s\u00F3lo a Personas Naturales - Otras Rentas.'
  };
  // --SECCION INFORMATIVA:
  // ---Tipo Declaración
  /* CUS02 */
  static ERROR_002 = { tab: 'tabTipoDeclaracion', codigo: 442002, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_003 = { tab: 'tabTipoDeclaracion', codigo: 442003, mensaje: 'El DNI ingresado no es v\u00E1lido.' };
  static ERROR_004 = { tab: 'tabTipoDeclaracion', codigo: 442004, mensaje: 'El RUC ingresado no es v\u00E1lido.' };
  // ---Condóminos
  /* CUS03 */
  static ERROR_005 = { tab: 'tabCondominios', codigo: 442005, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_006 = { tab: 'tabCondominios', codigo: 442006, mensaje: 'El RUC ingresado no es v\u00E1lido.' };
  static ERROR_007 = { tab: 'tabCondominios', codigo: 442007, mensaje: 'El DNI ingresado no es v\u00E1lido.' };
  static ERROR_008 = { tab: 'tabCondominios', codigo: 442008, mensaje: 'Valor del Bien (Autoval\u00FAo AAAA) no puede ser menor a 1.' };
  static ERROR_009 = { tab: 'tabCondominios', codigo: 442009, mensaje: 'Dato obligatorio.' };
  static ERROR_010 = { tab: 'tabCondominios', codigo: 442010, mensaje: '% Participaci\u00F3n no puede ser mayor a 99.99' };
  static ERROR_011 = { tab: 'tabCondominios', codigo: 442011, mensaje: '% Participaci\u00F3n no puede ser menor a 0.01' };
  /* excepciones restantes correspondientes al EXCEL */
  // ---Alquileres
  /* CUS04 */
  static ERROR_012 = { tab: 'tabAlquileresPagadoscodigo', codigo: 442012, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_013 = { tab: 'tabAlquileresPagadoscodigo', codigo: 422013, mensaje: 'El RUC ingresado no es v\u00E1lido.' };
  static ERROR_014 = { tab: 'tabAlquileresPagadoscodigo', codigo: 422014, mensaje: 'El DNI ingresado no es v\u00E1lido.' };
  static ERROR_015 = { tab: 'tabAlquileresPagadoscodigo', codigo: 422015, mensaje: 'Monto alquiler anual S/. no puede ser menor a 1.' };
  static ERROR_016 = { tab: 'tabAlquileresPagadoscodigo', codigo: 422016, mensaje: 'Dato obligatorio.' };
  static ERROR_017 = {
    tab: 'tabAlquileresPagadoscodigo',
    codigo: 422017, mensaje: 'N\u00famero de meses de alquiler no puede ser menor a 1.'
  };
  static ERROR_018 = {
    tab: 'tabAlquileresPagadoscodigo',
    codigo: 422018, mensaje: 'N\u00famero de meses de alquiler no puede ser mayor a 12.'
  };
  static ERROR_019 = {
    tab: 'tabAlquileresPagadoscodigo',
    codigo: 422019, mensaje: 'Ingrese n\u00famero de documento o documento inv\u00e1lido.'
  };
  static ERROR_020 = { tab: 'tabAlquileresPagadoscodigo', codigo: 422020, mensaje: 'Elija el tipo de bien.' };
  static ERROR_021 = { tab: 'tabAlquileresPagadoscodigo', codigo: 422021, mensaje: 'Seleccione el Bien.' };
  static ERROR_022 = { tab: 'tabAlquileresPagadoscodigo', codigo: 422022, mensaje: 'Ingrese descripci\u00f3n del bien.' };
  static ERROR_023 = {
    tab: 'tabAlquileresPagadoscodigo',
    codigo: 422023, mensaje: 'El n\u00famero de RUC no puede ser igual al RUC del declarante.'
  };
  // ---Otros ingresos
  /* CUS05 */
  static ERROR_024 = { tab: 'tabOtrosIngresos', codigo: 442024, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_025 = { tab: 'tabOtrosIngresos', codigo: 442025, mensaje: 'Dato obligatorio.' };
  static ERROR_026 = { tab: 'tabOtrosIngresos', codigo: 442026, mensaje: 'Formato de RUC inv\u00e1lido.' };
  static ERROR_027 = { tab: 'tabOtrosIngresos', codigo: 442027, mensaje: 'El RUC ingresado no es v\u00e1lido.' };
  static ERROR_028 = { tab: 'tabOtrosIngresos', codigo: 442028, mensaje: 'Este valor est\u00e1 fuera del intervalo.' };
  static ERROR_029 = { tab: 'tabOtrosIngresos', codigo: 442029, mensaje: 'Monto no puede ser menor o igual a 0' };
  static ERROR_030 = {
    tab: 'tabOtrosIngresos', codigo: 442030,
    mensaje: 'El n\u00famero de RUC no puede ser igual al RUC del declarante.'
  };
  static ERROR_031 = { tab: 'tabOtrosIngresos', codigo: 442031, mensaje: 'La informaci\u00f3n ya fue registrada.' };
  static ERROR_032 = { tab: 'tabOtrosIngresos', codigo: 442032, mensaje: 'El calculo es incorrecto' }; // No se
  // encuentra                                                                        // en el F2
  /* CUS06 */
  // VALIDACIONES ANEXO 1 - COMPETE AL FRONT-END
  // --SECCIÓN DETERMINATIVA
  // ---Primera Categoría
  /* CUS07 */
  static ERROR_033 = { codigo: 442033, mensaje: 'El valor especificado no es v\u00E1lido.' }; // No se encuentra en el F2
  static ERROR_034 = { codigo: 442034, mensaje: 'El calculo es incorrecto' }; // No se encuentra en el F2
  // ---Segunda Categoría
  /* CUS08 */
  static ERROR_035 = { codigo: 442035, mensaje: 'El valor especificado no es v\u00E1lido.' }; // No se encuentra en el F2
  static ERROR_036 = { codigo: 442036, mensaje: 'El calculo es incorrecto' }; // No se encuentra en el F2
  // -----Casilla 350
  /* CUS09 */
  static ERROR_037 = { codigo: 442037, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_038 = { codigo: 442038, mensaje: 'Dato obligatorio.' };
  static ERROR_039 = { codigo: 442039, mensaje: 'El DNI ingresado no es v\u00E1lido.' };
  static ERROR_040 = { codigo: 442040, mensaje: 'El RUC ingresado es inv\u00E1lido.' };
  static ERROR_041 = { codigo: 442041, mensaje: 'El n\u00famero de RUC no puede ser igual al RUC del declarante.' };
  static ERROR_042 = { codigo: 442042, mensaje: 'Formato de periodo inv\u00e1lido' };
  static ERROR_043 = { codigo: 442043, mensaje: 'Periodo no puede ser menor a 01/AAAA' };
  static ERROR_044 = { codigo: 442044, mensaje: 'Periodo no puede ser mayor a 12/AAAA' };
  static ERROR_045 = { codigo: 442045, mensaje: 'Casilla no puede ser negativa.' };
  static ERROR_046 = { codigo: 442046, mensaje: 'Cantidad de Valores no puede ser menor a 1.' };
  static ERROR_047 = { codigo: 442047, mensaje: 'Los datos que desea ingresar ya fueron ingresados.' };
  static ERROR_048 = { codigo: 442048, mensaje: 'El Monto de la ganancia debe ser mayor a cero.' };
  // ----Casilla 355
  /* CUS10 */
  static ERROR_049 = { codigo: 442049, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_050 = { codigo: 442050, mensaje: 'Dato obligatorio.' };
  static ERROR_051 = { codigo: 442051, mensaje: 'El DNI ingresado no es v\u00E1lido.' };
  static ERROR_052 = { codigo: 442052, mensaje: 'El RUC ingresado es inv\u00E1lido.' };
  static ERROR_053 = { codigo: 442053, mensaje: 'El n\u00famero de RUC no puede ser igual al RUC del declarante.' };
  static ERROR_054 = { codigo: 442054, mensaje: 'Formato de periodo inv\u00e1lido' };
  static ERROR_055 = { codigo: 442055, mensaje: 'Periodo no puede ser menor a 01/AAAA' };
  static ERROR_056 = { codigo: 442056, mensaje: 'Periodo no puede ser mayor a 12/AAAA' };
  static ERROR_057 = { codigo: 442057, mensaje: 'Casilla no puede ser negativa.' };
  static ERROR_058 = { codigo: 442058, mensaje: 'Cantidad de Valores no puede ser menor a 1.' };
  static ERROR_059 = { codigo: 442059, mensaje: 'Los datos que desea ingresar ya fueron ingresados.' };
  static ERROR_060 = { codigo: 442060, mensaje: 'El Monto de la ganancia debe ser mayor a cero.' };
  // ---Rentas de Trabajo y/o Fuente Extranjera
  /* CUS11 */
  static ERROR_061 = { codigo: 442061, mensaje: 'El valor especificado no es v\u00E1lido.' }; // No se encuentra en el F2
  static ERROR_062 = { codigo: 442062, mensaje: 'El calculo es incorrecto' }; // No se encuentra en el F2
  // ----Casilla 107
  /* CUS12 */
  static ERROR_063 = { codigo: 442063, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_064 = { codigo: 442064, mensaje: 'Dato obligatorio.' };
  static ERROR_065 = { codigo: 442065, mensaje: 'El RUC ingresado es inv\u00E1lido.' };
  static ERROR_066 = { codigo: 442066, mensaje: 'El n\u00famero de RUC no puede ser igual al RUC del declarante.' };
  static ERROR_067 = { codigo: 442067, mensaje: 'Formato de periodo inv\u00e1lido.' };
  static ERROR_068 = { codigo: 442068, mensaje: 'Periodo no puede ser menor a 01/AAAA' };
  static ERROR_069 = { codigo: 442069, mensaje: 'Periodo no puede ser mayor a 12/AAAA' };
  static ERROR_070 = { codigo: 442070, mensaje: 'Formato de Serie inv\u00e1lida.' };
  static ERROR_071 = { codigo: 442071, mensaje: 'Formato de Comprobante inv\u00e1lido.' };
  static ERROR_072 = { codigo: 442072, mensaje: 'Ya ingres\u00f3 este comprobante de pago.' };
  static ERROR_073 = { codigo: 442073, mensaje: 'La fecha no puede ser mayor al mes y año del periodo.' };
  static ERROR_074 = { codigo: 442074, mensaje: 'Casilla no puede ser negativa.' };
  static ERROR_075 = { codigo: 442075, mensaje: 'Monto no puede ser 0.' };
  // ----Casilla 108
  /* CUS13 */
  static ERROR_076 = { codigo: 442076, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_077 = { codigo: 442077, mensaje: 'Dato obligatorio.' };
  static ERROR_078 = { codigo: 442078, mensaje: 'El RUC ingresado es inv\u00e1lido.' };
  static ERROR_079 = { codigo: 442079, mensaje: 'El n\u00famero de RUC no puede ser igual al RUC del declarante.' };
  static ERROR_080 = { codigo: 442080, mensaje: 'Formato de periodo inv\u00e1lido.' };
  static ERROR_081 = { codigo: 442081, mensaje: 'Periodo no puede ser menor a 01/AAAA' };
  static ERROR_082 = { codigo: 442082, mensaje: 'Periodo no puede ser mayor a 12/AAAA' };
  static ERROR_083 = { codigo: 442083, mensaje: 'Casilla no puede ser negativa.' };
  static ERROR_084 = { codigo: 442084, mensaje: 'Los datos que desea ingresar ya fueron ingresados.' };
  static ERROR_085 = { codigo: 442085, mensaje: 'Monto no puede ser 0.' };
  // ----Casilla 111
  /* CUS14 */
  static ERROR_086 = { codigo: 442086, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_087 = { codigo: 442087, mensaje: 'Dato obligatorio.' };
  static ERROR_088 = { codigo: 442088, mensaje: 'El RUC ingresado es inv\u00e1lido.' };
  static ERROR_089 = { codigo: 442089, mensaje: 'Formato de periodo inv\u00e1lido.' };
  static ERROR_090 = { codigo: 442090, mensaje: 'Periodo no puede ser menor a 01/AAAA' };
  static ERROR_091 = { codigo: 442091, mensaje: 'Periodo no puede ser mayor a 12/AAAA' };
  static ERROR_092 = { codigo: 442092, mensaje: 'Casilla no puede ser negativa.' };
  static ERROR_093 = { codigo: 442093, mensaje: 'El formulario ya fue registrado.' };
  static ERROR_094 = { codigo: 442094, mensaje: 'Monto no puede ser 0.' };
  // ----Casilla 522
  /* CUS15 */
  static ERROR_095 = { codigo: 42095, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_096 = { codigo: 42097, mensaje: 'mensaje : Dato obligatorio.' };
  static ERROR_097 = { codigo: 42096, mensaje: 'El RUC ingresado es inv\u00e1lido.' };
  static ERROR_098 = { codigo: 42097, mensaje: 'Formato de RUC inv\u00e1lido.' };
  static ERROR_099 = { codigo: 42098, mensaje: 'Monto retenido al 31/12/AAAA no puede ser menor a 1.00' };
  static ERROR_0100 = { codigo: 442099, mensaje: 'Los datos que desea ingresar ya fueron ingresados.' };
  static ERROR_0101 = { codigo: 4420100, mensaje: 'El n\u00famero de RUC no puede ser igual al RUC del declarante.' };
  static ERROR_0102 = { codigo: 4420101, mensaje: 'El valor especificado no es v\u00E1lido.' };
  // ----Casilla 519
  /* CUS16 */
  static ERROR_0103 = { codigo: 4420103, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_0104 = { codigo: 4420104, mensaje: 'Dato obligatorio.' };
  static ERROR_0105 = { codigo: 4420105, mensaje: 'El DNI ingresado no es v\u00e1lido.' };
  static ERROR_0106 = { codigo: 4420106, mensaje: 'El RUC ingresado es inv\u00e1lido.' };
  static ERROR_0107 = { codigo: 4420107, mensaje: 'El n\u00famero de RUC no puede ser igual al RUC del declarante.' };
  static ERROR_0108 = { codigo: 4420108, mensaje: 'Este valor est\u00e1 fuera del intervalo.' };
  static ERROR_0109 = { codigo: 4420109, mensaje: 'Monto de la donaci\u00f3n no puede ser menor a 1.00' };
  static ERROR_0110 = {
    codigo: 4420110,
    mensaje: 'Sus donaciones por Mecenazgo Deportivo superan el 10% de su renta neta,' +
      ' por lo que solo se est\u00e1 considerando como valor el gasto deducible m\u00e1ximo.' +
      ' La diferencia puede ser considerada dentro de la Donaci\u00f3n a la que hace referencia el' +
      ' numeral 5.2 del art\u00edculo 5 del DS 217-2017-EF.'
  };
  static ERROR_0111 = {
    codigo: 4420111,
    mensaje: 'La suma de sus donaciones por Art.49 de la LIR y Desastres Naturales superan el 10% de su' +
      ' renta neta, por lo que solo se est\u00e1 considerando como valor el gasto deducible m\u00e1ximo.'
  };
  static ERROR_0112 = { codigo: 4420112, mensaje: 'Los datos que desea ingresar ya fueron ingresados.' };
  static ERROR_0113 = { codigo: 4420113, mensaje: 'La modalidad no es v\u00e1lida para el Tipo de donaci\u00f3n seleccionado.' };
  /* CUS17 */
  // Es solo informativo - parte FRONT-END
  // ---Determinación de la Deuda
  // ----Determinación de Deuda – Rentas de Capital Primera Categoría
  /* CUS18 */
  static ERROR_0114 = { codigo: 442114, mensaje: 'El valor especificado no es v\u00E1lido.' }; // No se encuentra en el };
  static ERROR_0115 = { codigo: 442115, mensaje: 'El calculo es incorrecto' }; // No se encuentra en el };
  // ----Casilla 100
  /* CUS19 */
  static ERROR_0116 = { codigo: 442116, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_0117 = { codigo: 442117, mensaje: 'Dato obligatorio.' };
  static ERROR_0118 = { codigo: 442118, mensaje: 'El RUC ingresado no es v\u00e1lido.' };
  static ERROR_0119 = { codigo: 442119, mensaje: 'El n\u00famero de RUC no puede ser igual al RUC del declarante.' };
  static ERROR_0120 = { codigo: 442120, mensaje: 'El DNI ingresado no es v\u00e1lido.' };
  static ERROR_0121 = { codigo: 442121, mensaje: 'Tipo de Bien es Dato Obligatorio.' };
  static ERROR_0122 = { codigo: 442122, mensaje: 'Seleccione identificaci\u00f3n del Bien.' };
  static ERROR_0123 = { codigo: 442123, mensaje: 'Ingrese Nro. Placa/Matricula/Concesi\u00f3n Minera/Otros.' };
  static ERROR_0124 = { codigo: 442124, mensaje: 'Tipo de Documento es Dato Obligatorio.' };
  static ERROR_0125 = { codigo: 442125, mensaje: 'N\u00famero es Dato Obligatorio.' };
  static ERROR_0126 = { codigo: 442126, mensaje: 'Formato de periodo inv\u00e1lido.' };
  static ERROR_0127 = { codigo: 442127, mensaje: 'Periodo no puede ser menor a 01/AAAA' };
  static ERROR_0128 = { codigo: 442128, mensaje: 'Periodo no puede ser mayor a 12/AAAA' };
  static ERROR_0129 = { codigo: 442129, mensaje: 'N\u00famero de Orden o de Operaci\u00f3n inv\u00e1lido.' };
  static ERROR_0130 = { codigo: 442130, mensaje: 'El valor est\u00e1 fuera del intervalo.' };
  static ERROR_0131 = { codigo: 442131, mensaje: 'Debe seleccionar un archivo excel.' };
  static ERROR_0132 = { codigo: 442132, mensaje: 'El archivo seleccionado no tiene la extensi\u00f3n .xls.' };
  static ERROR_0133 = { codigo: 442133, mensaje: 'El archivo seleccionado no tiene el formato.' };
  static ERROR_0134 = { codigo: 442134, mensaje: 'El calculo es incorrecto' }; // };
  // ----Determinación de Deuda – Rentas de Capital Segunda Categoría
  /* CUS20 */
  static ERROR_0135 = { codigo: 442135, mensaje: 'El valor especificado no es v\u00E1lido.' }; // No se encuentra en el };
  static ERROR_0136 = { codigo: 442136, mensaje: 'El calculo es incorrecto' }; // No se encuentra en el };
  // ----Casilla 358
  /* CUS21 */
  static ERROR_0137 = { codigo: 442137, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_0138 = { codigo: 442138, mensaje: 'Dato obligatorio.' };
  static ERROR_0139 = { codigo: 442139, mensaje: 'Formato de periodo inv\u00e1lido.' };
  static ERROR_0140 = { codigo: 442140, mensaje: 'Periodo no puede ser menor a 01/AAAA.' };
  static ERROR_0141 = { codigo: 442141, mensaje: 'Periodo no puede ser mayor a 12/AAAA.' };
  static ERROR_0142 = { codigo: 442142, mensaje: 'N\u00famero de Orden o de Operaci\u00f3n inv\u00e1lido.' };
  static ERROR_0143 = { codigo: 442143, mensaje: 'Este valor est\u00e1 fuera del intervalo.' };
  static ERROR_0144 = { codigo: 442144, mensaje: 'Casilla no puede ser negativa.' };
  static ERROR_0145 = { codigo: 442145, mensaje: 'El formulario ya fue registrado.' };
  // ----Casilla 359
  /* CUS22 */
  static ERROR_0146 = { codigo: 442146, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_0147 = { codigo: 442147, mensaje: 'Dato obligatorio.' };
  static ERROR_0148 = { codigo: 442148, mensaje: 'El RUC ingresado es inv\u00e1lido.' };
  static ERROR_0149 = { codigo: 442149, mensaje: 'Formato de periodo inv\u00e1lido.' };
  static ERROR_0150 = { codigo: 442150, mensaje: 'Periodo no puede ser menor a 01/AAAA.' };
  static ERROR_0151 = { codigo: 442151, mensaje: 'Periodo no puede ser mayor a 12/AAAA.' };
  static ERROR_0152 = { codigo: 442152, mensaje: 'Casilla no puede ser negativa.' };
  static ERROR_0153 = { codigo: 442153, mensaje: 'Formato de RUC inv\u00e1lido.' };
  static ERROR_0154 = { codigo: 442154, mensaje: 'El formulario ya fue registrado.' };
  // ---Determinación de Deuda – Rentas de Trabajo
  /* CUS23 */
  static ERROR_0155 = { codigo: 442155, mensaje: 'El valor especificado no es v\u00E1lido.' }; // No se encuentra en el };
  static ERROR_0156 = { codigo: 442156, mensaje: 'El calculo es incorrecto' }; // No se encuentra en el };
  // ----Casilla 122
  /* CUS24 */
  static ERROR_0157 = { codigo: 442157, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_0158 = { codigo: 442158, mensaje: 'Casilla no puede ser negativa.' };
  static ERROR_0159 = { codigo: 442159, mensaje: 'Monto del impuesto no puede ser 0.' };
  static ERROR_0160 = { codigo: 442160, mensaje: 'El pa\u00eds y tipo de renta ya fueron registrados.' };
  static ERROR_0161 = { codigo: 442161, mensaje: 'La informaci\u00f3n de la casilla 122 no puede ser mayor a XXX' };
  // ----Casilla 127
  /* CUS25 */
  static ERROR_0162 = { codigo: 442162, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_0163 = { codigo: 442163, mensaje: 'Dato obligatorio.' };
  static ERROR_0164 = { codigo: 442164, mensaje: 'Formato de periodo inv\u00e1lido.' };
  static ERROR_0165 = { codigo: 442165, mensaje: 'Periodo no puede ser menor a 01/AAAA.' };
  static ERROR_0166 = { codigo: 442166, mensaje: 'Periodo no puede ser mayor a 12/AAAA.' };
  static ERROR_0167 = { codigo: 442167, mensaje: 'N\u00famero de Orden o de Operaci\u00f3n inv\u00e1lido.' };
  static ERROR_0168 = { codigo: 442168, mensaje: 'El valor est\u00e1 fuera del intervalo.' };
  static ERROR_0169 = { codigo: 442169, mensaje: 'Casilla no puede ser negativa.' };
  static ERROR_0170 = { codigo: 442170, mensaje: 'El formulario ya fue registrado.' };
  // ----Casilla 128
  /* CUS26 */
  static ERROR_0171 = { codigo: 442171, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_0172 = { codigo: 442172, mensaje: 'Dato obligatorio.' };
  static ERROR_0173 = { codigo: 442173, mensaje: 'Formato de periodo inv\u00e1lido.' };
  static ERROR_0174 = { codigo: 442174, mensaje: 'Periodo no puede ser menor a 01/AAAA.' };
  static ERROR_0175 = { codigo: 442175, mensaje: 'Periodo no puede ser mayor a 12/AAAA.' };
  static ERROR_0176 = { codigo: 442176, mensaje: 'N\u00famero de Orden o de Operaci\u00f3n inv\u00e1lido.' };
  static ERROR_0177 = { codigo: 442177, mensaje: 'El valor est\u00e1 fuera del intervalo.' };
  static ERROR_0178 = { codigo: 442178, mensaje: 'Casilla no puede ser negativa.' };
  static ERROR_0179 = { codigo: 442179, mensaje: 'El formulario ya fue registrado.' };
  // ----Casilla 130
  /* CUS27 */
  static ERROR_0180 = { codigo: 442180, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_0181 = { codigo: 442181, mensaje: 'Dato obligatorio.' };
  static ERROR_0182 = { codigo: 442182, mensaje: 'El RUC ingresado es inv\u00e1lido.' };
  static ERROR_0183 = { codigo: 442183, mensaje: 'Formato de periodo inv\u00e1lido.' };
  static ERROR_0184 = { codigo: 442184, mensaje: 'Periodo no puede ser menor a 01/AAAA.' };
  static ERROR_0185 = { codigo: 442185, mensaje: 'Periodo no puede ser mayor a 12/AAAA.' };
  static ERROR_0186 = { codigo: 442186, mensaje: 'Casilla no puede ser negativa.' };
  static ERROR_0187 = { codigo: 442187, mensaje: 'Este periodo ya fue registrado para este RUC.' };
  static ERROR_0188 = { codigo: 442188, mensaje: 'Formato de RUC inv\u00e1lido.' };
  static ERROR_0189 = { codigo: 442189, mensaje: 'El n\u00famero de RUC no puede ser igual al RUC del declarante.' };
  static ERROR_0190 = { codigo: 442190, mensaje: 'Monto no puede ser 0.' };
  // ----Casilla 131
  /* CUS28 */
  static ERROR_0191 = { codigo: 442191, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_0192 = { codigo: 442192, mensaje: 'Dato obligatorio.' };
  static ERROR_0193 = { codigo: 442193, mensaje: 'El RUC ingresado es inv\u00e1lido.' };
  static ERROR_0194 = { codigo: 442194, mensaje: 'Formato de periodo inv\u00e1lido.' };
  static ERROR_0195 = { codigo: 442195, mensaje: 'Periodo no puede ser menor a 01/AAAA.' };
  static ERROR_0196 = { codigo: 442196, mensaje: 'Periodo no puede ser mayor a 12/AAAA.' };
  static ERROR_0197 = { codigo: 442197, mensaje: 'Este periodo ya fue registrado para este RUC.' };
  static ERROR_0198 = { codigo: 442198, mensaje: 'Formato de RUC inv\u00e1lido.' };
  static ERROR_0199 = { codigo: 442199, mensaje: 'El n\u00famero de RUC no puede ser igual al RUC del declarante.' };
  static ERROR_0200 = { codigo: 442200, mensaje: 'N\u00famero de Orden inv\u00e1lido.' };
  static ERROR_0201 = {
    codigo: 442201,
    mensaje: 'El N\u00famero de Orden asociado al RUC y periodo no est\u00e1 informado en la SUNAT,' +
      ' verifique que la informaci\u00f3n sea correcta.'
  };
  static ERROR_0202 = {
    codigo: 442202,
    mensaje: 'Monto retenido y Monto devuelto, ambos no pueden ser 0, ingrese su valor seg\u00fan corresponda.'
  };
  /* CUS29 */
  // Presentar y pagar Declaraci\u00f3n
  // ----Casilla 116
  /* CUS30 */
  static ERROR_0203 = { codigo: 442203, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_0204 = { codigo: 442204, mensaje: 'Dato obligatorio.' };
  static ERROR_0205 = { codigo: 442205, mensaje: 'El RUC ingresado no es v\u00e1lido.' };
  static ERROR_0206 = { codigo: 442206, mensaje: 'El DNI ingresado no es v\u00e1lido.' };
  static ERROR_0207 = { codigo: 442207, mensaje: 'Monto no puede ser menor o igual a 0.' };
  static ERROR_0208 = { codigo: 442208, mensaje: 'El pa\u00eds y tipo de renta ya fueron registrados.' };
  // ----Casilla 385
  /* CUS31 */
  static ERROR_0209 = { codigo: 442209, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_0210 = { codigo: 442210, mensaje: 'Monto Neto no puede ser menor a 1' };
  static ERROR_0211 = { codigo: 442211, mensaje: 'Fuente de Renta y Pa\u00eds ya fueron registrados' };
  // ----Casilla 514
  /* CUS32 */
  static ERROR_0212 = { codigo: 442212, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_0213 = { codigo: 442213, mensaje: 'Dato obligatorio.' };
  static ERROR_0214 = { codigo: 442214, mensaje: 'El RUC ingresado es inv\u00e1lido.' };
  static ERROR_0215 = { codigo: 442215, mensaje: 'Este valor est\u00e1 fuera del intervalo.' };
  static ERROR_0216 = { codigo: 442216, mensaje: 'Debe de ingresar el tipo de Bien.' };
  static ERROR_0217 = { codigo: 442217, mensaje: 'Monto de comprobante no puede ser menor a 0.01' };
  static ERROR_0218 = { codigo: 442218, mensaje: 'Debe de ingresar la forma de pago para montos mayores a S/ 3500' };
  static ERROR_0219 = { codigo: 442219, mensaje: 'Los montos mayores a 3500 deben ser bancarizados' };
  static ERROR_0220 = { codigo: 442220, mensaje: 'Verifique el dato ingresado, no cumple con el formato' };
  static ERROR_0221 = { codigo: 442221, mensaje: 'Formato de RUC inv\u00e1lido.' };
  static ERROR_0222 = { codigo: 442222, mensaje: 'Formato de Serie inv\u00e1lida.' };
  static ERROR_0223 = {
    codigo: 442223,
    mensaje: 'El formulario ingresado no se encuentra en la base de SUNAT,' +
      ' por favor verifique que la informaci\u00f3n registrada sea correcta.'
  };
  static ERROR_0224 = { codigo: 442224, mensaje: 'La informaci\u00f3n no coincide con lo informado por el emisor del comprobante' };
  static ERROR_0225 = { codigo: 442225, mensaje: 'El comprobante debe estar emitido entre el 01/01/AAAA y el 31/01/(AAAA+1).' };
  static ERROR_0226 = {
    codigo: 442226,
    mensaje: 'Monto no puede ser mayor a <valor del monto original proveniente de la plataforma de gastos>'
  };
  static ERROR_0227 = { codigo: 442227, mensaje: 'Ya ingres\u00f3 este comprobante de pago.' };
  static ERROR_0228 = {
    codigo: 442228,
    mensaje: 'RUC del emisor del Comprobante de Pago es el mismo RUC del receptor, por favor verifique.'
  };
  static ERROR_0229 = { codigo: 442229, mensaje: 'Existe una Rectificatoria para el comprobante ingresado.' };
  static ERROR_0230 = {
    codigo: 442230,
    mensaje: 'El comprobante no est\u00e1 informado en la SUNAT, verifique que la informaci\u00f3n sea correcta.'
  };
  static ERROR_0231 = { codigo: 442231, mensaje: 'El formulario debe estar emitido entre el 01/01/AAAA y el 31/01/(AAAA+1)' };
  static ERROR_0232 = { codigo: 442232, mensaje: 'Usted NO figura como emisor del documento registrado. Por favor verifique.' };
  static ERROR_0233 = { codigo: 442233, mensaje: 'Aportaci\u00f3n no puede ser menor a 0.01' };
  static ERROR_0234 = { codigo: 442234, mensaje: 'Monto inter\u00e9s no puede ser menor a 0.01' };
  static ERROR_0235 = { codigo: 442235, mensaje: 'El comprobante debe pertenecer al periodo AAAA.' };
  static ERROR_0236 = { codigo: 442236, mensaje: 'Monto a deducir no puede ser mayor al Monto m\u00e1ximo a deducir.' };
  static ERROR_0237 = { codigo: 442237, mensaje: 'Monto de deducir no puede ser menor a 0.01.' };
  static ERROR_0238 = {
    codigo: 442238,
    mensaje: 'El RUC del emisor del Comprobante de Pago es el mismo RUC del receptor, por favor verifique.'
  };
  /* CUS33 */
  // Dirige al cus34
  // ----Seccion informativa --> Atribuciones de Gastos
  /* CUS34 */
  static ERROR_0239 = { codigo: 442239, mensaje: 'El valor especificado no es v\u00E1lido.' };
  static ERROR_0240 = {
    codigo: 442240,
    mensaje: 'Usted tiene una atribuci\u00f3n recibida por lo que no es posible' +
      ' registrar a su C\u00f3nyuge o Concubino, por favor verificar.'
  };
  static ERROR_0241 = { codigo: 442241, mensaje: 'Usted no puede registrarse como atribuido.' };
  static ERROR_0242 = { codigo: 442242, mensaje: 'El DNI ingresado no es v\u00e1lido.' };
  static ERROR_0243 = { codigo: 442243, mensaje: 'La fecha de inicio de la relaci\u00f3n no puede ser mayor a la fecha actual.' };
  static ERROR_0244 = { codigo: 442244, mensaje: 'El RUC ingresado no es v\u00e1lido.' };
  static ERROR_0245 = { codigo: 442245, mensaje: 'C\u00f3nyuge o Concubino ya registrado, verificar.' };
  static ERROR_0246 = {
    codigo: 442246,
    mensaje: 'Usted ya ha registrado a un C\u00f3nyuge o Concubino por Sociedad Conyugal, por favor verificar.'
  };
  static ERROR_0247 = { codigo: 442213, mensaje: 'Dato obligatorio.' }; // No esta en el };
}
