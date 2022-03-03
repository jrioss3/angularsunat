import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'rentas-modal-presentar-pagar-form',
  templateUrl: './modal-presentar-pagar-form.component.html',
  styleUrls: ['./modal-presentar-pagar-form.component.css']
})
export class ModalPresentarPagarFormComponent implements OnInit {

  @Input() isPagoCero: boolean;
  @Output() evento = new EventEmitter<boolean>();

  constructor(private modalService: NgbActiveModal) { }

  ngOnInit(): void {
  }

  public cerrar(): void {
    this.evento.emit(false);
    this.modalService.close();
  }

  public aceptar(): void {
    this.evento.emit(true);
    this.modalService.close();
  }

}
