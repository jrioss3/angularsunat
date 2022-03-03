import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultasComponent } from './component/consultas/consultas.component';
import { ConsultasRoutingModule } from './consultas-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ParametrosFormularioService, SharedCoreModule } from '@rentas/shared/core';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, 
    ConsultasRoutingModule,
    SharedCoreModule,
    DataTablesModule, 
    HttpClientModule, 
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ConsultasComponent
  ],
  providers: [
    ParametrosFormularioService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ConsultasModule { }
