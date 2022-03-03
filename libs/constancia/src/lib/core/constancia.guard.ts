import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Rutas } from '@rentas/shared/constantes';

@Injectable()
export class ConstanciaGuard implements CanDeactivate<any> {
  
  constructor(private router: Router) { }
  

  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot)
    : boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

      if ( !!nextState && this.contiene(nextState.url, Rutas.SEC_DETERMINATIVA)) {
        return this.router.navigate(['/']);
      }
      return true;
  }

  private contiene(url: string, palabra: string): boolean {
    return new RegExp(`^.*${palabra}.*`).test(url);
  }
  
}
