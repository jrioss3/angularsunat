import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConstantesUris } from '@rentas/shared/constantes';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EnviarCorreoComponent } from '../component/enviar-correo/enviar-correo.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ConstanciaEnviarGuardarService {

  uriVisorConstanciaGeneral = ConstantesUris.URI_VISORCONSTANCIA_ENVIAR_GENERAL;
  urlVisorConstanciaMasivo = ConstantesUris.URI_VISORCONSTANCIA_ENVIAR_MASIVO;
  uriEnviarCorreo = ConstantesUris.URI_VISORCONSTANCIA_ENVIAR;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal
  ) {

  }

  public enviarCorreoGeneral(solicitud: { idPresentacion: string, razonSocial: string }): void {
    const modalRef = this.modalService.open(EnviarCorreoComponent, { size: 'lg' });
    modalRef.componentInstance.uri = this.uriVisorConstanciaGeneral;
    modalRef.componentInstance.solicitud = solicitud;
  }

  public enviarCorreoMasivo(solicitud: { idPresentacion: string, razonSocial: string }): void {
    const modalRef = this.modalService.open(EnviarCorreoComponent, { size: 'lg' });
    modalRef.componentInstance.uri = this.urlVisorConstanciaMasivo;
    modalRef.componentInstance.solicitud = solicitud;
  }

  public  enviarCorreo(solicitud: { idPresentacion: string, razonSocial: string, numOrd: string }): void {
    const modalRef = this.modalService.open(EnviarCorreoComponent, { size: 'lg' });
    modalRef.componentInstance.uri = this.uriEnviarCorreo;
    modalRef.componentInstance.solicitud = solicitud;
  }

  public guardarGeneral(numeroOperacionSunat: string): Observable<Blob> {
    const uri = ConstantesUris.URI_VISORCONSTANCIA_GUARDAR_GENERAL
      .replace('{numeroOperacionSunat}', numeroOperacionSunat);

    return this.http.get(uri, { responseType: 'blob' }).pipe(
      catchError(error => {
        return this.handlerErrorBlob(error);
      })
    );
  }

  public guardarMasivo(numeroOperacionSunat: string): Observable<Blob> {
    const uri = ConstantesUris.URI_VISORCONSTANCIA_GUARDAR_MASIVO
      .replace('{numeroOperacionSunat}', numeroOperacionSunat);

    return this.http.get(uri, { responseType: 'blob' }).pipe(
      catchError(error => {
        return this.handlerErrorBlob(error);
      })
    );
  }

  public guardar(numeroOperacionSunat: string, numeroOrden: string): Observable<Blob> {
    const uri = ConstantesUris.URI_VISORCONSTANCIA_GUARDAR
      .replace('{numeroOperacionSunat}', numeroOperacionSunat)
      .replace('{numeroOrden}', numeroOrden);

    return this.http.get(uri, { responseType: 'blob' }).pipe(
      catchError(error => {
        return this.handlerErrorBlob(error);
      })
    );
  }

  private handlerErrorBlob(err: HttpErrorResponse): Observable<any> {
    if (err.status === 422) {
      const reader: FileReader = new FileReader();
      const obs = new Observable<HttpErrorResponse>((observer: any) => {
        reader.onloadend = (_e) => {
          const data = JSON.parse(reader.result as string);
          // const listaErrores = data.errors.map(el => el.msg);
          const error = new HttpErrorResponse({ error: data, status: 422 });
          observer.error(error);
          observer.complete();
        };
      });

      reader.readAsText(err.error);
      return obs;
    }
    return throwError(err);
  }

}
