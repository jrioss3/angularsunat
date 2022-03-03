import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersonaJuridica, PersonaNatural,PersonaArtesano } from '@rentas/shared/types';
import { ConstantesUris } from '@rentas/shared/constantes';

@Injectable({
    providedIn: 'root'
})
export class ConsultaPersona {

    constructor(private http: HttpClient) { }

    obtenerContribuyente(numRuc) {
        return this.http.get<PersonaJuridica>(ConstantesUris.URI_CONSULTA_CONTRIBUYENTE + numRuc);
    }

    obtenerPersona(numDni) {
        return this.http.get<PersonaNatural>(ConstantesUris.URI_CONSULTA_NATURAL + numDni);
    }

    obtenerArtesano(numRuc) {
        //console.log(ConstantesUris.URI_CONSULTA_ARTESANOS);
        return this.http.get<PersonaArtesano>(ConstantesUris.URI_CONSULTA_ARTESANOS + numRuc);
    }
}
