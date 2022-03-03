import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agregarSignoPeriodo'
})
export class AgregarSignoPeriodoPipe implements PipeTransform {

  transform(perido: string, signo: string): unknown {
    const mes = perido.substring(0,2);
    const anio = perido.substring(2,6);
    return `${mes}${signo}${anio}`;
  }

}
