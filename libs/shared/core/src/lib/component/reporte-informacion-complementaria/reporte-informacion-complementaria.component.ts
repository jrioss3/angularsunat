import { Component, OnInit } from '@angular/core';
import { ConstantesCombos } from '@rentas/shared/constantes';
import { ReporteUtil } from '@rentas/shared/utils';

@Component({
  selector: 'rentas-reporte-informacion-complementaria',
  templateUrl: './reporte-informacion-complementaria.component.html',
  styleUrls: ['./reporte-informacion-complementaria.component.css']
})
export class ReporteInformacionComplementariaComponent extends ReporteUtil implements OnInit {

  private doc: any[];
  public casInformativa: any;
  public mtoCas829: string;
  public correo1: string;
  public correo2: string;
  public nombre1: string;
  public nombre2: string;

  constructor() {
    super();
  }

  ngOnInit(): void {

    this.doc = this.getListaParametro(ConstantesCombos.TIPO_DOCUMENTO);
      this.casInformativa = this.preDeclaracion.declaracion.seccInformativa.casInformativa;
      this.mtoCas829 = this.cambiar10ToYesNo(this.casInformativa.mtoCas829);

      this.correo1 = (this.casInformativa.mtoCas252 ? this.casInformativa.mtoCas252 : '') +
        (this.casInformativa.mtoCas253 ? this.casInformativa.mtoCas253 : '')
        + (this.casInformativa.mtoCas254 ? this.casInformativa.mtoCas254 : '') +
        (this.casInformativa.mtoCas255 ? this.casInformativa.mtoCas255 : '')
        + (this.casInformativa.mtoCas256 ? this.casInformativa.mtoCas256 : '') +
        (this.casInformativa.mtoCas257 ? this.casInformativa.mtoCas257 : '');
      // Correo2
      this.correo2 = (this.casInformativa.mtoCas258 ? this.casInformativa.mtoCas258 : '') +
        (this.casInformativa.mtoCas259 ? this.casInformativa.mtoCas259 : '')
        + (this.casInformativa.mtoCas260 ? this.casInformativa.mtoCas260 : '') +
        (this.casInformativa.mtoCas261 ? this.casInformativa.mtoCas261 : '')
        + (this.casInformativa.mtoCas262 ? this.casInformativa.mtoCas262 : '') +
        (this.casInformativa.mtoCas263 ? this.casInformativa.mtoCas263 : '');

      this.nombre1 =
        (this.casInformativa.mtoCas815 == null ? '' :
          this.casInformativa.mtoCas815) + '' +
        (this.casInformativa.mtoCas814 == null ? '' :
          this.casInformativa.mtoCas814);
      this.nombre2 =
        (this.casInformativa.mtoCas817 == null ? '' :
          this.casInformativa.mtoCas817) + '' +
        (this.casInformativa.mtoCas818 == null ? '' :
          this.casInformativa.mtoCas818);

  }

  public obtenerValor(val: string): string {
    if (val !== '99') {
      const documento = this.doc.filter(x => x.val === val);
      return documento.length !== 0 ? documento[0].desc : '';
    } else {
      return 'SIN DATOS';
    }
  }

}
