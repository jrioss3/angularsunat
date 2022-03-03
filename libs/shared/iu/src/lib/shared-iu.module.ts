import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddParentesisPipe } from './pipes/add-parentesis/add-parentesis.pipe';
import { AgregarSignoPeriodoPipe } from './pipes/agregar-signo-periodo.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [AddParentesisPipe, AgregarSignoPeriodoPipe],
  exports:[AddParentesisPipe, AgregarSignoPeriodoPipe]
})
export class SharedIuModule {}
