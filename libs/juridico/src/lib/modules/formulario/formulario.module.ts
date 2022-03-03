import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioRoutingModule } from './formulario-routing.module';
import { Formulario710Component } from './components/formulario710/formulario710.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalRucComponent } from './components/seteoRUC/modal-ruc.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ModalReintentoComponent } from './components/modal-reintento/modal-reintento.component';
import { CabeceraModule } from '@rentas/cabecera';

@NgModule({
    declarations: [
        Formulario710Component,
        ModalRucComponent,
        ModalReintentoComponent
    ],
    imports: [
        CommonModule,
        FormularioRoutingModule,
        NgxSpinnerModule,
        CabeceraModule,
        FormsModule,
        NgbModule,
    ],
    exports: [],
    entryComponents: [
        ModalRucComponent,
        ModalReintentoComponent
    ]
})
export class FormularioModule { }
