import { Page, expect } from '@playwright/test'

const URL_AUTONOMOS: string = 'https://www.safrapay.com.br/csi-new/';

type Cadastro = {
    nomeCompleto: string,
    cpf: string,
    email: string,
    telefoneCelular: string,
    dataNascimento: string,
    senha: string,
}

export class SignupPage {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Acessa página de inscricao
     */
    async go() {
        await this.page.goto(URL_AUTONOMOS, { waitUntil: 'networkidle' }); 
        const btnGoToSignUp = this.page.locator('button >> text=Quero me cadastrar');
        await btnGoToSignUp.click();
    }

    /**
     * Performa a inscricao com os dados de cadastro do usuario desejado
     * 
     * @param pessoa pessoa com dados validos de cadastro
     */
    async signUp(pessoa: Cadastro) {
        await this.page.waitForURL('https://www.safrapay.com.br/csi-new/unlogged');
        // await this.page.waitForLoadState('networkidle');
        
        let formTitle = this.page.locator('h3.title');
        await expect(formTitle).toHaveText("Para começar precisamos de alguns dados");

        const selectorInputNome = 'input[name="nome"]';
        const selectorInputCpf = 'input[name="cpf"]';
        const selectorInputEmail = 'input[name="email"]';
        const selectorInputTelefoneCelular = 'input[name="celular"]';
        const selectorInputDataNascimento = 'input[name="dataNascimento"]';
        let btnProximo = this.page.locator('button >> text=Próximo');

        // Validação e preenchimento do formulário:
        await expect(this.page.locator(selectorInputNome), 'Nome deveria estar em branco').toBeEmpty();
        await expect(this.page.locator(selectorInputCpf), 'CPF deveria estar em branco').toBeEmpty();
        await expect(this.page.locator(selectorInputEmail), 'Email deveria estar em branco').toBeEmpty();
        await expect(this.page.locator(selectorInputTelefoneCelular), 'Telefone Celular deveria estar em branco').toBeEmpty();
        await expect(this.page.locator(selectorInputDataNascimento), 'Data de Nascimento deveria estar em branco').toBeEmpty();
        
        await expect(btnProximo, 'Botao \'Próximo\'  deveria estar desabilitado').toBeDisabled();
        await this.page.fill(selectorInputNome, pessoa.nomeCompleto);
        await expect(btnProximo, 'Botao \'Próximo\'  deveria estar desabilitado').toBeDisabled();
        await this.page.fill(selectorInputCpf, pessoa.cpf);

        // >> Há aqui uma consulta ao CPF realizada nesta etapa <<
        await this.page.waitForLoadState('networkidle');

        await expect(btnProximo, 'Botao \'Próximo\'  deveria estar desabilitado').toBeDisabled();
        await this.page.fill(selectorInputEmail, pessoa.email);
        await expect(btnProximo, 'Botao \'Próximo\'  deveria estar desabilitado').toBeDisabled();
        await this.page.fill(selectorInputTelefoneCelular, pessoa.telefoneCelular);
        await expect(btnProximo, 'Botao \'Próximo\'  deveria estar desabilitado').toBeDisabled();
        await this.page.fill(selectorInputDataNascimento, pessoa.dataNascimento);
        await expect(btnProximo, 'Botao \'Próximo\'  deveria estar habilitado').toBeEnabled();
        await btnProximo.click();

        // Step de aceite dos termos:
        await this.page.waitForURL('https://www.safrapay.com.br/csi-new/unlogged/signup/terms');
        formTitle = this.page.locator('h3.title');
        btnProximo = this.page.locator('button >> text=Próximo');
        const checkboxAceitarTermos = this.page.locator('input[type="checkbox"]');

        await expect(btnProximo, 'Botao \'Próximo\'  deveria estar desabilitado').toBeDisabled();
        await expect(formTitle).toHaveText("Leia atentamente e aceite os termos e condições");
        await checkboxAceitarTermos.check();

        await expect(btnProximo, 'Botao \'Próximo\'  deveria estar habilitado').toBeEnabled();
        await btnProximo.click();

        // Step de criacao de senha:
        await this.page.waitForURL('https://www.safrapay.com.br/csi-new/unlogged/signup/create-password');
        formTitle = this.page.locator('h3.title');
        const selectorInputSenha = 'input[data-placeholder="Senha"]';
        const selectorInputConfirmarSenha = 'input[data-placeholder="Confirmar Senha"]';
        const btnCriarConta = this.page.locator('button >> text=Criar Conta');

        // Validação e preenchimento do formulário:
        await expect(formTitle).toHaveText('texto aqui');
        await expect(this.page.locator(selectorInputSenha), 'Senha deveria estar em branco').toBeEmpty();
        await expect(this.page.locator(selectorInputCpf), 'Confirmação de senha deveria estar em branco').toBeEmpty();

        await expect(btnProximo, 'Botao \'Criar Conta\'  deveria estar desabilitado').toBeDisabled();
        await this.page.fill(selectorInputSenha, pessoa.senha);
        await this.page.fill(selectorInputConfirmarSenha, pessoa.senha);

        // TODO: Validação sobre a senha é realizada

        await expect(btnCriarConta, 'Botao \'Criar Conta\'  deveria estar habilitado').toBeEnabled();
        await btnCriarConta.click();

        // Step final:
        await this.page.waitForURL('https://www.safrapay.com.br/csi-new/unlogged/signup/response');
        formTitle = this.page.locator('h3.title');
        const btnFazerLogin = this.page.locator('button >> text=Fazer Login');

        await expect(btnFazerLogin, 'Botao \'Fazer Login\'  deveria estar habilitado').toBeEnabled();
        await expect(formTitle).toHaveText('Oba! Seu cadastro foi concluído com sucesso');

        await btnFazerLogin.click();
        await this.page.waitForURL('https://www.safrapay.com.br/csi-new/unlogged/login');
        await expect(this.page.locator(selectorInputCpf).inputValue(), 'Formulário deveria conter CPF utilizado no cadastro').toEqual(pessoa.cpf);
    }

 
    /**
     * Checa se usuário foi criado
     */
    async userSignedUp() {

    }

    async goBack() {
        const btnArrowBack = this.page.locator('#button_arrow_back');
    }

}