import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionModel } from '@path/juridico/models';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { DetalleCas108, ImpRtaEmpresaModelCas108Impl } from '@path/juridico/models/SeccionDeterminativa/impRtaEmpresaModelCas108';
import { ConstantesParametros, MensajeGenerales } from '@rentas/shared/constantes';
import { CasillasUtil, SessionStorage } from '@rentas/shared/utils';
import { ModalConfirmarService } from '@rentas/shared/core';
import { Detalle108RegistroFormService } from './detalle108-registro-form.service';
import { ConstantesCas108 } from '@path/juridico/utils/constantesCas108';

@Component({
  selector: 'app-detalle108-registro',
  templateUrl: './detalle108-registro.component.html',
  styleUrls: ['./detalle108-registro.component.css'],
  providers: [Detalle108RegistroFormService]
})
export class Detalle108RegistroComponent extends CasillasUtil implements OnInit {

  @Input() tipoArrastre: string;
  @Input() saldos: DetalleCas108[];
  @Output() listaDetalle108 = new EventEmitter<DetalleCas108[]>();
  @Input() saldo: DetalleCas108;
  @Input() indice: number;
  @Input() cantidadRegistros: number;

  public ejercicios = [];
  private preDeclaracion: PreDeclaracionModel;
  private anio: number;
  private casilla107: number;
  private casilla106: number;
  public submitted = false;
  public anioSeleccionado = 'AAAA';
  public mensajes = MensajeGenerales;

  constructor(
    private preDeclaracionService: PreDeclaracionService,
    public activeModal: NgbActiveModal,
    public detalle108Form: Detalle108RegistroFormService,
    private modalMensejaService: ModalConfirmarService) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.anio = Number(this.preDeclaracionService.obtenerNumeroEjercicio());
    this.casilla106 = Number(this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa.mtoCas106);
    this.casilla107 = Number(this.preDeclaracion.declaracion.seccDeterminativa.impuestoRta.impuestoRtaEmpresa.mtoCas107);
    this.obtenerListaAnios();
    this.detalle108Form.inicializarFormulario(this.saldo);
    this.obtenerValorCompesacion();

    if (!this.saldo) {
      this.saldos.forEach(x => {
        this.ejercicios = this.ejercicios.filter(y => y.val !== x.casillaCompensacion.desValLiteral);
      })
    }
  }

  private obtenerListaAnios(): void {
    if (this.tipoArrastre === ConstantesCas108.ARRASTRE_B) {
      this.obtenerAniosArrastreB(2002, (this.anio - 1));
    } else {
      this.obtenerAniosArrastreA(this.anio - 1);
    }
  }

  private obtenerAniosArrastreB(anioInicial: number, anioFinal: number): void {
    const listaAnios = [];
    for (let i = anioInicial; i <= anioFinal; i++) {
      listaAnios.push({ val: String(i), desc: String(i) });
    }
    this.ejercicios = listaAnios;
  }

  private obtenerAniosArrastreA(anioInicial: number): void {
    const listaAnios = [];
    for (let i = 1; i <= this.cantidadRegistros; i++) {
      const anioFinal = anioInicial--;
      listaAnios.push({ val: String(anioFinal), desc: String(anioFinal) });
    }
    this.ejercicios = listaAnios;
  }

  private obtenerValorCompesacion(): void {
    if (this.noPermiteRegistrarCompensacion()) {
      this.detalle108Form.fieldSaldoCompensa.setValue(0);
      this.detalle108Form.fieldSaldoCompensa.disable();
    }
  }

  public setearAnioSelec(): void {
    this.anioSeleccionado = this.detalle108Form.fieldEjercicio.value ? this.detalle108Form.fieldEjercicio.value : 'AAAA';
  }

  private noPermiteRegistrarCompensacion(): boolean {
    return Math.abs(this.casilla107) > 0 || (this.casilla107 === 0 && this.casilla106 === 0);
  }

  public guardar(): void {
    this.submitted = true;
    if (this.detalle108Form.getForm.invalid) return;

    const objPerdida = this.crearObjetoSaldos(ConstantesCas108.SALDO_PERDIDA, this.detalle108Form.fieldSaldoPerdida.value);
    const objCompensacion = this.crearObjetoSaldos(ConstantesCas108.SALDO_COMPENSACION, this.detalle108Form.fieldSaldoCompensa.value);
    const objetoLista = {
      casillaPerdidas: objPerdida,
      casillaCompensacion: objCompensacion
    };

    if (this.detalle108Form.fieldSaldoCompensa.value == null || this.detalle108Form.fieldSaldoPerdida.value == null) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS22_EX02, 'Mensaje');
      return;
    } else if (Number(this.detalle108Form.fieldSaldoCompensa.value) > Number(this.detalle108Form.fieldSaldoPerdida.value)) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS22_EX03.replace('AAAA', this.detalle108Form.fieldEjercicio.value), 'Mensaje');
      return;
    } else if (!this.saldo) {
      this.saldos.push(objetoLista);
    } else {
      this.saldos[this.indice] = objetoLista;
    }
    this.listaDetalle108.emit(this.saldos);
    this.activeModal.close();
  }

  private crearObjetoSaldos(tipoSaldo: string, monto: number): ImpRtaEmpresaModelCas108Impl {
    return new ImpRtaEmpresaModelCas108Impl(ConstantesParametros.COD_FORMULARIO_PPJJ, this.tipoArrastre, tipoSaldo, this.detalle108Form.fieldEjercicio.value, monto);
  }
}
