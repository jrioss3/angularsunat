import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DispositivoUtil, SessionStorage } from '@rentas/shared/utils';
import { Parametro15 } from '@rentas/shared/types';
import { ConstantesCombos } from '@rentas/shared/constantes';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {

  constructor(private http: HttpClient) { }

  public getIp(): Observable<string> {
    return of(SessionStorage.getDIreccionIP());
  }

  public getNavegador(): string {
    return DispositivoUtil.getNavegador();
  }

  public generateUuid(): string {
    return DispositivoUtil.generateUuid();
  }

  public getSO(): string {
    return DispositivoUtil.getSO();
  }

  public getMensaje(listaParametro: Array<{ val: string; desc: string }>): string {
    const mensaje = `La versión de su navegador no es compatible. Actualice su navegador o utilice los siguientes navegadores: \n`;
    const navegadores = listaParametro.reduce((carry, e) => {
      if (carry.trim().length === 0) {
        return carry + `${e.desc}: ${e.val}+`;
      }
      return carry + `, ${e.desc}: ${e.val}+`;
    }, '');
    return `${mensaje} ${navegadores}`;
  }

  public verificar(parametros: Array<any>): { isCumple: boolean; mensaje: string } {
    const paran15 = this.getParametro(parametros);
    // nuestro navegador utilizado
    const { navegador, version } = this.getNavegadorVersion();
    console.log(navegador);
    console.log(version);
    // valor de la parametria
    const nimVersion = paran15.listaParametro.find(
      (e) => e.desc.toUpperCase() === navegador.toUpperCase()
    );

    if (nimVersion !== null && nimVersion !== undefined ) {
      return {
        isCumple: Number(version) >= Number(nimVersion.val),
        mensaje: this.getMensaje(paran15.listaParametro),
      };
    }
    return {
      isCumple: false,
      mensaje: this.getMensaje(paran15.listaParametro),
    };
  }

  public solicitarIP() {
    return this.http.get('https://api.ipify.org/?format=json')
      .pipe(
        map((resp: any) => resp.ip as string),
        catchError(_error => {
          return of("192.168.1.1");
        })
      );
  }

  private getNavegadorVersion() {
    const navegador = this.getNavegador().split(' ')[0];
    const version = this.getNavegador().split(' ')[1];
    return {navegador, version};
  }

  private getParametro(parametros: Array<any>): Parametro15 {
    const value = parametros.find(
      (e) => e.codigo === ConstantesCombos.VERSION_NAVEGADOR
    );
    if (value === null) {
      throw Error(`no se encontro el codigo
        ${ConstantesCombos.VERSION_NAVEGADOR}`);
    }
    return value;
  }

}
