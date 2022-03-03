import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeterminativaRoutingModule } from './determinativa-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CabeceraSecDeterminativaComponent } from './components/cabecera/cabecera.component';
import { EstFinActivoMainComponent } from './components/activo/main/main.component';
import { EstFinActivoImportarComponent } from './components/activo/importar/importar.component';
import { EstFinPasivoMainComponent } from './components/pasivo-patrimonio/main/main.component';
import { EstFinPasivoImportarComponent } from './components/pasivo-patrimonio/importar/importar.component';
import { EstFinEstadoGananciaMainComponent } from './components/estado-ganancia/main/main.component';
import { EegImportarComponent } from './components/estado-ganancia/importar/importar.component';
import { CredContraImpRentaMainComponent } from './components/cred-contra-ir/main/main.component';
import { EegDetalleComponent } from './components/estado-ganancia/detalle/detalle.component';
import { ImpRentaMainComponent } from './components/impuesto-renta/main.component';
import { CredContraImpRentaImportarComponent } from './components/cred-contra-ir/importar/importar.component';
import { DeterminaDeudaComponent } from './components/determina-deuda/determina-deuda.component';
import { HttpClientModule } from '@angular/common/http';
import { ReportCenterModule } from '@path/juridico/report-center/report-center.module';
import { Detalle127Component } from './components/cred-contra-ir/detalle127/detalle127.component';
import { Detalle297Component } from './components/detalle297/detalle297.component';
import { Detalle297RegistroComponent } from './components/detalle297-registro/detalle297-registro.component';
import { Detalle144Component } from './components/detalle144/detalle144.component';
import { Detalle108Component } from './components/detalle108/detalle108.component';
import { Detalle108RegistroComponent } from './components/detalle108-registro/detalle108-registro.component';
import { Detalle128Component } from './components/cred-contra-ir/detalle128/detalle128.component';
import { Detalle131Component } from './components/cred-contra-ir/detalle131/detalle131.component';
import { Detalle126Component } from './components/cred-contra-ir/detalle126/detalle126.component';
import { Detalle130Component } from './components/cred-contra-ir/detalle130/detalle130.component';
import { PasarelaPagosService } from '@path/juridico/services/pasarela-pagos.service';
import { CasillasModule } from '@rentas/casillas';
import { CabeceraModule } from '@rentas/cabecera';
import { SharedIuModule } from '@rentas/shared/iu';
import { FormatoListaDeudaPipe } from './components/detalle297/formato-lista-deuda.pipe';
import { Detalle144RegistroComponent } from './components/detalle144-registro/detalle144-registro.component';
import { ValidarCasilla297Service } from '@path/juridico/services/validar-casilla297.service';
import { Detalle108RegistroFormService } from './components/detalle108-registro/detalle108-registro-form.service';

@NgModule({
    declarations: [
        CabeceraSecDeterminativaComponent,
        EstFinActivoMainComponent,
        EstFinActivoImportarComponent,
        EstFinPasivoMainComponent,
        EstFinPasivoImportarComponent,
        EstFinEstadoGananciaMainComponent,
        EegImportarComponent,
        CredContraImpRentaMainComponent,
        EegDetalleComponent,
        ImpRentaMainComponent,
        CredContraImpRentaImportarComponent,
        DeterminaDeudaComponent,
        Detalle127Component,
        Detalle297Component,
        Detalle297RegistroComponent,
        Detalle144Component,
        Detalle108Component,
        Detalle108RegistroComponent,
        Detalle128Component,
        Detalle131Component,
        Detalle126Component,
        Detalle130Component,
        FormatoListaDeudaPipe,
        Detalle144RegistroComponent
    ],
    imports: [
        CommonModule,
        DeterminativaRoutingModule,
        NgbModule,
        DataTablesModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ReportCenterModule,
        NgxSpinnerModule,
        CasillasModule,
        CabeceraModule,
        SharedIuModule
    ],
    exports: [
        CommonModule,
        CabeceraSecDeterminativaComponent,
        EstFinActivoMainComponent,
        EstFinActivoImportarComponent,
        EstFinPasivoMainComponent,
        EstFinPasivoImportarComponent,
        EstFinEstadoGananciaMainComponent,
        EegImportarComponent,
        CredContraImpRentaMainComponent,
        EegDetalleComponent,
        ImpRentaMainComponent,
        CredContraImpRentaImportarComponent,
        DeterminaDeudaComponent
    ],
    entryComponents: [
        EegImportarComponent,
        EegDetalleComponent,
        CredContraImpRentaImportarComponent,
        EstFinPasivoImportarComponent,
        EstFinActivoImportarComponent,
        Detalle127Component,
        Detalle297Component,
        Detalle297RegistroComponent,
        Detalle144Component,
        Detalle144RegistroComponent,
        Detalle108Component,
        Detalle108RegistroComponent,
        Detalle128Component,
        Detalle131Component,
        Detalle126Component,
        Detalle130Component
    ],
    providers: [
        PasarelaPagosService,
        ValidarCasilla297Service
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DeterminativaModule { }
