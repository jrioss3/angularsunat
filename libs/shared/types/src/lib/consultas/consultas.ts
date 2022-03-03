export interface Consulta {
  codFor: string;
  ejercicio: string;
  desFor: string;
  desTipoDeclaracion: string;
  desMedPago: string;
  fecDeclaracion: string;
  idPresentacion: string;
  medPago: string;
  mtoPag: number;
  numOrden: number;
  tipDeclaracion: '0'|'1';
  web: boolean;
}

// 0 = Rectificatoria
// 1 = Original
