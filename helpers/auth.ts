import { expect, type Page } from "@playwright/test";
import { LoginPage } from "../pages/login/login.page";
import { DEMO_USER } from "../test-data/users";

export async function loginAsDemo(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(DEMO_USER.email, DEMO_USER.password);
  await expect(page).toHaveURL("/products");  
}