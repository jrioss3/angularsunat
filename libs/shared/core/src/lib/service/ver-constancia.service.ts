import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RowConstnacia } from '@rentas/shared/types';
import { VerConstanciaComponent } from '../component/ver-constancia/ver-constancia.component';
import { VerTodoConstanciaComponent } from '../component/ver-todo-constancia/ver-todo-constancia.component';

@Injectable({
  providedIn: 'root'
})
export class VerConstanciaService {

  constructor(
    private modalService: NgbModal
  ) { }

  mostrarVerConstancia(rowConstnacia: RowConstnacia): void {
    const modalRef = this.modalService
      .open(VerConstanciaComponent, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      });

    modalRef.componentInstance.rowConstnacia = rowConstnacia;
  }

  mostrarTodoConstancias(listRowConstnacia: Array<RowConstnacia>): void {
    const modalRef = this.modalService
      .open(VerTodoConstanciaComponent, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      });

    modalRef.componentInstance.listRowConstnacia = listRowConstnacia;
  }

}
