import { Detalle130Component } from './../detalle130/detalle130.component';
import { Component, OnInit } from '@angular/core';
import { Detalle127Component } from '../detalle127/detalle127.component';
import { Detalle128Component } from '../detalle128/detalle128.component';
import { Detalle131Component } from '../detalle131/detalle131.component';
import { Detalle126Component } from '../detalle126/detalle126.component';
import { SessionStorage } from '@rentas/shared/utils';
import { AbrirModalService } from '@rentas/shared/core';
import { FormulasService } from '@path/juridico/services/formulas.service';

@Component({
    selector: 'app-ccimain',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class CredContraImpRentaMainComponent implements OnInit {

    public valorSi = 1;
    public valorNo = 0;

    constructor(
        private abrirModalService: AbrirModalService,
        public fs: FormulasService) { }

    public ngOnInit(): void {
        this.fs.validarFormatoCasilla506();
        this.fs.validarFormatoCasilla131();
    }

    public asistenteCasilla126(): void {
        const modalRef = this.abrirModalService.abrirModal(Detalle126Component);
        modalRef.componentInstance.inputDataCasilla = this.fs.casilla126 ?? [];
        modalRef.componentInstance.datosCasilla.subscribe(($e) => {
            this.fs.lista126.lisCasilla126 = $e.lista;
            this.fs.credImprenta.mtoCas126 = Number($e.total);
            this.fs.calcularSUBTOTALCredSinDevolucion();
        });
    }

    public asistenteCasilla127(): void {
        const modalRef = this.abrirModalService.abrirModal(Detalle127Component, { size: 'lg' });
        modalRef.componentInstance.inputDataCasilla = this.fs.casilla127 ?? [];
        modalRef.componentInstance.datosCasilla.subscribe(($e) => {
            this.fs.credImprenta.mtoCas202 = Number($e.casilla202);
            this.fs.credImprenta.mtoCas203 = Number($e.casilla203);
            this.fs.credImprenta.mtoCas204 = Number($e.casilla204);
            this.fs.credImprenta.mtoCas297 = Number($e.casilla297);
            this.fs.lista297.lisCasilla297 = $e.listaDeudas;
            this.fs.credImprenta.mtoCas127 = Number($e.total);
            this.fs.calcularSUBTOTALCredConDevolucion();
        });
    }

    public asistenteCasilla128(): void {
        const modalRef = this.abrirModalService.abrirModal(Detalle128Component, { size: 'lg', windowClass: 'custom-class74' });
        modalRef.componentInstance.inputDataCasilla = this.fs.casilla128 ?? [];
        modalRef.componentInstance.datosCasilla.subscribe(($e) => {
            this.fs.lista128.lisCasilla128 = $e.lista;
            this.fs.credImprenta.mtoCas128 = Number($e.total);
            this.fs.calcularSUBTOTALCredConDevolucion();
        });
    }

    public asistenteCasilla130(): void {
        const modalRef = this.abrirModalService.abrirModal(Detalle130Component);
        modalRef.componentInstance.inputDataCasilla = this.fs.casilla130 ?? [];
        modalRef.componentInstance.datosCasilla.subscribe(($e) => {
            this.fs.lista130.lisCasilla130 = $e.lista;
            this.fs.credImprenta.mtoCas130 = Number($e.total);
            this.fs.calcularSUBTOTALCredConDevolucion();
        });
    }

    public asistenteCasilla131(): void {
        const modalRef = this.abrirModalService.abrirModal(Detalle131Component);
        modalRef.componentInstance.inputDataCasilla = this.fs.casilla131 ?? [];
        modalRef.componentInstance.datosCasilla.subscribe(($e) => {
            this.fs.lista131.lisCasilla131 = $e.lista;
            this.fs.credImprenta.mtoCas131 = Number($e.total);
            this.fs.calcularSaldoItan();
        });
    }

    public cambiarArrastre(): void {
        SessionStorage.setPreDeclaracion(this.fs.preDeclaracion);
    }
}
