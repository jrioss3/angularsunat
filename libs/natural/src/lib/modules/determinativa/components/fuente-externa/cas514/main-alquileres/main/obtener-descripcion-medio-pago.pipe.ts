import { Pipe, PipeTransform } from '@angular/core';
import { ParametriaFormulario } from '@path/natural/services';
import { LCas514Detalle, ListaParametrosModel } from '@path/natural/models';

@Pipe({
  name: 'obtenerDescripcionMedioPago'
})
export class ObtenerDescripcionMedioPagoPipe implements PipeTransform {
  descMedioPago: ListaParametrosModel[];
  constructor(private cus27Service: ParametriaFormulario) {}

  transform(value: LCas514Detalle, args?: any): any {
    const tipo = value.codForPago ? value.codForPago : '';
    this.descMedioPago = this.cus27Service.obtenerFormaPago().filter(x => x.val === tipo);
    return this.descMedioPago.length !== 0 ? this.descMedioPago[0].desc.toUpperCase() : '';
  }

}
