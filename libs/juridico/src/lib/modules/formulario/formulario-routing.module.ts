import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Formulario710Component } from './components/formulario710/formulario710.component';
import { SunatGuard } from '../../guard';

const routes: Routes = [
  { path: '',
    component: Formulario710Component,
    canActivate: [SunatGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormularioRoutingModule { }
