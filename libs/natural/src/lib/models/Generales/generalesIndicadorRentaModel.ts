export interface GeneralesIndicadorRentaModel {
    refTabla: string;
    indCas100: number; // lisCas100Cab  si tiene al menos un item en la indCas100 se pone 1  si no 0
    indCas350: number; // lisCas350 si tiene al menos un item en la indCas350 se pone 1 si no 0
    indCas107: number; // lisCas107 si tiene al menos un item en la indCas107 se pone 1 si no 0
    indCas108: number; // lisCas108 si tiene al menos un item en la indCas108 se pone 1  si no 0
    indCas111: number; // lisCas111 si tiene al menos un item en la indCas111 se pone 1 si no 0
    indCas130: number; // lisCas130 si tiene al menos un item en la indCas130 se pone 1 si no 0
    indCas131: number; // lisCas131 si tiene al menos un item en la indCas131 se pone 1 si no 0
    indCas514: number; // declaraciones.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[4].
    // casilla514Detalle.lisCas514[] almenos un item se pone 1 si no 0
}
