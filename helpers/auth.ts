import { expect, type Page } from "@playwright/test";
import { LoginPage } from "../pages/login/login.page";
import { DEMO_USER } from "../test-data/users";
import { type APIRequestContext } from "@playwright/test";

export async function loginAsDemo(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(DEMO_USER.email, DEMO_USER.password);
  await expect(page).toHaveURL("/products");  
}

export async function apiLoginCookie(request: APIRequestContext) {
  const res = await request.post("/api/auth/login", {
    data: { email: DEMO_USER.email, password: DEMO_USER.password },
  });
  if (!res.ok()) {
    throw new Error(`API login failed: ${res.status()} ${await res.text()}`);
  }

  // Get the session cookie from the request context's storage state
  const { cookies } = await request.storageState();

  const session = cookies.find((c) => c.name === "session");
  if (!session) {
    throw new Error("Login succeeded but no 'session' cookie was returned");
  }
  
  return session;
}