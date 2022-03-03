import { NgModule, Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.css']
})
export class ErrorListComponent implements OnInit {

  resultado: number;
  @Input() public modal;
  @Input() public nameTab = '';
  @Input() public tipoEstilo = '';
  estilo = 'alert alert-danger';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    if (this.tipoEstilo !== '') {
      this.estilo = '';
    }
  }

  aceptar() {
    if (this.nameTab === '') {
      this.activeModal.close();
    }
  }
}
