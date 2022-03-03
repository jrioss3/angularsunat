import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantesUris } from '@rentas/shared/constantes';
import { concat, from, Observable, throwError } from 'rxjs';
import { delay, map, retryWhen, switchMap, take } from 'rxjs/operators';
import { TimerPagoComponent } from '../component/timer-pago/timer-pago.component';

@Injectable({
  providedIn: 'root'
})
export class PopupVisaService {

  private popUp: Window;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal
  ) { }

  public getPopUp(): Window {
    return this.popUp;
  }

  public isClosed(): boolean {
    return this.popUp.closed;
  }

  public showModalTimer(fnEndTime: () => void): void {
    const modalRef = this.modalService.open(TimerPagoComponent, { backdrop: 'static', keyboard: false, size: 'lg' });
    modalRef.componentInstance.winopenPopad = this;
    const event = modalRef.componentInstance.event as Observable<any>;
    event.subscribe(fnEndTime);
  }

  public open(numeroOperacionSunat: string, codMedPag: string, codEntFin: string, montoApagar: number) {
    const uri = `${ConstantesUris.URI_PARAMETRIA_PASARELA_VISA}` +
      `?IdCache=159312&numTransApliCli=${numeroOperacionSunat}` +
      `&numPas=1&numMedPagPas=3&codTipmon=00&codMedpag=${codMedPag}` +
      `&codEntFin=${codEntFin}&tipoOperacion=1&codTipSer=01&mtoOpe=` +
      `${montoApagar}&codMedPre=01&codAplCli=1`;

    const promesa = new Promise((resolver, reject) => {

      this.http.get(uri, { responseType: 'text' })
        .subscribe(data => {

          this.popUp = window.open('about:blank', 'Pago Electrónico', 'width=550,height=600');
          if (!this.popUp) { throw new Error('tiene que tener permisos para abrir un modal'); }
          this.popUp.document.write(data.replace('hidden', ''));

          setTimeout(() => {
            this.showModalTimer(() => this.popUp.close());
          }, 1500);

          const id = setInterval(() => {
            if (this.popUp.closed) {
              clearInterval(id);
              reject('se cerro la venta');
              return;
            }
            this.popUp.postMessage('visa', '*');
          }, 700);

          window.addEventListener('message', (event) => {
            console.log(event);
            clearInterval(id);
            if (String(event.data) === '2223') {
              resolver(event.data);
              this.popUp.close();
            } else {
              reject('error al pagar');
            }
          }, false);

        });
    });

    return from(promesa)
      .pipe(
        switchMap(() => this.consutarPago(numeroOperacionSunat))
      );
  }

  private consutarPago(numeroOperacionSunat: any): Observable<any> {
    return this.http.get(ConstantesUris.URI_PARAMETRIA_PASARELA_VISA_RESPONSE + numeroOperacionSunat)
      .pipe(
        map((resp: any) => {
          if (Number(resp.cod) === 1) {
            throw resp;
          }
          return resp;
        }),
        retryWhen(errors => errors.pipe(
          delay(1000),
          take(5),
          o => concat(o, throwError({ status: 425, errors: [`Lo sentimos, su pago no puedo realizarce`] }))
        ))
      );
  }

}
