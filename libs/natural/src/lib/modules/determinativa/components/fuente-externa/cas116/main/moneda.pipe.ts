import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monedaCustom'
})
export class MonedaPipePipe implements PipeTransform {

  transform(value: number): string {
      return `S/ ${value} `;
  }

}
