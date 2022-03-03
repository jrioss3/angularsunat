import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SunatGuard implements CanActivate {
  canActivate(): Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      if (!!!sessionStorage.getItem('SUNAT.token') &&
          !!!sessionStorage.getItem('SUNAT.currentData') &&
          !!!sessionStorage.getItem('SUNAT.userdata')) {
        window.location.assign('http://www.sunat.gob.pe');
        reject(false);
      } else {
        resolve(true);
      }
    });
  }
}
