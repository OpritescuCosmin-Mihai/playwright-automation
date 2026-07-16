import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

test.describe('Checkout Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/login`);
    await page.getByTestId('login-email-input').fill(process.env.TEST_EMAIL!);
    await page.getByTestId('login-password-input').fill(process.env.TEST_PASSWORD!);
    await page.getByTestId('login-btn').click();
    
    await expect(page).toHaveURL(`${process.env.BASE_URL}/products`);
    let cartItemsCount = await page.getByTestId('remove-cart-item-btn').count();
    while (cartItemsCount > 0) {
      await page.getByTestId('remove-cart-item-btn').first().click();
      cartItemsCount--;
    }
  });

  test('C55 - add a product to the cart', async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.getByTestId('cart-link').click();

    await expect(page).toHaveURL(`${process.env.BASE_URL}/cart`);
    await expect(page.getByText('Gaming Laptop$1199.00 · Qty 1$'));
  });

  test('C56 - add a product to the cart twice', async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.getByTestId('cart-link').click();

    await expect(page).toHaveURL(`${process.env.BASE_URL}/cart`);
    await expect(page.getByText('Gaming Laptop$1199.00 · Qty 2$'));
  });

  test('C57 - remove a product from the cart', async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.getByTestId('cart-link').click();

    await expect(page).toHaveURL(`${process.env.BASE_URL}/cart`);

    await page.getByTestId('remove-cart-item-btn').click();

    await expect(page.getByText('Your cart is empty')).toBeVisible();
  });
});