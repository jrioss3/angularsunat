import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsComponent } from '@path/natural/components';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FuncionesGenerales } from '../../../../shared/utils/src/lib/funciones-generales/funciones-generales';

@Injectable()
export class MostrarMensajeService {
    private funcionesGenerales: FuncionesGenerales;

    constructor(private modalService: NgbModal) { 
        this.funcionesGenerales = FuncionesGenerales.getInstance();
    }

    public callModal(excepcionName: string) {
        const modal = {
            titulo: 'Mensaje',
            mensaje: excepcionName
        };
        const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
        modalRef.componentInstance.modal = modal;
        return;
    }

    public mensajeEliminar(excepcionName: string): Observable<string> {
        const modal = {
            titulo: 'Mensaje',
            mensaje: excepcionName
        };
        const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
        modalRef.componentInstance.nameTab = 'Eliminar-Registro';
        modalRef.componentInstance.modal = modal;
        return modalRef.componentInstance.respuesta;
    }

    public alerta(excepcionName: string):Observable<string> {
        const modal = {
            titulo: 'Mensaje',
            mensaje: excepcionName
        };
        const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
        modalRef.componentInstance.nameTab = 'aceptar';
        modalRef.componentInstance.modal = modal;
        return modalRef.componentInstance.respuesta;
    }
}