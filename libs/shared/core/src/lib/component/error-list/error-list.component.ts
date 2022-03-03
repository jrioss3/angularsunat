import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantesCadenas } from '@rentas/shared/constantes';

@Component({
  selector: 'rentas-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.css']
})
export class ErrorListComponent implements OnInit {

  @Input() public modal;
  @Input() public nameTab = '';
  @Input() public tipoEstilo = '';
  @Output() respuesta = new EventEmitter<any>();
  public estilo = 'alert alert-danger';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    if (this.tipoEstilo !== '') {
      this.estilo = '';
    }
  }

  aceptar() {
    if (this.tipoEstilo) this.respuesta.emit(ConstantesCadenas.RESPUESTA_SI);
    this.activeModal.close();
  }
}
