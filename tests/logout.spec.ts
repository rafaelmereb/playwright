import { test } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { UtilPage } from '../pages/util';

/**
 * TODO: criar utilitario para obter usuario do json fixtura
 */
 const usuarioLogout = {
    "cpf": "757.529.991-20",
    "senha": "Teste123"
};

let loginPage: LoginPage;
let utilPage: UtilPage;

test.beforeEach(async ({page}) => {
    loginPage = new LoginPage(page);
    utilPage = new UtilPage(page);
});

/**
 * Separar um usuário de logout pra evitar problemas de execucao em paralelo
 */
 test('logout pela home page', async ({ page }) => {
    await loginPage.go();
    await loginPage.signIn(usuarioLogout.cpf, usuarioLogout.senha);
    await utilPage.skipCompleteRegistration();
    await loginPage.userLoggedIn();
    await loginPage.logout();
    await loginPage.userLoggedOut();
});