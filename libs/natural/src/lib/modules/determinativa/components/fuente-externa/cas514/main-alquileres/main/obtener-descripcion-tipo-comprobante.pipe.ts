import { Pipe, PipeTransform } from '@angular/core';
import { LCas514Detalle, ListaParametrosModel } from '@path/natural/models';
import { ParametriaFormulario } from '@path/natural/services';

@Pipe({
  name: 'obtenerDescripcionTipoComprobante'
})
export class ObtenerDescripcionTipoComprobantePipe implements PipeTransform {

  descTipoComprobante: ListaParametrosModel[];
  constructor(
    private cus12Service: ParametriaFormulario) { }

  transform(value: LCas514Detalle, args?: any): any {
    const tipo = value.codTipComprob ;
    this.descTipoComprobante = this.cus12Service.obtenerTipoComprobante().filter(x => x.val === tipo);
    return this.descTipoComprobante.length !== 0 ? this.descTipoComprobante[0].desc.toUpperCase() : '';
  }

}
