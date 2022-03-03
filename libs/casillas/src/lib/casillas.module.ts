import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextboxComponent } from './textbox/textbox.component';
import { ComboboxComponent } from './combobox/combobox.component';
import { RadiobuttonComponent } from './radiobutton/radiobutton.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@path/casillas/shared/shared.module';
import { ControlCasillasComponent } from './control-casillas/control-casillas.component';
import { MonthDatePickerComponent } from './month-date-picker/month-date-picker.component';

@NgModule({
  imports: [CommonModule, TextMaskModule, NgbModule, FormsModule, SharedModule],
  declarations: [TextboxComponent, ComboboxComponent, RadiobuttonComponent, CheckboxComponent, ControlCasillasComponent , MonthDatePickerComponent],
  exports: [TextboxComponent, ComboboxComponent, RadiobuttonComponent, CheckboxComponent, ControlCasillasComponent , MonthDatePickerComponent],
})
export class CasillasModule { }
