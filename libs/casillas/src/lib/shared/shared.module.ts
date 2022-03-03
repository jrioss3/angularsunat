import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectivaTemporalDirective } from './directiva/directiva-temporal.directive';


@NgModule({
  declarations: [DirectivaTemporalDirective],
  imports: [
    CommonModule
  ],
  exports: [DirectivaTemporalDirective]
})
export class SharedModule { }
