import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mensaje-validacion-anexo',
  templateUrl: './mensaje-validacion-anexo.component.html',
  styleUrls: ['./mensaje-validacion-anexo.component.css']
})
export class MensajeValidacionAnexoComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  resultado: number;
  @Input() public modal;
  @Input() public tipoEstilo = '';
  @Output() respuesta = new EventEmitter<any>();
  estilo = 'alert alert-danger';

  ngOnInit() {
    if (this.tipoEstilo !== '') {
      this.estilo = '';
    }
  }

  aceptar() {
      this.respuesta.emit('si');
      this.activeModal.close(this.resultado);
  }
}
