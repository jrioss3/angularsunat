import { DirectivasModule } from './../../directivas/directivas.module';
import { NgModule } from '@angular/core';
import { Formulario709Component } from './components/formulario709/formulario709.component';
import { CommonModule } from '@angular/common';
import { FormularioRoutingModule } from './formulario-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalRucComponent } from './components/seteoRUC/modal-ruc.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReprocesoComponent } from './components/reproceso/reproceso.component';
import { ModalReintentoComponent } from './components/modal-reintento/modal-reintento.component';
import { CasillasModule } from '@rentas/casillas';
import { CabeceraModule } from '@rentas/cabecera';

@NgModule({
    declarations: [
        Formulario709Component,
        ModalRucComponent,
        ReprocesoComponent,
        ModalReintentoComponent
    ],
    imports: [
        CommonModule,
        FormularioRoutingModule,
        NgxSpinnerModule,
        DirectivasModule,
        CabeceraModule,
        FormsModule,
        NgbModule,
        CasillasModule
    ],
    exports: [
        Formulario709Component,
        CommonModule,
        ModalRucComponent
    ],
    providers: [],
    entryComponents: [
        ModalRucComponent,
        ReprocesoComponent,
        ModalReintentoComponent
    ]
})
export class FormularioModule { }
