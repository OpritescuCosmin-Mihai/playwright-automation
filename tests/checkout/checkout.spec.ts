import { test, expect } from '@playwright/test';
import { LoginPage } from "../../pages/login/login.page";
import { ProductsPage } from "../../pages/products/products.page";
import { CartPage } from "../../pages/cart/cart.page";
import { Header } from "../../pages/common/header.page";
import { loginAsDemo } from '../../helpers/auth';

const DEMO = { email: process.env.TEST_EMAIL!, password: process.env.TEST_PASSWORD! };

test.describe('Checkout Page', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let header: Header;

  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);

    cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.clear();

    productsPage = new ProductsPage(page);
    header = new Header(page);
    await productsPage.goto();
  });

  test('C55 - add a product to the cart', async ({ page }) => {
    await productsPage.addFirstToCart();
    await header.openCart();

    await expect(page).toHaveURL("/cart");
    await expect(cartPage.itemByText("Qty 1")).toBeVisible();
  });

  test('C56 - add a product to the cart twice', async ({ page }) => {
    await productsPage.addFirstToCart();
    await productsPage.addFirstToCart();
    await header.openCart();

    await expect(page).toHaveURL("/cart");
    await expect(cartPage.itemByText("Qty 2")).toBeVisible();
  });

  test('C57 - remove a product from the cart', async ({ page }) => {
    await productsPage.addFirstToCart();
    await header.openCart();
    await cartPage.removeFirst();

    await expect(page).toHaveURL("/cart");
    await expect(cartPage.emptyMessage()).toBeVisible();
  });
});