import { NumberDirective } from './only_number.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NumberDirective],
  imports: [
    CommonModule
  ],
  exports:[
    NumberDirective
  ]
})
export class DirectivasModule { }
