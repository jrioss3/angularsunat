import { OnInit, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CurrentData, UserData } from '@rentas/shared/types';

import { SessionStorage } from '@rentas/shared/utils';

@Component({
    selector: 'app-modal-ruc',
    templateUrl: './modal-ruc.component.html',
})
export class ModalRucComponent implements OnInit {
    numRuc: number;

    constructor(public modalService: NgbActiveModal,
        public activeModal: NgbActiveModal) { }

    ngOnInit() {
        this.numRuc = 20717080778;
    }

    aceptar() {
        if (this.numRuc.toString().length === 11) {
            // MODIFICACION
            const currentData = {
                sub: '',
                aud:
                    '[{"api":"https://e-renta.sunat.gob.pe","recurso":'
                    + '[{"id":"/v1/recaudacion/declaracionespago","indicador":"1","gt":"101000"}]}]',
                nbf: 1573505283,
                clientId: 'c0c584ff-7395-4927-867a-c2d74b53f623',
                iss: 'https://api-seguridad.sunat.gob.pe/v1/clientessol/c0c584ff-7395-4927-867a-c2d74b53f623/oauth2/token/',
                exp: 1573508883,
                grantType: 'authorization_code',
                iat: 1573505283,
            };

            const userData = {
                numRUC: this.numRuc.toString(),
                ticket: '1315154803676',
                nroRegistro: '',
                apeMaterno: '',
                login: '20100066603MODDATOS',
                nombreCompleto: 'UNION DE CERVECERIAS BACKUS Y JHONSTON S.A.C.',
                nombres: 'BACKUSYJHONSTON',
                codDepend: '0023',
                codTOpeComer: '',
                codCate: '',
                nivelUO: 0,
                codUO: '',
                correo: '',
                usuarioSOL: 'MODDATOS',
                id: '',
                desUO: '',
                desCate: '',
                apePaterno: '',
                idCelular: '',
                map: {
                    isClon: false,
                    ddpData: {
                        ddp_numruc: this.numRuc.toString(),
                        ddp_numreg: '0023',
                        ddp_estado: '00',
                        ddp_flag22: '00',
                        ddp_ubigeo: '150103',
                        ddp_tamano: '03',
                        ddp_tpoemp: '34',
                        ddp_ciiu: '51225'
                    },
                    idMenu: '1315154803676',
                    jndiPool: 'p0023',
                    tipUsuario: '0',
                    tipOrigen: 'IT',
                    primerAcceso: false
                }
            };
            SessionStorage.setCurrentData(currentData);
            SessionStorage.setUserData(userData);
            this.activeModal.close();
        }
    }
}
