import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Rutas } from '@rentas/shared/constantes';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { SessionStorage } from '@rentas/shared/utils';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: SessionStorage.getRoute()
  },
  { path: Rutas.JURIDICO, loadChildren: () => import('@rentas/juridico').then(m => m.JuridicoModule) },
  { path: Rutas.NATURAL, loadChildren: () => import('@rentas/natural').then(m => m.NaturalModule) },
  { path: Rutas.CONSULTAS, loadChildren: () => import('@rentas/consultas').then(m => m.ConsultasModule) },
  { path: Rutas.BIENVENIDA, component: BienvenidaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
