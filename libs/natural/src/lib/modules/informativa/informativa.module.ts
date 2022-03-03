import { DirectivasModule } from '@path/natural/directivas/directivas.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CabeceraSecInformativaComponent } from './components/cabecera/cabecera.component';
import { SaMainComponent } from './components/alquileres-pagados/main/main.component';
import { SaMantenimientoComponent } from './components/alquileres-pagados/mantenimiento/mantenimiento.component';
import { SatrMainComponent } from './components/atribucion-gastos/main/main.component';
import { SatrMantenimientoComponent } from './components/atribucion-gastos/mantenimiento/mantenimiento.component';
import { ScImportarComponent } from './components/condominos/importar/importar.component';
import { ScMainComponent } from './components/condominos/main/main.component';
import { ScMantenimientoComponent } from './components/condominos/mantenimiento/mantenimiento.component';
import { C999MainComponent } from './components/otros-ingresos/cas999/main/main.component';
import { C999MantenimientoComponent } from './components/otros-ingresos/cas999/mantenimiento/mantenimiento.component';
import { SogMainComponent } from './components/otros-ingresos/main/main.component';
import { RentasExoneradasComponent } from './components/otros-ingresos/rentas-exoneradas/rentas-exoneradas.component';
import { RentasInafectasComponent } from './components/otros-ingresos/rentas-inafectas/rentas-inafectas.component';
import { TipoDeclaracionComponent } from './components/tipo-declaracion/tipo-declaracion.component';
import { CommonModule } from '@angular/common';
import { InformativaRoutingModule } from './informativa-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from '@path/natural/components/error-message/validation.service';
import { Sfec998MainComponent } from './components/otros-ingresos/cas998/main/main.component';
import { Sfec998MantenimientoComponent } from './components/otros-ingresos/cas998/mantenimiento/mantenimiento.component';
import { ReportCenterModule } from '@path/natural/report-center/report-center.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ObtenerDescripcionTipoDocumentoPipe } from './components/condominos/main/obtener-descripcion-tipo-documento.pipe';
import { ObtenerTipoBienPipe } from './components/alquileres-pagados/main/obtener-tipo-bien.pipe';
import { ObtenerTipoDocumentoPipe } from './components/alquileres-pagados/main/obtener-tipo-documento.pipe';
import { ObtenerSubBienPipe } from './components/alquileres-pagados/main/obtener-sub-bien.pipe';
import { IndicadorRentaService } from '@path/natural/services/indicador-renta.service';
import { CasillasModule } from '@rentas/casillas';
import { CabeceraModule } from '@rentas/cabecera';

@NgModule({
    declarations: [
        CabeceraSecInformativaComponent,
        SaMainComponent,
        SaMantenimientoComponent,
        SatrMainComponent,
        SatrMantenimientoComponent,
        ScImportarComponent,
        ScMainComponent,
        ScMantenimientoComponent,
        C999MainComponent,
        C999MantenimientoComponent,
        SogMainComponent,
        RentasExoneradasComponent,
        RentasInafectasComponent,
        TipoDeclaracionComponent,
        Sfec998MainComponent,
        Sfec998MantenimientoComponent,
        ObtenerDescripcionTipoDocumentoPipe,
        ObtenerTipoBienPipe,
        ObtenerTipoDocumentoPipe,
        ObtenerSubBienPipe
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        InformativaRoutingModule,
        NgbModule,
        DataTablesModule,
        NgxSpinnerModule,
        DirectivasModule,
        ReportCenterModule,
        CasillasModule,
        CabeceraModule
    ],
    exports: [
    ],
    entryComponents: [
        SaMainComponent,
        SaMantenimientoComponent,
        SatrMainComponent,
        SatrMantenimientoComponent,
        ScImportarComponent,
        ScMainComponent,
        ScMantenimientoComponent,
        C999MainComponent,
        C999MantenimientoComponent,
        SogMainComponent,
        RentasExoneradasComponent,
        RentasInafectasComponent,
        TipoDeclaracionComponent,
        Sfec998MainComponent,
        Sfec998MantenimientoComponent,
    ],
    providers: [
        ValidationService,
        IndicadorRentaService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InformativaModule { }
