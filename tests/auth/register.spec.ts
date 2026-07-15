import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import path from 'path';
import assert from 'assert';
dotenv.config({ path: path.resolve(__dirname, '.env') });

test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/register`);
  });

  test('a user can register with valid credentials', async ({ page }) => {
    await page.getByTestId('register-name-input').fill(faker.person.firstName());
    await page.getByTestId('register-email-input').fill(faker.internet.email());
    await page.getByTestId('register-password-input').fill(faker.internet.password());
    await page.getByTestId('register-btn').click();
    await expect(page).toHaveURL(`${process.env.BASE_URL}/login`);
  });
  
  test('a user cannot register with empty fields', async ({ page }) => {
    await page.getByTestId('register-btn').click();
    await expect(page.getByTestId('name-error')).toBeVisible();
    await expect(page.getByTestId('name-error')).toHaveText('Name is required');
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('email-error')).toHaveText('Email is required');
    await expect(page.getByTestId('password-error')).toBeVisible();
    await expect(page.getByTestId('password-error')).toHaveText('Password is required');
  });

  test('a user cannot register without a name', async ({ page }) => {
    await page.getByTestId('register-email-input').fill(faker.internet.email());
    await page.getByTestId('register-password-input').fill(faker.internet.password());
    await page.getByTestId('register-btn').click();
    await expect(page.getByTestId('name-error')).toBeVisible();
    await expect(page.getByTestId('name-error')).toHaveText('Name is required');
  });

  test('a user cannot register without an email', async ({ page }) => {
    await page.getByTestId('register-name-input').fill(faker.person.firstName());
    await page.getByTestId('register-password-input').fill(faker.internet.password());
    await page.getByTestId('register-btn').click();
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('email-error')).toHaveText('Email is required');
  });

  test('a user cannot register without a password', async ({ page }) => {
    await page.getByTestId('register-name-input').fill(faker.person.firstName());
    await page.getByTestId('register-email-input').fill(faker.internet.email());
    await page.getByTestId('register-btn').click();
    await expect(page.getByTestId('password-error')).toBeVisible();
    await expect(page.getByTestId('password-error')).toHaveText('Password is required');
  });

  test('a user cannot register with invalid email', async ({ page }) => {
    await page.getByTestId('register-name-input').fill(faker.person.firstName());
    await page.getByTestId('register-email-input').fill('invalid-email');
    await page.getByTestId('register-password-input').fill(faker.internet.password());
    await page.getByTestId('register-btn').click();
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('email-error')).toHaveText('Enter a valid email');
  });

  test('a user cannot register with an already registered email', async ({ page }) => {
    await page.getByTestId('register-name-input').fill(faker.person.firstName());
    await page.getByTestId('register-email-input').fill(process.env.TEST_EMAIL!);
    await page.getByTestId('register-password-input').fill(faker.internet.password());
    await page.getByTestId('register-btn').click();
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('email-error')).toHaveText('Email is already registered');
  });

  test('a user cannot register with a password less than 6 characters', async ({ page }) => {
    await page.getByTestId('register-name-input').fill(faker.person.firstName());
    await page.getByTestId('register-email-input').fill(faker.internet.email());
    await page.getByTestId('register-password-input').fill('123');
    await page.getByTestId('register-btn').click();
    await expect(page.getByTestId('password-error')).toBeVisible();
    await expect(page.getByTestId('password-error')).toHaveText('Password must be at least 6 characters');
  });

  test('a user can register with a password of 6 characters', async ({ page }) => {
    await page.getByTestId('register-name-input').fill(faker.person.firstName());
    await page.getByTestId('register-email-input').fill(faker.internet.email());
    await page.getByTestId('register-password-input').fill('123456');
    await page.getByTestId('register-btn').click();
    await expect(page).toHaveURL(`${process.env.BASE_URL}/login`);
  });
});