import { Page, expect } from '@playwright/test'

export class LoginPage {

    readonly page: Page
    readonly URL = 'https://www.safrapay.com.br/csi-new/';

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Acessa página de login
     */
    async go() {
        await this.page.goto(this.URL, { waitUntil: 'networkidle' }); 
        const btnGoToLogin = this.page.locator('button >> text=Já Tenho Conta');
        await btnGoToLogin.click();
    }

    /**
     * Acessa e checa a página inicial (deslogada)
     */
     async onboarding() {
        await this.page.goto(this.URL, { waitUntil: 'networkidle' }); 

        const pageTitle = 'Autônomo - Safrapay';
        await expect(this.page).toHaveTitle(pageTitle);   

        const logo = this.page.locator('.logo__image');
        await expect(logo).toBeVisible();

        const carousel = this.page.locator('.carrousel')
        await expect(carousel).toBeVisible();

        // Sign-in:
        const btnGoToLogin = this.page.locator('button >> text=Já Tenho Conta');
        await expect(btnGoToLogin).toBeVisible();
        // Sign-up:
        const btnGoToSignUp = this.page.locator('button >> text="Quero me cadastrar"');
        await expect(btnGoToSignUp).toBeVisible();
    }

    /**
     * Performa o login com os dados do usuario desejado
     * 
     * TODO : Aceitar um boolean para marcar o checkbox manter conectado
     * @param cpf cpf do usuario para performar o login
     * @param senha senha do usuario desejado
     */
    async signIn(cpf: string, senha: string) {
        await this.page.waitForURL('https://www.safrapay.com.br/csi-new/unlogged');
        // await this.page.waitForLoadState('networkidle');
        
        const formTitle = this.page.locator('h3.title');
        await expect(formTitle).toHaveText("Acesse sua conta");

        const selectorInputCpf = 'input[name="cpf"]';
        const selectorInputSenha = 'input[name="senha"]';
        const btnEntrar = this.page.locator('button >> text=Entrar');

        await expect(this.page.locator(selectorInputCpf), 'CPF deveria estar em branco').toBeEmpty();
        await expect(this.page.locator(selectorInputSenha), 'senha deveria estar em branco').toBeEmpty();
        
        await this.page.fill(selectorInputCpf, cpf);
        await this.page.fill(selectorInputSenha, senha);
        await btnEntrar.click();
    }

    /**
     * Perfoma o logout do usuario
     */
    async logout() {
        // await this.page.waitForLoadState('networkidle');
        await this.openMenu();
        const btnSair = this.page.locator('button >> text=Sair');
        await btnSair.click();
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

    /**
     * Valida se o modal de senha incorreta foi exibido em tela
     */
     async modalSenhaIncorreta() {
        const modalTitle = this.page.locator('#swal2-title');
        const modalMessage = this.page.locator('#swal2-content');
        const btnFechar = this.page.locator('button >> text=Fechar');

        /**
         * É necessário fazer checagens para evitar problemas com o auto-waiting:
         * https://playwright.dev/docs/actionability
         */
        await expect(modalTitle).toBeVisible();
        await expect(modalMessage).toBeVisible();
        await expect(btnFechar).toBeEnabled();

        const titleOops = 'Oops!';
        const msgSenhaIncorreta = 'Senha incorreta. Tente se lembrar da senha cadastrada ou clique em “Esqueci minha senha” para criar uma nova';
        await expect(modalTitle).toHaveText(titleOops);
        await expect(modalMessage).toHaveText(msgSenhaIncorreta);

        await btnFechar.click();
    }

    /**
     * Checa se usuário está logado ao avaliar o header da página
     */
    async userLoggedIn() {
        await this.page.waitForURL('https://www.safrapay.com.br/csi-new/core')
        // await this.page.waitForLoadState('networkidle');

        const toolbar = this.page.locator('mat-toolbar.mat-toolbar.toolbar__header.mat-secondary.mat-toolbar-single-row');
        const personIcon = this.page.locator('img.header-name__person');
        const helloMessage = this.page.locator('h3.header-name__title');
        const msgHello = 'Olá,';

        await expect(toolbar).toBeVisible();
        await expect(personIcon).toBeVisible();
        await expect(helloMessage).toBeVisible();
        await expect(helloMessage).toContainText(msgHello);
    }

    async userLoggedOut() {
        await this.page.waitForURL('https://www.safrapay.com.br/csi-new/unlogged');
        // await this.page.waitForLoadState('networkidle');

        const pageTitle = 'Autônomo - Safrapay';
        await expect(this.page).toHaveTitle(pageTitle);   

        // Sign-in:
        const btnGoToLogin = this.page.locator('button >> text=Já Tenho Conta');
        await expect(btnGoToLogin).toBeVisible();
        // Sign-up:
        const btnGoToSignUp = this.page.locator('button >> text="Quero me cadastrar"');
        await expect(btnGoToSignUp).toBeVisible();
    }

}