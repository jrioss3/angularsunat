import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConstantesParametros, ConstantesUris } from '@rentas/shared/constantes';
import { Formulario } from '@rentas/shared/types';
import { map } from 'rxjs/operators';
import { SessionStorage } from '@rentas/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ParametrosFormularioService {

    opcionDefecto = {
        codigo: '0',
        valor: 'Seleccionar'
    };

    opcionesEjercicio : any = [];

    constructor(private http: HttpClient) { }

    obtenerDatosFormularioInit() {
      const uri = ConstantesUris.URI_PARAMELTRIA_FORMULARIO
            .replace('{ejercicio}', ConstantesUris.GENERAL_FORMULARIO)
            .replace('{formulario}', ConstantesParametros.COD_FORMULARIO_PPJJ);
    
          return this.http.get<any>(uri).pipe(map( respuesta => {
            return respuesta.find(f => f.codFormulario === ConstantesParametros.COD_FORMULARIO_PPJJ);
          }));    
    }

    obtenerDatosFormulario(ejercicio) {
      /* return this.http.get<Formulario>(ConstantesUris.URI_BASE + ejercicio + '/'
          + ConstantesUris.GENERAL_FORMULARIO + '/' + ConstantesParametros.COD_FORMULARIO_PPJJ); */

      const uri = ConstantesUris.URI_PARAMELTRIA_FORMULARIO
        .replace('{ejercicio}', ejercicio)
        .replace('{formulario}', ConstantesParametros.COD_FORMULARIO_PPJJ);

      return this.http.get<Formulario>(uri);

  }

    obtenerListaOpciones(cabeceraFormulario: any): [] {
        const listaAnios = [];
        listaAnios.push(this.opcionDefecto);

        cabeceraFormulario.ejercicios.forEach((item) => {
          listaAnios.push({
            codigo: String(item.ejercicio),
            valor: String(item.ejercicio),
          });
        });
        this.opcionesEjercicio = listaAnios;

        return this.opcionesEjercicio;
    }

    setearSesionFormulario(data: any): void {
      SessionStorage.setFormulario(data);
    }

    getDatosCabeceraFormulario(): Observable<any>{
        const isMicro = true;
        const tipoAplicacion = 'web';
        const formulario = 'formulario';
        if (isMicro) {
          return this.http.get(ConstantesUris.URI_BASE + tipoAplicacion + '/' + formulario);
        } else {
          const datos = [
              {
                "codFormulario": "0710",
                "descripcion": "Formulario virtual 0710",
                "ejercicios": [
                  {
                    "ejercicio": 2019,
                    "esPresentacion": true,
                    "esActual": false
                  },
                  {
                    "ejercicio": 2020,
                    "esPresentacion": true,
                    "esActual": true
                  }
                ]
              },
              {
                "codFormulario": "0709",
                "descripcion": "Formulario virtual 0709",
                "ejercicios": [
                  {
                    "ejercicio": 2019,
                    "esPresentacion": true,
                    "esActual": false
                  },
                  {
                    "ejercicio": 2020,
                    "esPresentacion": true,
                    "esActual": false
                  },
                  {
                    "ejercicio": 2021,
                    "esPresentacion": true,
                    "esActual": true
                  }
                ]
              }
            ]
          return of(datos);  
        }
      }
}
