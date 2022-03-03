import {
    NgbDateParserFormatter,
    NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { FuncionesGenerales } from '@rentas/shared/utils';

@Injectable()
export class NgbDateParsearFormato extends NgbDateParserFormatter {
    parse(value: string): NgbDateStruct {
        if (value) {
            const dateParts = value.trim().split('/');
            if (
                dateParts.length === 1 &&
                FuncionesGenerales.getInstance().isNumber(dateParts[0])
            ) {
                return {
                    day: FuncionesGenerales.getInstance().toInteger(dateParts[0]),
                    month: null,
                    year: null,
                };
            } else if (
                dateParts.length === 2 &&
                FuncionesGenerales.getInstance().isNumber(dateParts[0]) &&
                FuncionesGenerales.getInstance().isNumber(dateParts[1])
            ) {
                return {
                    day: FuncionesGenerales.getInstance().toInteger(dateParts[0]),
                    month: FuncionesGenerales.getInstance().toInteger(dateParts[1]),
                    year: null,
                };
            } else if (
                dateParts.length === 3 &&
                FuncionesGenerales.getInstance().isNumber(dateParts[0]) &&
                FuncionesGenerales.getInstance().isNumber(dateParts[1]) &&
                FuncionesGenerales.getInstance().isNumber(dateParts[2])
            ) {
                return {
                    day: FuncionesGenerales.getInstance().toInteger(dateParts[0]),
                    month: FuncionesGenerales.getInstance().toInteger(dateParts[1]),
                    year: FuncionesGenerales.getInstance().toInteger(dateParts[2]),
                };
            }
        }
        return null;
    }

    format(date: NgbDateStruct): string {
        return date
            ? `${FuncionesGenerales.getInstance().isNumber(date.day)
                ? FuncionesGenerales.getInstance().padNumber(date.day)
                : ''
            }/${FuncionesGenerales.getInstance().isNumber(date.month)
                ? FuncionesGenerales.getInstance().padNumber(date.month)
                : ''
            }/${date.year}`
            : '';
    }
}
