import { expect, type Page } from "@playwright/test";
import { LoginPage } from "../pages/login/login.page";

const DEMO = { email: process.env.TEST_EMAIL!, password: process.env.TEST_PASSWORD! };

export async function loginAsDemo(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(DEMO.email, DEMO.password);
  await expect(page).toHaveURL("/products");  
}