import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { UtilPage } from '../pages/util';

let loginPage: LoginPage;
let utilPage: UtilPage;

test.beforeEach(async ({page}) => {
    loginPage = new LoginPage(page);
    utilPage = new UtilPage(page);
})

test('deve exibir onboarding inicial', async ({ page }) => {
    await loginPage.onboarding(); 
});

test('deve acessar página de login', async ({ page }) => {
    await loginPage.go(); 
});

test('CPF obrigatório', async ({ page }) => {
    await loginPage.go();

    const selectorInputCpf = 'input[name="cpf"]';
    const selectorInputSenha = 'input[name="senha"]';
    const selectorCheckboxManterConectado = '#mat-checkbox-1-input';
    const btnEntrar = page.locator('button >> text=Entrar');

    // Botão deve estar desabilitado antes que o usuário preencha o formulário:
    await expect(btnEntrar).toBeDisabled();
    
    // Preenchendo formulário:
    await page.fill(selectorInputCpf, '');
    await page.fill(selectorInputSenha, 'textoQualquer');
    await page.check(selectorCheckboxManterConectado);

    // Alerta no formulário:
    const errorInputCpf = page.locator('mat-error.mat-error >> text=Para continuar, digite o CPF de cadastro');
    await expect(errorInputCpf).toBeVisible();
    
    // Botão deve permanecer desabilitado, uma vez que o CPF não foi preenchido!
    await expect(btnEntrar).toBeDisabled();
});

test('senha obrigatória', async ({ page }) => {
    await loginPage.go();

    const selectorInputCpf = 'input[name="cpf"]';
    const selectorInputSenha = 'input[name="senha"]';
    const selectorCheckboxManterConectado = '#mat-checkbox-1-input';
    const btnEntrar = page.locator('button >> text=Entrar');

    // Botão deve estar desabilitado antes que o usuário preencha o formulário:
    await expect(btnEntrar).toBeDisabled();
    
    // Preenchendo formulário:
    await page.fill(selectorInputCpf, '757.529.991-20');
    await page.fill(selectorInputSenha, '');
    await page.press(selectorInputSenha, 'Tab');
    await page.check(selectorCheckboxManterConectado);
    // await page.waitForLoadState('networkidle');

    // Alerta no formulário:
    const errorInputSenha = page.locator('mat-error.mat-error >> text=Campo obrigatório');
    await expect(errorInputSenha).toBeVisible();
    
    // Botão deve permanecer desabilitado, uma vez que a senha não foi preenchida!
    await expect(btnEntrar).toBeDisabled();
});

/**
 * Na aplicação, o alerta para este cenário é idêntico ao erro de senha
 */
test.skip('usuario inexistente', async ({ page }) => {
    const cpfNaoCadastrado = '788.296.320-82';
    const senhaQualquer = '123';

    await loginPage.go();
    await loginPage.signIn(cpfNaoCadastrado, senhaQualquer);
});

/**
 * Desabilitado pois há um bloqueio temporário após algumas tentativas
 */
test.skip('senha incorreta', async ({ page }) => {
    const usuario = '757.529.991-20';
    const senha = '123';

    await loginPage.go();
    await loginPage.signIn(usuario, senha);
    await loginPage.modalSenhaIncorreta();
});

/**
 * TODO: colher um usuário com cadastro completo
 */
test.skip('login com cadastro completo', async ({ page }) => {
    await loginPage.go();
    await loginPage.signIn('344.986.898-52', 'Vida1266');
    await loginPage.userLoggedIn();
});

/**
 * TODO: escolher outro usuário para evitar problemas de logout concorrente com a suite de logout
 */
test.skip('login com cadastro incompleto', async ({ page }) => {
    await loginPage.go();
    await loginPage.signIn('757.529.991-20', 'Teste123');
    await utilPage.skipCompleteRegistration();
    await loginPage.userLoggedIn();
});



