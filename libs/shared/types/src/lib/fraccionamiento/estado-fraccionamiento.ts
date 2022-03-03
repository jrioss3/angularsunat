export enum TipoPlataformaFrac {
  JURIDICO = 'JURIDICO',
  NATURAL = 'NATURAL'
}

export enum TipoFrac {
  MAYOR_10_PORCIENTO_UIT = 1,
  MAYOR_150_UIT = 2,
}

export interface EstadoFraccionamiento {
  tipoPlaforma: TipoPlataformaFrac,
  mesaje: string;
  tieneFraccionamiento: boolean;
  tipo: TipoFrac
}
