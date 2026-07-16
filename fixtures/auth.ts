import { test as base, expect, type Page } from '@playwright/test';
import { loginAsDemo } from '../helpers/auth';
import { CartPage } from '../pages/cart/cart.page';

type AppFixtures = {
  authedPage: Page;
  emptyCartPage: Page;
};

export const test = base.extend<AppFixtures>({
  authedPage: async ({ page }, use) => {
    await loginAsDemo(page);
    await use(page);
  },

  emptyCartPage: async ({ authedPage }, use) => {
    const cart = new CartPage(authedPage);
    await cart.goto();
    await cart.clear();
    await authedPage.goto("/products");
    await use(authedPage);
  },
});

export { expect };