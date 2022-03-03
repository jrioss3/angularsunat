import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MedioPago } from '@rentas/shared/types';

@Component({
  selector: 'rentas-modal-confirmar-pago',
  templateUrl: './modal-confirmar-pago.component.html',
  styleUrls: ['./modal-confirmar-pago.component.css']
})
export class ModalConfirmarPagoComponent implements OnInit {

  @Output() evento =  new EventEmitter<boolean>();
  @Input() medioPagoSelected: any;
  @Input() montoApagar: number;
  mensaje = '';
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.mensaje = this.getMensaje();
  }

  private getMensaje(): string {
    const medioPago = this.medioPagoSelected.codMedPag.toString() as MedioPago;
    switch (medioPago) {
      case MedioPago.CUENTA_DETRACCIONES: return 'Se ha seleccionado el ' +
        `${this.medioPagoSelected.nomEntFin}, el monto a ` +
        `pagar es: S/ ${this.montoApagar}, si es conforme seleccione el botón Aceptar`;
      case MedioPago.BANCOS: return 'Se ha seleccionado el ' +
        `${this.medioPagoSelected.nomEntFin}, el monto a ` +
        `pagar es: S/ ${this.montoApagar}, si es conforme seleccione el botón Aceptar`;
      case MedioPago.VISA: return 'Se ha seleccionado el ' +
        'pago con tarjeta de crédito el monto a ' +
        `pagar es: S/ ${this.montoApagar}, si es conforme seleccione el botón Aceptar`;
      case MedioPago.NPS: return 'Se ha seleccionado el pago con NPS, el monto a ' +
        `pagar es: S/ ${this.montoApagar}, si es conforme seleccione el botón Aceptar`;
      default: return 'no se encontro la cateroria';
    }
  }

  aceptar(): void {
    this.evento.emit(true);
    this.activeModal.close();
  }

  cancelar(): void {
    this.evento.emit(false);
    this.activeModal.close();
  }

}
