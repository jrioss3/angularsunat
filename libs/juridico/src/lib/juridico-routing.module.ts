import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Rutas } from '@rentas/shared/constantes';
import { JuridicoComponent } from './juridico.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: Rutas.FORMULRIO710 },
  {
    path: '', component: JuridicoComponent, children: [
      { path: Rutas.SEC_INFORMATIVA, loadChildren: () => import('./modules/informativa/informativa.module').then(m => m.InformativaModule) },
      { path: Rutas.SEC_DETERMINATIVA, loadChildren: () => import('./modules/determinativa/determinativa.module').then(m => m.DeterminativaModule) },
    ]
  },
  { path: Rutas.FORMULRIO710, loadChildren: () => import('./modules/formulario/formulario.module').then(m => m.FormularioModule) },
  { path: Rutas.PAGO, loadChildren: () => import('@rentas/pasarela').then(m => m.PasarelaModule) }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuridicoRoutingModule { }
