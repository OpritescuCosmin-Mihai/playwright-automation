import { test, expect, type Page, type Locator } from "@playwright/test";
import { loginLocators } from "./login.locators";

// Actions for the Login page
export class LoginPage {
  private readonly el;

  constructor(private readonly page: Page) {
    this.el = loginLocators(page);
  }

  async goto(): Promise<void> {
    await test.step("Open the login page", async () => {
      await this.page.goto("/login");
    });
  }

  async login(email: string, password: string): Promise<void> {
    await test.step(`Log in as "${email}"`, async () => {
      await this.el.emailInput().fill(email);
      await this.el.passwordInput().fill(password);
      await this.el.submitButton().click();
    });
  }

  error() { return this.el.error(); } 
}