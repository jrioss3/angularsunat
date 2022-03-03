import { MesnajeAutorizacionComponent } from './../components/mesnaje-autorizacion/mesnaje-autorizacion.component';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilsComponent } from '@path/natural/components';
import {
  NgbModalOptions,
  NgbModal,
  NgbActiveModal,
} from '@ng-bootstrap/ng-bootstrap';
import { HttpError } from '@path/natural/models';
import { EstablecerEncabezados } from '../utils/establecer-encabezados';

@Injectable({ providedIn: 'root' })
export class HeaderInterceptor implements HttpInterceptor {
  modalOption: NgbModalOptions = {};
  titulo = 'Error';
  mensaje = 'Error desconocido';

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal) {}

  private getticket(): string {
    const user = JSON.parse(sessionStorage.getItem('SUNAT.userdata'));
    return user.login + '-' + user.ticket;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const logFormat = `background: red; color: white`;
    const token: string = sessionStorage.getItem('SUNAT.token');
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

    console.log(solicitud.url);
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
              this.mensaje = 'Error desconocido';
              console.log(`${error.statusText}`, logFormat);
              break;
          }
        }

        if (error.status !== 422) {
          const message = {
            titulo: this.titulo,
            mensaje: this.mensaje,
          };
          const modalRef = this.modalService.open(UtilsComponent, this.modalOption);
          modalRef.componentInstance.modal = message;
          modalRef.componentInstance.nameTab = '';
        }

        return throwError(error);
      })
    );
  }

  mostrarMensaje401(): void {
    this.modalService.open(MesnajeAutorizacionComponent, {
      backdrop: 'static',
      keyboard: false,
    });
  }
}
