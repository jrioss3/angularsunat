import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { FuncionesGenerales } from '@rentas/shared/utils';

@Injectable()
export class NgbDateParsearFormato extends NgbDateParserFormatter {
    private funcionesGenerales: FuncionesGenerales = FuncionesGenerales.getInstance();

    parse(value: string): NgbDateStruct {
        if (value) {
            const dateParts = value.trim().split('/');
            if (dateParts.length === 1 && this.funcionesGenerales.isNumber(dateParts[0])) {
                return { day: this.funcionesGenerales.toInteger(dateParts[0]), month: null, year: null };
            } else if (dateParts.length === 2 && this.funcionesGenerales.isNumber(dateParts[0]) && this.funcionesGenerales.isNumber(dateParts[1])) {
                return { day: this.funcionesGenerales.toInteger(dateParts[0]), month: this.funcionesGenerales.toInteger(dateParts[1]), year: null };
            } else if (dateParts.length === 3 && this.funcionesGenerales.isNumber(dateParts[0]) && this.funcionesGenerales.isNumber(dateParts[1]) && this.funcionesGenerales.isNumber(dateParts[2])) {
                return { day: this.funcionesGenerales.toInteger(dateParts[0]), month: this.funcionesGenerales.toInteger(dateParts[1]), year: this.funcionesGenerales.toInteger(dateParts[2]) };
            }
        }
        return null;
    }

    format(date: NgbDateStruct): string {
        return date ?
            `${this.funcionesGenerales.isNumber(date.day) ? this.funcionesGenerales.padNumber(date.day) : ''}/${this.funcionesGenerales.isNumber(date.month) ? this.funcionesGenerales.padNumber(date.month) : ''}/${date.year}` :
            '';
    }
}
