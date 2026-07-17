import { test, expect } from '../../fixtures/auth';
import { ProductsPage } from '../../pages/products/products.page';
import { Header } from '../../pages/common/header.page';

test("authenticates via API and reaches logged in content without UI", async ({ apiAuthedPage }) => {
  const productsPage = new ProductsPage(apiAuthedPage);
  const header = new Header(apiAuthedPage);

  await apiAuthedPage.goto("/products");

  await expect(apiAuthedPage).toHaveURL("/products");
  await expect(productsPage.list()).toBeVisible();
  await expect(header.logoutButton()).toBeVisible();
});