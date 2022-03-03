import { ComboService } from '@rentas/shared/core';
import { Casilla107 } from './../../../../../../models/SeccionDeterminativa/DetRentaTrabajoModel';
import { Pipe, PipeTransform } from '@angular/core';
import { ConstantesCombos } from '@rentas/shared/constantes';

@Pipe({
  name: 'obtenerDescripcionTipoDocumento'
})
export class ObtenerDescripcionTipoDocumentoPipe implements PipeTransform {

  constructor(private comboService: ComboService) {}

  transform(value: Casilla107, args?: any): any {
    const tipo = value.tipDoc;
    const list = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
    const descripcion = list.find(x => x.val === tipo);
    return descripcion.desc ?? '';
  }

}
