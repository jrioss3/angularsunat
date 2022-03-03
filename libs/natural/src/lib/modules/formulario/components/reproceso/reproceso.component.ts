import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

const enum respuesta { SI = 'SI', NO = 'NO' }

@Component({
  selector: 'app-reproceso',
  templateUrl: './reproceso.component.html',
  styleUrls: ['./reproceso.component.css']
})
export class ReprocesoComponent implements OnInit {

  @Input() mensaje: string;
  @Output() eventoRespuesta = new EventEmitter<string>();

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  cerrar(): void {
    this.eventoRespuesta.emit(respuesta.NO);
    this.activeModal.close();
  }

  aceptar(): void {
    this.eventoRespuesta.emit(respuesta.SI);
    this.activeModal.close();
  }

}
