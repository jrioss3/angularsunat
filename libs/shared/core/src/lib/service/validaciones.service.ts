import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConstantesBienes, ConstantesDocumentos, MensajeGenerales } from '@rentas/shared/constantes';
import { FuncionesGenerales, SessionStorage } from '@rentas/shared/utils';
import { ListaParametro } from '@rentas/shared/types';

@Injectable({
    providedIn: 'root'
})
export class ValidacionService {

    static validaNrodoc(tipoDocumento: string, nroDocumento: string, cus?: string) {

        return (formGroup: FormGroup) => {
            const tipoDocumentoValue = formGroup.controls[tipoDocumento];
            const nroDocumentoValue = formGroup.controls[nroDocumento];

            if (nroDocumentoValue.errors && !nroDocumentoValue.errors.excepccion01) {
                return;
            }

            if (tipoDocumentoValue.value === ConstantesDocumentos.DNI && nroDocumentoValue.value) {
                if (!nroDocumentoValue.value.match(/^[0-9]*$/)) {
                    if (cus === 'CUS6') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS6_EX02 });
                    } else if (cus === 'CUS5') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS5_EX02 });
                    } else if (cus === 'CUS4') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS4_EX02 });
                    } else if (cus === 'CUS18') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX02 });
                    }
                }

                if (nroDocumentoValue.value.length !== 8) {
                    if (cus === 'CUS6') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS6_EX04 });
                    } else if (cus === 'CUS5') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS5_EX02 });
                    } else if (cus === 'CUS4') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS4_EX02 });
                    } else if (cus === 'CUS18') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX02 });
                    }
                }
            }

            if (tipoDocumentoValue.value === ConstantesDocumentos.RUC && nroDocumentoValue.value) {
                if (!nroDocumentoValue.value.match(/^[0-9]*$/)) {
                    if (cus === 'CUS6') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS6_EX01 });
                    } else if (cus === 'CUS5') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS5_EX01 });
                    } else if (cus === 'CUS4') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS4_EX01 });
                    } else if (cus === 'CUS18') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX01 });
                    }
                }
                if (nroDocumentoValue.value.length !== 11) {
                    if (cus === 'CUS6') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS6_EX04 });
                    } else if (cus === 'CUS5') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS5_EX01 });
                    } else if (cus === 'CUS4') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS4_EX01 });
                    } else if (cus === 'CUS18') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX01 });
                    }
                }

                if (!this.valruc(nroDocumentoValue.value)) {
                    if (cus === 'CUS4') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS4_EX01 });
                    } else if (cus === 'CUS5') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS5_EX01 });
                    } else if (cus === 'CUS6') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS6_EX01 });
                    } else if (cus === 'CUS18') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX01 });
                    }
                }
            }

            if ((tipoDocumentoValue.value === ConstantesDocumentos.PASAPORTE ||
                tipoDocumentoValue.value === ConstantesDocumentos.CARNET_DE_EXTRANJERIA ||
                tipoDocumentoValue.value === ConstantesDocumentos.PTP ||
                tipoDocumentoValue.value === ConstantesDocumentos.CARNET_IDENTIDAD ||
                tipoDocumentoValue.value === ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS_NATURAL) && nroDocumentoValue.value) {
                if (!nroDocumentoValue.value.match(/^[a-zA-Z0-9Ññ]*$/)) {
                    if (cus === 'CUS6') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS6_EX01 });
                    } else if (cus === 'CUS5') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS5_EX01 });
                    } else if (cus === 'CUS4') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS4_EX01 });
                    } else if (cus === 'CUS18') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX01 });
                    }
                }

                if (nroDocumentoValue.value.length > 15) {
                    if (cus === 'CUS6') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS6_EX04 });
                    } else if (cus === 'CUS5') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS5_EX01 });
                    } else if (cus === 'CUS4') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS4_EX01 });
                    } else if (cus === 'CUS18') {
                        return nroDocumentoValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX01 });
                    }
                }
            }
            return null;
        };
    }

    static validaNroPlaca(identBien: string, tipoBien: string, descripcionBien: string) {
        return (formGroup: FormGroup) => {
            const identBienValue = formGroup.controls[identBien];
            const tipoBienValue = formGroup.controls[tipoBien];
            const descripcionBienValue = formGroup.controls[descripcionBien];

            if (identBienValue.value === ConstantesBienes.BIEN_MUEBLE &&
                tipoBienValue.value === ConstantesBienes.VEHICULOS && descripcionBienValue.value) {
                if (!descripcionBienValue.value.match(/^[a-zA-Z0-9ñÑ]{6,7}$/)) {
                    return descripcionBienValue.setErrors({ excepccion01: MensajeGenerales.CUS6_EX04 });
                }
            } else if (identBienValue.value === ConstantesBienes.BIEN_MUEBLE &&
                tipoBienValue.value === ConstantesBienes.OTROS && descripcionBienValue.value) {
                if (!descripcionBienValue.value.match(/^[ a-zA-ZñÑ]*$/) || descripcionBienValue.value.length > 25) {
                    return descripcionBienValue.setErrors({ excepccion01: MensajeGenerales.CUS6_EX04 });
                }
            } else if ((identBienValue.value === ConstantesBienes.BIEN_INMUEBLE_DISTINTOS_DE_PREDIOS &&
                (tipoBienValue.value === ConstantesBienes.CONCESION_MINERA ||
                    tipoBienValue.value === ConstantesBienes.NAVES || tipoBienValue.value === ConstantesBienes.AERONAVES)) && descripcionBienValue.value) {
                if (!descripcionBienValue.value.match(/^[a-zA-Z0-9ñÑ]*$/) || descripcionBienValue.value.length !== 10) {
                    return descripcionBienValue.setErrors({ excepccion01: MensajeGenerales.CUS6_EX04 });
                }
            } else if (identBienValue.value === ConstantesBienes.BIEN_INMUEBLE_DISTINTOS_DE_PREDIOS &&
                tipoBienValue.value === ConstantesBienes.OTROS_INMUEBLE && descripcionBienValue.value) {
                if (!descripcionBienValue.value.match(/^[ a-zA-ZñÑ]*$/) || descripcionBienValue.value.length > 25) {
                    return descripcionBienValue.setErrors({ excepccion01: MensajeGenerales.CUS6_EX04 });
                }
            }
            return null;
        };
    }

    static validarCel(nroCel: string) {
        return (formGroup: FormGroup) => {
            const nroCelValue = formGroup.controls[nroCel];
            if (nroCelValue.errors && !nroCelValue.errors.excepccion01) {
                return;
            }
            if (nroCelValue.value !== '') {
                if (nroCelValue.value.charAt(0) !== '9') {
                    return nroCelValue.setErrors({ excepccion01: true });
                }
                if (nroCelValue.value.length !== 9) {
                    return nroCelValue.setErrors({ excepccion01: true });
                }
            }
            return null;
        };
    }

    static validarTelf(nrotelf: string) {
        return (formGroup: FormGroup) => {
            const nrotelfValue = formGroup.controls[nrotelf];

            if (nrotelfValue.errors && !nrotelfValue.errors.excepccion01) {
                return;
            }

            if (nrotelfValue.value !== '') {
                if (nrotelfValue.value.match(/^[0-9]{2,3}(\-)([0-9]*)$/)) {
                    if (nrotelfValue.value.charAt(0) !== '0') {
                        return nrotelfValue.setErrors({ excepccion01: true });
                    }
                    if (nrotelfValue.value.length !== 10) {
                        return nrotelfValue.setErrors({ excepccion01: true });
                    }
                    const telf = nrotelfValue.value.split('-')[1];
                    if (telf) {
                        if (telf.substr(0, 1) === '0' || telf.substr(0, 1) === '9') {
                            return nrotelfValue.setErrors({ excepccion01: true });
                        }
                    }

                } else if (!nrotelfValue.value.match(/^[0-9]*$/)) {
                    return nrotelfValue.setErrors({ excepccion01: true });
                } else {
                    if ((nrotelfValue.value.length === 6 || nrotelfValue.value.length === 7) &&
                        (nrotelfValue.value.substr(0, 1) === '0' || nrotelfValue.value.substr(0, 1) === '9')) {
                        return nrotelfValue.setErrors({ excepccion01: true });
                    }
                    if (nrotelfValue.value.length < 6 || nrotelfValue.value.length > 7) {
                        return nrotelfValue.setErrors({ excepccion01: true });
                    }
                }
            }
            return null;
        };
    }

    static ValidarEmail(email: string, email2: string) {
        return (formGroup: FormGroup) => {
            const emailObt = formGroup.controls[email];
            const email2Obt = formGroup.controls[email2];

            const emailValue = String(emailObt.value);
            const email2Value = String(email2Obt.value);

            if ((emailObt.errors && !emailObt.errors.excepccion01)) {
                return;
            }
            // CORREO 1
            if (emailValue !== '') {
                if (emailValue && emailValue.indexOf('@') !== -1) {
                    const [parte1, dominio] = emailValue.split('@');
                    const [dom, servidor] = dominio.split('.');

                    if (parte1.toUpperCase() === 'NO+TENGO+CORREO' ||
                        parte1.toUpperCase() === 'NO_TENGO_CORREO' ||
                        parte1.toUpperCase() === 'NO.TENGO.CORREO') {
                        return emailObt.setErrors({ '{excepccion01}': MensajeGenerales.CUS4_EX09 });
                    } else if (servidor === undefined || servidor.length < 2) {
                        return emailObt.setErrors({
                            '{excepccion01}': MensajeGenerales.CUS4_EX07_1.replace('[x]', emailValue.toUpperCase())
                        });
                    } else if (dom === undefined || dom.length <= 0) {
                        return emailObt.setErrors({
                            '{excepccion01}': MensajeGenerales.CUS4_EX07_1.replace('[x]', emailValue.toUpperCase())
                        });
                    } else if (dom.length === 1) {
                        return emailObt.setErrors({ '{excepccion01}': MensajeGenerales.CUS4_EX08 });
                    } else if (parte1.length <= 3) {
                        return emailObt.setErrors({ '{excepccion01}': MensajeGenerales.CUS4_EX08 });
                    } else if (parte1.length === 1) {
                        return emailObt.setErrors({ '{excepccion01}': MensajeGenerales.CUS4_EX08 });
                    } else if (dominio.toUpperCase() === 'HOTMAIL.COM.PE') {
                        return emailObt.setErrors({ '{excepccion01}': MensajeGenerales.CUS4_EX09 });
                    } else if (emailValue === email2Value) {
                        return emailObt.setErrors({ '{excepccion01}': MensajeGenerales.CUS4_EX11 });
                    }
                } else {
                    return emailObt.setErrors({
                        '{excepccion01}': MensajeGenerales.CUS4_EX07_1.replace('[x]', emailValue.toUpperCase())
                    });
                }
            }
            return null;
        };
    }

    static ValidarEmail2(email: string, email2: string): boolean {
        // CORREO 1
        if (email && email.indexOf('@') !== -1) {
            const [parte1, dominio] = email.split('@');
            const [dom, servidor] = dominio.split('.');

            if (servidor === undefined || servidor.length < 2) {
                return true;
            } else if (dom === undefined || dom.length <= 0) {
                return true;
            } else if (dom.length === 1) {
                return true;
            } else if (parte1.length <= 3) {
                return true;
            } else if (parte1.length === 1) {
                return true;
            } else if (parte1 === 'no+tengo+correo' || parte1 === 'no_tengo_correo' || parte1 === 'no.tengo.correo') {
                return true;
            } else if (dominio === 'hotmail.com.pe' || dominio === 'HOTMAIL.COM.PE') {
                return true;
            } else if (email === email2) {
                return true;
            }
        } else {
            return true;
        }
    }

    // MODULO 11
    public static valruc(valor): boolean {
        valor = String(valor).trim();
        if (FuncionesGenerales.getInstance().isNumber(valor)) {
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

    static validarFechas(fecha: string, anioLimit: number, sistema?: string, cus?: string) {
        return (formGroup: FormGroup) => {
            const fechaValue = formGroup.controls[fecha];

            if (fechaValue.value !== '' && fechaValue.value) {
                if (typeof fechaValue.value === 'string') {
                    if (cus === 'CUS5') {
                        return fechaValue.setErrors({ excepccion01: MensajeGenerales.CUS5_EX03 });
                    } else if (cus === 'CUS18') {
                        return fechaValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX03 });
                    }
                } else {
                    const Fecha = {
                        day: fechaValue.value.day,
                        month: fechaValue.value.month,
                        year: fechaValue.value.year
                    };
                    const anio = String(Fecha.year);
                    const anioNum = Number(Fecha.year);
                    if (anio.length !== 4) {
                        if (cus === 'CUS5') {
                            return fechaValue.setErrors({ excepccion01: MensajeGenerales.CUS5_EX03 });
                        } else if (cus === 'CUS18') {
                            return fechaValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX03 });
                        }
                    }
                    if (anioNum < 0) {
                        if (cus === 'CUS5') {
                            return fechaValue.setErrors({ excepccion01: MensajeGenerales.CUS5_EX03 });
                        } else if (cus === 'CUS18') {
                            return fechaValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX03 });
                        }
                    }
                    if (cus === 'CUS5' && Fecha.year > anioLimit) {
                        return fechaValue.setErrors({ excepccion01: MensajeGenerales.CUS5_EX05 });
                    }
                    if (cus === 'CUS18' && Fecha.year < anioLimit) {
                        return fechaValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX03.replace('AAAA', String(anioLimit)) });
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
                                    return fechaValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX05 });
                                }
                            }
                        }
                        if (Fecha.month > FechaSistema.month) {
                            if (Fecha.year >= FechaSistema.year) {
                                return fechaValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX05 });
                            }
                        }
                        if (Fecha.year > FechaSistema.year) {
                            return fechaValue.setErrors({ excepccion01: MensajeGenerales.CUS18_EX05 });
                        }
                    }
                }
            }
            return null;
        };
    }

    static validarNombre(nombre: string, cus: string) {
        return (formGroup: FormGroup) => {
            const nombreValue = formGroup.controls[nombre];

            if (nombreValue.errors && !nombreValue.errors.excepccion01) {
                return;
            }
            if (nombreValue.value !== '' && nombreValue.value && nombreValue.enabled) {
                if (nombreValue.value.trim().length > 40) {
                    if (cus === 'CUS5') {
                        return nombreValue.setErrors({ excepccion01: MensajeGenerales.CUS5_EX03 });
                    } else if (cus === 'CUS6') {
                        return nombreValue.setErrors({ excepccion01: MensajeGenerales.CUS6_EX04 });
                    }
                }
                if (!nombreValue.value.match(/^[ a-zA-Z0-9ñÑ]*$/)) {
                    if (cus === 'CUS5') {
                        return nombreValue.setErrors({ excepccion01: MensajeGenerales.CUS5_EX03 });
                    } else if (cus === 'CUS6') {
                        return nombreValue.setErrors({ excepccion01: MensajeGenerales.CUS6_EX04 });
                    }
                }
            }
            return null;
        };
    }

    static validarNumeroValor(numero: string, listaValores: ListaParametro[], listaPrimerosDigitos: ListaParametro[]) {
        return (formGroup: FormGroup) => {
            const numeroValue = formGroup.controls[numero];

            if (numeroValue.errors && !numeroValue.errors.excepccion01) {
                return;
            }

            if (numeroValue.value) {
                const valor = (String(numeroValue.value).replace(/^0+/gm, ''));
                const vNumero = Number(valor);
                if (FuncionesGenerales.getInstance().isNumber(vNumero)) {
                    const existen3PrimerosDigitos = listaPrimerosDigitos.some(x => x.val === numeroValue.value.substring(0, 3));
                    const existen3SegundosDigitos = listaValores.some(x => x.val === numeroValue.value.substring(3, 6))
                    if (!existen3PrimerosDigitos) {
                        return numeroValue.setErrors({ excepccion01: MensajeGenerales.CUS23_EX04 });
                    }
                    if (!existen3SegundosDigitos) {
                        return numeroValue.setErrors({ excepccion01: MensajeGenerales.CUS23_EX04 });
                    }
                    if (numeroValue.value.length < 12 || numeroValue.value.length > 17) {
                        return numeroValue.setErrors({ excepccion01: MensajeGenerales.CUS23_EX04 });
                    }
                } else {
                    return numeroValue.setErrors({ excepccion01: MensajeGenerales.CUS23_EX04 });
                }
            }
        }
    }

    static validarDeclaracionJurada(formDecJurada: string, obligatorios: boolean) {
        return (formGroup: FormGroup) => {
            const formDecJuradaValue = formGroup.controls[formDecJurada];

            if (!formDecJuradaValue.value && obligatorios && formDecJuradaValue.enabled) {
                return formDecJuradaValue.setErrors({ required: true });
            }

            if (formDecJuradaValue.value) {
                if (formDecJuradaValue.value.trim().length < 4) {
                    return formDecJuradaValue.setErrors({ excepccion01: MensajeGenerales.CUS23_EX09 });
                }
                if (!formDecJuradaValue.value.match(/^[0-9]*$/)) {
                    return formDecJuradaValue.setErrors({ excepccion01: MensajeGenerales.CUS23_EX09 });
                }
                const existeTributo = SessionStorage.getParametros().formularios.some(x => Object(x).codParametro === formDecJuradaValue.value);
                if (!existeTributo) {
                    return formDecJuradaValue.setErrors({ excepccion01: MensajeGenerales.CUS23_EX09 });
                }
            }
            return null;
        }
    }

    static validarNumOrdenDecJurada(numOrdDecJurada: string, obligatorios: boolean) {
        return (formGroup: FormGroup) => {
            const numOrdDecJuradaValue = formGroup.controls[numOrdDecJurada];

            if (!numOrdDecJuradaValue.value && obligatorios && numOrdDecJuradaValue.enabled) {
                return numOrdDecJuradaValue.setErrors({ required: true });
            }

            if (numOrdDecJuradaValue.value && !numOrdDecJuradaValue.value.match(/^[0-9]*$/)) {
                return numOrdDecJuradaValue.setErrors({ excepccion01: MensajeGenerales.CUS23_EX10 });
            }
            return null;
        }
    }

    static validarNumResCom(numResCom: string, obligatorios: boolean, listaValores: ListaParametro[], listaPrimerosDigitos: ListaParametro[]) {
        return (formGroup: FormGroup) => {
            const numResComValue = formGroup.controls[numResCom];

            if (numResComValue.errors && !numResComValue.errors.excepccion01) {
                return;
            }

            if (!numResComValue.value && obligatorios) {
                return numResComValue.setErrors({ required: true });
            }

            if (numResComValue.value) {
                const valor = (String(numResComValue.value).replace(/^0+/gm, ''));
                const vNumero = Number(valor);
                if (FuncionesGenerales.getInstance().isNumber(vNumero)) {
                    const existen3PrimerosDigitos = listaPrimerosDigitos.some(x => x.val === numResComValue.value.substring(0, 3));
                    const existen3SegundosDigitos = listaValores.some(x => x.val === numResComValue.value.substring(3, 6))
                    if (!existen3PrimerosDigitos) {
                        return numResComValue.setErrors({ excepccion01: MensajeGenerales.CUS23_EX11 });
                    }
                    if (!existen3SegundosDigitos) {
                        return numResComValue.setErrors({ excepccion01: MensajeGenerales.CUS23_EX11 });
                    }
                    if (numResComValue.value.length < 12 || numResComValue.value.length > 17) {
                        return numResComValue.setErrors({ excepccion01: MensajeGenerales.CUS23_EX11 });
                    }
                } else {
                    return numResComValue.setErrors({ excepccion01: MensajeGenerales.CUS23_EX11 });
                }
            }
            return null;
        }
    }

    static validarCodTributo(codTributo: string) {
        return (formGroup: FormGroup) => {
            const tributo = formGroup.controls[codTributo];

            if (tributo.errors && !tributo.errors.excepccion01) {
                return;
            }
            if (tributo.value) {
                if (tributo.value.trim().length < 4) {
                    return tributo.setErrors({ excepccion01: MensajeGenerales.CUS23_EX05 });
                }
                if (!tributo.value.match(/^[0-9]*$/)) {
                    return tributo.setErrors({ excepccion01: MensajeGenerales.CUS23_EX05 });
                }
                const existeTributo = SessionStorage.getParametros().tributos.some(x => Object(x).codParametro === FuncionesGenerales.getInstance().formatearTributo(tributo.value));
                if (!existeTributo) {
                    return tributo.setErrors({ excepccion01: MensajeGenerales.CUS23_EX05 });
                }
            }
            return null;
        };
    }

    static validarPeriodo(periodo: string) {
        return (formGroup: FormGroup) => {
            const periodoValue = formGroup.controls[periodo];

            const periodoActual = new Date().getFullYear() + '' + (new Date().getMonth() + 1);
            const periodoSeleccionado = periodoValue.value.year + '' + periodoValue.value.month;

            if (Number(periodoSeleccionado) > Number(periodoActual) && (periodoValue.value.month !== 14 && periodoValue.value.month !== 13)) {
                return periodoValue.setErrors({ errorPeriodo: true });
            }
            return null;
        }
    }
}
