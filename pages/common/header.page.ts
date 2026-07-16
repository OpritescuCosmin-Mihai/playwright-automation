import { test, type Page, type Locator } from "@playwright/test";
import { headerLocators } from "./header.locators";

export class Header {
  private readonly el;

  constructor(private readonly page: Page) {
    this.el = headerLocators(page);
  }

  async openCart(): Promise<void> {
    await test.step("Open the cart", async () => {
      await this.el.cartLink().click();
    });
  }

  async logout(): Promise<void> {
    await test.step("Log out", async () => {
      await this.el.logoutButton().click();
    });
  }

  cartCount(): Locator { return this.el.cartCount(); }
}