import { Pipe, PipeTransform } from '@angular/core';
import { ListaParametrosModel, LCas514Detalle } from '@path/natural/models';
import { ParametriaFormulario } from '@path/natural/services';

@Pipe({
  name: 'obtenerDescripcionTipoVinculo'
})
export class ObtenerDescripcionTipoVinculoPipe implements PipeTransform {

  descTipoVinculo: ListaParametrosModel[];

  constructor(
    private cus27Service: ParametriaFormulario) { }

  transform(value: LCas514Detalle, args?: any): any {
    const tipo = value.codTipVinc;
    this.descTipoVinculo = this.cus27Service.obtenerTipoVinculo().filter(x => x.val === tipo);
    return this.descTipoVinculo.length !== 0 ? this.descTipoVinculo[0].desc.toUpperCase() : '';
  }

}
