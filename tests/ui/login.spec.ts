import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { PASSWORD, USERS } from '../../test-data/users';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('valid user can log in', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(USERS.standard, PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('invalid credentials show an error message', async ({ page }) => {
    await loginPage.login(USERS.standard, 'wrong_password');

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('locked-out user cannot log in', async ({ page }) => {
    await loginPage.login(USERS.lockedOut, PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('empty username shows a required-field error', async () => {
    await loginPage.login('', PASSWORD);

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
  });

  test('empty password shows a required-field error', async () => {
    await loginPage.login(USERS.standard, '');

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Password is required');
  });

  test('logged-in user can log out', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(USERS.standard, PASSWORD);
    await inventoryPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
});
