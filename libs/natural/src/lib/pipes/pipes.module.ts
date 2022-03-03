import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroPorTributosPipe } from './filtro-por-tributos.pipe';

@NgModule({
  declarations: [
    FiltroPorTributosPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FiltroPorTributosPipe
  ]
})
export class PipesModule { }
