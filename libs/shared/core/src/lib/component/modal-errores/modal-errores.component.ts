
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'rentas-modal-errores',
  templateUrl: './modal-errores.component.html',
  styleUrls: ['./modal-errores.component.css']
})
export class ModalErroresComponent implements OnInit {
  @Input() listaErrores: Array<string>;
  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
