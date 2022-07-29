import { Page, expect } from '@playwright/test';
import { UtilPage } from './util';

/**
 * Page Object para a tela inicial
 * Obs.: necessita que a conta tenha cadastro completo
 */
export class HomePage {

    readonly page: Page
    // readonly URL = 'https://www.safrapay.com.br/csi-new/';

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Acessa página inicial
     */
     async go() {
        await this.page.goto(UtilPage.URL, { waitUntil: 'networkidle' }); 
        
    }
};