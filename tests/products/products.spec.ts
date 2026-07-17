import { test, expect } from '../../fixtures/auth';
import { LoginPage } from "../../pages/login/login.page";
import { ProductsPage } from "../../pages/products/products.page";
import { loginAsDemo } from '../../helpers/auth';

test.describe('Products Page', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ authedPage }) => {
    productsPage = new ProductsPage(authedPage);
  });

  test('C49 - view product list', async ( ) => {
    await expect(productsPage.list()).toBeVisible();
    await expect(productsPage.resultsCount()).toBeVisible();
    await expect(productsPage.pageInfo()).toBeVisible();
    await expect(productsPage.pagination()).toBeVisible();
  });

  test('C50 - search product by name', async ( ) => {
    await productsPage.search('Gaming Laptop');
    await expect(productsPage.productHeading('Gaming Laptop')).toBeVisible();
  });

  test('C69 - search product by Electronics category', async ( ) => {
    await productsPage.filterByCategory("electronics");
    await expect(productsPage.resultsCount()).toHaveText("125 products");
    await expect(productsPage.pageInfo()).toHaveText("Page 1 of 11");
  });

  test('C51 - search with no results', async ( ) => {
    await productsPage.search("NonExistingProduct");
    await expect(productsPage.noResults()).toBeVisible();
  });

  test('C54 - filter by rating 4+ stars', async ( ) => {
    await productsPage.filterByRating(4);
    await expect(productsPage.resultsCount()).toHaveText("271 products");
    await expect(productsPage.pageInfo()).toHaveText("Page 1 of 23");
  });
});