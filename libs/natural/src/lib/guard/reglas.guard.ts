import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Rutas } from '@rentas/shared/constantes';

@Injectable({
  providedIn: 'root'
})
export class ReglasGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate() {
    if (sessionStorage.getItem('determinativa') === 'true') {
      return true;
    }
    this.router.navigate([Rutas.NATURAL_INFORMATIVA]);
    return false;
  }

}
