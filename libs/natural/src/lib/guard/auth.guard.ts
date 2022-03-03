import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ConstantesStores, Rutas } from '@rentas/shared/constantes';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem(ConstantesStores.STORE_CASILLAS) ||
          !sessionStorage.getItem(ConstantesStores.STORE_FORMULARIO) ||
          !localStorage.getItem(ConstantesStores.STORE_COMBOS) ||
          !sessionStorage.getItem('determinativa') ||
          !sessionStorage.getItem(ConstantesStores.STORE_CURRENTDATA) ||
          !sessionStorage.getItem(ConstantesStores.STORE_USERDATA) ||
          !sessionStorage.getItem(ConstantesStores.STORE_TOKEN) ||
          !sessionStorage.getItem(ConstantesStores.STORE_ERRORES) ||
          !sessionStorage.getItem('rentas') ||
          !sessionStorage.getItem(ConstantesStores.STORE_PREDECLARACION)) {
        this.router.navigate([Rutas.NATURAL]);
        reject(false);
      } else {
        resolve(true);
      }
    });
  }
}
