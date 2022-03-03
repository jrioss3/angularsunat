import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalReportePreliminarComponent } from './tipo-reporte-preliminar/tipo-reporte-preliminar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [
    ModalReportePreliminarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPrintModule
  ],
  exports: [
    ModalReportePreliminarComponent,
  ],
  entryComponents: [
    ModalReportePreliminarComponent,
  ],
})
export class ReportCenterModule { }
