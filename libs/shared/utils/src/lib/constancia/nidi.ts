import { SessionStorage } from '../session-storage/session-storage';

enum tipo_nidi { ESTADO = '20', FLAG22 = '10' }

export abstract class Nidi {

    private ruc = SessionStorage.getnumRuc();
    private userData = SessionStorage.getUserData();

    private isNidi(): boolean {
        return this.userData.map.ddpData.ddp_estado  === tipo_nidi.ESTADO
        && this.userData.map.ddpData.ddp_flag22 === tipo_nidi.FLAG22;
    }

    private getDni(): string {
        return this.ruc.substring(2, this.ruc.length - 1);
    }

    public getEtiquetaRuc(): string {
        return !this.isNidi() ? 'RUC:' : 'DNI:';
    }

    public getEtiquetaRazonSocial(): string {
        return !this.isNidi() ? 'Nombre o Razón Social:' : 'Nombre Contribuyente:';
    }

    public getValueRuc(): string {
        return !this.isNidi() ? this.ruc : this.getDni();
    }
}
