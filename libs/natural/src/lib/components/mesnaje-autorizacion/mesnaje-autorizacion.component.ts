
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mesnaje-autorizacion',
  templateUrl: './mesnaje-autorizacion.component.html',
  styleUrls: ['./mesnaje-autorizacion.component.css']
})
export class MesnajeAutorizacionComponent implements OnInit {

  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  aceptar(): void {
    location.href = 'https://e-renta.sunat.gob.pe/loader/recaudaciontributaria/declaracionpago/personas?idFormulario=for0709';
  }

}
