import { throwError } from 'rxjs';
import { Component, forwardRef, Input, ViewChild, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, Validator } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { isNumber } from 'util';
import { PreDeclaracionModel } from '@path/natural/models';
import { SessionStorage } from '@rentas/shared/utils';

interface Idata {
    month: number | string;
    year: number | string;
}
@Component({
    // tslint:disable-next-line: component-selector
    selector: 'month-date-picker',
    templateUrl: './month-date-picker.component.html',
    styleUrls: ['./month-date-picker.component.css'],
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => MonthDatePickerComponent),
            multi: true
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MonthDatePickerComponent),
            multi: true
        },
    ]
})
export class MonthDatePickerComponent implements ControlValueAccessor, Validator, OnInit {

    data: Idata;
    dataTxt: string;
    separator: string;
    monthFirst: boolean;
    place: number;

    isyear = false;
    incr = 0;
    preDeclaracionObject: PreDeclaracionModel;
    anioSelect: number;

    monthsPer: string[] = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic', 'Anual', 'Varios'];
    monthsNormal: string[] = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    months: string[];
    @Input() disabled = false;
    @Input() mask = 'MM/AAAA';
    @Input() periodoFull = false;

    @Input() minYear = 0;
    @Input() maxYear = 5000;

    @Input() classValid: boolean;

    @ViewChild('calendarPanel') calendar: NgbDropdown;

    constructor() {
        this.separator = this.mask.replace(/m|A|M/gi, '');
        this.monthFirst = this.mask.indexOf('A') > 0;
        this.place = this.mask.indexOf(this.separator);
        this.preDeclaracionObject = SessionStorage.getPreDeclaracion();
    }

    ngOnInit(): void {
        this.months = this.periodoFull ? this.monthsPer : this.monthsNormal;
        this.classValid = this.classValid;
        this.anioSelect = this.maxYear;
    }

    validate({ value }: FormControl) {
        const isNotValid = !isNumber(value.year) && value.month === 'MM';
        return isNotValid && { invalid: true };
    }

    change(value: string) {
        value = this.separator === ' ' ? value.replace(/\.|-|\//, ' ') :
            this.separator === '/' ? value.replace(/\.|-| /, '/') :
                this.separator === '-' ? value.replace(/\.| |\//, '-') :
                    value.replace(/.| |\/ /, '-');

        const lastchar = value.substr(value.length - 1);
        if (lastchar === this.separator && value.length <= this.place) {
            if (this.monthFirst) {
                value = '0' + value;
            }
        }

        if (value.length > this.place && value.indexOf(this.separator) < 0) {
            value = value.substr(0, value.length - 1) + this.separator + lastchar;
        }

        this.dataTxt = value;
        const items = value.split(this.separator);
        if (items.length === 2) {
            const year = this.monthFirst ? items[1] : items[0];
            const month = this.monthFirst ? items[0] : items[1];
            let imonth = this.months.indexOf(month);

            if ((imonth) < 0) {
                // tslint:disable-next-line: radix
                imonth = parseInt(month);
            } else {
                imonth = imonth + 1;
            }

            // tslint:disable-next-line: radix
            let iyear = parseInt(year);

            if (iyear < 100) {
                iyear = iyear + 2000;
            }

            this.data = {
                year: iyear,
                month: imonth
            };

            this.incr = this.getIncr(this.data.year);
        }
        this.writeValue(this.data);

    }

    selectYearMonth($event, index: number) {
        if (this.isyear) {
            $event.stopPropagation();
            this.data.year = index + this.incr;
            this.dataTxt = this.formatData(this.data);
            this.isyear = false;
            this.incr = this.getIncr(this.data.year);
        } else {
            this.data.month = index + 1;
            this.setAnio();
            this.dataTxt = this.formatData(this.data);
        }
        this.onChange(this.data);
        this.calendar.close();

    }

    setAnio() {
        if (this.data.year === 'AAAA') {
            this.data.year = this.anioSelect;
        }
    }

    showYear($event: any, show: boolean) {
        $event.stopPropagation();
        this.isyear = !this.isyear;
    }

    addYear($event: any, incr: number) {
        $event.stopPropagation();
        this.data.year = this.anioSelect;
        const year = this.isyear ? Number(this.data.year) + 10 * incr : Number(this.data.year) + incr;
        this.data.year = year;
        this.incr = this.getIncr(year);
        this.anioSelect = this.data.year;
    }

    getIncr(year: number | string): number {
        if (typeof year === 'string') {
            throwError('el metodo getIncr recibe string');
        } else {
            return (year - year % 10) - 1;
        }
    }

    formatData(data: Idata): string {
        const monthTxt = data.month < 10 ? '0' + data.month : '' + data.month;
        return this.monthFirst ? monthTxt + this.separator + data.year :
            '' + data.year + this.separator + monthTxt;

    }

    onTouched = () => { };

    private onChange = (data: any) => { };

    writeValue(data: Idata): void {
        this.data = data;
        if (this.data.year !== 'AAAA') {
            this.dataTxt = this.data.month + '/' + this.data.year;
        }
        this.onChange(this.data);
    }

    registerOnChange(fn: (data: Idata) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    obtenerMinYearPermitido(): boolean {
        this.data.year = this.anioSelect;
        return this.data.year <= this.minYear;
    }

    obtenerMaxYearPermitido(): boolean {
        this.data.year = this.anioSelect;
        return this.data.year >= this.maxYear;
    }
}
