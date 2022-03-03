import { Pipe, PipeTransform } from '@angular/core';
import { Casilla522 } from '@path/natural/models';
import { ComboService } from '@rentas/shared/core';
import { ConstantesCombos } from '@rentas/shared/constantes';

@Pipe({
  name: 'obtenerTipoDocumentoCas522'
})
export class ObtenerTipoDocumentoCas522Pipe implements PipeTransform {
  constructor(private comboService: ComboService) {}

  listaTipoDoc =  this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
  transform(value: Casilla522, args?: any): any {
    const tipo = value.codTipDoc;
    const descTipDoc = this.listaTipoDoc.find(x => x.val === tipo);
    return descTipDoc.desc;
  }

}
