import { DirectivasModule } from './../../directivas/directivas.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeterminativaRoutingModule } from './determinativa-routing.module';
import { CabeceraSecDeterminativaComponent } from './components/cabecera/cabecera.component';
import { SddCas122MainComponent } from './components/determina-deuda/cas122/main/main.component';
import { Cas122MantenimientoComponent } from './components/determina-deuda/cas122/mantenimiento/mantenimiento.component';
import { C127MainComponent } from './components/determina-deuda/cas127/main/main.component';
import { C127MantenimientoComponent } from './components/determina-deuda/cas127/mantenimiento/mantenimiento.component';
import { C128MainComponent } from './components/determina-deuda/cas128/main/main.component';
import { C128MantenimientoComponent } from './components/determina-deuda/cas128/mantenimiento/mantenimiento.component';
import { Sddc130MainComponent } from './components/determina-deuda/cas130/main/main.component';
import { Sddc130MantenimientoComponent } from './components/determina-deuda/cas130/mantenimiento/mantenimiento.component';
import { Sddc131MainComponent } from './components/determina-deuda/cas131/main/main.component';
import { Sddc131MantenimientoComponent } from './components/determina-deuda/cas131/mantenimiento/mantenimiento.component';
import { SdCas358Component } from './components/determina-deuda/cas358/main/main.component';
import { SdCas358MantComponent } from './components/determina-deuda/cas358/mantenimiento/mantenimiento.component';
import { SdCas359Component } from './components/determina-deuda/cas359/main/main.component';
import { SdCas359MantComponent } from './components/determina-deuda/cas359/mantenimiento/mantenimiento.component';
import { SddMainComponent } from './components/determina-deuda/main/main.component';
import { ScCas107Component } from './components/fuente-externa/cas107/main/main.component';
import { ScCas107MantenimientoComponent } from './components/fuente-externa/cas107/mantenimiento/mantenimiento.component';
import { ScCas108Component } from './components/fuente-externa/cas108/main/main.component';
import { ScCas108MantenimientoComponent } from './components/fuente-externa/cas108/mantenimiento/mantenimiento.component';
import { SfeC111MainComponent } from './components/fuente-externa/cas111/main/main.component';
import { Cas111MantenimientoComponent } from './components/fuente-externa/cas111/mantenimiento/mantenimiento.component';
import { SfeCas116MainComponent } from './components/fuente-externa/cas116/main/main.component';
import { Cas116MantenimientoComponent } from './components/fuente-externa/cas116/mantenimiento/mantenimiento.component';
import { Sfec514MainComponent } from './components/fuente-externa/cas514/main/main.component';
import { Sfec519MainComponent } from './components/fuente-externa/cas519/main/main.component';
import { Sfec519MantenimientoComponent } from './components/fuente-externa/cas519/mantenimiento/mantenimiento.component';
import { C522MainComponent } from './components/fuente-externa/cas522/main/main.component';
import { Sfec522MantenimientoComponent } from './components/fuente-externa/cas522/mantenimiento/mantenimiento.component';
import { SfMainComponent } from './components/fuente-externa/main/main.component';
import { SdPrimeraCatComponent } from './components/primera-categoria/sd-primera-cat.component';
import { ScCas100Component } from './components/primera-categoria/cas100/main/main.component';
import { ScCas100MantenimientoComponent } from './components/primera-categoria/cas100/cabecera/mantenimiento.component';
import { ScCas100RegistroComponent } from './components/primera-categoria/cas100/detalle/registro.component';
import { ScCas100ImportarComponent } from './components/primera-categoria/cas100/importar/importar.component';
import { SscMainComponent } from './components/segunda-categoria/main/main.component';
import { C350MainComponent } from './components/segunda-categoria/cas350/main/main.component';
import { C350MantenimientoComponent } from './components/segunda-categoria/cas350/mantenimiento/mantenimiento.component';
import { C355MainComponent } from './components/segunda-categoria/cas355/main/main.component';
import { C355MantenimientoComponent } from './components/segunda-categoria/cas355/mantenimiento/mantenimiento.component';
import { C385MainComponent } from './components/segunda-categoria/cas385/main/main.component';
import { C385MantenimientoComponent } from './components/segunda-categoria/cas385/mantenimiento/mantenimiento.component';
import { ValidationService } from '@path/natural/components/error-message/validation.service';
import { PasarelaPagosService, PreDeclaracionService } from '@path/natural/services';
import { ReportCenterModule } from '@path/natural/report-center/report-center.module';
import { DatePipe } from '@angular/common';
import {
    Sfec514AlquileresMantenimientoComponent
} from './components/fuente-externa/cas514/main-alquileres/mantenimiento/mantenimiento.component';
import { Sfec514MainAlquileresComponent } from './components/fuente-externa/cas514/main-alquileres/main/main.component';
import { Sfec514MainAportacionesComponent } from './components/fuente-externa/cas514/main-aportaciones/main/main.component';
import {
    Sfec514AportacionesMantenimientoComponent
} from './components/fuente-externa/cas514/main-aportaciones/mantenimiento/mantenimiento.component';
import { Sfec514MainHotelesComponent } from './components/fuente-externa/cas514/main-hoteles/main/main.component';
import {
    Sfec514HotelesMantenimientoComponent
} from './components/fuente-externa/cas514/main-hoteles/mantenimiento/mantenimiento.component';

import { Sfec514MainArtesaniasComponent } from './components/fuente-externa/cas514/main-artesanias/main/main.component';
import {
    Sfec514ArtesaniasMantenimientoComponent
} from './components/fuente-externa/cas514/main-artesanias/mantenimiento/mantenimiento.component';

import { Sfec514MainMedicosComponent } from './components/fuente-externa/cas514/main-medicos/main/main.component';
import {
    Sfec514MedicosMantenimientoComponent
} from './components/fuente-externa/cas514/main-medicos/mantenimiento/mantenimiento.component';
import { ObtenerDescripcionTipoDocumentoPipe } from './components/fuente-externa/cas107/main/obtener-descripcion-tipo-documento.pipe';
import { ObtenerDescripcionComprobantePipe } from './components/fuente-externa/cas107/main/obtener-descripcion-comprobante.pipe';
import { ObtenerDecripcionTipoBienPipe } from './components/fuente-externa/cas514/main-alquileres/main/obtener-decripcion-tipo-bien.pipe';
import {
    ObtenerDescripcionMedioPagoPipe
} from './components/fuente-externa/cas514/main-alquileres/main/obtener-descripcion-medio-pago.pipe';
import {
    ObtenerDescripcionTipoVinculoPipe
} from './components/fuente-externa/cas514/main-alquileres/main/obtener-descripcion-tipo-vinculo.pipe';
import {
    ObtenerDescripcionTipoComprobantePipe
} from './components/fuente-externa/cas514/main-alquileres/main/obtener-descripcion-tipo-comprobante.pipe';
import { ObtenerTipoDocumentoCas522Pipe } from './components/fuente-externa/cas522/main/obtener-tipo-documento-cas522.pipe';
import { MensajeValidacionAnexoComponent } from './components/mensaje-validacion-anexo/mensaje-validacion-anexo.component';
import { PipesModule } from '@path/natural/pipes/pipes.module';
import { C162MainComponent } from './components/determina-deuda/cas162/main/main.component';
import { C363MainComponent } from './components/determina-deuda/cas363/main/main.component';
import { C144MainComponent } from './components/determina-deuda/cas144/main/main.component';
import { ExcedeDeudaService } from '@path/natural/services/excede-deuda.service';
import { IndicadorRentaService } from '@path/natural/services/indicador-renta.service';
import { CasillasModule } from '@rentas/casillas';
import { CabeceraModule } from '@rentas/cabecera';
import { MonedaPipePipe } from './components/fuente-externa/cas116/main/moneda.pipe';

import { C162RegistroComponent } from './components/determina-deuda/cas162/registro/registro.component';
import { C162RegistroFormService } from './components/determina-deuda/cas162/registro/registro-form.service';

import { C363RegistroComponent } from './components/determina-deuda/cas363/registro/registro.component';
import { C363RegistroFormService } from './components/determina-deuda/cas363/registro/registro-form.service';

import { C144RegistroComponent } from './components/determina-deuda/cas144/registro/registro.component';
import { C144RegistroFormService } from './components/determina-deuda/cas144/registro/registro-form.service';
import { ObtenerMotivoObservacionPipe } from './components/fuente-externa/cas514/pipes/obtener-motivo-observacion.pipe';


@NgModule({
    declarations: [
        CabeceraSecDeterminativaComponent,
        SddCas122MainComponent,
        Cas122MantenimientoComponent,
        C127MainComponent,
        C127MantenimientoComponent,
        C128MainComponent,
        C128MantenimientoComponent,
        Sddc130MainComponent,
        Sddc130MantenimientoComponent,
        Sddc131MainComponent,
        Sddc131MantenimientoComponent,
        SdCas358Component,
        SdCas358MantComponent,
        SdCas359Component,
        SdCas359MantComponent,
        SddMainComponent,
        ScCas107Component,
        ScCas107MantenimientoComponent,
        ScCas108Component,
        ScCas108MantenimientoComponent,
        SfeC111MainComponent,
        Cas111MantenimientoComponent,
        SfeCas116MainComponent,
        Cas116MantenimientoComponent,
        Sfec514MainComponent,
        Sfec519MainComponent,
        Sfec519MantenimientoComponent,
        C522MainComponent,
        Sfec522MantenimientoComponent,
        SfMainComponent,
        SdPrimeraCatComponent,
        ScCas100Component,
        ScCas100MantenimientoComponent,
        ScCas100RegistroComponent,
        ScCas100ImportarComponent,
        SscMainComponent,
        C350MainComponent,
        C350MantenimientoComponent,
        C355MainComponent,
        C355MantenimientoComponent,
        C385MainComponent,
        C385MantenimientoComponent,
        Sfec514AlquileresMantenimientoComponent,
        Sfec514MainAlquileresComponent,
        Sfec514MainAportacionesComponent,
        Sfec514AportacionesMantenimientoComponent,
        Sfec514MainHotelesComponent,
        Sfec514HotelesMantenimientoComponent,
        Sfec514MainArtesaniasComponent,
        Sfec514ArtesaniasMantenimientoComponent,
        Sfec514MainMedicosComponent,
        Sfec514MedicosMantenimientoComponent,
        ObtenerDescripcionTipoDocumentoPipe,
        ObtenerDescripcionComprobantePipe,
        ObtenerDecripcionTipoBienPipe,
        ObtenerDescripcionMedioPagoPipe,
        ObtenerDescripcionTipoVinculoPipe,
        ObtenerDescripcionTipoComprobantePipe,
        ObtenerTipoDocumentoCas522Pipe,
        MensajeValidacionAnexoComponent,
        C162MainComponent,
        C162RegistroComponent,
        C363MainComponent,
        C363RegistroComponent,
        C144MainComponent,
        C144RegistroComponent,
        MonedaPipePipe,
        ObtenerMotivoObservacionPipe
    ],
    imports: [
        CommonModule,
        DeterminativaRoutingModule,
        NgbModule,
        DataTablesModule,
        FormsModule,
        ReactiveFormsModule,
        DirectivasModule,
        NgxSpinnerModule,
        ReportCenterModule,
        PipesModule,
        CasillasModule,
        CabeceraModule
    ],
    exports: [
        CommonModule,
    ],
    entryComponents: [
        SddCas122MainComponent,
        Cas122MantenimientoComponent,
        C127MainComponent,
        C127MantenimientoComponent,
        C128MainComponent,
        C128MantenimientoComponent,
        Sddc130MainComponent,
        Sddc130MantenimientoComponent,
        Sddc131MainComponent,
        Sddc131MantenimientoComponent,
        SdCas358Component,
        SdCas358MantComponent,
        SdCas359Component,
        SdCas359MantComponent,
        SddMainComponent,
        ScCas107Component,
        ScCas107MantenimientoComponent,
        ScCas108Component,
        ScCas108MantenimientoComponent,
        SfeC111MainComponent,
        Cas111MantenimientoComponent,
        SfeCas116MainComponent,
        Cas116MantenimientoComponent,
        Sfec514MainComponent,
        Sfec519MainComponent,
        Sfec519MantenimientoComponent,
        C522MainComponent,
        Sfec522MantenimientoComponent,
        SfMainComponent,
        SdPrimeraCatComponent,
        ScCas100Component,
        ScCas100MantenimientoComponent,
        ScCas100ImportarComponent,
        ScCas100RegistroComponent,
        SscMainComponent,
        C350MainComponent,
        C350MantenimientoComponent,
        C355MainComponent,
        C355MantenimientoComponent,
        C385MainComponent,
        C385MantenimientoComponent,
        Sfec514AlquileresMantenimientoComponent,
        Sfec514MainAlquileresComponent,
        Sfec514MainAportacionesComponent,
        Sfec514AportacionesMantenimientoComponent,
        Sfec514MainHotelesComponent,
        Sfec514HotelesMantenimientoComponent,
        Sfec514MainArtesaniasComponent,
        Sfec514ArtesaniasMantenimientoComponent,
        Sfec514MainMedicosComponent,
        Sfec514MedicosMantenimientoComponent,
        MensajeValidacionAnexoComponent,
        C162MainComponent,
        C162RegistroComponent,
        C363MainComponent,
        C144MainComponent
    ],
    providers: [
        ValidationService,
        PasarelaPagosService,
        DatePipe,
        ExcedeDeudaService,
        IndicadorRentaService,
        PreDeclaracionService,
        C162RegistroFormService,
        C363RegistroFormService,
        C144RegistroFormService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DeterminativaModule { }
