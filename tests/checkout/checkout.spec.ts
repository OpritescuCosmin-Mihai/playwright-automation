import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import path from 'path';
import assert from 'assert';
dotenv.config({ path: path.resolve(__dirname, '.env') });

test.describe('Checkout Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/login`);
    await page.getByTestId('login-email-input').fill(process.env.TEST_EMAIL!);
    await page.getByTestId('login-password-input').fill(process.env.TEST_PASSWORD!);
    await page.getByTestId('login-btn').click();
    await expect(page).toHaveURL(`${process.env.BASE_URL}/products`);
  });

  test('add a product to the cart', async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.getByTestId('cart-link').click();
    await expect(page).toHaveURL(`${process.env.BASE_URL}/cart`);
    await expect(page.getByText('Gaming Laptop$1199.00 · Qty 1$'));
    await page.getByTestId('remove-cart-item-btn').click();
  });

  test('add a product to the cart twice', async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.getByTestId('cart-link').click();
    await expect(page).toHaveURL(`${process.env.BASE_URL}/cart`);
    await expect(page.getByText('Gaming Laptop$1199.00 · Qty 2$'));
    await page.getByTestId('remove-cart-item-btn').click();
  });
});