import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Formulario } from '@rentas/shared/types';
import { OptionSelect } from '../models/optionSelect';
import { ConstantesPlaceHolder } from '../utils/constantesPlaceHolder';
import { HttpClient } from '@angular/common/http';
import { ConstantesUris } from '@rentas/shared/constantes';
import { ConstantesParametros } from '../utils/constantesParametros';
import { map } from 'rxjs/operators';
import { MensajeInformativo } from '../models/FormularioUtil/mensaje-informativo';

@Injectable()
export class ParametrosFormularioService{

    opcionDefecto: OptionSelect = {
        codigo: '0',
        valor: ConstantesPlaceHolder.DEFAULT_COMBO
    };

    opcionesEjercicio: OptionSelect[] = [];

    private obtenerAnios(anioInicial: number, anioFinal: number): void {
        const listaAnios = [];
        listaAnios.push(this.opcionDefecto);
        for (let i = anioInicial; i <= anioFinal; i++) {
          listaAnios.push({ codigo: String(i), valor: String(i) });
        }
        this.opcionesEjercicio = listaAnios;
    }

    constructor(private http: HttpClient) { }

    obtenerDatosFormularioInit(): Observable<Formulario> {
      /* return this.http.get<Formulario>(ConstantesUris.URI_BASE +
          ConstantesUris.GENERAL_FORMULARIO + '/' +
          ConstantesParametros.COD_FORMULARIO_PPNN); */
      const uri = ConstantesUris.URI_PARAMELTRIA_FORMULARIO
        .replace('{ejercicio}', ConstantesUris.GENERAL_FORMULARIO)
        .replace('{formulario}', ConstantesParametros.COD_FORMULARIO_PPNN);

      return this.http.get<any>(uri).pipe(map(respuesta => {
        return respuesta.find(f => f.codFormulario === ConstantesParametros.COD_FORMULARIO_PPNN);
      }));
    }

    obtenerDatosFormulario(ejercicio) {
      /* return this.http.get<Formulario>(ConstantesUris.URI_BASE + ejercicio + '/'
      + ConstantesUris.GENERAL_FORMULARIO + '/' + ConstantesParametros.COD_FORMULARIO_PPNN); */
      const uri = ConstantesUris.URI_PARAMELTRIA_FORMULARIO
        .replace('{ejercicio}', ejercicio)
        .replace('{formulario}', ConstantesParametros.COD_FORMULARIO_PPNN);

      return this.http.get<Formulario>(uri);
    }

    obtenerListaOpciones(cabeceraFormulario: any): OptionSelect[]{
      const listaAnios = [];
      listaAnios.push(this.opcionDefecto);

      cabeceraFormulario.ejercicios.forEach(item => {
        listaAnios.push({ codigo: String(item.ejercicio), valor: String(item.ejercicio) });
      });
      this.opcionesEjercicio = listaAnios;

     /*  this.obtenerAnios(2019, (Number((new Date()).getFullYear())-1)) */
      return this.opcionesEjercicio;
    }
    
    getFechaServidor(): Observable<any> {
        return this.http.get(ConstantesUris.URI_OBTENER_FECHA_SERVIDOR);
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
    getMensajeInicial(codFormulario: string): Observable<any> {
      const uri = ConstantesUris.URI_MENSAJE_INICIO_PARAMETRIA.replace("{codFormulario}",codFormulario);
      return this.http.get<MensajeInformativo>(uri);  
    }
}
