import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guard';
import { Rutas } from '@rentas/shared/constantes';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: Rutas.FORMULRIO709,
    canActivate: [AuthGuard]
  },
  { path: Rutas.FORMULRIO709, loadChildren: () => import('./modules/formulario/formulario.module').then(m => m.FormularioModule) },
  { path: Rutas.SEC_INFORMATIVA, loadChildren:  () => import('./modules/informativa/informativa.module').then(m => m.InformativaModule) },
  { path: Rutas.SEC_DETERMINATIVA, loadChildren: () => import('./modules/determinativa/determinativa.module').then(m => m.DeterminativaModule) },
  { path: Rutas.PAGO, loadChildren: () => import('@rentas/pasarela').then(m => m.PasarelaModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NaturalRoutingModule {}
