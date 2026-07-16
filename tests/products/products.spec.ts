import { test, expect } from '@playwright/test';
import { LoginPage } from "../../pages/login/login.page";
import { ProductsPage } from "../../pages/products/products.page";
import { loginAsDemo } from '../../helpers/auth';

const DEMO = { email: process.env.TEST_EMAIL!, password: process.env.TEST_PASSWORD! };

test.describe('Products Page', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    productsPage = new ProductsPage(page);
  });

  test('C49 - view product list', async ({ page }) => {
    await expect(productsPage.list()).toBeVisible();
    await expect(productsPage.resultsCount()).toBeVisible();
    await expect(productsPage.pageInfo()).toBeVisible();
    await expect(productsPage.pagination()).toBeVisible();
  });

  test('C50 - search product by name', async ({ page }) => {
    await productsPage.search('Gaming Laptop');
    await expect(productsPage.productHeading('Gaming Laptop')).toBeVisible();
  });

  test('C69 - search product by Electronics category', async ({ page }) => {
    await productsPage.filterByCategory("electronics");
    await expect(productsPage.resultsCount()).toHaveText("125 products");
    await expect(productsPage.pageInfo()).toHaveText("Page 1 of 11");
  });

  test('C51 - search with no results', async ({ page }) => {
    await productsPage.search("NonExistingProduct");
    await expect(productsPage.noResults()).toBeVisible();
  });
});