import { Component, OnInit, forwardRef, Input } from '@angular/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GeneralCasillasUtil } from '../utils/general-casillas-util';
import { AbrirModalService } from '@rentas/shared/core';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextboxComponent),
  multi: true,
};

@Component({
  selector: 'rentas-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.css'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class TextboxComponent extends GeneralCasillasUtil implements OnInit {
  mask = '';
  private prefix: string;
  private suffix: string;
  public placeHolder: string;
  private innerValue: any = '';
  public rentaTipo: any;
  public existeNumeroCasilla: boolean;
  public esFormatoAlfanumerico: boolean;

  private openAsistente = true;

  @Input() 
  set negativoPositivo(value: boolean) {
      this.setInputMask(value);
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private abrirModalService: AbrirModalService) {
    super();
  }

  obtenerCantidadDecimales() {
    if (this.dataCasilla?.cantidadDecimal) {
      return this.dataCasilla.cantidadDecimal;
    } else {
      return this.cantidadDecimales;
    }
  }

  obtenerLongitudMaxima(): number {
    if (this.dataCasilla?.longMaxima) {
      return this.dataCasilla.longMaxima;
    } else {
      return this.cantidadDecimales;
    }
  }

  ngOnInit(): void {
    this.esFormatoAlfanumerico = this.tieneFormatoAlfanumerico();

    this.rentaTipo = this.dataCasilla
      ? this.dataCasilla.codTipCas
      : this.tipoRenta;

    this.formatearInput();
    this.setInputMask();
    this.setParametrosAyuda();

    if (this.sinCero === true) {
      this.placeHolder = 'S/';
    }
  }

  private formatearInput(): void {
    switch (this.tipoFormato) {
      case this.FORMATO_NUMERICO:
        this.setFormatoNumerico();
        break;

      case this.FORMATO_PORCENTAJE:
        this.setFormatoPorcentaje();
        break;

      case this.FORMATO_ALFANUMERICO:
        this.setFormatoAlfanumerico();
        break;

      default:
        if (this.dataCasilla?.codTipCas === this.CODIGO_TIPO_CASILLA_EDITABLE_TEXTO_SIN_FORMATO) {
          this.setFormatoAlfanumerico();
        } else {
          this.setFormatoMonto();
        }
        break;
    }
  }

  private setFormatoNumerico(): void {
    this.prefix = '';
    this.suffix = '';
    this.placeHolder = '0';
  }

  private setFormatoPorcentaje(): void {
    this.prefix = '';
    this.suffix = ' %';
    this.placeHolder = '0 %';
  }

  private setFormatoAlfanumerico(): void {
    this.prefix = '';
    this.suffix = '';
    this.placeHolder = 'Ingresar';
  }

  private setFormatoMonto(): void {
    if (this.dataCasilla?.indFormatoNegativo) {
      this.prefix = '(S/ ';
      this.suffix = ')';
      this.placeHolder = '(S/ 0)';
    } else {
      this.prefix = 'S/ ';
      this.suffix = '';
      this.placeHolder = 'S/ 0';
    }
  }

  private setInputMask(value? : boolean): void {
    if (!this.esFormatoAlfanumerico) {
      const isFormatoDecimal =
        this.dataCasilla?.cantidadDecimal || this.cantidadDecimales
          ? true
          : false;

      this.mask = createNumberMask({
        prefix: value !== undefined ? ( value ? '(S/ ' : 'S/ ' ) : this.prefix,
        suffix: value !== undefined ? ( value ? ')' : '') : this.suffix,
        allowDecimal: isFormatoDecimal,
        decimalSymbol: '.',
        decimalLimit: this.obtenerCantidadDecimales(),
        integerLimit: this.dataCasilla?.longMaxima || this.maxlength,
      });
    }
  }

  get value(): any {
    return this.innerValue === 0 ||
      this.innerValue !== undefined ||
      this.innerValue !== null
      ? String(this.innerValue)
      : '';
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      if (this.dataCasilla?.indFormatoNegativo) {
        this.innerValue = v
          .replace('(S/', '')
          .replace(')', '')
          .replace(/,/g, '')
          .replace(/ /g, '');
      } else {
        this.innerValue = v
          .replace('S/', '')
          .replace(/,/g, '')
          .replace(/ /g, '');
      }
      this.onTouched();
      this.onChange(this.innerValue === '' ? null : Number(this.innerValue));
    }
  }

  // Para casillas alfanumericas
  get textValue(): any {
    return this.innerValue;
  }

  set textValue(valor: any) {
    if (valor === undefined || valor === null) {
      this.innerValue = '';
      this.onTouched();
      this.onChange("");
      return;
    }

    this.innerValue = valor;
    this.onTouched();
    this.onChange(this.innerValue);
  }

  writeValue(value: any) {
    if (value !== this.innerValue) {
      if (value && !this.esFormatoAlfanumerico) {
        const valorRedondeado = this.getMontoRedondeado(Number(value));
        this.innerValue = valorRedondeado;
      } else {
        this.innerValue = value;
      }
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  // Set touched on blur
  onBlur(evento) {
    if ((evento.target.value === '' || evento.target.value === 'S/ ') && this.sinCero === false) {
      evento.target.value = this.dataCasilla?.indFormatoNegativo
        ? '(S/ 0)'
        : 'S/ 0';
    }
    this.onTouched();
  }

  public openScrollableContent(longContent): void {
    this.abrirModalService.abrirModal(longContent);
  }

  escucharEventoAsistente(evento) {
    const tipoCasilla = this.dataCasilla?.codTipCas || this.tipoFormato;

    if (tipoCasilla === this.CODIGO_TIPO_CASILLA_CALCULADA) {
      evento.target.blur();
      evento.preventDefault();
    } else if (
      tipoCasilla === this.CODIGO_TIPO_CASILLA_EDITABLE_FORMATO_NUMERICO ||
      tipoCasilla === this.FORMATO_MONTO
    ) {
      if (
        (evento.target.value === 'S/ 0' || evento.target.value === '' || evento.target.value === '(S/ 0)') &&
        (Number(this.value) !== 0 || Number(this.value) === 0)
      ) {
        evento.target.value = 'S/ ';
      }
    } else {
      if(this.openAsistente === true) {
        this.openAsistente = false;
        this.abrirAsistente.emit(evento);
      }
      setTimeout(() => this.openAsistente = true, 250);
    }
  }

  public setDisabled(): boolean {
    return this.dataCasilla ? !this.dataCasilla.indEditable : this.isDisabled;
  }

  public setParametrosAyuda(): void {
    if (this.dataCasilla?.descAyuda) {
      this.popOverLength = this.dataCasilla?.descAyuda.length;
      this.subTextoPopover = this.dataCasilla?.descAyuda.substring(
        0,
        this.popOverLimite
      );
      this.superaLimite =
        this.popOverLength >= this.popOverLimite ||
        this.dataCasilla?.imagenAyuda != null;
    }
  }

  public getMontoRedondeado(monto) {
    const potencia10 = Math.pow(10, this.obtenerCantidadDecimales());
    return Math.round(monto * potencia10) / potencia10;
  }

  public tieneFormatoAlfanumerico(): boolean {
    return this.tipoFormato === this.FORMATO_ALFANUMERICO || this.dataCasilla?.codTipCas === this.CODIGO_TIPO_CASILLA_EDITABLE_TEXTO_SIN_FORMATO ? true : false
  }
}
