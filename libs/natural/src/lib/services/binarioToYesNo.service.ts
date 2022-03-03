import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BinarioToYesNoService {

    constructor() { }

    cambiar10ToYesNo(datoBinario: any) {
        let datoString = '';
        if (datoBinario == '1') {
            datoString = 'SI';
        } else if (datoBinario == '0') {
            datoString = 'NO';
        }
        return datoString;
    }
    cambiar10ToTipoDeclaracion(datoBinario: any) {
        let datoString = '';
        if (datoBinario == '1') {
            datoString = 'Original';
        } else if (datoBinario == '2') {
            datoString = 'Sustitutoria/Rectificatoria';
        }
        return datoString;
    }

    cambiar10ToTipoDeclaracionEndPoint(datoBinario: any) {
        let datoString = '';
        if (datoBinario == '0') {
            datoString = 'Original';
        } else if (datoBinario == '1') {
            datoString = 'Sustitutoria/Rectificatoria';
        }
        return datoString;
    }
}