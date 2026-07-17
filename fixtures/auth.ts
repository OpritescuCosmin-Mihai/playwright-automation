import { test as base, expect, type Page } from '@playwright/test';
import { loginAsDemo } from '../helpers/auth';
import { CartPage } from '../pages/cart/cart.page';
import { DEMO_USER } from "../test-data/users";

type AppFixtures = {
  authedPage: Page;
  emptyCartPage: Page;
  apiAuthedPage: Page;
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

  apiAuthedPage: async ({ browser, request }, use) => {
    // log in via the API - no UI interaction needed
    const res = await request.post("/api/auth/login", {
      data: { email: DEMO_USER.email, password: DEMO_USER.password },
    });
    if (!res.ok()) {
      throw new Error(`API login failed: ${res.status()} ${await res.text()}`);
    }

    // Grab the HttpOnly "session" cookie the login set
    const { cookies } = await request.storageState();
    const session = cookies.find((c: any) => c.name === "session");
    if (!session) {
      throw new Error("Login succeeded but no session cookie was returned");
    }

    // isolated context per test; inject the cookie (HttpOnly -> addCookie)
    const context = await browser.newContext();
    await context.addCookies([session]);
    const page = await context.newPage();

    await use(page);

    await context.close(); // cleanup after the test
  },
});

export { expect };