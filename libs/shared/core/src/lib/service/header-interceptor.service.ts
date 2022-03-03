import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ModalMensajeComponent } from '../component/modal-mensaje/modal-mensaje.component';
import { EstablecerEncabezados } from '../utils/establecer-encabezados';
import { SessionStorage } from '@rentas/shared/utils';
import { AbrirModalService } from './abrir-modal.service';
import { ModalConfirmarService } from './modal-confirmar.service';

export class HttpError {
  static BadRequest = 400;
  static Unauthorized = 401;
  static Forbidden = 403;
  static NotFound = 404;
  static TimeOut = 408;
  static Conflict = 409;
  static InternalServerError = 500;
  static GatewayTimeout = 504;
}

@Injectable()
export class HeaderInterceptorService implements HttpInterceptor {

  constructor(private abrirModalService: AbrirModalService , private modalConfirmarService: ModalConfirmarService) { }

  titulo = 'Error';
  mensaje = 'Error desconocido';

  private getticket(): string {
    const user = SessionStorage.getUserData();
    return user.login + '-' + user.ticket;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const logFormat = `background: red; color: white`;
    const token: string = SessionStorage.getToken();
    const ticket = this.getticket();
    let solicitud = request;

    if (solicitud.url === 'https://api.ipify.org/?format=json') {
      return next.handle(solicitud);
    }

    if (token) {
      solicitud = request.clone({
        setHeaders: {
          authorization: `Bearer ${token}`,
          'x-custom-ticket': ticket,
        },
      });
    }

    /**
     * Este if es para agregar cabeceras a una ruta especifica
     */
    if (EstablecerEncabezados.checkUrlIsValid(solicitud.url)) {
      solicitud = EstablecerEncabezados.getInstance(solicitud).buildProperty();
    }

    return next.handle(solicitud).pipe(
      catchError((error: any) => {
        console.log(error);
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case HttpError.BadRequest:
              this.mensaje = 'Error 400 en el servidor';
              console.error('%c error 400', logFormat);
              break;
            case HttpError.Unauthorized:
              this.mostrarMensaje401();
              return throwError(error);
            case HttpError.NotFound:
              this.titulo = 'HTTP 404';
              this.mensaje = 'El recurso solicitado no existe';
              console.log('%c error not found 404', logFormat);
              break;
            case HttpError.TimeOut:
              this.mensaje = 'Error 408 en el Servidor';
              console.log('%c error time out 408', logFormat);
              break;
            case HttpError.InternalServerError:
              this.titulo = 'Error del Servidor';
              this.mensaje =
                'Señor contribuyente disculpe la molestia, en estos momentos no se ' +
                'puede acceder a los servicios de SUNAT, por favor reintentar en 5 minutos';
              // console.log('%c error Internal Server 500', logFormat);
              break;
            case HttpError.GatewayTimeout:
              this.titulo = 'Tiempo de espera';
              this.mensaje = `no puede completar tu solicitud dentro del marco de tiempo dado
                            (Status ${HttpError.GatewayTimeout})`;
              break;
            default:
              this.mensaje =
                'Señor contribuyente disculpe la molestia,' +
                ' en estos momentos no se puede acceder a los servicios de SUNAT, por favor reintentar en 5 minutos.';
              console.log(`${error.statusText}`, logFormat);
          }
        }

        if (error.status !== 422) {
          this.modalConfirmarService.msgValidaciones(this.mensaje , this.titulo);
        }

        return throwError(error);
      })
    );
  }

  mostrarMensaje401(): void {
    const modalRef = this.abrirModalService.abrirModal(ModalMensajeComponent);
    modalRef.componentInstance.callback = function () {
      location.href = 'https://e-renta.sunat.gob.pe/loader/recaudaciontributaria/declaracionpago/formularios?idFormulario=menu';
    }
    modalRef.componentInstance.titulo = 'Mensaje 401';
    modalRef.componentInstance.mensaje = 'Mensaje (401) Su sesión ha expirado';
  }
}

