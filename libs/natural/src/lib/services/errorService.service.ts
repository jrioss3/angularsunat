import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Error } from '../models/error';
import { HttpClient } from '@angular/common/http';
import { ConstantesUris } from '../utils/constantesUris';
import { ConstantesParametros } from '../utils/constantesParametros';
import { SessionStorage } from '@rentas/shared/utils';

@Injectable()
export class ErrorService {
    constructor(private http: HttpClient) { }

    obtenerErrores(ejercicio: string) {
        return this.http.get<Error>(ConstantesUris.URI_BASE + ejercicio
            + '/' + ConstantesUris.GENERAL_FORMULARIO + '/' +
            ConstantesParametros.COD_FORMULARIO_PPNN + '/' + ConstantesUris.FORMULARIO_ERROR);
    }

    obtenerErrorPorCodigo(id: string) {
        const errores = SessionStorage.getErrores<any>();
        const error = errores.find(item => item.codigo === id);
        return error;
    }

}
