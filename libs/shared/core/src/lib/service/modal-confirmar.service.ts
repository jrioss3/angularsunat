import { Injectable } from '@angular/core';
import { ConstantesCadenas } from '@rentas/shared/constantes';
import { Observable } from 'rxjs';
import { ModalConfirmarComponent } from '../component/modal-confirmar/modal-confirmar.component';
import { ModalMensajeComponent } from '../component/modal-mensaje/modal-mensaje.component';
import { ModalPresentarPagarFormComponent } from '../component/modal-presentar-pagar-form/modal-presentar-pagar-form.component';
import { ModalTienePagoProcesoComponent } from '../component/modal-tiene-pago-proceso/modal-tiene-pago-proceso.component';
import { AbrirModalService } from './abrir-modal.service';

@Injectable({
  providedIn: 'root'
})
export class ModalConfirmarService {

  constructor(
    private abrirModalService: AbrirModalService,
  ) { }

  msgPresentarPagarForm(isPagoCero: boolean): Observable<boolean> {
    const modalRef = this.abrirModalService.abrirModal(ModalPresentarPagarFormComponent);
    modalRef.componentInstance.isPagoCero = isPagoCero;
    return modalRef.componentInstance.evento;
  }

  msgErrorPagoEnProceso(error): void {
    const listMensajes = error?.error?.errors.map(e => e.msg);
    const modalRef = this.abrirModalService.abrirModal(ModalTienePagoProcesoComponent);
    modalRef.componentInstance.errores = listMensajes;
  }

  msgValidaciones(excepcionName: string, titulo: string): void {
    const modalRef = this.abrirModalService.abrirModal(ModalMensajeComponent);
    modalRef.componentInstance.mensaje = excepcionName;
    modalRef.componentInstance.titulo = titulo;
  }

  msgConfirmar(mensaje: string): Observable<string> {
    const modal = {
      titulo: 'Mensaje',
      mensaje: mensaje
    };
    const modalRef = this.abrirModalService.abrirModal(ModalConfirmarComponent);
    modalRef.componentInstance.modal = modal;
    return modalRef.componentInstance.respuesta;
  }

  msgBotonesSINO(mensaje): Observable<string> {
    const modal = {
      titulo: 'Mensaje',
      mensaje: mensaje
    };
    const modalRef = this.abrirModalService.abrirModal(ModalConfirmarComponent);
    modalRef.componentInstance.modal = modal;
    modalRef.componentInstance.nameTab = ConstantesCadenas.BOTONESSINO;
    return modalRef.componentInstance.respuesta;
  }

  msgActualizarModals(mensaje, titulo) {
    const modal = {
      titulo: titulo,
      mensaje: mensaje
    };
    const modalRef = this.abrirModalService.abrirModal(ModalConfirmarComponent);
    modalRef.componentInstance.modal = modal;
    return modalRef.componentInstance.respuesta;
  }
}
