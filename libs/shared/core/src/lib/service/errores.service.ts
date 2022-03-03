import { Injectable } from '@angular/core';
import { ErrorMensajes, Error422, ErrorValidar } from '@rentas/shared/types';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConstantesUris } from '@rentas/shared/constantes';
import { Observable } from 'rxjs';
import { SessionStorage } from '@rentas/shared/utils';
import { ChatErrorService } from './chat-error.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalErroresComponent } from '../component/modal-errores/modal-errores.component';

@Injectable({
  providedIn: 'root'
})
export class ErroresService {
  constructor(
    private http: HttpClient,
    private chatErrorService: ChatErrorService,
    private modalService: NgbModal
  ) { }

  obtenerErrores(ejercicio: string, codFormulario: string): Observable<ErrorMensajes[]> {
    return this.http.get<ErrorMensajes[]>(ConstantesUris.URI_OBTENER_ERRORES
      .replace('{ejercicio}', ejercicio)
      .replace('{codFormulario}', codFormulario)
    );
  }

  obtenerErrorPorCodigo(id: string) {
    const errores = SessionStorage.getErrores<ErrorMensajes[]>();
    const error = errores.find(item => item.id === id);
    return error;
  }

  obtenerMensajeError(codExcepcion: string) {
    const errores = SessionStorage.getErrores<ErrorMensajes[]>();
    const error = errores.find(item => item.codCusExcepcion === codExcepcion);
    return error;
  }

  mostrarModalError(listaErrores) {
    this.chatErrorService.showErrorsArray(listaErrores.map((item) => item.descripcion || item.mensaje));
  }

  obtenerListaErrorMensaje(error) {
    if (error?.error?.errors) {
      const listaError = error.error.errors
        .map((item) => JSON.parse(item.msg) as ErrorValidar)
        .map((item: ErrorValidar) => {
          const msg = this.obtenerMensajeError(item.codCusExcepcion);
          msg.descripcion = item.params.reduce((carry, el) => {
            return carry.replace(`{${el.id}}`, el.val);
          }, msg.descripcion);
          return msg;
        });
      return listaError;
    }
    return [];
  }

  public mostarModalError(errorRespuesta: HttpErrorResponse): void {
    if (errorRespuesta.status === 422) {
      const listaError = (errorRespuesta.error as Error422)?.errors || [];
      if (listaError.length === 0) return;

      const listMensajes = listaError.map(e => e.msg);
      const modalRef = this.modalService.open(ModalErroresComponent, { backdrop: 'static', keyboard: false });
      modalRef.componentInstance.listaErrores = listMensajes;
    }

  }

  public esErrorPagoEnProceso(error: any): boolean {
    return error.status === 422 && error.error.errors[0].cod === 42229;
  }

}
