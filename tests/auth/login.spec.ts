import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import path from 'path';
import assert from 'assert';
dotenv.config({ path: path.resolve(__dirname, '.env') });

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/login`);
  });

  test('a user can login with valid credentials', async ({ page }) => {
    await page.getByTestId('login-email-input').fill(process.env.TEST_EMAIL!);
    await page.getByTestId('login-password-input').fill(process.env.TEST_PASSWORD!);
    await page.getByTestId('login-btn').click();
    await expect(page).toHaveURL(`${process.env.BASE_URL}/products`);
  });

  test('a user cannot login with empty fields', async ({ page }) => { 
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
  });

  test('a user cannot login without an email', async ({ page }) => {
    await page.getByTestId('login-password-input').fill(process.env.TEST_PASSWORD!);
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('login-error')).toHaveText('Email is required');
  });

  test('a user cannot login without a password', async ({ page }) => {
    await page.getByTestId('login-email-input').fill(process.env.TEST_EMAIL!);
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('login-error')).toHaveText('Password is required');
  });
  
  test('a user cannot login with non-existing email', async ({ page }) => {
    await page.getByTestId('login-email-input').fill(faker.internet.email());
    await page.getByTestId('login-password-input').fill(process.env.TEST_PASSWORD!);
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('login-error')).toHaveText('Invalid email or password');
  });

  test('a user cannot login with incorrect password', async ({ page }) => {
    await page.getByTestId('login-email-input').fill(process.env.TEST_EMAIL!);
    await page.getByTestId('login-password-input').fill(faker.internet.password());
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('login-error')).toHaveText('Invalid email or password');
  });

});