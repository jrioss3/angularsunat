import { Component, Input, OnInit } from '@angular/core';
import { RowConstnacia } from '@rentas/shared/types';
import { Nidi } from '@rentas/shared/utils';

@Component({
  selector: 'rentas-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent extends Nidi implements OnInit {

  @Input() rowConstnacia: RowConstnacia = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  esPagoCeroSinDeuda(): boolean {
    const pagoTotal = this.rowConstnacia.detalleTributos.reduce((carry, item)=> carry + item.montoPago , 0);
    const montoDeuda = this.rowConstnacia.pagoPendientes.reduce((carry, item)=> carry + item.deuda , 0);
    return  pagoTotal === 0 && montoDeuda === 0;
  }

  esPagoCeroConDeuda(): boolean {
    const pagoTotal = this.rowConstnacia.detalleTributos.reduce((carry, item)=> carry + item.montoPago , 0);
    const montoDeuda = this.rowConstnacia.pagoPendientes.reduce((carry, item)=> carry + item.deuda , 0);
    return pagoTotal === 0 && montoDeuda > 0;
  }

  esPagoTotal(): boolean {
    return this.rowConstnacia.detalleTributos.filter(item => item.montoPago === item.totalDeuda).length > 0;
  }

  esPagoParcial(): boolean {
    return this.rowConstnacia.detalleTributos.filter(item => 0 < item.montoPago && item.montoPago < item.totalDeuda).length > 0;
  }

  tieneBoleta() {
    return !this.rowConstnacia.esNps && (this.esPagoParcial() || this.esPagoTotal());
  }

}
