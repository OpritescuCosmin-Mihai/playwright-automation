import { test, type Page, type Locator } from "@playwright/test";
import { registerLocators } from "./register.locators";

export class RegisterPage {
  private readonly el;

  constructor(private readonly page: Page) {
    this.el = registerLocators(page);
  }

  async goto(): Promise<void> {
    await test.step("Open the register page", async () => {
      await this.page.goto("/register");
    });
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await test.step(`Register as "${email}"`, async () => {
      await this.el.nameInput().fill(name);
      await this.el.emailInput().fill(email);
      await this.el.passwordInput().fill(password);
      await this.el.submitButton().click();
    });
  }

  nameError(): Locator { return this.el.nameError(); }
  emailError(): Locator { return this.el.emailError(); }
  passwordError(): Locator { return this.el.passwordError(); }
}