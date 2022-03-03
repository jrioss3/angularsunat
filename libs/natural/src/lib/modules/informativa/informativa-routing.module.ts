import { Routes, RouterModule } from '@angular/router';
import { CabeceraSecInformativaComponent } from './components/cabecera/cabecera.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: '', component: CabeceraSecInformativaComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InformativaRoutingModule { }
