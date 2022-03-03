import { ConstantesUris } from '@rentas/shared/constantes';
import { HttpRequest } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { SessionStorage } from '@rentas/shared/utils';

export abstract class EstablecerEncabezados {
  private static whiteList = [
    ConstantesUris.URI_CONSULTA_NATURAL
  ];

  private static strategies: Array<
    (request: HttpRequest<any>) => EstablecerEncabezados
  > = [];

  protected request: HttpRequest<any> = null;

  protected constructor(request: HttpRequest<any>) {
    this.request = request;
  }

  public static checkUrlIsValid(url): boolean {
    return this.whiteList.some((e) => this.regExp(e).test(url));
  }

  private static regExp(url: string): RegExp {
    return new RegExp('^' + url + '.*$', 'i');
  }

  public static getInstance(request: HttpRequest<any>): EstablecerEncabezados {
    // tslint:disable-next-line: no-use-before-declare
    this.strategies[ConstantesUris.URI_CONSULTA_NATURAL] = (req: HttpRequest<any>) =>
      new EncriptarTipoDocumento(req);
    const url = request.url;
    const key = this.whiteList.find((e) => this.regExp(e).test(url));
    return this.strategies[key](request);
  }

  public abstract buildProperty(): HttpRequest<any>;
}

export class EncriptarTipoDocumento extends EstablecerEncabezados {
  constructor(req: HttpRequest<any>) {
    super(req);
  }

  public buildProperty(): HttpRequest<any> {
    const documento = this.request.url.split('/').pop();
    const xCustomTicket = this.getTokken();
    const encry = CryptoJS.AES.encrypt(documento, xCustomTicket).toString();
    return this.request.clone({
      setHeaders: {
        'x-requested-with': encry,
      },
    });
  }

  private getTokken(): string {
    const user = SessionStorage.getUserData();
    return user.login + '-' + user.ticket;
  }
}
