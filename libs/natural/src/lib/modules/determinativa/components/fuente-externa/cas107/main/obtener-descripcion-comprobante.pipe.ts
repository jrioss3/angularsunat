import { Pipe, PipeTransform } from '@angular/core';
import { ParametriaFormulario } from '@path/natural/services';
import { Casilla107 } from '@path/natural/models';

@Pipe({
  name: 'obtenerDescripcionComprobante107'
})
export class ObtenerDescripcionComprobantePipe implements PipeTransform {

  constructor(
      private cus12Service: ParametriaFormulario) { }

  transform(value: Casilla107, args?: any): any {
    const tipo = value.codTipComp ? value.codTipComp : '';
    let descTipoComprobante: any[];
    descTipoComprobante = this.cus12Service.obtenerTipoComprobante().filter(x => x.val === tipo);
    return descTipoComprobante.length !== 0 ? descTipoComprobante[0].desc.toUpperCase() : '';
  }
}
