import { Injectable } from '@angular/core';
import { ConstantesParametros, ConstantesUris } from '@rentas/shared/constantes';
import { SessionStorage } from '@rentas/shared/utils';
import { HttpClient } from '@angular/common/http';
import { Formulario } from '@rentas/shared/types';
import { interval, EMPTY, Observable } from 'rxjs';
import { AutoGuardadoService } from './auto-guardado.service';
import { takeUntil, switchMap } from 'rxjs/operators';
import * as sha1 from 'js-sha1';


@Injectable({
  providedIn: 'root'
})
export class PredeclaracionService {

  furmulario = SessionStorage.getFormulario<Formulario>();

  constructor(
    private http: HttpClient,
    private autoGuardadoService: AutoGuardadoService
  ) { }

  public guardar() {
    const predeclaracion = SessionStorage.getPreDeclaracion();
    return this.http.post(ConstantesUris.URI_BASE_PD + '/save', predeclaracion);
  }

  public runAutoSave() {
    const time = this.furmulario?.numSegAutograbado ?
      +this.furmulario.numSegAutograbado * 1000 : 6000

    interval(time).pipe(
      takeUntil(this.autoGuardadoService.getOnDestroyAutoguardado()),
      switchMap(tiempo => this.handlerGuardar(tiempo)),
    ).subscribe();
  }

  public reestablecerPersonalizado() {
    const pd = SessionStorage.getPreDeclaracion<any>();
    const { numFormulario, numRuc } = pd.declaracion.generales.cabecera;
    const perTri = pd.perTri;
    const paramns = 'reset?ruc=' + numRuc +
      '&periodo=' + perTri +
      '&formulario=' + numFormulario +
      '&tipodeclaracion=' + this.getTipoDeclara(numFormulario);
    return this.http.post(ConstantesUris.URI_BASE_PD + '/' + paramns, null);
  }

  public validarReestablecer() {
    const pd = SessionStorage.getPreDeclaracion<any>();
    //const perTri = pd.perTri;
    const { numFormulario, numRuc, numEjercicio } = pd.declaracion.generales.cabecera;
    const paramns = 'validarpersonalizado?ejercicio=' + numEjercicio +
      '&codFormulario=' + numFormulario +
      '&numRuc=' + numRuc +
      '&tipodeclaracion=' + this.getTipoDeclara(numFormulario);
    return this.http.get(ConstantesUris.URI_BASE_PD + '/' + paramns);
  }  

  public validarPersonalizado() : Observable<any>  {
    //debugger;
    const pd = SessionStorage.getPreDeclaracion<any>();
    //const perTri = pd.perTri;
    const { numFormulario, numRuc, numEjercicio } = pd.declaracion.generales.cabecera;
    const paramns = 'validarpersonalizado?ejercicio=' + numEjercicio +
      '&codFormulario=' + numFormulario +
      '&numRuc=' + numRuc +
      '&tipodeclaracion=' + this.getTipoDeclara(numFormulario);
    return this.http.get(ConstantesUris.URI_BASE_PD + '/' + paramns);
  }

  public validarPD() {
    const predeclaracion = SessionStorage.getPreDeclaracion<any>();
    const { numFormulario, numEjercicio } = predeclaracion.declaracion.generales.cabecera;

    if (numFormulario === ConstantesParametros.COD_FORMULARIO_PPNN)
      return this.http.post(ConstantesUris.URI_VALIDAR_PPNN + '/' + numEjercicio, predeclaracion);
    return this.http.post(ConstantesUris.URI_VALIDAR_PPJJ + '/' + numEjercicio, predeclaracion);
  }

  private handlerGuardar(tiempo: number) {
    if (this.noHuboCambios()) {
      return EMPTY;
    } else {
      console.log('Ejecutando el autoguardado...', tiempo);
      return this.guardar();
    }
  }

  private noHuboCambios(): boolean {
    const oldHash = SessionStorage.getValHash().toString();
    const newHash = sha1(JSON.stringify(SessionStorage.getPreDeclaracion())).toString();
    if(oldHash === newHash) {
      return true;
    } else {
      SessionStorage.setValHash(newHash);
      return false;
    }
    
  }

  private getTipoDeclara(codFormulario: string): string {
    if (codFormulario === ConstantesParametros.COD_FORMULARIO_PPNN) {
      return '01';
    } else {
      return '02';
    }
  }

}
