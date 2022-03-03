import { Pipe, PipeTransform } from '@angular/core';
import { TributoPagado } from '../models/tributo-pagado';

@Pipe({
  name: 'filtroPorTributos',
})
export class FiltroPorTributosPipe implements PipeTransform {
  transform(listaTributosPagados: Array<TributoPagado>, tributo?: string): any {
    if (tributo && listaTributosPagados) {
      return listaTributosPagados.filter((e) => e.codTributo === tributo);
    } else {
      return listaTributosPagados || [];
    }
  }
}
