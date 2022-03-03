import { Pipe, PipeTransform } from '@angular/core';
import { Casilla } from '@rentas/shared/types';

@Pipe({
  name: 'addParentesis'
})
export class AddParentesisPipe implements PipeTransform {

  transform(value: string | number, casilla: Casilla): unknown {
    const number = Number(String(value).replace(/[^0-9.-]+/g,""));
    if(casilla.indFormatoNegativo === true) {
      return `(${value})`;
    } else if (Number(number) < 0) {
      return `(${String(value).replace('-','')})`;
    }
    return value;
  }

}
