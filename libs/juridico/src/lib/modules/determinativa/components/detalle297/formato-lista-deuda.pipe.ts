import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoListaDeuda'
})
export class FormatoListaDeudaPipe implements PipeTransform {

  readonly size = 12;

  transform(value: string, args?: string ): string {
    if (args === 'tributo') {
      return value ? value.substring(1,3) + value.substring(3,4) + value.substring(5) : '';
    } else if (args === 'periodo') {
      return value ? value.substring(4) + '/' + value.substring(0, 4) : '';
    } else if (args === 'valor') {
      if (value === '' || value === null || value.length < this.size) {
        return 'Saldo Deudor';
      } else {
        return 'Valor';
      }
    } else if (args === 'fuente') {
      return value ? (value === '0' ? 'Pers.' : 'Manual') : '';
    } else if (args === 'numValor') {
      return value.length < this.size ? '' : value;
    }
  }

}
