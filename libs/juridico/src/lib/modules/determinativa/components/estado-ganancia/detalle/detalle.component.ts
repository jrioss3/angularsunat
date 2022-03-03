import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CasillasUtil } from '@rentas/shared/utils';
import { CasillaService } from '@rentas/shared/core';

@Component({
    selector: 'app-eegdetalle',
    templateUrl: './detalle.component.html',
    styleUrls: ['./detalle.component.css']
})
export class EegDetalleComponent extends CasillasUtil implements OnInit {

    public valor1: number;
    public valor2: number;
    public resultado: number;
    public casillaCalculada = this.CODIGO_TIPO_CASILLA_CALCULADA;
    private filaAsistente: any;
    public dataCasilla: any;
    @Input() public casilla;
    @Input() inputMonto1: number;
    @Input() inputMonto2: number;
    @Output() respuestaAsistente = new EventEmitter<{ resultado: number, montoA: number, montoB: number }>();

    constructor(
        public activeModal: NgbActiveModal,
        private casillaService: CasillaService) { 
        super();
    }

    public ngOnInit(): void {
        this.valor1 = this.inputMonto1;
        this.valor2 = this.inputMonto2;
        this.sumar();
        this.dataCasilla = this.casilla.dataCasilla;
        this.filaAsistente = this.dataCasilla?.filasAsistente || []; 
    }

    public sumar(): void {
        this.resultado = Number(this.valor1) + Number(this.valor2);
    }

    public back(): void {
        this.respuestaAsistente.emit({ resultado: this.resultado, montoA: this.valor1, montoB: this.valor2 });
        this.activeModal.close();
    }

    public existeCodFilaAsistente(codigo: string): boolean {
        const data = this.filaAsistente.find((item) => item.codFila === codigo);
        return data?.codFila ? true : false;
    }

    public getDescripcionFilaAsistente(codigo: string): string {
        return this.casillaService.filtrarFilaAsistentePorCodigoFila(codigo, this.filaAsistente);
    }
}
