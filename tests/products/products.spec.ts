import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/login`);
    await page.getByTestId('login-email-input').fill(process.env.TEST_EMAIL!);
    await page.getByTestId('login-password-input').fill(process.env.TEST_PASSWORD!);
    await page.getByTestId('login-btn').click();

    await expect(page).toHaveURL(`${process.env.BASE_URL}/products`);
  });

  test('C49 - view product list', async ({ page }) => {
    await expect(page.getByTestId('product-list')).toBeVisible();
    await expect(page.getByTestId('results-count')).toBeVisible();
    await expect(page.getByTestId('pagination')).toBeVisible();
    await expect(page.getByTestId('page-info')).toBeVisible();
  });

  test('C50 - search product by name', async ({ page }) => {
    const productName = 'Gaming Laptop';
    await page.getByTestId('search-input').fill(productName);

    await expect(page.getByRole('heading', { name: 'Gaming Laptop' })).toBeVisible();
  });

  test('search product by Electronics category', async ({ page }) => {
    await page.getByTestId('category-option-electronics').click();

    await expect(page.getByTestId('results-count')).toHaveText('125 products');
    await expect(page.getByTestId('page-info')).toHaveText('Page 1 of 11');
  });

  test('C51 - search with no results', async ({ page }) => {
    const searchTerm = 'NonExistingProduct';
    await page.getByTestId('search-input').fill(searchTerm);
    
    await expect(page.getByTestId('no-results-message')).toBeVisible();
  });
});