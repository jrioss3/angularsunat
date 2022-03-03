import { CabeceraSecDeterminativaComponent } from './components/cabecera/cabecera.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
// import { AuthGuard } from '../../guard';

const routes: Routes = [
    { path: '', component: CabeceraSecDeterminativaComponent, /* canActivate: [AuthGuard] */ },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeterminativaRoutingModule { }
