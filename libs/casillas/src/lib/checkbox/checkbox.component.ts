import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GeneralCasillasUtil } from '../utils/general-casillas-util';

const CUSTOM_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};

@Component({
  selector: 'rentas-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  providers: [CUSTOM_CHECKBOX_CONTROL_VALUE_ACCESSOR]
})

export class CheckboxComponent extends GeneralCasillasUtil implements OnInit {

    public descripcion: string;
    public innerValue: any
    onChange: any = () => {};
    onTouched: any = () => {};
  
    constructor() {
      super();
    }
  
    ngOnInit(): void {
    }

    get value(): any {
      return this.innerValue;
    }
  
    set value(valor: any) {
      if (valor !== this.innerValue) {
        this.innerValue = valor;
        this.onChange(valor);
      }
    }
  
    writeValue(value: any) {  
      if (value !== this.innerValue) {
        this.innerValue = value;
      }
    }
    
    registerOnChange(fn: any) {
      this.onChange = fn;
    }
  
    registerOnTouched(fn: any) {
      this.onTouched = fn;
    }
}
