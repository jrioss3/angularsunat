import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformativaRoutingModule } from './informativa-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdentificacionComponent } from './components/identificacion/identificacion.component';
import { EmpresasConstructorasComponent } from './components/empresas-constructoras/empresas-constructoras.component';
import { InformacionGeneralComponent } from './components/informacion-general/informacion-general.component';
import { CabeceraSecInformativaComponent } from './components/cabecera/cabecera.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReportCenterModule } from '@path/juridico/report-center/report-center.module';
import { CabeceraModule } from '@rentas/cabecera';
import { CasillasModule } from '@rentas/casillas';
import { SociosComponent } from './components/socios/socios.component';
import { SociosRegistroComponent } from './components/socios-registro/socios-registro.component';
import { SociosImportarComponent } from './components/socios-importar/socios-importar.component';
import { AlquileresComponent } from './components/alquileres/alquileres.component';
import { AlquileresRegistroComponent } from './components/alquileres-registro/alquileres-registro.component';
import { TextMaskModule } from 'angular2-text-mask';
import { DonacionesComponent } from './components/donaciones/donaciones.component';
import { DonacionesRegistroComponent } from './components/donaciones-registro/donaciones-registro.component';
import { ItanComponent } from './components/itam/itan.component';

@NgModule({
    declarations: [
        IdentificacionComponent,
        SociosComponent,
        SociosRegistroComponent,
        AlquileresComponent,
        AlquileresRegistroComponent,
        DonacionesComponent,
        DonacionesRegistroComponent,
        EmpresasConstructorasComponent,
        InformacionGeneralComponent,
        SociosImportarComponent,
        CabeceraSecInformativaComponent,
        ItanComponent,
    ],
    imports: [
        CommonModule,
        InformativaRoutingModule,
        NgbModule,
        DataTablesModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        ReportCenterModule,
        CabeceraModule,
        CasillasModule,
        TextMaskModule
    ],
    exports: [
        IdentificacionComponent,
        SociosComponent,
        SociosRegistroComponent,
        AlquileresComponent,
        AlquileresRegistroComponent,
        DonacionesComponent,
        DonacionesRegistroComponent,
        EmpresasConstructorasComponent,
        InformacionGeneralComponent,
        SociosImportarComponent,
        ItanComponent
    ],
    entryComponents: [
        SociosRegistroComponent,
        AlquileresRegistroComponent,
        DonacionesRegistroComponent,
        SociosImportarComponent,
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InformativaModule { }
