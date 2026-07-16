import { Page } from "@playwright/test";

export const headerLocators = (page: Page) => ({
  cartLink: () => page.getByTestId("cart-link"),
  cartCount: () => page.getByTestId("cart-count"),
  logoutButton: () => page.getByTestId("logout-btn"),
});