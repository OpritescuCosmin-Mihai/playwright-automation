import { test, type Page, type Locator, expect } from "@playwright/test";
import { cartLocators } from "./cart.locators";

export class CartPage {
  private readonly el;

  constructor(private readonly page: Page) {
    this.el = cartLocators(page);
  }

  async goto(): Promise<void> {
    await test.step("Open the cart page", async () => {
      await this.page.goto("/cart");
      await expect(this.el.page()).toBeVisible();
    });
  }

  async clear(): Promise<void> {
    await test.step("Empty the cart", async () => {
      const buttons = this.el.removeButtons();
      let count = await buttons.count();
      while (count > 0) {
        await buttons.first().click();
        count--;
      }
    });
  }

  async removeFirst(): Promise<void> {
    await test.step("Remove the first cart item", async () => {
      await this.el.removeButtons().first().click();
    });
  }

  emptyMessage(): Locator { return this.el.emptyMessage(); }
  itemByText(text: string): Locator { return this.el.itemByText(text); }
}