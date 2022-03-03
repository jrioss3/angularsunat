import { Pipe, PipeTransform } from '@angular/core';
import { InfAlquileresModel } from '@path/natural/models';
import { ComboService } from '@rentas/shared/core';
import { ConstantesCombos } from '@rentas/shared/constantes';

@Pipe({
  name: 'obtenerTipoDocumento'
})
export class ObtenerTipoDocumentoPipe implements PipeTransform {
  constructor(
    private comboService: ComboService) { }

  transform(value: InfAlquileresModel, args?: any): any {
    const tipo = value.codDocIdeDec ? value.codDocIdeDec : '';
    const descTipoDocumento = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO_ESPECIAL).filter(x => x.val === tipo)
    return descTipoDocumento.length !== 0 ? descTipoDocumento[0].desc.toUpperCase() : '';
  }

}
