import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConstanciaComponent } from './constancia/constancia.component';
import { ConstanciaGuard } from './core/constancia.guard';

const routes: Routes = [
  {
    path: '',
    component: ConstanciaComponent,
    canDeactivate: [ConstanciaGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConstanciaRoutingModule { }
