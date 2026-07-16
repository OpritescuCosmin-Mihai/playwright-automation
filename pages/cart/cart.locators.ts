import { Page } from "@playwright/test";

export const cartLocators = (page: Page) => ({
  page: () => page.getByTestId("cart-page"),
  removeButtons: () => page.getByTestId("remove-cart-item-btn"),
  removeFor: (id: string) =>
    page.locator(`[data-testid="remove-cart-item-btn"][data-product-id="${id}"]`),
  itemByText: (text: string) => page.getByText(text),
  emptyMessage: () => page.getByText("Your cart is empty"),
});