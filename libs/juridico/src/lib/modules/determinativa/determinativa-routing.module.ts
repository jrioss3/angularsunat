import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CabeceraSecDeterminativaComponent } from './components/cabecera/cabecera.component';


const routes: Routes = [
  { path: '', component: CabeceraSecDeterminativaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeterminativaRoutingModule { }
