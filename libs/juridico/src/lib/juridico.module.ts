import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { JuridicoRoutingModule } from './juridico-routing.module';
import { JuridicoComponent } from './juridico.component';
import { PreDeclaracionService } from './services/preDeclaracion.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InicializadorService } from './services/inicializadorService.service';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PrincipalesSociosService } from './services/principales-socios.service';
import { RepresentasLegalesService } from './services/representantesLegalService.service';
import { CommonModule } from '@angular/common';
import { EjercicioAnteriorService } from './services/ejercicio-anterior.service';
import { CasillasModule } from '@rentas/casillas';
import { SharedCoreModule } from '@rentas/shared/core';
import { ConstantesDevolucion, ConstantesPagos, ConstantesUris } from '@rentas/shared/constantes';
import { ParametrosFormularioService } from '@rentas/shared/core';
import { PlataformaPresentacion } from '@rentas/shared/types';
import { ValidacionesService } from '@path/juridico/services/validaciones.service';
import { HabilitarCasillas2021Service } from './services/habilitar-casillas-2021.service';

@NgModule({
    declarations: [
        JuridicoComponent
    ],
    imports: [
        CommonModule,
        JuridicoRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        CasillasModule,
        SharedCoreModule
    ],
    entryComponents: [],
    exports: [
        JuridicoComponent,
    ],
    providers: [
        InicializadorService,
        PrincipalesSociosService,
        PreDeclaracionService,
        ParametrosFormularioService,
        NgbActiveModal,
        DatePipe,
        RepresentasLegalesService,
        ValidacionesService,
        EjercicioAnteriorService,
        HabilitarCasillas2021Service,
        { provide: ConstantesDevolucion.URI_DEVOLUCION, useValue: ConstantesUris.URI_LINK_DEVOLUCION_PPJJ },
        { provide: ConstantesPagos.PLATAFORMA, useValue: PlataformaPresentacion.JURIDICO }
    ],
    bootstrap: [
      JuridicoComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class JuridicoModule { }
