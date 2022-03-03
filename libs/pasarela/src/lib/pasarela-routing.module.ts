import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasarelaComponent } from './components/pasarela/pasarela.component';
import { Rutas } from '@rentas/shared/constantes';


const routes: Routes = [
  { path: Rutas.PASARELA, component: PasarelaComponent, /* canDeactivate: [PasarelaPagosGuard] */ },
  { 
    path: Rutas.CONSTANCIA, 
    loadChildren: () => import('@rentas/constancia').then(m => m.ConstanciaModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasarelaRoutingModule { }
