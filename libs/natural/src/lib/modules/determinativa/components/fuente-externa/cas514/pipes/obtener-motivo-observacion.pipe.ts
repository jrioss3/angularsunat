import { Pipe, PipeTransform } from '@angular/core';
import { LCas514Detalle, ListaParametrosModel } from '@path/natural/models';
import { PreDeclaracionService } from '@path/natural/services';

@Pipe({
  name: 'obtenerMotivoObservacion'
})
export class ObtenerMotivoObservacionPipe implements PipeTransform {

  constructor(){}

  private getDescripcionInconsistencias(lstCodigosInconsistencias, observacionesParametria: ListaParametrosModel[], anioEjercicio: string): any {
    let descripciones = '';
   

    lstCodigosInconsistencias.forEach(codigo => {    
      const codigoParametro = codigo.trim();
      const desc = observacionesParametria.find((x) => x.val == codigoParametro)?.desc ?? '';
   
      if(desc != ''){
         descripciones += desc + '.<br/>'
      }     
    });
    return `${descripciones}`;
  }

  transform(value: LCas514Detalle, observacionesParametria: ListaParametrosModel[], anioEjercicio: string): any {
    const motivoInconsistencias = '';       
   
    if (value.indInconsistencia != '') {
      const lstCodigosInconsistencias = value.desInconsistencia ?  value.desInconsistencia.trim().split(",") : [];

      return this.getDescripcionInconsistencias(lstCodigosInconsistencias, observacionesParametria, anioEjercicio); 
    }
    
    return motivoInconsistencias;
  }

}
