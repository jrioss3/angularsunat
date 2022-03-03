import { Pipe, PipeTransform } from '@angular/core';
import { LCas514Detalle, ListaParametrosModel } from '@path/natural/models';
import { ComboService } from '@rentas/shared/core';
import { ConstantesCombos } from '@rentas/shared/constantes';

@Pipe({
  name: 'obtenerDecripcionTipoBien'
})
export class ObtenerDecripcionTipoBienPipe implements PipeTransform {
  listaTipoBien: ListaParametrosModel[];
  constructor(
    private comboService: ComboService) { }

  obtenerListaTipoBien(): ListaParametrosModel[] {
    this.listaTipoBien = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_BIEN);
    this.listaTipoBien.pop();
    this.listaTipoBien[1].desc = 'BIEN INMUEBLE';
    this.listaTipoBien.forEach(x => { x.val = '0' + x.val; });
    return this.listaTipoBien;
  }
 
  transform(value: LCas514Detalle, args?: any): any {
    switch (value.indTipGasto) {
      case '01': {
        if (value.codTipBien !== null) {
          const tipo = value.codTipBien;
          // let descTipoBien: any;
          let descTipoBien = this.obtenerListaTipoBien().filter(x => x.val = tipo);
          return descTipoBien.length !== 0 ? descTipoBien[0].desc.toUpperCase() : '';
        } else {
          return '';
        }
      }
      default: return '';
    }
  }

}
