import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Casilla } from '@rentas/shared/types';
import  {CasillasUtil} from '@rentas/shared/utils';

@Component({
     template: '',
})

export abstract class GeneralCasillasUtil extends CasillasUtil{

     public subTextoPopover: string;
     public popOverLimite = 100;
     public popOverLength: number;
     public superaLimite = false;

     // Texbox
     @Input() dataCasilla: Casilla;
     @Input() soloLectura = false;
     @Input() cantidadDecimales = 0;
     @Output() abrirAsistente: EventEmitter<boolean> = new EventEmitter();
     @Input() tipoFormato: string;
     @Input() sinCero = false;
     @Input() maxlength = 0
     @Input() minlength = 0
     @Input() isMontoNegativo: boolean;
     @Input() tipoRenta = this.CODIGO_TIPO_CASILLA_EDITABLE_FORMATO_NUMERICO;
     @Input() numCas: number;

     // RadioButton
     @Input() valorSeleccionado: any;
     @Output()selectedOptionChange: EventEmitter<any> = new EventEmitter<any>();
     @Input() name: any;

     // General
     @Input() isDisabled = false;
     @Input() isInvalid = false;

     //checkbox
     @Input() isChecked = false;
     @Input() idCheck: string;
     @Input() desCasilla: string;
}