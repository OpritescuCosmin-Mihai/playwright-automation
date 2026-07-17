import { test, expect, type Page } from "@playwright/test";
import { loginLocators } from "./login.locators";

// Actions for the Login page
export class LoginPage {
  private readonly loginPage;

  constructor(private readonly page: Page) {
    this.loginPage = loginLocators(page);
  }

  async goto(): Promise<void> {
    await test.step("Open the login page", async () => {
      await this.page.goto("/login");
    });
  }

  async login(email: string, password: string): Promise<void> {
    await test.step(`Log in as "${email}"`, async () => {
      await this.loginPage.emailInput().fill(email);
      await this.loginPage.passwordInput().fill(password);
      await this.loginPage.submitButton().click();
    });
  }

  error() { return this.loginPage.error(); } 
}