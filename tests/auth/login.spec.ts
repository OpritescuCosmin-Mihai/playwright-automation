import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { LoginPage } from '../../pages/login/login.page';
import { DEMO_USER } from '../../test-data/users';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('C46 - log in with valid demo credentials', async ({ page }) => {
    await loginPage.login(DEMO_USER.email, DEMO_USER.password);
    await expect(page).toHaveURL("/products");
  });

  test('C58 - log in with empty fields', async ({ page }) => { 
    await loginPage.login("", "");
    await expect(loginPage.error()).toBeVisible();
  });

  test('C59 - log in without an email', async ({ page }) => {
    await loginPage.login("", DEMO_USER.password);
    await expect(loginPage.error()).toBeVisible();
    await expect(loginPage.error()).toHaveText('Email is required');
  });

  test('C48 - log in without a password', async ({ page }) => {
    await loginPage.login(DEMO_USER.email, "");
    await expect(loginPage.error()).toBeVisible();
    await expect(loginPage.error()).toHaveText('Password is required');
  });
  
  test('C60 - log in with non-existing email', async ({ page }) => {
    await loginPage.login(faker.internet.email(), DEMO_USER.password);
    await expect(loginPage.error()).toBeVisible();
    await expect(loginPage.error()).toHaveText('Invalid email or password');
  });

  test('C47 - log in with incorrect password', async ({ page }) => {
    await loginPage.login(DEMO_USER.email, faker.internet.password());
    await expect(loginPage.error()).toBeVisible();
    await expect(loginPage.error()).toHaveText('Invalid email or password');
  });
});