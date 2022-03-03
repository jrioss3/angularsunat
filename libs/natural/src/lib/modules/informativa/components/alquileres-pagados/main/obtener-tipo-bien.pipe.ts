import { Pipe, PipeTransform } from '@angular/core';
import { InfAlquileresModel } from '@path/natural/models';
import { ComboService } from '@rentas/shared/core';
import { ConstantesCombos } from '@rentas/shared/constantes';

@Pipe({
  name: 'obtenerTipoBien'
})
export class ObtenerTipoBienPipe implements PipeTransform {
  constructor(
    private comboService: ComboService) { }

  transform(value: InfAlquileresModel, args?: any): any {
    const tipo = value.codTipBien ? value.codTipBien : '';
    const listaTipoBien = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_BIEN);
    listaTipoBien.forEach(x => { x.val = '0' + x.val; });
    const descTipoBien = listaTipoBien.filter(y => y.val === tipo);
    return descTipoBien.length !== 0 ? descTipoBien[0].desc.toUpperCase() : '';
  }

}
