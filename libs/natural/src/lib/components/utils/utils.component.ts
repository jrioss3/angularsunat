import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-utils',
  templateUrl: './utils.component.html',
  styleUrls: ['./utils.component.css']
})
export class UtilsComponent implements OnInit {
  resultado: number;
  texto = 'Aceptar';
  texto2 = 'Cancelar';
  @Input() public modal;
  @Input() public nameTab = '';
  @Output() respuesta = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    // this.resultado = 0;
    if (this.nameTab === 'Desmarcar-TipoRenta') {
      this.texto = 'SI';
      this.texto2 = 'NO';
    }
  }

  aceptar() {
    if (this.nameTab === '') {
      this.activeModal.close();
    }
    if (this.nameTab !== '') {
      this.respuesta.emit('si');
      this.activeModal.close(this.resultado);
    }
  }

  cancelar() {
    if (this.nameTab !== '') {
      this.respuesta.emit('no');
      this.activeModal.close(this.resultado);
    }
  }

}
