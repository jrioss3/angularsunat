import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CasillaErrorService } from '@path/natural/services/CasillaErrors/CasillaErrorService.service';
import { trim } from 'jquery';
import { ConstantesSeccionDeterminativa, ConstantesExcepciones, ConstantesAlquileres } from '@path/natural/utils';
import { ConstantesDocumentos } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils';
import { ConstantesCasilla514 } from '../../utils/constantesCasilla514';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  private static funcionesGenerales = FuncionesGenerales.getInstance();

  // Validaciones de tipo de Documento
  static validarNrodoc(tipDoc: string, numDoc: string, cus: string, numRucDec?: string, numDNIdec?: string, rucAutorizado?: any) {
    
    return (formGroup: FormGroup) => {
      const tipoDoc = formGroup.controls[tipDoc];
      const numeDoc = formGroup.controls[numDoc];     

      const doc = tipoDoc ? tipoDoc.value : tipDoc;
      //debugger;
      if (numeDoc.value && numeDoc.value !== '') {
        // RUC
        if (doc === ConstantesDocumentos.RUC || doc === ConstantesDocumentos.TipoDocumento('RUC')) {
          // Si es diferente de 11
          if (numeDoc?.value?.length !== 11) {
            if (cus === 'CUS02') {
              sessionStorage.setItem('SUNAT.errorPadronConyugue', '2');
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS02_EX02 });
            } else if (cus === 'CUS03') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS03_EX01 });
            } else if (cus === 'CUS04') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX01 });
            } else if (cus === 'CUS05') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS05_EX04 });
            } else if (cus === 'CUS09') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX01 });
            } else if (cus === 'CUS10') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX01 });
            } else if (cus === 'CUS12') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX01 });
            } else if (cus === 'CUS13') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS13_EX01 });
            } else if (cus === 'CUS14') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS14_EX03 });
            } else if (cus === 'CUS15') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS15_EX04 });
            } else if (cus === 'CUS16') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS16_EX01 });
            } else if (cus === 'CUS19') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            } else if (cus === 'CUS22') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS22_EX08 });
            } else if (cus === 'CUS27') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS27_EX09 });
            } else if (cus === 'CUS28') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS28_EX09 });
            } else if (cus === 'CUS30') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS30_EX01 });
            } else if (cus === 'CUS32_1' || cus === 'CUS32_2') {
              return numeDoc.setErrors({ '{excepccion01}': CasillaErrorService.Ex220 });
            }
          }

          // Si no es numerico
          if (!numeDoc.value.match(/^[0-9]*$/)) {
            if (cus === 'CUS02') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS02_EX02 });
            } else if (cus === 'CUS03') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS03_EX01 });
            } else if (cus === 'CUS04') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX01 });
            } else if (cus === 'CUS05') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS05_EX04 });
            } else if (cus === 'CUS09') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX01 });
            } else if (cus === 'CUS10') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX01 });
            } else if (cus === 'CUS12') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX01 });
            } else if (cus === 'CUS13') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS13_EX01 });
            } else if (cus === 'CUS14') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS14_EX03 });
            } else if (cus === 'CUS15') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS15_EX04 });
            } else if (cus === 'CUS16') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS16_EX01 });
            } else if (cus === 'CUS19') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            } else if (cus === 'CUS22') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS22_EX08 });
            } else if (cus === 'CUS27') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS27_EX09 });
            } else if (cus === 'CUS28') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS28_EX09 });
            } else if (cus === 'CUS30') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS30_EX01 });
            } else if (cus === 'CUS32_1' || cus === 'CUS32_2') {
              return numeDoc.setErrors({ '{excepccion01}': CasillaErrorService.Ex220 });
            }
          }

          if ((cus === 'CUS34' || cus === 'CUS32_2') && numeDoc.value.substring(0, 2) === '20') {
            const ruc20 = rucAutorizado.filter(x => x.val === numeDoc.value);
            return ruc20.length === 0 ? numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS34_EX09 }) : null;
          }

          // Solo personas Naturales
          if (cus === 'CUS02') {
            if (numeDoc.value.substring(0, 2) === '20') {
              const ruc20 = rucAutorizado.filter(x => x.val === numeDoc.value);
              return ruc20.length === 0 ? (
                numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS02_EX03 }),
                sessionStorage.setItem('SUNAT.errorPadronConyugue', '3')) :
                sessionStorage.setItem('SUNAT.errorPadronConyugue', '0');
            }
          }

          // Modulo 11
          if (!this.valruc(numeDoc.value)) {
            if (cus === 'CUS02') {
              sessionStorage.setItem('SUNAT.errorPadronConyugue', '2');
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS02_EX02 });
            } else if (cus === 'CUS03') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS03_EX02 });
            } else if (cus === 'CUS04') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX02 });
            } else if (cus === 'CUS05') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS05_EX05 });
            } else if (cus === 'CUS09') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX04 });
            } else if (cus === 'CUS10') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX04 });
            } else if (cus === 'CUS12') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX03 });
            } else if (cus === 'CUS13') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS13_EX03 });
            } else if (cus === 'CUS14') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS14_EX03 });
            } else if (cus === 'CUS15') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS15_EX03 });
            } else if (cus === 'CUS16') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS16_EX04 });
            } else if (cus === 'CUS19') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX03 });
            } else if (cus === 'CUS22') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS22_EX03 });
            } else if (cus === 'CUS27') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS27_EX03 });
            } else if (cus === 'CUS28') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS28_EX03 });
            } else if (cus === 'CUS30') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS30_EX03 });
            } else if (cus === 'CUS32_1') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS32_EX03 });
            } else if (cus === 'CUS32_2') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS32_EX03 });
            } else if (cus === 'CUS34') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS34_EX08 });
            }
          }

          if (numRucDec) {
            if (numeDoc.value === numRucDec) {
              if (cus === 'CUS04') {
                return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX12 });
              } else if (cus === 'CUS05') {
                return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS05_EX09 });
              } else if (cus === 'CUS09') {
                return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX05 });
              } else if (cus === 'CUS10') {
                return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX05 });
              } else if (cus === 'CUS12') {
                return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX04 });
              } else if (cus === 'CUS13') {
                return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS13_EX04 });
              } else if (cus === 'CUS15') {
                return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS15_EX07 });
              } else if (cus === 'CUS16') {
                return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS16_EX05 });
              } else if (cus === 'CUS19') {
                return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX04 });
              } else if (cus === 'CUS27') {
                return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS27_EX10 });
              } else if (cus === 'CUS28') {
                return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS28_EX10 });
              } else if (cus === 'CUS32') {
                return numeDoc.setErrors({ '{excepccion01}': CasillaErrorService.Ex226 });
              } else if (cus === 'CUS34') {
                return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS34_EX05 });
              } else if (cus === 'CUS32_1' || cus === 'CUS32_2') {
                return numeDoc.setErrors({ '{excepccion01}': CasillaErrorService.EX236_1 });
              }
            }
          }
        }

        // DNI
        if (doc === ConstantesDocumentos.DNI || doc === ConstantesDocumentos.TipoDocumento('DNI')) {
          // Si es diferente de 8
          if (numeDoc.value.length !== 8) {
            if (cus === 'CUS02') {
              sessionStorage.setItem('SUNAT.errorPadronConyugue', '1');
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS02_EX01 });
            } else if (cus === 'CUS03') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS03_EX01 });
            } else if (cus === 'CUS04') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX01 });
            } else if (cus === 'CUS09') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX01 });
            } else if (cus === 'CUS10') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX01 });
            } else if (cus === 'CUS16') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS16_EX01 });
            } else if (cus === 'CUS19') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            } else if (cus === 'CUS30') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS30_EX01 });
            } else if (cus === 'CUS32_2') {
              return numeDoc.setErrors({ '{excepccion01}': CasillaErrorService.Ex214 });
            } else if (cus === 'CUS34') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS34_EX01 });
            }
          }

          // Si no es numerico
          if (!numeDoc.value.match(/^[0-9]*$/)) {
            if (cus === 'CUS02') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS02_EX01 });
            } else if (cus === 'CUS03') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS03_EX01 });
            } else if (cus === 'CUS04') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX01 });
            } else if (cus === 'CUS09') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX01 });
            } else if (cus === 'CUS10') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX01 });
            } else if (cus === 'CUS16') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS16_EX01 });
            } else if (cus === 'CUS19') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            } else if (cus === 'CUS30') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS30_EX01 });
            } else if (cus === 'CUS32_2') {
              return numeDoc.setErrors({ '{excepccion01}': CasillaErrorService.Ex214 });
            } else if (cus === 'CUS34') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS34_EX01 });
            }
          }

          if (numDNIdec) {
            if (numeDoc.value === numDNIdec) {
              if (cus === 'CUS34') {
                return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS34_EX05 });
              }
            }
          }
        }

        // PASAPORTE , CE Y DOC. TRIBUTARIO PAIS ORIGEN
        if (doc === ConstantesDocumentos.PASAPORTE || doc === ConstantesDocumentos.TipoDocumento('PAS') ||
          doc === ConstantesDocumentos.CARNET_DE_EXTRANJERIA || doc === ConstantesDocumentos.TipoDocumento('CEX') ||
          doc === ConstantesDocumentos.DOC_TRIBUTARIO_PAIS_ORIGEN || doc === ConstantesDocumentos.PTP ||
          doc === ConstantesDocumentos.CARNET_IDENTIDAD ||
          doc === ConstantesDocumentos.NIT || doc === ConstantesDocumentos.TipoDocumento('NIT')) {
          // Si es mayor a 15 caracteres
          if (numeDoc.value.length > 15) {
            if (cus === 'CUS02') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS02_EX05 });
            } else if (cus === 'CUS03') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS03_EX01 });
            } else if (cus === 'CUS04') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX01 });
            } else if (cus === 'CUS09') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX01 });
            } else if (cus === 'CUS10') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX01 });
            } else if (cus === 'CUS16') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS16_EX01 });
            } else if (cus === 'CUS19') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            } else if (cus === 'CUS30') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS30_EX01 });
            } else if (cus === 'CUS34') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS34_EX01 });
            }
          }

          // Si no es alfanumerico
          if (!numeDoc.value.match(/^[0-9a-zA-Z]*$/)) {
            if (cus === 'CUS02') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS02_EX05 });
            } else if (cus === 'CUS03') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS03_EX01 });
            } else if (cus === 'CUS04') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX01 });
            } else if (cus === 'CUS09') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX01 });
            } else if (cus === 'CUS10') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX01 });
            } else if (cus === 'CUS16') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS16_EX01 });
            } else if (cus === 'CUS19') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            } else if (cus === 'CUS30') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS30_EX01 });
            } else if (cus === 'CUS34') {
              return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS34_EX05 });
            }
          }
        }

        if (doc === ConstantesDocumentos.CONSOLIDADO) {
          if (numeDoc.value.length !== 11 || !numeDoc.value.match(/^[0-9]*$/)) {
            switch (cus) {
              case 'CUS12': { return numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX01 }); }
            }
          }
        }
      } else {
        switch (cus) {
          case 'CUS12': {
            return doc !== ConstantesDocumentos.CONSOLIDADO ?
              numeDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX02 }) : null;
          }
          /*case 'CUS14': {
            return doc !== ConstantesDocumentos.SIN_RUC ?
              numeDoc.setErrors({ '{excepccion02}': ConstantesExcepciones.CUS12_EX02 }) : null;
          }*/
        }
      }
      // sessionStorage.setItem('SUNAT.errorPadronConyugue', '0');
      return null;
    };
  }

  // Modulo 11
  static valruc(valor): boolean {
    valor = trim(valor);
    if (this.funcionesGenerales.isNumber(valor)) {
      valor = String(valor);
      let suma;
      let resta;
      if (valor.length === 8) {
        suma = 0;
        for (let i = 0; i < valor.length - 1; i++) {
          const digito = valor.charAt(i) - 0;
          i === 0 ? suma += (digito * 2) : suma += (digito * (valor.length - i));
        }
        resta = suma % 11;
        if (resta === 1) {
          resta = 11;
        }
        if (resta + (valor.charAt(valor.length - 1) - 0) === 11) {
          return true;
        }
      } else if (valor.length === 11) {
        suma = 0;
        let x = 6;
        for (let i = 0; i < valor.length - 1; i++) {
          if (i === 4) {
            x = 8;
          }
          const digito = valor.charAt(i) - 0;
          x--;
          i === 0 ? suma += (digito * x) : suma += (digito * x);
        }
        resta = suma % 11;
        resta = 11 - resta;
        if (resta >= 10) {
          resta = resta - 10;
        }
        if (resta === valor.charAt(valor.length - 1) - 0) {
          return true;
        }
      }
    }
    return false;
  }


  //Validacion cuya funcionalidad es solo permitir solo caracteres
  static soloCaracteres(cus: string, param?: string) {
    return (formGroup: FormGroup) => {
      //ugger;

      const frmpar = formGroup.controls[param];

      if (frmpar.value && frmpar.value !== ''){

        if (frmpar.value.length !== 4 || !frmpar.value.match(/^[a-zA-Z]*$/)) {
          switch (cus) {
            case 'CUS27': { return frmpar.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS27_EX01 }); }
          }
        }

      }

      return null;

    };

  }

  // Validacion cuya funcionalidad es solo permitir numeros enteros o decimales
  static soloNumeros(monto: string, cus: string, decimal: string, mayores0: string, tipoComp?: string, montPerd?: string, annioEjercicio?: number) {
    return (formGroup: FormGroup) => {
      const montoValue = formGroup.controls[monto];
      const tipoCompValue = formGroup.controls[tipoComp];
      const montPerdValue = formGroup.controls[montPerd];

      const sNumero = String(montoValue.value);
      const nNumero = Number(montoValue.value);

      if (montoValue.value !== null && montoValue.value !== undefined && montoValue.value !== '') {
        // Mayores a 0
        if (mayores0 !== '') {
          if (nNumero <= 0) {
            if (cus === 'CUS03') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS03_EX04.replace('AAAA', String(annioEjercicio)) });
            } else if (cus === 'CUS05') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS05_EX08 });
            } else if (cus === 'CUS12') {
              if (nNumero < 0) {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX12 });
              }
              if (nNumero === 0) {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX13 });
              }
            } else if (cus === 'CUS13') {
              if (nNumero < 0) {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS13_EX08 });
              }
              if (nNumero === 0) {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS13_EX10 });
              }
            } else if (cus === 'CUS21') {
              if (nNumero < 0) {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS21_EX08 });
              }
              if (nNumero === 0) {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS21_EX01 });
              }
            } else if (cus === 'CUS22') {
              if (nNumero < 0) {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS22_EX07 });
              }
              if (nNumero === 0) {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS22_EX01 });
              }
            } else if (cus === 'CUS24') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS24_EX03 });
            } else if (cus === 'CUS31') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS31_EX01 });
            } else if (cus.substring(0, 5) === 'CUS32') {
              switch (cus) {
                case 'CUS32_2': return montoValue.setErrors({ '{excepccion01}': CasillaErrorService.Ex218 });
                case 'CUS32_3': return montoValue.setErrors({ '{excepccion01}': CasillaErrorService.Ex231 });
                case 'CUS32_1': return nNumero < 0 ? montoValue.setErrors({ '{excepccion01}': CasillaErrorService.CUS32Ex10 }) : null;
                default: {
                  return (tipoCompValue.value === '01' || montPerdValue.value === '02') && nNumero < 0 ?
                    null : montoValue.setErrors({ '{excepccion01}': CasillaErrorService.CUS32Ex10 });
                }
              }
            } else if (cus === 'CUS27') {
              if (nNumero < 0) {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS27_EX01 });
              }
            } else if (cus === 'CUS28') {
              if (nNumero < 0) {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS28_EX01 });
              }
            }
          }

          if (cus === 'CUS15') {
            if (nNumero < 0) {
              return montoValue.setErrors({
                '{excepccion01}': ConstantesExcepciones.CUS15_EX05
                  .replace('AAAA', String(annioEjercicio))
              });
            }
          }

          if (cus === 'CUS16') {
            if (nNumero < 1) {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS16_EX07 });
            }
          }
        } else {
          if (nNumero < 1) {
            if (cus === 'CUS04') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX04 });
            } else if (cus === 'CUS19') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            } else if (cus === 'CUS24') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS24_EX03 });
            } else if (cus === 'CUS25') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS25_EX08 });
            } else if (cus === 'CUS26') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS26_EX08 });
            } else if (cus === 'CUS27') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS27_EX11 });
            } else if (cus === 'CUS14') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS14_EX07 });
            } else if (cus === 'CUS09') {
              if (tipoComp !== '') {
                if (tipoCompValue.value !== '03' && montPerd !== '') {
                  return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX09 });
                } else if (tipoCompValue.value === '03' && montPerd === '') {
                  return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX09 });
                }
              } else {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX10 });
              }
            } else if (cus === 'CUS10') {
              if (tipoComp !== '') {
                if (tipoCompValue.value !== '03' && montPerd !== '') {
                  return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX09 });
                } else if (tipoCompValue.value === '03' && montPerd === '') {
                  return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX09 });
                }
              } else {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX10 });
              }
            }
          } else if (nNumero === 0) {
            if (cus === 'CUS24') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS24_EX03 });
            } else if (cus === 'CUS26') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS26_EX01 });
            } else if (cus === 'CUS09') {
              if (tipoComp === '') {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX10 });
              }
            }
          }
        }

        //  Numeros Decimales
        if (decimal !== '') {
          if (!sNumero.match(/^([0-9]{1,11}|[0-9]{1,11}\.{1}[0-9]{1,2})$/)) {
            if (cus === 'CUS05') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS05_EX01 });
            } else if (cus === 'CUS09') {
              if (tipoCompValue.value !== '03') {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX01 });
              } else if (tipoCompValue.value === '03' && montPerd === '') {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX01 });
              }
            } else if (cus === 'CUS10') {
              if (tipoCompValue.value !== '03') {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX01 });
              } else if (tipoCompValue.value === '03' && montPerd === '') {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX01 });
              }
            } else if (cus === 'CUS12') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX01 });
            } else if (cus === 'CUS13') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS13_EX01 });
            } else if (cus === 'CUS14') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS14_EX01 });
            } else if (cus === 'CUS15') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS15_EX01 });
            } else if (cus === 'CUS16') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS16_EX01 });
            } else if (cus === 'CUS21') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS21_EX01 });
            } else if (cus === 'CUS22') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS22_EX01 });
            } else if (cus === 'CUS24') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS24_EX01 });
            } else if (cus === 'CUS25') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS25_EX01 });
            } else if (cus === 'CUS26') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS26_EX06 });
            } else if (cus === 'CUS27') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS27_EX01 });
            } else if (cus === 'CUS28') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS28_EX01 });
            } else if (cus === 'CUS30') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS30_EX01 });
            } else if (cus.substring(0, 5) === 'CUS32') {
              return montoValue.setErrors({ '{excepccion01}': CasillaErrorService.Ex214 });
            }
          } // Numeroes Enteros
        } else {
          if (!sNumero.match(/^[0-9]{1,11}$/)) {
            if (cus === 'CUS05') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS05_EX01 });
            } else if (cus === 'CUS19') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            } else if (cus === 'CUS31') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS31_EX01 });
            } else if (cus === 'CUS09') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS09_EX01 });
            } else if (cus === 'CUS10') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS10_EX01 });
            } else if (cus === 'CUS25') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS25_EX06 });
            } else if (cus === 'CUS26') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS26_EX06 });
            } else if (cus === 'CUS12') {
              return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX09 });
            }
          }
          if (sNumero.match(/^[0-9]{1,11}$/)) {
            if (cus === 'CUS12') {
              if (Number(nNumero) === 0) {
                return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX09 });
              }
            }
          }
        }
      }
      return null;
    };
  }

  static validarRuc2(ruc1: string, ruc2: string) {
    return (formGroup: FormGroup) => {
      const rucOb1 = formGroup.controls[ruc1];
      const rucOb2 = formGroup.controls[ruc2];

      if (rucOb1.value && rucOb2.value) {
        if (rucOb2.errors && !rucOb2.errors.excepccion01) {
          return;
        }
        if (rucOb1.value === rucOb2.value) {
          return rucOb2.setErrors({ '{excepccion01}': CasillaErrorService.Ex236 });
        }

      }
      return null;
    };
  }

  static validarprecvta350(precioventa: string, costocomp: string) {
    return (formGroup: FormGroup) => {
      const precvta = formGroup.controls[precioventa];
      const costo = formGroup.controls[costocomp];

      if ((precvta.value - costo.value) < 0) {
        return (precvta.setErrors({ excepcion12: true }), costo.setErrors({ excepcion12: true }));
      } else {
        return null;
      }
    };
  }

  static total(nroPorcentaje: string, monto: string, cus?: string) {
    return (formGroup: FormGroup) => {
      const nroPorcentajeValue = formGroup.controls[nroPorcentaje];
      const montoValue = formGroup.controls[monto];

      if ((nroPorcentajeValue.value !== '') && (montoValue.value !== '')) {
        if (nroPorcentajeValue.errors && !nroPorcentajeValue.errors.excepccion01) {
          return;
        }
        const NnroPorcentaje = Number(nroPorcentajeValue.value);
        const Nmonto = Number(montoValue.value);
        if ((NnroPorcentaje - Nmonto) < 0) {
          if (cus === 'CUS09') {
            return nroPorcentajeValue.setErrors({ excepccion01: ConstantesExcepciones.CUS09_EX12 });
          } else if (cus === 'CUS32') {
            return montoValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS32_EX31 });
          }
        }
      }
      return null;
    };
  }

  // Validar OTROS EN ALQUILERES PAGADOS
  static validaOtrosAlquileresPagados(option: string, bien: string, otros: string, cus?: string) {
    return (formGroup: FormGroup) => {
      const optionValue = formGroup.controls[option];
      const bienValue = formGroup.controls[bien];
      const otrosValue = formGroup.controls[otros];

      // SI BIEN ES OTROS
      if (optionValue.value && cus === 'CUS04' &&
        ((optionValue.value === ConstantesAlquileres.COD_BIEN_INMUEBLE_DISTINTO_PREDIOS &&
          bienValue.value !== ConstantesAlquileres.COD_CONCESION_MINERA) ||
          optionValue.value === ConstantesAlquileres.COD_BIEN_MUEBLE)) {
            if (otrosValue.value === '') {
              return otrosValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX11 });
            }
      }

      if (optionValue.value !== '' && !!bienValue.value && !!otrosValue.value) {
        if (optionValue.value === ConstantesAlquileres.COD_BIEN_INMUEBLE_DISTINTO_PREDIOS) {
          if (bienValue.value === ConstantesAlquileres.COD_CONCESION_MINERA ||
              bienValue.value === ConstantesAlquileres.COD_AERONAVES ||
              bienValue.value === ConstantesAlquileres.COD_NAVES) {
            if (!otrosValue.value.match(/^[a-zA-Z0-9ñÑ]*$/)) {
              return otrosValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            }
            if (otrosValue.value.length !== 10) {
              return otrosValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            }
          } else {
            if (!otrosValue.value.match(/^[ a-zA-Z0-9ñÑ]*$/)) {
              return otrosValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            }
            if (otrosValue.value.length > 25) {
              return otrosValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            }
          }
        } else if (optionValue.value === ConstantesAlquileres.COD_BIEN_MUEBLE) {
          if (bienValue.value === ConstantesAlquileres.COD_VEHICULOS) {
            if (!otrosValue.value.match(/^[a-zA-Z0-9ñÑ]*$/)) {
              return otrosValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            }
            if (otrosValue.value.length !== 6) {
              return otrosValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            }
          } else {
            if (!otrosValue.value.match(/^[ a-zA-Z0-9ñÑ]*$/)) {
              return otrosValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            }
            if (otrosValue.value.length > 25) {
              return otrosValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX01 });
            }
          }
        }
      }
    };
  }

  static validarFechas(fecha: string, anioLimit: number, sistema?: string, cus?: string) {
    return (formGroup: FormGroup) => {
      const fechaValue = formGroup.controls[fecha];

      if (fechaValue.value !== '') {
        if (typeof fechaValue.value === 'string') {
          if (cus === 'CUS26') {
            return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS26_EX01 });
          } else if (cus === 'CUS21') {
            return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS21_EX01 });
          } else if (cus === 'CUS16') {
            return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS16_EX01 });
          } else if (cus === 'CUS34') {
            return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS34_EX05 });
          } else if (cus === 'CUS05') {
            return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS05_EX01 });
          } else if (cus === 'CUS32') {
            return fechaValue.setErrors({ excepccion01: CasillaErrorService.Ex214 });
          }
        } else {
          const Fecha = {
            day: fechaValue.value.day,
            month: fechaValue.value.month,
            year: fechaValue.value.year
          };
          const anio = String(Fecha.year);
          if (anio.length !== 4) {
            if (cus === 'CUS26') {
              return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS26_EX01 });
            } else if (cus === 'CUS16') {
              return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS16_EX01 });
            } else if (cus === 'CUS34') {
              return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS34_EX01 });
            } else if (cus === 'CUS05') {
              return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS05_EX01 });
            } else if (cus === 'CUS32') {
              return fechaValue.setErrors({ excepccion01: CasillaErrorService.Ex214 });
            }
          }
          if (anio !== String(anioLimit)) {
            if (cus === 'CUS16') {
              return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS16_EX06 });
            } else if (cus === 'CUS05') {
              return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS05_EX07 });
            } else if (cus === 'CUS32') {
              return fechaValue.setErrors({ excepccion01: CasillaErrorService.Ex217 });
            } else if ((Number(anio) > anioLimit) && cus === 'CUS34') {
              return fechaValue.setErrors({
                excepccion01: ConstantesExcepciones.CUS34_EX10
                  .replace('AAAA', String(anioLimit))
              });
            }
          }
          if (sistema === 'si') {
            const fechaSis = new Date();
            const FechaSistema = {
              day: fechaSis.getUTCDate(),
              month: fechaSis.getUTCMonth() + 1,
              year: fechaSis.getUTCFullYear()
            };
            if (Fecha.day > FechaSistema.day) {
              if (Fecha.month >= FechaSistema.month) {
                if (Fecha.year >= FechaSistema.year) {
                  if (cus === 'CUS21') {
                    return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS21_EX07 });
                  } else if (cus === 'CUS19') {
                    return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS19_EX25 });
                  } else if (cus === 'CUS26') {
                    return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS26_EX07 });
                  }
                }
              }
            }
            if (Fecha.month > FechaSistema.month) {
              if (Fecha.year >= FechaSistema.year) {
                if (cus === 'CUS21') {
                  return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS21_EX07 });
                } else if (cus === 'CUS19') {
                  return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS19_EX25 });
                } else if (cus === 'CUS26') {
                  return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS26_EX07 });
                }
              }
            }
            if (Fecha.year > FechaSistema.year) {
              if (cus === 'CUS21') {
                return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS21_EX07 });
              } else if (cus === 'CUS19') {
                return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS19_EX25 });
              } else if (cus === 'CUS26') {
                return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS26_EX07 });
              }
            }
          }
        }
      }
      return null;
    };
  }

  static validarNroCompro(nro: string, personalizado?: boolean) {
    return (formGroup: FormGroup) => {
      const nroValue = formGroup.controls[nro];

      if (nroValue.value !== '' && !personalizado && !nroValue.value.match(/^[0-9]*$/)) {
        return nroValue.setErrors({ '{excepccion01}': CasillaErrorService.Ex214 });
      }
      return null;
    };
  }

  static validarFechasEsp(fecha: string, tipo: string, anio: number) {
    return (formGroup: FormGroup) => {
      const fechaValue = formGroup.controls[fecha];
      const tipoValue = formGroup.controls[tipo];

      if (fechaValue.value) {
        if (typeof fechaValue.value === 'string') {
          return fechaValue.setErrors({ excepccion01: CasillaErrorService.Ex214 });
        } else if (tipoValue.value && tipoValue.value == ConstantesCasilla514.COD_TIPO_COMPROB_FACTURA) {
          const Fecha = {
            day: fechaValue.value.day,
            month: fechaValue.value.month,
            year: fechaValue.value.year
          };
          if (String(Fecha.year).length !== 4) {
            return fechaValue.setErrors({ excepccion01: CasillaErrorService.Ex214 });
          }
          if (Fecha.year < anio) {
            return fechaValue.setErrors({ excepccion01: CasillaErrorService.Ex217 });
          }
          if (Fecha.day > 31) {
            if (Fecha.month >= 1) {
              if (Fecha.year >= Number(anio + 1)) {
                return fechaValue.setErrors({ excepccion01: CasillaErrorService.Ex217 });
              }
            }
          }
          if (Fecha.month > 1) {
            if (Fecha.year >= Number(anio + 1)) {
              return fechaValue.setErrors({ excepccion01: CasillaErrorService.Ex217 });
            }
          }
          if (Fecha.year > Number(anio + 1)) {
            return fechaValue.setErrors({ excepccion01: CasillaErrorService.Ex217 });
          }
        }
        return null;
      }
    };
  }

  static validarMontoRenta(renta: string, monto: string) {
    return (formGroup: FormGroup) => {
      const montoValue = formGroup.controls[monto];
      const rentaValue = formGroup.controls[renta];
      if (montoValue.errors && !montoValue.errors.excepccion01) {
        return;
      }
      if (montoValue.value !== '' && rentaValue.value !== '') {
        if (montoValue) {
          const vNumero = Number(montoValue.value);
          if (rentaValue.value === '5' || rentaValue.value === '6') {
            if (String(montoValue.value).match(/^(-?[0-9]{1,11}|-?[0-9]{1,11}\.{1}[0-9]{1,2})$/)) {
              return null;
            } else {
              return montoValue.setErrors({ excepccion01: ConstantesExcepciones.CUS30_EX01 });
            }
          } else {
            if (vNumero <= 0) {
              return montoValue.setErrors({ excepccion01: ConstantesExcepciones.CUS30_EX05 });
            }
            if (!String(montoValue.value).match(/^([0-9]{1,11}|[0-9]{1,11}\.{1}[0-9]{1,2})$/)) {
              return montoValue.setErrors({ excepccion01: ConstantesExcepciones.CUS30_EX01 });
            }
          }
        }
        return null;
      }
    };
  }

  static validarFechayPeriodo(fecha: string, periodo: string) {
    return (formGroup: FormGroup) => {
      const fechaValue = formGroup.controls[fecha];
      const periodoValue = formGroup.controls[periodo];

      if (fechaValue.value !== '') {
        if (typeof fechaValue.value === 'string') {
          return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS12_EX01 });
        } else {
          const Fecha = {
            day: fechaValue.value.day,
            month: fechaValue.value.month,
            year: fechaValue.value.year
          };

          const anio = String(Fecha.year);

          if (anio.length !== 4) {
            return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS12_EX01 });
          } else if (periodoValue.value.year < fechaValue.value.year ||
            (periodoValue.value.year === fechaValue.value.year && Number(periodoValue.value.month) < Number(fechaValue.value.month))) {
            return fechaValue.setErrors({ excepccion01: ConstantesExcepciones.CUS12_EX11 });
          }
        }
      }
      return null;
    };
  }

  static validarFechasBien(fecha: string, anioLimit: number, cus?: string, bien?: string) {
    return (formGroup: FormGroup) => {
      const fechaValue = formGroup.controls[fecha];

      if (fechaValue.value !== '') {
        if (typeof fechaValue.value === 'string') {
          return fechaValue.setErrors({ excepccion01: CasillaErrorService.Ex214 });
        } else {
          const Fecha = {
            day: fechaValue.value.day,
            month: fechaValue.value.month,
            year: fechaValue.value.year
          };
          const anio = String(Fecha.year);
          if (anio.length !== 4) {
            return fechaValue.setErrors({ excepccion01: CasillaErrorService.Ex214 });
          }
          if (anio !== String(anioLimit)) {
            return fechaValue.setErrors({ excepccion01: CasillaErrorService.Ex217 });
          }
        }
      }
      return null;
    };
  }

  static validaMesAlquiler(mes: string) {
    return (formGroup: FormGroup) => {
      const mesValue = formGroup.controls[mes];
      const nMes = Number(mesValue.value);
      const sMes = String(mesValue.value);

      if (mesValue.value !== '') {
        if (nMes <= 0) {
          return mesValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX06 });
        }
        if (nMes > 12) {
          return mesValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX07 });
        }
        if (!sMes.match(/^([0-9]{1,2})$/)) {
          return mesValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX01 });
        }
      }
    };
  }

  static validarSerie(serie: string) {
    return (formGroup: FormGroup) => {
      const serieValue = formGroup.controls[serie];

      if (serieValue.value && serieValue.value !== '') {
        if (serieValue.value.length !== 4) {
          return serieValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX08 });
        }
        if (serieValue.value.startsWith('E') || serieValue.value.startsWith('e')) {
          if (Number(serieValue.value.substring(1, 4)) === 0) {
            return serieValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX08 });
          }
          if (!serieValue.value.substring(1, 3).match(/^[0-9]*$/)) {
            return serieValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX08 });
          }
        } else {
          if (serieValue.value.match(/^[0-9]*$/)) {
            if (Number(serieValue.value) === 0) {
              return serieValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX08 });
            }
            return null;
          } else {
            return serieValue.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS12_EX08 });
          }
        }
      }
    };
  }

  static validaPagoSI(numForm: string, pagoSI: string) {
    return (formGroup: FormGroup) => {
      const form = formGroup.controls[numForm];
      const pago = formGroup.controls[pagoSI];

      const nPago = Number(pago.value);
      const sPago = String(pago.value);

      if (form.value !== '' && pago.value !== '') {
        if (form.value === '0116' || form.value === '0616') {
          if (nPago < 0) {
            return pago.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS25_EX08 });
          }
          if (!sPago.match(/^([0-9]{1,11}|[0-9]{1,11}\.{1}[0-9]{1,2})$/)) {
            return pago.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS25_EX01 });
          }
        } else {
          if (nPago === 0) {
            return pago.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS25_EX01 });
          } else if (nPago < 0) {
            return pago.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS25_EX08 });
          }
          if (!sPago.match(/^([0-9]{1,11}|[0-9]{1,11}\.{1}[0-9]{1,2})$/)) {
            return pago.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS25_EX01 });
          }
        }
      }
    };
  }

  static validarMonto(
    mtoDeduccion: string, codForPago: string, bien: string, montoPersonalizado?: number, noValMonto?: boolean) {
    return (formGroup: FormGroup) => {
      const monto = formGroup.controls[mtoDeduccion];
      const formaPago = formGroup.controls[codForPago];

      if (bien === 'HOTELES') {
        switch (formaPago.value) {
          case '': {
            return Number(monto.value) >= 3500 ?
              monto.setErrors({ '{excepccion01}': CasillaErrorService.Cus32Ex7 }) :
              (noValMonto && Number(monto.value) > montoPersonalizado ?
                monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado }) : null);
          }
          case '02': {
            if (noValMonto && Number(monto.value) > montoPersonalizado) {
              return monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado });
            }
            if (Number(monto.value) >= 3500) {
              return formaPago.setErrors({ '{excepccion01}': CasillaErrorService.Cus32Ex8 });
            }
            break;
          }
          default: {
            return noValMonto && Number(monto.value) > montoPersonalizado ?
              monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado }) : null;
          }
        }
      } else if (bien === 'APORTACIONES') {
        return noValMonto && Number(monto.value) > montoPersonalizado ?
          monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado }) : null;
      } else if (bien === 'MEDICOS') {
        switch (formaPago.value) {
          case '008': {
            if (noValMonto && Number(monto.value) > montoPersonalizado) {
              return monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado });
            }
            if (Number(monto.value) >= 3500) {
              return formaPago.setErrors({ '{excepccion01}': CasillaErrorService.Cus32Ex8 });
            }
            break;
          }
          default: {
            return noValMonto && Number(monto.value) > montoPersonalizado ?
              monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado }) : null;
          }
        }
      } else if (bien === 'ALQUILERES') { //&& Number(monto.value) >= 3500
        /*if (formaPago.value === '') {
          return monto.setErrors({ '{excepccion01}': CasillaErrorService.Cus32Ex7 });
        } else if (formaPago.value === '02') {
          return monto.setErrors({ '{excepccion01}': CasillaErrorService.Cus32Ex8 });
        }*/        
        
        switch (formaPago.value) {
          case '': {
            /*if(Number(monto.value) >= 3500){
              return monto.setErrors({ '{excepccion01}': CasillaErrorService.Cus32Ex7 })
            }else{
              if((noValMonto && Number(monto.value) > montoPersonalizado)){
                return monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado })
              }
            }*/
            /*return Number(monto.value) >= 3500 ? monto.setErrors({ '{excepccion01}': CasillaErrorService.Cus32Ex7 })  : (noValMonto && Number(monto.value) > montoPersonalizado ?
                monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado }) : null);*/
            return formaPago.setErrors({ '{excepccion01}': CasillaErrorService.Ex214 });
            /*return Number(monto.value) >= 3500 ? formaPago.setErrors({ '{excepccion01}': CasillaErrorService.Cus32Ex8 })  : (noValMonto && Number(monto.value) > montoPersonalizado ?
                monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado }) : null); codigo corregido*/
          }
          case '02': {
            if (noValMonto && Number(monto.value) > montoPersonalizado) {
              return monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado });
            }
            if (Number(monto.value) >= 3500) {
              return formaPago.setErrors({ '{excepccion01}': CasillaErrorService.Cus32Ex8 });
            }
            break;
          }
          default: {
            return noValMonto && Number(monto.value) > montoPersonalizado ?
              monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado }) : null;
          }
        }

      } else if (bien === 'ARTESANIAS') {
        switch (formaPago.value) {
          case '': {
            return Number(monto.value) >= 3500 ?
              monto.setErrors({ '{excepccion01}': CasillaErrorService.Cus32Ex7 }) :
              (noValMonto && Number(monto.value) > montoPersonalizado ?
                monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado }) : null);
          }
          case '02': {
            if (noValMonto && Number(monto.value) > montoPersonalizado) {
              return monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado });
            }
            if (Number(monto.value) >= 3500) {
              return formaPago.setErrors({ '{excepccion01}': CasillaErrorService.Cus32Ex8 });
            }
            break;
          }
          default: {
            return noValMonto && Number(monto.value) > montoPersonalizado ?
              monto.setErrors({ '{excepccion01}': 'Monto no puede ser mayor a ' + montoPersonalizado }) : null;
          }
        }
      }
      return null;
    };
  }

  static validarNumSerie(tipoComp: string, serie: string) {
    return (formGroup: FormGroup) => {
      const serieValue = formGroup.controls[serie];
      const tipoCompValue = formGroup.controls[tipoComp];
      if (serieValue.value !== '') {
        if (serieValue.value.length !== 4) {
          serieValue.setErrors({ '{excepccion01}': CasillaErrorService.Ex221 });
        }
        switch (tipoCompValue.value) {
          case ConstantesSeccionDeterminativa.COD_BOLETA: {
            if (serieValue.value.toUpperCase() !== 'EB01' && !serieValue.value.toUpperCase().match(/^B[A-Z0-9]{3}$/) &&
              !serieValue.value.match(/^[0-9]*$/) || serieValue.value === '0000') {
              serieValue.setErrors({ '{excepccion01}': CasillaErrorService.Ex221 });
            }
            break;
          }
          case ConstantesSeccionDeterminativa.COD_FACTURA: {
            if (serieValue.value.toUpperCase() !== 'E001' && !serieValue.value.toUpperCase().match(/^F[A-Z0-9]{3}$/) &&
              !serieValue.value.match(/^[0-9]*$/) || serieValue.value === '0000') {
              serieValue.setErrors({ '{excepccion01}': CasillaErrorService.Ex221 });
            }
            break;
          }
        }
      }
      return null;
    };
  }

  static validarNumSerieArtesanias(tipoComp: string, serie: string) {
    return (formGroup: FormGroup) => {
      const serieValue = formGroup.controls[serie];
      const tipoCompValue = formGroup.controls[tipoComp];
      if (serieValue.value !== '') {
        if (serieValue.value.length !== 4) {
          serieValue.setErrors({ '{excepccion01}': CasillaErrorService.Ex221 });
        }
        switch (tipoCompValue.value) {
          case ConstantesSeccionDeterminativa.COD_BOLETA: {
            if (serieValue.value.toUpperCase() !== 'EB01' && !serieValue.value.toUpperCase().match(/^B[A-Z0-9]{3}$/) &&
              !serieValue.value.match(/^[0-9]*$/) || serieValue.value === '0000') {
              serieValue.setErrors({ '{excepccion01}': CasillaErrorService.Ex221 });
            }
            break;
          }
          case ConstantesSeccionDeterminativa.COD_RHE: {
            if (serieValue.value.toUpperCase() !== 'E001' && 
              !serieValue.value.match(/^[0-9]*$/) || serieValue.value === '0000') {
              serieValue.setErrors({ '{excepccion01}': CasillaErrorService.Ex221 });
            }
            break;
          }
        }
      }
      return null;
    };
  }

  static validarPorcentaje(Porcentaje: string) {
    return (formGroup: FormGroup) => {
      const porcentaje = formGroup.controls[Porcentaje];

      const nPorcentaje = Number(porcentaje.value);
      const sPorcentaje = String(porcentaje.value);

      if (porcentaje.value !== '') {
        if (!sPorcentaje.match(/^([0-9]*|[0-9]*\.{1}[0-9]{1,2})$/)) {
          return porcentaje.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS03_EX01 });
        }
        if (nPorcentaje < 0.01) {
          return porcentaje.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS03_EX07 });
        }
        if (nPorcentaje > 99.99) {
          return porcentaje.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS03_EX06 });
        }
      }
      return null;
    };
  }

  static validarNumOrden(Orden: string, cus: string) {
    return (formGroup: FormGroup) => {
      const numOrden = formGroup.controls[Orden];

      const nOrden = Number(numOrden.value);
      const sOrden = String(numOrden.value);

      if (numOrden.value !== '') {
        if (!sOrden.match(/^[0-9]*$/)) {
          if (cus === 'CUS21') {
            return numOrden.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS21_EX06 });
          } else if (cus === 'CUS25') {
            return numOrden.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS25_EX06 });
          } else if (cus === 'CUS26') {
            return numOrden.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS26_EX06 });
          } else if (cus === 'CUS28') {
            return numOrden.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS28_EX12 });
          } else if (cus === 'CUS19') {
            return numOrden.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX24 });
          }
        }
        if (nOrden === 0) {
          if (cus === 'CUS21') {
            return numOrden.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS21_EX06 });
          } else if (cus === 'CUS25') {
            return numOrden.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS25_EX06 });
          } else if (cus === 'CUS26') {
            return numOrden.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS26_EX06 });
          } else if (cus === 'CUS28') {
            return numOrden.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS28_EX12 });
          } else if (cus === 'CUS19') {
            return numOrden.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX24 });
          }
        }
      }
      return null;
    };
  }
}

