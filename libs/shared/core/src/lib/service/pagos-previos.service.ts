import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStorage } from '@rentas/shared/utils';
import { Observable, of } from 'rxjs';
import { Formulario, PagosPrevios } from '@rentas/shared/types';
import { ConstantesUris, ConstantesParametros } from '@rentas/shared/constantes';

@Injectable({
  providedIn: 'root'
})
export class PagosPreviosService {

  constructor(
    private http: HttpClient
  ) { }

  public getTributosPagados(): Observable<PagosPrevios[]> {

    const preDeclaracion = SessionStorage.getPreDeclaracion<any>();
    const ejercicio = preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    const formulario = SessionStorage.getFormulario<Formulario>().codFormulario;
    const numSec = preDeclaracion.declaracion.generales.cabecera.numSec.toString();
    const numRuc = preDeclaracion.numRuc;
    const uri = ConstantesUris.URI_OBTENER_PAGOS;

    return this.http
      .get<PagosPrevios[]>(`${uri}/${ejercicio}/${formulario}/${numRuc}/${numSec}`);
  }

  public verificarPagoEnProceso(): Observable<any> {
    return this.getTributosPagados();
  }

  public getPagosPrevios(): Observable<PagosPrevios[]> {
    return of(SessionStorage.getPagosPrevios());
  }

  public obtenerPagosPreviosPorTributo(lista, tributo) {
    return lista ? lista.filter(pagos => Number(pagos.codTri) === Number(tributo)) : [];
  }

  public obtenerListaFinalPagosPreviosPorTributo(listaPagosPreviosPreDeclaracion, tributo, pagosPreviosTributo) {
    const pagosPreviosPredeclaracion = this.obtenerPagosPreviosPorTributo(listaPagosPreviosPreDeclaracion, tributo);
    const listaPagosPrevios = pagosPreviosTributo
      .filter(
        this.obtenerPagosPreviosDiferentesAPreDeclaracion.bind(pagosPreviosTributo, pagosPreviosPredeclaracion)
      )
      .map((e) => ({ ...e, indSel: ConstantesParametros.COD_SELECCIONADO_PAGO_PREVIO }));

    return listaPagosPrevios.concat(pagosPreviosPredeclaracion);
  }

  private obtenerPagosPreviosDiferentesAPreDeclaracion(pagosPreviosPredeclaracion, e): any {
    return !pagosPreviosPredeclaracion.map((i) => String(i.numOrd)).includes(String(e.numOrd));
  }

  public obtenerListaPagosPrevios(lista, pagosPreviosTributo, codigo): any {
    return lista.filter((e) => e.codTri !== codigo).concat(pagosPreviosTributo);
  }

  public obtenerMontoPagosPreviosPorTributo(lista): number {
    return lista
      .filter((x) => x.indSel === ConstantesParametros.COD_SELECCIONADO_PAGO_PREVIO)
      .reduce((carry, x) => carry + Number(x.mtoPag), 0);
  }

  public obtenerPago(numOrden: string, numFormulario: string, codTributo: string): Observable<PagosPrevios> {
    const preDeclaracion = SessionStorage.getPreDeclaracion<any>();
    const ejercicio = preDeclaracion.declaracion.generales.cabecera.numEjercicio;
    const codDepen = SessionStorage.getUserData().codDepend;
    const numRuc = preDeclaracion.numRuc;
    const uri = ConstantesUris.URI_OBTENER_PAGO;

    return this.http.get<PagosPrevios>(`${uri}/${codDepen}/${numRuc}/${ejercicio}/${codTributo}/${numOrden}/${numFormulario}`);
  }
}
