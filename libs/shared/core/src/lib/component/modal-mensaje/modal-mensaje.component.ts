import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AceptarCallback } from '../../types/aceptar-callback';

@Component({
  selector: 'rentas-modal-mensaje',
  templateUrl: './modal-mensaje.component.html',
  styleUrls: ['./modal-mensaje.component.css']
})
export class ModalMensajeComponent implements OnInit {

  @Input() public mensaje = '';
  @Input() public titulo = '';
  @Input() private callback: AceptarCallback = null;

  constructor(private modalService: NgbActiveModal) { }

  ngOnInit(): void {
  }

  public aceptar(): void {
    if (this.callback !== null) this.callback();
    this.modalService.close();
  }

}
