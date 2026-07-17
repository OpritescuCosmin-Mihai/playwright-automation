import { test as base, expect, type Page } from '@playwright/test';
import { loginAsDemo } from '../helpers/auth';
import { CartPage } from '../pages/cart/cart.page';
import { DEMO_USER } from "../test-data/users";
import { apiLoginCookie } from '../helpers/auth';

type AppFixtures = {
  authedPage: Page;
  emptyCartPage: Page;
  apiAuthedPage: Page;
};

export const test = base.extend<AppFixtures>({
  authedPage: async ({ page, request }, use) => {
    const session = await apiLoginCookie(request);
    await page.context().addCookies([session]);
    await page.goto("/products");
    await use(page);
  },

  emptyCartPage: async ({ authedPage }, use) => {
    const cartPage = new CartPage(authedPage);
    await cartPage.goto();
    await cartPage.clear();
    await authedPage.goto("/products");
    await use(authedPage);
  },

  // Standalone: fresh browser context with the injected session (used by the API-login E2E test).
  apiAuthedPage: async ({ browser, request }, use) => {
    const session = await apiLoginCookie(request);
    const context = await browser.newContext();
    await context.addCookies([session]);
    const page = await context.newPage();
    await use(page);
    await page.close();
    await context.close();
  },
});

export { expect };