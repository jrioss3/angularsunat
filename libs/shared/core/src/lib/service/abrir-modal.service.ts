import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesGenerales } from '@rentas/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class AbrirModalService {

  constructor(private modalService: NgbModal) { }

  abrirModal(modal: any, estilo?: {}): NgbModalRef {
    const funcionesGenerales = FuncionesGenerales.getInstance();
    const modalRef = this.modalService.open(modal, funcionesGenerales.getModalOptions(estilo?? {}));
    return modalRef;
  }

}
