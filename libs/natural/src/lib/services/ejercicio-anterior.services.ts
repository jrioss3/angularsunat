import { Injectable } from '@angular/core';
import { PreDeclaracionModel } from '@path/natural/models';
import { PreDeclaracionService } from '../services/preDeclaracion.service';
import { SessionStorage } from '@rentas/shared/utils';

@Injectable()
export class EjercicioAnterior {

    preDeclaracion: PreDeclaracionModel;
    constructor(
        private preDeclaracionService: PreDeclaracionService,
    ) { }

    setearAlquileresCondominosEjercicioAnterior() {
        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        if (this.preDeclaracion.indEjeAntAct === null) {
            Number(this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria) === 0 ?
                this.preDeclaracion.indEjeAntAct = '0' : this.preDeclaracion.indEjeAntAct = '1';
            SessionStorage.setPreDeclaracion(this.preDeclaracion);
        }

        this.preDeclaracion = SessionStorage.getPreDeclaracion();
        if (Number(this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria) === 0 &&
            Number(this.preDeclaracion.indEjeAntAct) === 0) {
            const alquilerAnioAnterior = SessionStorage.getIdentificacionBien();

            /** Alquileres */
            if (alquilerAnioAnterior.alquileresSinValorAlquiler.length !== 0) {
                this.preDeclaracion.declaracion.seccInformativa.alquileres.lisAlquileres =
                    this.preDeclaracion.declaracion.seccInformativa.alquileres.lisAlquileres.
                        concat(alquilerAnioAnterior.alquileresSinValorAlquiler);
                this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas602 = 1;
            }

            /** Condominos */
            if (alquilerAnioAnterior.condominosSinValorBien.length !== 0) {
                this.preDeclaracion.declaracion.seccInformativa.condominos.lisCondomino =
                    this.preDeclaracion.declaracion.seccInformativa.condominos.lisCondomino.
                        concat(alquilerAnioAnterior.condominosSinValorBien);
                this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas559 = 1;
            }

            /** Tipo Declaracion */
            if (alquilerAnioAnterior.tipoDeclara !== null) {
                this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas552 =
                    alquilerAnioAnterior.tipoDeclara;
            }

            this.preDeclaracion.indEjeAntAct = '1';
            SessionStorage.setPreDeclaracion(this.preDeclaracion);
            this.preDeclaracionService.guardarDeclaracion(/* 'cambio' */).subscribe();
        }
    }
}
