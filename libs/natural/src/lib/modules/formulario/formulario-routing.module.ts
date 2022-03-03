import { Formulario709Component } from './components/formulario709/formulario709.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SunatGuard } from '../../guard';

const routes: Routes = [
    { 
      path: '',
      component: Formulario709Component,
      canActivate: [SunatGuard]
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class FormularioRoutingModule { }