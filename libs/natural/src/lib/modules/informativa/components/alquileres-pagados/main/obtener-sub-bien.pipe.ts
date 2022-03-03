import { Pipe, PipeTransform } from '@angular/core';
import { InfAlquileresModel } from '@path/natural/models';
import { ComboService } from '@rentas/shared/core';
import { ConstantesCombos } from '@rentas/shared/constantes';

@Pipe({
  name: 'obtenerSubBien'
})
export class ObtenerSubBienPipe implements PipeTransform {
  constructor(
    private comboService: ComboService) { }

  listaBienMueble = this.comboService.obtenerComboPorNumero(ConstantesCombos.BIEN_MUEBLES);
  listaBienInmueble = this.comboService.obtenerComboPorNumero(ConstantesCombos.BIEN_INMUEBLES);

  transform(value: InfAlquileresModel, args?: any): any {
    return value.codSubTipBien && value.codTipBien ?
      this.obtenerDescripcion(value.codSubTipBien, value.codTipBien, value.desBienAlq) : '';
  }

  obtenerDescripcion(subTipoBien: string, tipoBien: string, descBienAlq: string) {
    switch (tipoBien) {
      case '01': {
        const descBienMueble = this.listaBienMueble.filter(x => x.val === subTipoBien);
        return descBienMueble.length !== 0 ? descBienMueble[0].desc.toUpperCase() + ' - ' + descBienAlq.toUpperCase() : '';
      }
      case '03': {
        const descBienImueble = this.listaBienInmueble.filter(x => x.val === subTipoBien);
        return descBienImueble.length !== 0 ? descBienImueble[0].desc.toUpperCase() + ' - ' + descBienAlq.toUpperCase() : '';
      }
    }
  }

}
