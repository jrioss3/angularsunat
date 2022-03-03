import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'rentas-modal-mensaje-visa',
  templateUrl: './modal-mensaje-visa.component.html',
  styleUrls: ['./modal-mensaje-visa.component.css']
})
export class ModalMensajeVisaComponent implements OnInit  {

  @Output() evento =  new EventEmitter<void>();

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  aceptar(): void {
    this.evento.emit();
    this.activeModal.close();
  }

  cancelar(): void {
    this.evento.emit();
    this.activeModal.close();
  }

}