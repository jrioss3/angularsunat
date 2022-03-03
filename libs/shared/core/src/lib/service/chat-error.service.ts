import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ErrorListComponent } from '../component/error-list/error-list.component';
import { AbrirModalService } from './abrir-modal.service';

//El subject permite realizar diversas tareas de multicasting
//Comparte exactamente el mismo stream de datos con las subscripciones

@Injectable({
    providedIn: 'root'
})
export class ChatErrorService {
    mensaje:any[];
    enviarMensajeSubject = new Subject<any>();
    enviarMensajeObservable = this.enviarMensajeSubject.asObservable();
    
    constructor(
        public abrirModalService: AbrirModalService
    ){
    }

    enviarMensaje(mensaje:any, showErrorListComponent : boolean){
        this.mensaje = mensaje;
        const messajeObj = {
            mensaje:mensaje,
            showErrorListComponent : showErrorListComponent
        };
        this.enviarMensajeSubject.next(messajeObj);
        // ListaErroresComponent.prototype.loadListErrors(messajeObj);
    }

    showErrorsArray(errorList1: string[] , estilo?: string , titulo?: string): any {
        const modal = {
          titulo: titulo == undefined ? 'Errores' : titulo, 
          errorList: errorList1,
        };
        const modalRef = this.abrirModalService.abrirModal(ErrorListComponent);
        modalRef.componentInstance.modal = modal;
        modalRef.componentInstance.tipoEstilo = estilo === undefined ? '' : estilo;
        if (estilo) {
            return modalRef.componentInstance.respuesta;
        }
      }
}