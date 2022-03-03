import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutoGuardadoService {

  private onDestroyAutoguardado: Subject<boolean> = new Subject<boolean>();

  constructor() { }


  public getOnDestroyAutoguardado(): Subject<boolean> {
    if (this.onDestroyAutoguardado.isStopped) {
      return this.onDestroyAutoguardado = new Subject<boolean>();
    }
    return this.onDestroyAutoguardado;
  }

  public detenerAutoGuardado(): void {
    if (!this.onDestroyAutoguardado.isStopped) {
      this.onDestroyAutoguardado.next(true);
      this.onDestroyAutoguardado.unsubscribe();
    }
  }
}
