import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { RegisterPage } from "../../pages/register/register.page";

const DEMO = { email: process.env.TEST_EMAIL!, password: process.env.TEST_PASSWORD! };

test.describe('Register Page', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('C61 - register with valid credentials', async ({ page }) => {
    await registerPage.register(
      faker.person.firstName(),
      faker.internet.email(),
      faker.internet.password()
    );

    await expect(page).toHaveURL("/login");
  });
  
  test('C62 - register with empty fields', async ({ page }) => {
    await registerPage.register('', '', '');

    await expect(registerPage.nameError()).toHaveText('Name is required');
    await expect(registerPage.emailError()).toHaveText('Email is required');
    await expect(registerPage.passwordError()).toHaveText('Password is required');
  });

  test('C63 - register without a name', async ({ page }) => {
    await registerPage.register('', faker.internet.email(), faker.internet.password());

    await expect(registerPage.nameError()).toHaveText('Name is required');
  });

  test('C64 - register without an email', async ({ page }) => {
    await registerPage.register(faker.person.firstName(), '', faker.internet.password());

    await expect(registerPage.emailError()).toHaveText('Email is required');
  });

  test('C65 - register without a password', async ({ page }) => {
    await registerPage.register(faker.person.firstName(), faker.internet.email(), '');

    await expect(registerPage.passwordError()).toHaveText('Password is required');
  });

  test('C66 - register with invalid email', async ({ page }) => {
    await registerPage.register(faker.person.firstName(), 'invalid-email', faker.internet.password());

    await expect(page.getByTestId('email-error')).toHaveText('Enter a valid email');
  });

  test('C53 - register with an already registered email', async ({ page }) => {
    await registerPage.register(faker.person.firstName(), process.env.TEST_EMAIL!, faker.internet.password());

    await expect(registerPage.emailError()).toHaveText('Email is already registered');
  });

  test('C67 - register with a password less than 6 characters', async ({ page }) => {
    await registerPage.register(faker.person.firstName(), faker.internet.email(), '123');
    
    await expect(registerPage.passwordError()).toHaveText('Password must be at least 6 characters');
  });

  test('C68 - register with a password of 6 characters', async ({ page }) => {
    await registerPage.register(faker.person.firstName(), faker.internet.email(), '123456');

    await expect(page).toHaveURL("/login");
  });
});