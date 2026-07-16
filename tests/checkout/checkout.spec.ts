import { test, expect } from '../../fixtures/auth';
import { LoginPage } from "../../pages/login/login.page";
import { ProductsPage } from "../../pages/products/products.page";
import { CartPage } from "../../pages/cart/cart.page";
import { Header } from "../../pages/common/header.page";
import { loginAsDemo } from '../../helpers/auth';

test.describe('Checkout Page', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let header: Header;

  test.beforeEach(async ({ emptyCartPage }) => {
    productsPage = new ProductsPage(emptyCartPage);
    cartPage = new CartPage(emptyCartPage);
    header = new Header(emptyCartPage);
  });

  test('C55 - add a product to the cart', async ({ emptyCartPage }) => {
    await productsPage.addFirstToCart();
    await header.openCart();

    await expect(emptyCartPage).toHaveURL("/cart");
    await expect(cartPage.itemByText("Qty 1")).toBeVisible();
  });

  test('C56 - add a product to the cart twice', async ({ emptyCartPage }) => {
    await productsPage.addFirstToCart();
    await productsPage.addFirstToCart();
    await header.openCart();

    await expect(emptyCartPage).toHaveURL("/cart");
    await expect(cartPage.itemByText("Qty 2")).toBeVisible();
  });

  test('C57 - remove a product from the cart', async ({ emptyCartPage }) => {
    await productsPage.addFirstToCart();
    await header.openCart();
    await cartPage.removeFirst();

    await expect(emptyCartPage).toHaveURL("/cart");
    await expect(cartPage.emptyMessage()).toBeVisible();
  });
});