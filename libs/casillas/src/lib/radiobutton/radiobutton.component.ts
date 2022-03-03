import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { GeneralCasillasUtil } from '../utils/general-casillas-util';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const CUSTOM_RADIOBUTTON_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadiobuttonComponent),
  multi: true,
};

@Component({
  selector: 'rentas-radiobutton',
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.component.css'],
  providers: [CUSTOM_RADIOBUTTON_CONTROL_VALUE_ACCESSOR],
})
export class RadiobuttonComponent extends GeneralCasillasUtil
  implements OnInit {
  public listaOpciones: any;
  public opcionSeleccionado: any;

  @Input() lista: Array<any>;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.valorSeleccionado = String(this.valorSeleccionado);
  }

  writeValue(value: any) {
    this.onChange(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  changeValue(value: any): void {
    setTimeout(() => {
      this.selectedOptionChange.emit(value);
      this.onTouched();
      this.onChange(value);
    }, 100);
  }

  public setDisabled(): boolean {
    return this.dataCasilla ? !this.dataCasilla.indEditable : this.isDisabled;
  }
}
