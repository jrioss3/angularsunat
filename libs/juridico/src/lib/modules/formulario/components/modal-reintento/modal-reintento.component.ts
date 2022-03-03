import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConstantesCadenas } from '@rentas/shared/constantes';

@Component({
  selector: 'app-modal-reintento',
  templateUrl: './modal-reintento.component.html',
  styleUrls: ['./modal-reintento.component.css']
})
export class ModalReintentoComponent implements OnInit {
  @Input() mensaje: string;
  @Output() respuesta = new EventEmitter<string>();

  constructor(private modalService: NgbActiveModal) { }

  ngOnInit() {}

  public aceptar(): void {
    this.respuesta.emit(ConstantesCadenas.RESPUESTA_SI);
    this.modalService.close();
  }

}
