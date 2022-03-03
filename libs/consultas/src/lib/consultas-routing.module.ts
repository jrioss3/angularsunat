import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultasComponent } from './component/consultas/consultas.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ConsultasComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultasRoutingModule { }
