import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaErroresComponent } from './lista-errores/lista-errores.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ListaErroresComponent],
  exports: [ListaErroresComponent],
})
export class ListaErroresModule {}
