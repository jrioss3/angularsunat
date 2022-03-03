import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantesCadenas } from '@rentas/shared/constantes';

@Component({
  selector: 'app-modal-confirmar',
  templateUrl: './modal-confirmar.component.html',
  styleUrls: ['./modal-confirmar.component.css']
})
export class ModalConfirmarComponent implements OnInit {

  @Input() public modal;
  @Input() public nameTab = '';
  @Output() respuesta = new EventEmitter<any>();
  public textoCancelar = 'Cancelar';
  public textoAceptar = 'Aceptar';
  public claseCancelar = 'btn btn-outline-secondary';

  constructor(public modalService: NgbActiveModal) { }

  ngOnInit() {
    if (this.nameTab === ConstantesCadenas.BOTONESSINO) {
      this.textoCancelar = 'Si';
      this.textoAceptar = 'No';
      this.claseCancelar = 'btn btn-primary';
    }
  }

  public aceptar(): void {
    if (this.nameTab === ConstantesCadenas.BOTONESSINO) {
      this.respuesta.emit(ConstantesCadenas.RESPUESTA_NO);
    } else {
      this.respuesta.emit(ConstantesCadenas.RESPUESTA_SI);
    }
    this.modalService.close();
  }

  public cancelar(): void {
    if (this.nameTab === ConstantesCadenas.BOTONESSINO) {
      this.respuesta.emit(ConstantesCadenas.RESPUESTA_SI);
    } else {
      this.respuesta.emit(ConstantesCadenas.RESPUESTA_NO);
    }
    this.modalService.close();

  }
}
