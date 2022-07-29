import { Page, expect } from '@playwright/test';

/**
 * Lista de URLs da aplicacao
 * 
 * Observacao: aplicacao nao permite navegacao direta à URL.
 */
export const enum URL {
    BASE = 'https://www.safrapay.com.br/csi-new/',
    DESLOGADO = 'https://www.safrapay.com.br/csi-new/unlogged',
    COMPLETAR_CADASTRO = 'https://www.safrapay.com.br/csi-new/core/profile',
    COMPLETAR_CADASTRO_UPLOAD = 'https://www.safrapay.com.br/csi-new/core/profile/documents/live',
    COMPLETAR_CADASTRO_UPLOAD_CHECK = 'https://www.safrapay.com.br/csi-new/core/profile/documents/send',
    COMPLETAR_CADASTRO_CADASTRO_EMPRESA = 'https://www.safrapay.com.br/csi-new/core/profile/cnpj',
    COMPLETAR_CADASTRO_FINAL = 'https://www.safrapay.com.br/csi-new/core/profile/response',

    HOME = 'https://www.safrapay.com.br/csi-new/core',
    MEUS_GANHOS = 'https://www.safrapay.com.br/csi-new/core/invoice/list/total',
    MEUS_INDICADOS = 'https://www.safrapay.com.br/csi-new/core/indication/list',
    DUVIDAS = 'https://www.safrapay.com.br/csi-new/core/faq',
    MINHA_CONTA = 'https://www.safrapay.com.br/csi-new/core/profile/profile-account',
    INDICACAO = 'https://www.safrapay.com.br/csi-new/core/indication',

    MEUS_GANHOS_EMITIR_NOTA = 'https://www.safrapay.com.br/csi-new/core/invoice/list/emit',
    MEUS_GANHOS_EM_PROCESSAMENTO = 'https://www.safrapay.com.br/csi-new/core/invoice/list/processing',
    MEUS_GANHOS_PENDENTES = 'https://www.safrapay.com.br/csi-new/core/invoice/list/nok',
    MEUS_GANHOS_PAGAS = 'https://www.safrapay.com.br/csi-new/core/invoice/list/paid',
}
/**
 * Utilitario para navegacao
 * 
 */
export class UtilPage {

    readonly page: Page
    static readonly URL = 'https://www.safrapay.com.br/csi-new/';

    constructor(page: Page) {
        this.page = page
    }

    async openMenu() {
        const btnMenu = this.page.locator('button:has-text("menu")');
        if (btnMenu != null && await btnMenu.isVisible()) {
            await btnMenu.click();
        }
    }

    async closeMenu(){
        const btnFecharMenu = this.page.locator('button:has-text("close")');
        if (btnFecharMenu != null && await btnFecharMenu.isVisible()) {
            await btnFecharMenu.click();
        }
    }

    async openNotifications() {}

    async closeNotifications() {}

    async skipCompleteRegistration() {
        try {
            await this.page.waitForURL('https://www.safrapay.com.br/csi-new/core/profile');
            const btnSkip = this.page.locator('button:has-text("Fazer isso depois")');
            await btnSkip.click();
        } catch (error) {
            console.log('>> Página de completar cadastro não foi exibida! <<'); 
        }
    }

};