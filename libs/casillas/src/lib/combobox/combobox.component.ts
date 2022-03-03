import { Component, OnInit, forwardRef, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { GeneralCasillasUtil } from '../utils/general-casillas-util';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AbrirModalService } from '@rentas/shared/core';

declare var jQuery: any;

const CUSTOM_COMBOBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ComboboxComponent),
  multi: true,
};

@Component({
  selector: 'rentas-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.css'],
  providers: [CUSTOM_COMBOBOX_CONTROL_VALUE_ACCESSOR],
})
export class ComboboxComponent extends GeneralCasillasUtil implements OnInit, AfterViewInit, ControlValueAccessor {

  @ViewChild('mySelect') el: ElementRef;
  _lista: Array<any>;
  public selectedValue = '';

  @Input() isScrolling = false;
  @Input()
  set lista(lista: Array<any>) {
    this._lista = lista;
    if (this.isScrolling && this.select) {
      this._lista = lista;
      this.select.empty();
      const optSeleccionar = jQuery('<option/>').val("").html("--Seleccionar--");
      this.select.append(optSeleccionar);

      jQuery.each(this._lista, (index, element) => {
        const optAuxiliar = jQuery('<option/>');

        optAuxiliar.val(element.val);
        optAuxiliar.text(element.desc);

        this.select.append(optAuxiliar);
      });
      this.select.selectpicker('refresh');
      this.autoSeleccionar();
    }

  }

  public SIZE_OPTION_SCROLLING = '10';
  select: any;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private abrirModalService: AbrirModalService) {
    super();
  }

  ngOnInit(): void {
    if (this.dataCasilla?.descAyuda) {
      this.popOverLength = this.dataCasilla?.descAyuda.length;
      this.subTextoPopover = this.dataCasilla?.descAyuda.substring(0, this.popOverLimite);
      this.superaLimite = this.popOverLength >= this.popOverLimite;
    }
  }

  ngAfterViewInit(): void {
    if (this.isScrolling) {
      jQuery.fn.selectpicker.Constructor.BootstrapVersion = '4';

      this.el.nativeElement.setAttribute('data-size', this.SIZE_OPTION_SCROLLING);

      this.select = jQuery(this.el.nativeElement).selectpicker();

      this.select.on('changed.bs.select', (e, clickedIndex, isSelected, previousValue) => {
        const valor = this.select.val();

        if (valor === undefined || valor === null || valor === '' || valor === 0) {
          this.onChange(null);
          return;
        }

        this.selectedValue = String(valor);
        this.onTouched();
        this.onChange(this.selectedValue);
      });
    } else {
      this.el.nativeElement.addEventListener('change', () => {
        const valor = this.el.nativeElement.value;

        if (valor === undefined || valor === null || valor === '' || valor === 0) {
          this.selectedValue = '';
          this.onChange(null);
          return;
        }

        this.selectedValue = String(valor);
        this.onTouched();
        this.onChange(this.selectedValue);
      });
    }

    this.autoSeleccionar();
  }

  public constructorBootstrapSelect(): any {
    return jQuery(this.el.nativeElement).selectpicker();
  }

  public autoSeleccionar(): void {
    if (this.isScrolling) {
      this.select.selectpicker('val', this.selectedValue);
      this.onChange(this.selectedValue);
    } else {
      this.el.nativeElement.value = this.selectedValue;
      this.onChange(this.selectedValue);
    }
  }

  public openScrollableContent(longContent): void {
    this.abrirModalService.abrirModal(longContent);
  }

  writeValue(value: any) {
    if (value === undefined || value === null || value === 0) {
      this.selectedValue = '';
      return;
    }

    this.selectedValue = String(value);

    if (this.isScrolling) {
      if (this.select) {
        this.autoSeleccionar();
      }
    } else {
      if (this.el) {
        this.autoSeleccionar();
      }
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  public setDisabled(): boolean {
    return this.dataCasilla ? !this.dataCasilla.indEditable : this.isDisabled;
  }

  public setDisabledState(disabled: boolean) {
    if (this.isScrolling && this.select) {
      this.select.prop('disabled', disabled);
      this.select.selectpicker('refresh');
    } else {
      this.isDisabled = disabled;
    }
  }

}
